"use client"

import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Bot, User, Copy, Check } from "lucide-react"
import { useState } from "react"

// ChatBubbleProps interface 
interface ChatBubbleProps {
    role: "user" | "assistant"
    content: string
}

// ChatBubble component
export function ChatBubble({ role, content }: ChatBubbleProps) {
    const isAI = role === "assistant"

    return (
        <div
            className={cn(
                "flex gap-3 animate-fade-in",
                isAI ? "" : "flex-row-reverse"
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1",
                isAI
                    ? "bg-[#39ff14]/10 border border-[#39ff14]/20"
                    : "bg-[#00d4ff]/10 border border-[#00d4ff]/20"
            )}>
                {isAI
                    ? <Bot className="w-4 h-4 text-[#39ff14]" />
                    : <User className="w-4 h-4 text-[#00d4ff]" />
                }
            </div>

            {/* Bubble */}
            <div className={cn(
                "rounded-2xl px-5 py-4 max-w-[85%] md:max-w-[75%]",
                isAI
                    ? "glass border-r-2 border-r-[#39ff14]/20 rounded-tr-md"
                    : "bg-[#00d4ff]/10 border border-[#00d4ff]/10 rounded-tl-md"
            )}>
                {isAI ? (
                    <div className="markdown-body text-sm leading-relaxed">
                        <ReactMarkdown
                            components={{
                                code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "")
                                    const content = String(children).replace(/\n$/, "")
                                    const isBlock = content.includes("\n") || match

                                    if (isBlock) {
                                        return (
                                            <CodeBlock language={match?.[1] || "text"} code={content} />
                                        )
                                    }
                                    return (
                                        <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#39ff14] text-xs font-mono" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                )}
            </div>
        </div>
    )
}

// CodeBlock component
function CodeBlock({ language, code }: { language: string; code: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="rounded-xl overflow-hidden my-3 border border-zinc-800/50">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800/50">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-[#39ff14] transition-colors"
                >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "تم" : "نسخ"}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: "rgba(0,0,0,0.3)",
                    fontSize: "0.8rem",
                    direction: "ltr",
                    textAlign: "left",
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}
