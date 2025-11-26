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
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-8 transition-all duration-300 ${
                isDragging ? 'bg-blue-500 scale-110' : 'bg-white shadow-lg'
            }`}>
                <Upload className={`w-16 h-16 transition-colors ${
                    isDragging ? 'text-white' : 'text-slate-400'
                }`} />
            </div>

            <h1 className="text-5xl font-bold text-slate-800 mb-4">
                {isDragging ? 'Drop here': 'Drop anywhere'}
            </h1>

            <p className="text-xl text-slate-500 mb-12">
                or click to select files or folders
            </p>

            <div className="flex gap-4 justify-center">
                <label className="inline-block cursor-pointer">
                    <input
                        type="file"
                        multiple
                        onChange={onFileSelect}
                        className="hidden"
                    />
                    <span className="inline-flex items-center gap-3 px-8 py-8 bg-blue-500 text-white text-lg rounded-2xl font-medium hover:bg-blue-600 transition-all hover:scale-105 shadow-lg">
                        <Upload className="w-6 h-6" />
                        Select files
                    </span>
                </label>
            </div>
        </div>
    )
}

