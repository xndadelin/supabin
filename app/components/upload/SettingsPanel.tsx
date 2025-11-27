import { useState } from "react";

import { Tag, Lock, Mail, Clock, Download, Eye, Send } from 'lucide-react'
import InputField from "./InputField";

interface SettingsPanelProps {
    uploadName: string;
    setUploadName: (name: string) => void;
    password: string;
    setPassword: (password: string) => void;
    email: string;
    setEmail: (email: string) => void;
    expiryTime: string;
    setExpiryTime: (time: string) => void;
    maxDownloads: string;
    setMaxDownloads: (max: string) => void;
    allowPreview: boolean;
    setAllowPreview: (allow: boolean) => void;
    shareLink: string;
    customSlug: string;
    setCustomSlug: (slug: string) => void;
    allCompleted: boolean;
    onCopy: () => void;
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
    onCopy
}: SettingsPanelProps) {
    const [showQR, setShowQR] = useState<boolean>(false)

    const expiryOptions = [
        { value: '1', label: '1 hour' },
        { value: '6', label: '6 hours' },
        { value: '24', label: '24 hours' },
        { value: '72', label: '3 days' },
        { value: '168', label: '1 week' },
        { value: '720', label: '30 days' },
        { value: 'never', label: 'Never' }
    ]

    const downloadOptions = [
        { value: 'unlimited', label: 'Unlimited' },
        { value: '1', label: '1 download' },
        { value: '5', label: '5 downloads' },
        { value: '10', label: '10 downloads' },
        { value: '25', label: '25 downloads' },
        { value: '100', label: '100 downloads' }
    ]

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
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
        </div>
    )

}