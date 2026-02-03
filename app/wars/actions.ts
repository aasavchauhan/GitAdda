'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const K_FACTOR = 32

export async function submitVote(winnerId: string, loserId: string) {
    const supabase = await createClient()

    // 1. Fetch current stats
    const { data: repos, error } = await supabase
        .from('repositories')
        .select('id, elo_rating, matches_played')
        .in('id', [winnerId, loserId])

    if (error || !repos || repos.length !== 2) {
        throw new Error('Failed to fetch repositories for voting')
    }

    const winner = repos.find(r => r.id === winnerId)!
    const loser = repos.find(r => r.id === loserId)!

    // 2. Calculate ELO
    // Expected score = 1 / (1 + 10 ^ ((opponent_rating - my_rating) / 400))
    const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo_rating - winner.elo_rating) / 400))
    const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo_rating - loser.elo_rating) / 400))

    // New Rating = Current + K * (Actual - Expected)
    // Actual score for winner is 1, for loser is 0
    const newWinnerRating = Math.round(winner.elo_rating + K_FACTOR * (1 - expectedWinner))
    const newLoserRating = Math.round(loser.elo_rating + K_FACTOR * (0 - expectedLoser))

    // 3. Update Winner
    await supabase.from('repositories').update({
        elo_rating: newWinnerRating,
        matches_played: winner.matches_played + 1
    }).eq('id', winnerId)

    // 4. Update Loser
    await supabase.from('repositories').update({
        elo_rating: newLoserRating,
        matches_played: loser.matches_played + 1
    }).eq('id', loserId)

    // 5. Revalidate to show new stats/rankings if we had a leaderboard
    revalidatePath('/wars')
}
