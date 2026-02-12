"use client"

import { useState, useRef, useEffect, use } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatBubble } from "@/components/chat/ChatBubble"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Brain, Sparkles, Code, Image as ImageIcon, Coins, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"

interface Message {
    id: number | string
    role: "user" | "assistant"
    content: string
}

const models = [
    { slug: "deepseek/deepseek-chat", name: "DeepSeek V3", cost: 1, color: "#39ff14", icon: Code },
    { slug: "openai/gpt-4o-mini", name: "GPT-4o Mini", cost: 5, color: "#00d4ff", icon: Brain },
    { slug: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", cost: 5, color: "#a855f7", icon: Sparkles },
    { slug: "black-forest-labs/flux-1-schnell", name: "Flux 1 Image", cost: 10, color: "#ff2d87", icon: ImageIcon },
]

export default function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: chatId } = use(params)
    const [messages, setMessages] = useState<Message[]>([])
    const [model, setModel] = useState("deepseek/deepseek-chat")
    const scrollRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const router = useRouter()

    const isImageModel = model === "black-forest-labs/flux-1-schnell"

    // Load existing messages
    const { data: chatData, isLoading: isLoadingChat } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: async () => {
            const res = await api.get(`/api/chats/${chatId}`)
            return res.data?.data || res.data
        },
        retry: 1,
    })

    // Sync fetched messages into local state only once
    useEffect(() => {
        if (chatData?.messages && messages.length === 0) {
            setMessages(chatData.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
            })))
        }
    }, [chatData])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    // Delete chat
    const handleDelete = async () => {
        try {
            await api.delete(`/api/chats/${chatId}`)
            queryClient.invalidateQueries({ queryKey: ['chats'] })
            router.push('/chat')
            toast.success("تم حذف المحادثة")
        } catch {
            toast.error("فشل حذف المحادثة")
        }
    }

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: async ({ text, attachments }: { text: string, attachments: File[] }) => {
            const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
            setMessages(prev => [...prev, userMsg])

            const formData = new FormData()
            formData.append("prompt", text)
            formData.append("model_slug", model)
            formData.append("chat_id", chatId) // Continue existing chat
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
                    let isFirstChunk = true

                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break
                        let chunk = decoder.decode(value, { stream: true })

                        // Strip CHAT_ID: from first chunk (we already know our chat_id)
                        if (isFirstChunk) {
                            isFirstChunk = false
                            const lines = chunk.split('\n')
                            if (lines[0]?.startsWith('CHAT_ID:')) {
                                chunk = lines.slice(1).join('\n')
                            }
                        }

                        aiContent += chunk
                        setMessages(prev => prev.map(m =>
                            m.id === aiMsgId ? { ...m, content: aiContent } : m
                        ))
                    }
                } else {
                    const data = await response.json()
                    const finalContent = data?.data?.image_url
                        ? `![Generated Image](${data.data.image_url})`
                        : data?.data?.content || data?.message || JSON.stringify(data)
                    setMessages(prev => prev.map(m =>
                        m.id === aiMsgId ? { ...m, content: finalContent } : m
                    ))
                }

                // Refresh sidebar + wallet
                queryClient.invalidateQueries({ queryKey: ['chats'] })
                queryClient.invalidateQueries({ queryKey: ['wallet'] })

            } catch (error: any) {
                console.error("Request error:", error)
                const errorMsg = error?.message || "فشل في استلام الرد من الخادم"
                toast.error(errorMsg)
                setMessages(prev => prev.map(m =>
                    m.id === aiMsgId ? (m.content === "" ? { ...m, content: `⚠️ ${errorMsg}` } : m) : m
                ))
            }
        }
    })

    if (isLoadingChat) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-[#39ff14]" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] relative">
            {/* Header */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
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
                                        <Coins className="w-2.5 h-2.5" />{m.cost}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={handleDelete}
                    title="حذف المحادثة"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="max-w-3xl mx-auto space-y-6 pb-4 pt-16">
                    {messages.map(msg => (
                        <ChatBubble key={msg.id} role={msg.role as "user" | "assistant"} content={msg.content} />
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
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <ChatInput onSend={(text, attachments) => sendMessage({ text, attachments })} isLoading={isPending} />
        </div>
    )
}
