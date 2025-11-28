import { useState } from "react";

import { Link2, Edit2, Copy, Check, QrCode, Link, Edit } from 'lucide-react'
import QRCodeDisplay from "./QRCodeDisplay";

interface ShareLinkProps {
    link: string;
    customSlug: string;
    setCustomSlug: (slug: string) => void;
    onCopy: () => void;
    showQR: boolean,
    setShowQR: (show: boolean) => void;
}

export default function ShareLink({
    link,
    customSlug,
    setCustomSlug,
    onCopy,
    showQR,
    setShowQR
}: ShareLinkProps) {


    const displayLink = customSlug ? `http://localhost:3000/share/${customSlug}` : link;

    return (
        <div className="pt-3 border-t border-[#334155] space-y-3">
            <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#cbd5e1] mb-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    Sharing link
                </label>

                
                    <div className="flex gap-1.5">
                        <input
                            type="text"
                            value={displayLink}
                            readOnly
                            className="flex-1 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-[#64748b] font-mono text-xs"
                        />
                        <button
                            onClick={onCopy}
                            className="px-3 py-2 bg-[#334155] hover:bg-[#475569] rounded-lg transition-colors flex items-center gap-1.5 text-[#cbd5e1] font-medium text-xs"
                        >
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                    </div>
                
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#334155] hover:bg-[#475569] rounded-lg transition-colors text-[#cbd5e1] font-medium text-xs"
                >
                    <QrCode className="w-3.5 h-3.5" />
                    {showQR ? 'Hide QR' : 'Show QR Code'}
                </button>
            </div>
            {showQR && <QRCodeDisplay link={displayLink} />}
        </div>
    )
    
}