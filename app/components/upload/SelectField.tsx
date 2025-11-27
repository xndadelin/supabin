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
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Icon className="w-4 h-4" />
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
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