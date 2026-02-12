"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Loader2, FileText, Code, Mail, Globe,
    PenLine, Megaphone, BookOpen, Sparkles
} from "lucide-react"
import api from "@/lib/axios"
import { toast } from "sonner"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    "file-text": FileText,
    "code": Code,
    "mail": Mail,
    "globe": Globe,
    "pen-line": PenLine,
    "megaphone": Megaphone,
    "book-open": BookOpen,
    "sparkles": Sparkles,
}

const colorPalette = ["#39ff14", "#00d4ff", "#a855f7", "#ff2d87", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"]

interface TemplateField {
    name: string
    label: string
    type: "text" | "textarea"
    placeholder?: string
}

interface Template {
    id: number
    name: string
    description: string
    icon: string
    fields: TemplateField[]
}

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [dialogOpen, setDialogOpen] = useState(false)

    const { data: templates, isLoading } = useQuery<Template[]>({
        queryKey: ['templates'],
        queryFn: async () => {
            const res = await api.get('/api/templates')
            return res.data?.data || res.data || []
        }
    })

    const { mutate: generate, isPending } = useMutation({
        mutationFn: async () => {
            if (!selectedTemplate) return
            const res = await api.post(`/api/templates/${selectedTemplate.id}/generate`, formData)
            return res.data
        },
        onSuccess: (data) => {
            toast.success("تم إنشاء المحتوى بنجاح!")
            if (data?.data?.generated_content) {
                navigator.clipboard.writeText(data.data.generated_content)
                toast.info("تم نسخ المحتوى للحافظة")
            }
            setDialogOpen(false)
            setFormData({})
        },
        onError: () => {
            toast.error("فشل في إنشاء المحتوى")
        }
    })

    const openTemplate = (template: Template) => {
        setSelectedTemplate(template)
        setFormData({})
        setDialogOpen(true)
    }

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text">القوالب الجاهزة</h1>
                <p className="text-zinc-500 mt-1">اختر قالباً لإنشاء محتوى احترافي</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(templates) && templates.map((template, index) => {
                        const color = colorPalette[index % colorPalette.length]
                        const IconComponent = iconMap[template.icon] || Sparkles

                        return (
                            <Card
                                key={template.id}
                                className="glass border-zinc-800/30 hover-card-glow cursor-pointer group relative overflow-hidden"
                                onClick={() => openTemplate(template)}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ background: `linear-gradient(135deg, ${color}, transparent)` }} />
                                <CardHeader className="pb-3 relative">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                                    >
                                        <IconComponent className="w-6 h-6" style={{ color }} />
                                    </div>
                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <p className="text-sm text-zinc-500 leading-relaxed">{template.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="glass-strong border-zinc-800/50 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl gradient-text">{selectedTemplate?.name}</DialogTitle>
                        <p className="text-sm text-zinc-500">{selectedTemplate?.description}</p>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        {selectedTemplate?.fields?.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <Label className="text-zinc-400">{field.label}</Label>
                                {field.type === "textarea" ? (
                                    <Textarea
                                        placeholder={field.placeholder}
                                        value={formData[field.name] || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                        className="bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 min-h-[100px]"
                                    />
                                ) : (
                                    <Input
                                        placeholder={field.placeholder}
                                        value={formData[field.name] || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                        className="bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-11"
                                    />
                                )}
                            </div>
                        ))}
                        <Button
                            onClick={() => generate()}
                            className="w-full h-11 bg-[#39ff14] text-black font-bold hover:bg-[#39ff14]/80 glow-green"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري الإنشاء...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="ml-2 h-4 w-4" />
                                    إنشاء المحتوى
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
