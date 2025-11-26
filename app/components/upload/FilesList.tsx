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
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-3">
                        <File className="w-6 h-6 text-blue-500" />
                        {files.length} {files.length === 1 ? 'file' : "files"}
                    </h3> 
                </div>

               <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {files.map((file) => (
                    <FileItem key={file.id} file={file} viewMode={true} />
                ))}
               </div>
            </div>
        )
    }
}