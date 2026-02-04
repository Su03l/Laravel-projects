'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Search, Check, Users } from 'lucide-react';
import { clsx } from 'clsx';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock users
    const users = [
        { id: 1, name: 'Alice Johnson', avatar: null },
        { id: 2, name: 'Bob Smith', avatar: null },
        { id: 3, name: 'Charlie Brown', avatar: null },
        { id: 4, name: 'David Lee', avatar: null },
    ];

    const toggleUser = (id: number) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(uId => uId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleCreate = () => {
        // Logic to create group
        onClose();
        // Assuming a toast/feedback happens in parent or store
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-sky-500" /> New Group
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 ml-1 block mb-2">Group Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Design Team"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 ml-1 block mb-2">Add Members</label>
                                        <div className="relative mb-2">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-sm focus:outline-none"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto space-y-1">
                                            {users.map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => toggleUser(user.id)}
                                                    className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                                            {user.name[0]}
                                                        </div>
                                                        <span className="text-sm text-slate-700">{user.name}</span>
                                                    </div>
                                                    <div className={clsx(
                                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                        selectedUsers.includes(user.id) ? "bg-sky-500 border-sky-500 text-white" : "border-slate-300 bg-white"
                                                    )}>
                                                        {selectedUsers.includes(user.id) && <Check className="w-3 h-3" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-xl border border-transparent bg-sky-500 px-4 py-3 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleCreate}
                                        disabled={!groupName || selectedUsers.length === 0}
                                    >
                                        Create Group
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
