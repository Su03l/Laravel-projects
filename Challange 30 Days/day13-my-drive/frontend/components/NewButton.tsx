'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, FolderPlus, Upload } from 'lucide-react';

interface NewButtonProps {
    onNewFolder: () => void;
    onUploadFile: () => void;
}

export default function NewButton({ onNewFolder, onUploadFile }: NewButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="dropdown" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-primary"
            >
                <Plus className="w-5 h-5" />
                New
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <button
                        onClick={() => {
                            onNewFolder();
                            setIsOpen(false);
                        }}
                        className="dropdown-item"
                    >
                        <FolderPlus className="w-4 h-4" />
                        New Folder
                    </button>
                    <button
                        onClick={() => {
                            onUploadFile();
                            setIsOpen(false);
                        }}
                        className="dropdown-item"
                    >
                        <Upload className="w-4 h-4" />
                        Upload File
                    </button>
                </div>
            )}
        </div>
    );
}
