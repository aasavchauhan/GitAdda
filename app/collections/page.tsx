import { getUserCollections } from '@/app/actions/collections'
import CollectionsManager from '@/components/collections/CollectionsManager'

export const dynamic = 'force-dynamic'

export default async function CollectionsPage() {
    const collections = await getUserCollections()

    return <CollectionsManager collections={collections} />
}
