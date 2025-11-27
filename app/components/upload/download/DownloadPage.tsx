'use client';

import { useState } from "react";

import { Download, Shield, User, Calendar } from "lucide-react";
import FilesList from "../FilesList";
import { FileData, UploadData } from "@/app/types";

interface DownloadPageProps {
    uploadData: UploadData;
}

export default function DownloadPage({ uploadData }: DownloadPageProps) {
    const [password, setPassword] = useState('')
    const [isUnlocked, setIsUnlocked] = useState(!uploadData.hasPassword)
    const [error, setError] = useState('')

    const handleUnlock = () => {
        if(password === uploadData.password) {
            setIsUnlocked(true);
            setError('')
        } else {
            setError('Incorrect password. Try again.')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleUnlock();
        } 
    }

    if(!isUnlocked) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-blue-100 rounded-full">
                            <Shield className="w-12 h-12 text-blue-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">
                        Protected content
                    </h2>
                    <p className="text-slate-500 text-center mb-8"> 
                        Type the password to access the files
                    </p>

                    <div className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type the password"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2 text-center">
                                    {error}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleUnlock}
                            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                        >
                            Unlock
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="max-w-4xl w-full space-y-6">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-blue-100 rounded-2xl">
                                <Download className="w-10 h-10 text-blue-500" />
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    {uploadData.name || 'Shared files'}
                                </h1>
                            </div>
                            <p className="text-slate-500 mb-4">
                                Someone shared {uploadData.files.length}{' '}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <User className="w-4 h-4"></User>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Expires in: {uploadData.expiryTime}</span>
                                </div>
                                {uploadData.maxDownloads !== 'unlimited' && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Download className="w-4 h-4" />
                                        <span>Remaining downloads: {uploadData.maxDownloads}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <FilesList files={uploadData.files} viewMode={true} />
                </div>
            </div>
        </div>
    )

}