"use client";

import { ToolShell } from "@/components/layout/tool-shell";
import { API_BASE_URL } from "@/lib/api";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImagePage() {
    // Directly using the image URL since it's a stream
    const imageUrl = `${API_BASE_URL}/tools/image`;

    return (
        <ToolShell title="معرض الصور" description="استعارة صور عشوائية من الخادم بجودة عالية.">
            <div className="flex justify-center">
                <div className="group relative max-w-2xl overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt="Random Server Asset"
                        className="w-full object-cover transition-transform duration-700 hover:scale-105 hover:opacity-90"
                    />

                    {/* Overlay Content */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                                <p className="font-bold text-lg">Server Generated Image</p>
                                <p className="text-xs opacity-70">PNG Format</p>
                            </div>
                            <Button variant="outline" className="border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black">
                                <Download className="mr-2 h-4 w-4" />
                                Save Image
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
