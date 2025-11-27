import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
    link: string;
}

export default function QRCodeDisplay({ link }: QRCodeDisplayProps) {
    if(!link) return null;

    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div style={{
                background: 'white', padding: 8, borderRadius: 8
            }}>
                <QRCode
                    value={link}
                    size={256}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                />
            </div> 
            <p className="text-xs text-slate-500 text-center">
                Scan this for fast access
            </p> 
            <a className="text-xs text-blue-600" href={link}>{link}</a>
        </div>
    )

}