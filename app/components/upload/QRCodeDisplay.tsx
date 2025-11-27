import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
    link: string;
}

export default function QRCodeDisplay({ link }: QRCodeDisplayProps) {
    if(!link) return null;

    return (
        <div className="flex flex-col items-center gap-2 p-3 bg-[#0f172a] rounded-lg border border-[#334155]">
            <div style={{
                background: '#0f172a', padding: 6, borderRadius: 6, border: '1px solid #334155'
            }}>
                <QRCode
                    value={link}
                    size={200}
                    level="H"
                    bgColor="#0f172a"
                    fgColor="#ffffff"
                />
            </div> 
            <p className="text-xs text-[#cbd5e1] text-center">
                Scan this for fast access
            </p> 
            <a className="text-xs text-[#3ecf8e] hover:text-[#249361] truncate max-w-full" href={link}>{link}</a>
        </div>
    )

}