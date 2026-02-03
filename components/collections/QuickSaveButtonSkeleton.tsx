import { Icons } from "@/components/ui/Icons"

export function QuickSaveButtonSkeleton() {
    return (
        <div className="relative">
            <button
                className="p-2 -mr-2 text-slate-400 bg-transparent rounded-full opacity-50 cursor-not-allowed"
                disabled
                title="Loading..."
            >
                <Icons.Heart className="w-5 h-5 text-slate-700 animate-pulse" />
            </button>
        </div>
    )
}
