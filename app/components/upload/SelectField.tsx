import { LucideIcon } from "lucide-react";
import { ChangeEvent } from "react";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    icon: LucideIcon;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[]
}

export default function SelectField({
    icon: Icon,
    label,
    value,
    onChange,
    options
}: SelectFieldProps) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#cbd5e1] mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ecf8e] focus:ring-opacity-50 focus:border-transparent transition-all cursor-pointer text-sm text-[#f1f5f9]"
            >   
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}