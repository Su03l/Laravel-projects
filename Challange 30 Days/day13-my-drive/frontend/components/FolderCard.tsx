'use client';

import Link from 'next/link';
import { Folder, MoreVertical, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Folder as FolderType } from '@/types';

interface FolderCardProps {
    folder: FolderType;
    onDelete: (id: number) => void;
}

export default function FolderCard({ folder, onDelete }: FolderCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="card card-interactive group relative">
            <Link href={`/folder/${folder.id}`} className="block p-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-[var(--warning)]/10 rounded-xl group-hover:bg-[var(--warning)]/20 transition-colors">
                        <Folder className="w-12 h-12 text-[var(--warning)]" fill="currentColor" />
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)] text-center truncate w-full px-2">
                        {folder.name}
                    </span>
                </div>
            </Link>

            {/* Menu Button */}
            <div className="absolute top-2 right-2" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[var(--background-tertiary)] transition-all"
                >
                    <MoreVertical className="w-4 h-4 text-[var(--foreground-secondary)]" />
                </button>

                {showMenu && (
                    <div className="dropdown-menu">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(folder.id);
                                setShowMenu(false);
                            }}
                            className="dropdown-item danger"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
