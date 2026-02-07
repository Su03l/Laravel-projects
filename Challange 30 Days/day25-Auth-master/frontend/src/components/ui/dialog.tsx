import * as React from "react"
import { cn } from "@/lib/utils"
// Simplified Dialog without Radix, using standard HTML dialog or overlay
// For production ready, Radix is better, but I don't have it installed.
// I will build a custom Modal using fixed overlay.

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => onOpenChange(false)} />
            <div className="relative z-50 w-full max-w-lg transform overflow-hidden rounded-lg bg-background p-6 shadow-xl transition-all sm:my-8 bg-white dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
};

interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}

const DialogHeader = ({ children, className }: DialogHeaderProps) => (
    <div className={cn("mb-4 flex flex-col space-y-1.5 text-center sm:text-left", className)}>
        {children}
    </div>
);

const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
        {children}
    </h2>
)

const DialogFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>
        {children}
    </div>
)

export { Dialog, DialogHeader, DialogTitle, DialogFooter }
