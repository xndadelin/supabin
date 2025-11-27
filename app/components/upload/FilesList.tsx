import { File, FolderOpen, X, Check, Download, Folder, Upload } from "lucide-react";
import FileItem from "./FileItem";
import { FileData } from "@/app/types";

interface FilesListProps {
    files: FileData[];
    onRemove?: (id: string) => void;
    onAddMore?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    viewMode?: boolean;
}

export default function FilesList({
    files, onRemove, onAddMore, viewMode = false
}: FilesListProps ) {
    if(viewMode) {
        return (
            <div className="bg-[#1e293b] rounded-lg shadow-sm border border-[#334155] overflow-hidden">
                <div className="p-3 border-b border-[#334155]">
                    <h3 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
                        <File className="w-4 h-4 text-[#3ecf8e]" />
                        {files.length} {files.length === 1 ? 'file' : "files"}
                    </h3> 
                </div>

               <div className="divide-y divide-[#0f172a] max-h-64 overflow-y-auto">
                {files.map((file) => (
                    <FileItem key={file.id} file={file} viewMode={true} />
                ))}
               </div>

               <div className="p-3 border-t border-[#334155] bg-[#0f172a]">
                <button className="w-full py-2.5 bg-[#3ecf8e] text-[#0f172a] rounded-lg hover:bg-[#249361] transition-all font-semibold text-sm flex items-center justify-center gap-2">
                    <Download className="w-6 h-6" />
                    Download all files
                </button>
               </div>
            </div>
        )
    }

    return (
        <div className="bg-[#1e293b] rounded-lg shadow-sm border border-[#334155] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold  flex items-center gap-3">
                    <File className="w-6 h-6" />
                    {files.length} {files.length === 1 ? 'file' : 'files'}
                </h3>

                {onAddMore && (
                    <label
                        className="cursor-pointer"
                    >
                        <input
                            type="file"
                            multiple
                            onChange={onAddMore}
                            className="hidden"
                        /> 
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#3ecf8e] text-[#0f172a] text-sm rounded-lg font-medium hover:bg-[#249361] transition-colors">
                            <Upload className="w-4 h-4" />
                            Add files
                        </span>
                    </label>
                )}
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {files.map(file => (
                    <FileItem key={file.id} file={file} onRemove={onRemove} />
                ))}
            </div>

        </div>
    )

}