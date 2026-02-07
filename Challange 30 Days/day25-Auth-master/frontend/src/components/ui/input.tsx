"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, startIcon, endIcon, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const isPassword = type === "password"

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword)
        }

        return (
            <div className="w-full">
                <div className="relative">
                    {startIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {startIcon}
                        </div>
                    )}

                    <input
                        type={isPassword ? (showPassword ? "text" : "password") : type}
                        className={cn(
                            "flex h-11 w-full rounded-lg border border-slate-200 bg-white/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-white focus:border-indigo-500",
                            startIcon && "pr-10",
                            (endIcon || isPassword) && "pl-10",
                            error && "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {isPassword ? (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    ) : endIcon ? (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {endIcon}
                        </div>
                    ) : null}
                </div>
                {error && <p className="text-xs text-red-500 mt-1 font-medium ml-1">{error}</p>}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
