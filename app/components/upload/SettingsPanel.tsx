import { useState } from "react";
import { Tag, Lock, Mail, Clock, Download, Eye, Send } from 'lucide-react'
import InputField from "./InputField";
import SelectField from "./SelectField";
import ShareLink from "./ShareLink";
import { uploadFiles } from "@/app/lib/api";
import { FileData } from "@/app/types";

interface SettingsPanelProps {
    uploadName: string;
    setUploadName: (name: string) => void;
    password: string;
    setPassword: (password: string) => void;
    email: string;
    setEmail: (email: string) => void;
    expiryTime: Date | null;
    setExpiryTime: (time: Date | null) => void;
    maxDownloads: string;
    setMaxDownloads: (max: string) => void;
    allowPreview: boolean;
    setAllowPreview: (allow: boolean) => void;
    shareLink: string;
    customSlug: string;
    setCustomSlug: (slug: string) => void;
    allCompleted: boolean;
    onCopy: () => void;
    files: FileData[];
}

export default function SettingsPanel({
    uploadName, 
    setUploadName,
    password, 
    setPassword,
    email, 
    setEmail,
    expiryTime, 
    setExpiryTime,
    maxDownloads, 
    setMaxDownloads,
    allowPreview, 
    setAllowPreview,
    shareLink,
    customSlug, 
    setCustomSlug,
    allCompleted,
    onCopy,
    files
}: SettingsPanelProps) {
    const [showQR, setShowQR] = useState<boolean>(true)
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const expiryOptions = [
        { value: 1, label: '1 hour' },
        { value: 6, label: '6 hours' },
        { value: 24, label: '24 hours' },
        { value: 72, label: '3 days' },
        { value: 168, label: '1 week' },
        { value: 720, label: '30 days' },
        { value: 0, label: 'Never' }
    ]

    const downloadOptions = [
        { value: 'unlimited', label: 'Unlimited' },
        { value: '1', label: '1 download' },
        { value: '5', label: '5 downloads' },
        { value: '10', label: '10 downloads' },
        { value: '25', label: '25 downloads' },
        { value: '100', label: '100 downloads' }
    ]

    const handleFinalizeShare = async () => {
        try {
            setIsUploading(true);
            
            const filesToSend = files
                .map(f => f.file)
                .filter((f): f is File => f !== undefined)
            
            await uploadFiles(filesToSend, {
                uploadName,
                password,
                email,
                expiryTime: expiryTime ? expiryTime.toISOString() : "",
                maxDownloads,
                allowPreview,
                customSlug
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="bg-[#1e293b]/95 backdrop-blur-sm rounded-lg shadow-sm p-4 space-y-3 border border-[#334155]">
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">
                Share settings
            </h3>

            <InputField
                icon={Tag}
                label="Name upload (optional)"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="e.q: 2024 budget"
                maxLength={50}
            />

            <InputField
                icon={Lock}
                label="Password protection"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Add a password"
            />

            <InputField
                icon={Mail}
                label="Send link on email (optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@hackclub.app"
            />

            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#cbd5e1] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Will automatically delete after
                </label>
                <select
                    className="w-full px-3 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ecf8e] text-[#f1f5f9] text-sm"
                    value={
                        expiryTime
                            ? Math.round((expiryTime.getTime() - Date.now()) / (60 * 60 * 1000))
                            : 0
                    }
                    onChange={e => {
                        const hours = Number(e.target.value);
                        if (hours === 0) {
                            setExpiryTime(null);
                        } else {
                            setExpiryTime(new Date(Date.now() + hours * 60 * 60 * 1000));
                        }
                    }}
                >
                    {expiryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <SelectField
                icon={Download}
                label="Max number of downloads"
                value={maxDownloads}
                onChange={(e) => setMaxDownloads(e.target.value)}
                options={downloadOptions}
            />

            <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-[#334155]">
                <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#cbd5e1]" />
                    <span className="text-xs font-medium text-[#cbd5e1]">Allow preview files</span>
                </div>
                <button
                    onClick={() => setAllowPreview(!allowPreview)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                        allowPreview ? 'bg-[#3ecf8e]' : 'bg-[#ced4da]'
                    }`}
                >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        allowPreview ? 'translate-x-5' : ''
                    }`}>
                    </div>
                </button>
            </div>

            {allCompleted && shareLink && (
                <ShareLink
                    link={shareLink}
                    customSlug={customSlug}
                    setCustomSlug={setCustomSlug}
                    onCopy={onCopy}
                    showQR={showQR}
                    setShowQR={setShowQR}
                />
            )}

            <button
                onClick={handleFinalizeShare}
                disabled={!allCompleted || isUploading}
                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    allCompleted ? 'bg-[#3ecf8e] hover:bg-[#249361] text-[#0f172a] shadow-sm' : 'bg-[#334155] text-[#64748b] cursor-not-allowed'
                }`}
            >   
                <Send className="w-4 h-4" />
                {isUploading ? 'Uploading...' : allCompleted ? 'Finalise & share': 'Files are loading...'}
            </button>

        </div>
    )
}