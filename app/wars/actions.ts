'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const K_FACTOR = 32
const VOTES_PER_HOUR = 30

export async function submitVote(winnerId: string, loserId: string) {
    const supabase = await createClient()

    // Auth check — prevent anonymous voting
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('You must be logged in to vote')
    }

    // Rate limit: max VOTES_PER_HOUR votes per user per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count: recentVotes, error: countError } = await supabase
        .from('war_votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneHourAgo)

    if (!countError && (recentVotes ?? 0) >= VOTES_PER_HOUR) {
        throw new Error(`Rate limit exceeded — you can cast at most ${VOTES_PER_HOUR} votes per hour. Take a break! ☕`)
    }

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
    const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo_rating - winner.elo_rating) / 400))
    const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo_rating - loser.elo_rating) / 400))

    const newWinnerRating = Math.round(winner.elo_rating + K_FACTOR * (1 - expectedWinner))
    const newLoserRating = Math.round(loser.elo_rating + K_FACTOR * (0 - expectedLoser))

    // 3. Update both + record vote concurrently
    const [winnerUpdate, loserUpdate, voteInsert] = await Promise.all([
        supabase.from('repositories').update({
            elo_rating: newWinnerRating,
            matches_played: winner.matches_played + 1
        }).eq('id', winnerId),
        supabase.from('repositories').update({
            elo_rating: newLoserRating,
            matches_played: loser.matches_played + 1
        }).eq('id', loserId),
        supabase.from('war_votes').insert({
            user_id: user.id,
            winner_id: winnerId,
            loser_id: loserId
        })
    ])

    if (winnerUpdate.error || loserUpdate.error) {
        throw new Error('Failed to update ELO ratings')
    }

    // Non-critical: log if vote insert failed but don't block
    if (voteInsert.error) {
        console.error('Failed to record war vote:', voteInsert.error)
    }

    revalidatePath('/wars')
    revalidatePath('/wars/leaderboard')
}

