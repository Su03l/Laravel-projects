"use client"

import { useState, useRef, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatBubble } from "@/components/chat/ChatBubble"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { saveLocalChat } from "@/components/dashboard/Sidebar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Brain, Sparkles, MessageSquare, Image as ImageIcon, Code, Coins } from "lucide-react"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

const models = [
    { slug: "deepseek/deepseek-chat", name: "DeepSeek V3", desc: "برمجة ومنطق", cost: 1, color: "#39ff14", icon: Code },
    { slug: "openai/gpt-4o-mini", name: "GPT-4o Mini", desc: "ذكاء متوازن وسريع", cost: 5, color: "#00d4ff", icon: Brain },
    { slug: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", desc: "تحليل سريع", cost: 5, color: "#a855f7", icon: Sparkles },
    { slug: "black-forest-labs/flux-1-schnell", name: "Flux 1 Image", desc: "توليد صور احترافية", cost: 10, color: "#ff2d87", icon: ImageIcon },
]

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [model, setModel] = useState("deepseek/deepseek-chat")
    const scrollRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const router = useRouter()

    const isImageModel = model === "black-forest-labs/flux-1-schnell"

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: async ({ text, attachments }: { text: string, attachments: File[] }) => {
            const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
            setMessages(prev => [...prev, userMsg])

            const formData = new FormData()
            formData.append("prompt", text)
            formData.append("model_slug", model)
            attachments.forEach(file => {
                if (file.type.startsWith('image/')) {
                    formData.append("image", file)
                } else {
                    formData.append("code_file", file)
                }
            })

            const aiMsgId = (Date.now() + 1).toString()
            setMessages(prev => [...prev, { id: aiMsgId, role: "assistant", content: "" }])

            const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
            const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            const endpoint = isImageModel ? "/api/generate/image" : "/api/generate"

            try {
                const response = await fetch(`${baseURL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token || ''}`,
                        'Accept': 'application/json',
                    },
                    body: formData,
                    redirect: 'error',
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null)
                    throw new Error(errorData?.message || `HTTP ${response.status}`)
                }

                const contentType = response.headers.get('content-type') || ''

                if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
                    if (!response.body) throw new Error("No response body")
                    const reader = response.body.getReader()
                    const decoder = new TextDecoder()
                    let aiContent = ""
                    let chatId: string | null = null
                    let isFirstChunk = true

                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break

                        let chunk = decoder.decode(value, { stream: true })

                        // Parse CHAT_ID from first chunk
                        if (isFirstChunk) {
                            isFirstChunk = false
                            const lines = chunk.split('\n')
                            if (lines[0]?.startsWith('CHAT_ID:')) {
                                chatId = lines[0].split(':')[1]
                                // Save to localStorage for sidebar
                                saveLocalChat(chatId, text.substring(0, 30) + '...')
                                // Remove the CHAT_ID line from the chunk
                                chunk = lines.slice(1).join('\n')
                            }
                        }

                        aiContent += chunk

                        setMessages(prev => prev.map(m =>
                            m.id === aiMsgId ? { ...m, content: aiContent } : m
                        ))
                    }

                    // Navigate to the chat page and refresh sidebar
                    if (chatId) {
                        queryClient.invalidateQueries({ queryKey: ['chats'] })
                        queryClient.invalidateQueries({ queryKey: ['wallet'] })
                        router.push(`/chat/${chatId}`)
                    }
                } else {
                    // JSON response (image generation)
                    const data = await response.json()
                    const finalContent = data?.data?.image_url
                        ? `![Generated Image](${data.data.image_url})`
                        : data?.data?.content || data?.message || JSON.stringify(data)

                    setMessages(prev => prev.map(m =>
                        m.id === aiMsgId ? { ...m, content: finalContent } : m
                    ))

                    // Image endpoint returns chat_id in JSON
                    const imgChatId = data?.data?.chat_id
                    if (imgChatId) {
                        queryClient.invalidateQueries({ queryKey: ['chats'] })
                        queryClient.invalidateQueries({ queryKey: ['wallet'] })
                        router.push(`/chat/${imgChatId}`)
                    }
                }

            } catch (error: any) {
                console.error("Request error:", error)
                const errorMsg = error?.message || "فشل في استلام الرد من الخادم"
                toast.error(errorMsg)
                setMessages(prev => prev.map(m =>
                    m.id === aiMsgId
                        ? (m.content === "" ? { ...m, content: `⚠️ ${errorMsg}` } : m)
                        : m
                ))
            }
        }
    })

    const suggestions = [
        { icon: Code, text: "اكتب لي دالة Merge Sort in Python", color: "#39ff14" },
        { icon: MessageSquare, text: "ما هي أفضل ممارسات Laravel?", color: "#00d4ff" },
        { icon: Sparkles, text: "اكتب لي مقال عن الذكاء الاصطناعي", color: "#a855f7" },
    ]

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] relative">
            {/* Model Selector */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-[240px] glass border-zinc-800/50 hover:border-[#39ff14]/20 transition-colors">
                        <SelectValue placeholder="اختر النموذج" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800">
                        {models.map(m => (
                            <SelectItem key={m.slug} value={m.slug}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                                    <span>{m.name}</span>
                                    <span className="flex items-center gap-0.5 text-[10px] text-zinc-500 mr-auto">
                                        <Coins className="w-2.5 h-2.5" />
                                        {m.cost}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="max-w-3xl mx-auto space-y-6 pb-4 pt-16">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-8">
                            <div className="w-20 h-20 rounded-3xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center glow-green">
                                <Brain className="w-10 h-10 text-[#39ff14]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">مرحباً بك في GeniusLab</h2>
                                <p className="text-zinc-500">كيف أقدر أساعدك اليوم?</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage({ text: s.text, attachments: [] })}
                                        className="glass rounded-xl p-4 text-right hover-card-glow cursor-pointer transition-all text-sm text-zinc-400 hover:text-white"
                                    >
                                        <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
                                        {s.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(msg => (
                                <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
                            ))}
                            {isPending && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
                                <div className="flex items-center gap-2 pr-11">
                                    <div className="flex gap-1.5 px-4 py-3 glass rounded-2xl">
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <ChatInput onSend={(text, attachments) => sendMessage({ text, attachments })} isLoading={isPending} />
        </div>
    )
}
