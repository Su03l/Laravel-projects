"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, X, FileText, ImageIcon } from "lucide-react"


// ChatInputProps interface
interface ChatInputProps {
    onSend: (message: string, attachments: File[]) => void
    isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [input, setInput] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleSend = () => {
        if (!input.trim() && files.length === 0) return
        onSend(input, files)
        setInput("")
        setFiles([])
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFiles([...files, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const getFileIcon = (file: File) => {
        if (file.type.startsWith("image/")) return <ImageIcon className="w-3 h-3 text-[#00d4ff]" />
        return <FileText className="w-3 h-3 text-[#a855f7]" />
    }

    return (
        <div className="p-4 glass-strong border-t border-zinc-800/30">
            <div className="max-w-3xl mx-auto">
                {/* File Previews */}
                {files.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                        {files.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-zinc-800/50 text-xs group">
                                {getFileIcon(file)}
                                <span className="truncate max-w-[120px] text-zinc-400">{file.name}</span>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative flex items-end gap-2 glass rounded-2xl p-2 border border-zinc-800/30 focus-within:border-[#39ff14]/20 focus-within:glow-green transition-all">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl text-zinc-500 hover:text-[#39ff14] hover:bg-[#39ff14]/5"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />

                    <Textarea
                        placeholder="أرسل رسالة..."
                        className="min-h-[44px] max-h-[200px] bg-transparent border-0 focus-visible:ring-0 resize-none py-3"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <Button
                        size="icon"
                        disabled={isLoading || (!input.trim() && files.length === 0)}
                        onClick={handleSend}
                        className="h-10 w-10 shrink-0 rounded-xl bg-[#39ff14] text-black hover:bg-[#39ff14]/80 disabled:opacity-30 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all"
                    >
                        {isLoading ? (
                            <div className="flex gap-1">
                                <div className="typing-dot" style={{ width: 4, height: 4 }} />
                                <div className="typing-dot" style={{ width: 4, height: 4 }} />
                                <div className="typing-dot" style={{ width: 4, height: 4 }} />
                            </div>
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
                <div className="text-center mt-2 text-[10px] text-zinc-600">
                    GeniusLab قد يرتكب أخطاء. يرجى التحقق من المعلومات المهمة.
                </div>
            </div>
        </div>
    )
}
