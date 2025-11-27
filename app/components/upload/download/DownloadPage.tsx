'use client';

import { useState } from "react";
import { downloadFile, verifyPassword } from "@/app/lib/api";
import { Download, Shield, Clock, AlertCircle } from "lucide-react";
import FilesList from "../FilesList";
import { UploadData } from "@/app/types";

interface DownloadPageProps {
    uploadData: UploadData;
}

export default function DownloadPage({ uploadData }: DownloadPageProps) {
    const [password, setPassword] = useState('')
    const [isUnlocked, setIsUnlocked] = useState(!uploadData.requiresPassword)
    const [error, setError] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)

    const handleUnlock = async () => {
        try {
            setIsVerifying(true);
            setError('');
            
            const valid = await verifyPassword(uploadData.id, password);
            if (valid) {
                setIsUnlocked(true);
            } else {
                setError('Incorrect password. Try again.')
            }
        } catch (err) {
            setError('Verification failed. Try again.')
        } finally {
            setIsVerifying(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isVerifying) {
            handleUnlock();
        } 
    }

    if(!isUnlocked) {
        return (
            <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#1e293b] rounded-lg shadow-sm p-6 border border-[#334155]">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-[#3ecf8e]/10 rounded-lg">
                            <Shield className="w-8 h-8 text-[#3ecf8e]" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-[#f1f5f9] mb-1 text-center">
                        Protected content
                    </h2>
                    <p className="text-[#cbd5e1] text-sm text-center mb-6"> 
                        Type the password to access the files
                    </p>

                    <div className="space-y-3">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter password"
                                disabled={isVerifying}
                                className="w-full px-3 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ecf8e] text-[#f1f5f9] placeholder-[#64748b] text-sm"
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {error}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleUnlock}
                            disabled={isVerifying}
                            className="w-full py-2.5 bg-[#3ecf8e] text-[#0f172a] rounded-lg hover:bg-[#249361] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? 'Verifying...' : 'Unlock'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-[#0f172a] overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-2xl w-full space-y-4">
                    <div className="bg-[#1e293b] rounded-lg shadow-sm p-4 border border-[#334155]">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-[#3ecf8e]/10 rounded-lg flex-shrink-0">
                                <Download className="w-5 h-5 text-[#3ecf8e]" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-bold text-[#f1f5f9] mb-2">
                                    {uploadData.name || 'Shared files'}
                                </h1>
                                <p className="text-xs text-[#cbd5e1] mb-3">
                                    {uploadData.files.length} file{uploadData.files.length !== 1 ? 's' : ''} shared
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs">
                                    {uploadData.expiryDate && (
                                        <div className="flex items-center gap-1.5 text-[#cbd5e1] bg-[#0f172a] px-2.5 py-1.5 rounded">
                                            <Clock className="w-3.5 h-3.5 text-[#3ecf8e]" />
                                            <span>Expires: {new Date(uploadData.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {uploadData.maxDownloads && (
                                        <div className="flex items-center gap-1.5 text-[#cbd5e1] bg-[#0f172a] px-2.5 py-1.5 rounded">
                                            <Download className="w-3.5 h-3.5 text-[#3ecf8e]" />
                                            <span>Downloads: {uploadData.downloadCount}/{uploadData.maxDownloads}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <FilesList files={uploadData.files} viewMode={true} />
                </div>
            </div>
        </div>
    )
}