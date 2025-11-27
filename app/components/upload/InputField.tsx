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
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Icon className="w-4 h-4" />
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition all"
            />     
        </div>
    )
}