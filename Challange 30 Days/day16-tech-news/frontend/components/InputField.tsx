import React from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface InputFieldProps {
    icon: LucideIcon;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    togglePassword?: () => void;
    showPassword?: boolean;
}

const InputField = ({
    icon: Icon,
    type,
    placeholder,
    value,
    onChange,
    togglePassword,
    showPassword
}: InputFieldProps) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
            type={type}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-gray-400 text-gray-900"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        {togglePassword && (
            <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
        )}
    </div>
);

export default InputField;
