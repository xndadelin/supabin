import { LucideIcon } from "lucide-react";

interface InputFieldProps {
    icon: LucideIcon,
    label: string;
    type?: 'text' | 'email' | 'password' | 'number'
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    maxLength?: number;
}

export default function InputField({
    icon: Icon,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    maxLength
}: InputFieldProps) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#cbd5e1] mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ecf8e] focus:ring-opacity-50 focus:border-transparent transition-all text-sm text-[#f1f5f9] placeholder-[#64748b]"
            />     
        </div>
    )
}