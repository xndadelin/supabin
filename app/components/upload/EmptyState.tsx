import { Upload, Folder } from "lucide-react";

interface EmptyStateProps {
    isDragging: boolean;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EmptyState({
    isDragging,
    onFileSelect
} : EmptyStateProps) {
    return (
        <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 ${
                isDragging ? 'bg-[#3ecf8e] scale-110' : 'bg-[#1e293b] shadow-md border border-[#334155]'
            }`}>
                <Upload className={`w-10 h-10 transition-colors ${
                    isDragging ? 'text-[#0f172a]' : 'text-[#3ecf8e]'
                }`} />
            </div>

            <h1 className="text-3xl font-bold text-[#f1f5f9] mb-2">
                {isDragging ? 'Drop here': 'Drop anywhere'}
            </h1>

            <p className="text-sm text-[#cbd5e1] mb-8">
                or click to select files or folders
            </p>

            <div className="flex gap-3 justify-center">
                <label className="inline-block cursor-pointer">
                    <input
                        type="file"
                        multiple
                        onChange={onFileSelect}
                        className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3ecf8e] text-[#0f172a] text-sm rounded-lg font-medium hover:bg-[#249361] transition-all hover:scale-105 shadow-sm">
                        <Upload className="w-4 h-4" />
                        Select files
                    </span>
                </label>
            </div>
        </div>
    )
}

