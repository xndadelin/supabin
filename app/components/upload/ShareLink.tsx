import { useState } from "react";

import { Link2, Edit2, Copy, Check, QrCode, Link, Edit } from 'lucide-react'

interface ShareLinkProps {
    link: string;
    customSlug: string;
    setCustomSlug: (slug: string) => void;
    onCopy: () => void;
}

export default function ShareLink({
    link,
    customSlug,
    setCustomSlug,
    onCopy
}: ShareLinkProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const displayLink = customSlug ? `http://localhost:3000/${customSlug}` : link;

    return (
        <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Link2 className="w-4 h-4" />
                    Sharing link
                </label>

                {isEditing ? (
                    <div className="sapce-y-2">
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <span className="text-slate-500 text-sm"></span>
                                <input
                                    type="text"
                                    value={customSlug}
                                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    placeholder="personalized-link"
                                    maxLength={30}
                                    className="flex-1 bg-transparent outline-none text-slate-800 font-mono text-sm"
                                />
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ): (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={displayLink}
                            readOnly
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono text-sm"
                        />
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2 text-slate-700 font-medium"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onCopy}
                            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2 text-slate-700 font-medium"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
    
}