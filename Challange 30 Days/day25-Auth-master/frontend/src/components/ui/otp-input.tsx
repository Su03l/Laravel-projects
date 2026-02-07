"use client"

import React, { useRef, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OtpInputProps {
    length?: number
    value: string
    onChange: (value: string) => void
}

export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Derive inputs from external value only. Functional and stateless internally.
    const getDigit = (index: number) => {
        return value[index] || ''
    }

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (isNaN(Number(val))) return

        // Construct new string
        // We take the current value, pad it if needed for manipulation (though simple string concat is easier)
        const currentChars = value.split('')
        // Pad with empty strings up to length if needed to ensure index exists? 
        // Actually we just need to reconstruct the string up to 'length'.

        const newChars = Array.from({ length }, (_, i) => currentChars[i] || '')

        // If user types multiple chars (paste or predictive), take the last one
        // unless it's empty, then clear.
        const char = val.substring(val.length - 1)
        newChars[index] = char

        const newValue = newChars.join('').substring(0, length)
        onChange(newValue)

        // Auto-focus next
        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            const val = getDigit(index)
            if (!val && index > 0) {
                // If empty, define behavior: move back?
                inputRefs.current[index - 1]?.focus()
            }
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, length)
        if (!/^\d+$/.test(pastedData)) return

        onChange(pastedData)

        const focusIndex = Math.min(pastedData.length, length - 1)
        inputRefs.current[focusIndex]?.focus()
    }

    return (
        <div className="flex gap-2 justify-center direction-ltr" dir="ltr">
            {Array.from({ length }).map((_, index) => (
                <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={getDigit(index)}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    ref={(el) => { inputRefs.current[index] = el }}
                    className={cn(
                        "w-12 h-14 text-center text-2xl font-bold tracking-tighter transition-all",
                        "border-slate-200 focus:border-blue-500 focus:ring-blue-500",
                        getDigit(index) ? "bg-blue-50 border-blue-200" : "bg-white"
                    )}
                />
            ))}
        </div>
    )
}
