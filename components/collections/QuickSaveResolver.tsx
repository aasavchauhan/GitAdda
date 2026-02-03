import QuickSaveButton from "./QuickSaveButton"
import { getUserDataForQuickSave } from "@/app/actions/collections"

interface QuickSaveResolverProps {
    repoId: string
    promise: ReturnType<typeof getUserDataForQuickSave>
}

export default async function QuickSaveResolver({
    repoId,
    promise
}: QuickSaveResolverProps) {
    // Await the promise to get the data
    const { collections, repoMap } = await promise

    return (
        <QuickSaveButton
            repoId={repoId}
            userCollections={collections}
            initialSavedCollectionIds={repoMap[repoId] || []}
        />
    )
}
