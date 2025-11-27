import { File, FolderOpen, X, Check, Download, Folder } from "lucide-react";
import FileItem from "./FileItem";

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  isFolder: boolean;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  fileCount?: number;
  file?: File;
}

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
            </div>
        )
    }
}