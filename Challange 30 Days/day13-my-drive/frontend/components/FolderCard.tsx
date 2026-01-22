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
                    <div
                        className="p-4 rounded-xl transition-colors"
                        style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                    >
                        <Folder className="w-12 h-12" style={{ color: '#fbbf24' }} fill="currentColor" />
                    </div>
                    <span className="text-sm font-medium text-white text-center truncate w-full px-2">
                        {folder.name}
                    </span>
                </div>
            </Link>

            <div className="absolute top-2 right-2" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
                >
                    <MoreVertical className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
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
