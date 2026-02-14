import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Workspace } from '@/types/models';
import { Folder, Layers, ArrowLeft, Briefcase, FolderOpen, Users, Clock } from 'lucide-react';
import CreateWorkspaceDialog from '@/Components/Workspace/CreateWorkspaceDialog';
import CreateProjectDialog from '@/Components/Workspace/CreateProjectDialog';

interface DashboardProps {
    workspaces: Workspace[];
}

export default function Dashboard({ workspaces }: DashboardProps) {
    const user = usePage().props.auth.user;

    const totalProjects = workspaces.reduce((sum, w) => sum + (w.projects_count || 0), 0);

    return (
        <AppLayout>
            <Head title="الرئيسية" />

            <div className="p-6 md:p-8 space-y-8">
                {/* Hero / Greeting */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/20 via-[#222222] to-violet-600/20 border border-white/[0.06] p-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
                    <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            مرحباً، {user.name}
                        </h1>
                        <p className="text-zinc-400 text-base">
                            إليك نظرة عامة على مساحات عملك ومشاريعك
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="group bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5 hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{workspaces.length}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">مساحة عمل</p>
                            </div>
                        </div>
                    </div>
                    <div className="group bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5 hover:border-violet-500/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <FolderOpen className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalProjects}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">مشروع</p>
                            </div>
                        </div>
                    </div>
                    <div className="group bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5 hover:border-emerald-500/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">نشط</p>
                                <p className="text-xs text-zinc-500 mt-0.5">حالة الحساب</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workspaces Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100">مساحات العمل</h2>
                        <p className="text-zinc-500 text-sm mt-0.5">إدارة مساحات العمل والمشاريع</p>
                    </div>
                    <CreateWorkspaceDialog />
                </div>

                {/* Workspaces Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {workspaces.map((workspace, idx) => {
                        const colors = [
                            { from: 'from-indigo-500', to: 'to-blue-500', bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-400' },
                            { from: 'from-violet-500', to: 'to-purple-500', bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-400' },
                            { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-400' },
                            { from: 'from-amber-500', to: 'to-orange-500', bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-400' },
                            { from: 'from-rose-500', to: 'to-pink-500', bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-400' },
                        ];
                        const color = colors[idx % colors.length];

                        return (
                            <div key={workspace.id} className="group bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-xl hover:shadow-black/20 relative overflow-hidden">
                                {/* Top accent bar */}
                                <div className={`h-1 bg-gradient-to-r ${color.from} ${color.to} opacity-60 group-hover:opacity-100 transition-opacity`} />

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.from}/20 ${color.to}/20 flex items-center justify-center ${color.text} font-bold text-lg ${color.border}/10 border`}>
                                                {workspace.name.charAt(0)}
                                            </div>
                                            <div>
                                                <Link href={route('workspaces.show', workspace.id)} className="font-semibold text-lg text-zinc-100 group-hover:text-white transition-colors hover:text-indigo-300">{workspace.name}</Link>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                        <FolderOpen className="w-3 h-3" />
                                                        {workspace.projects_count || 0} مشاريع
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        {workspace.projects?.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={route('projects.show', project.id)}
                                                className="block p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200 group/link"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-2 h-2 rounded-full ${color.bg}/40`} />
                                                        <span className="font-medium text-zinc-300 group-hover/link:text-white transition-colors text-sm">{project.name}</span>
                                                    </div>
                                                    <ArrowLeft className="w-3.5 h-3.5 text-zinc-600 group-hover/link:text-zinc-300 transition-all opacity-0 group-hover/link:opacity-100 transform translate-x-1 group-hover/link:translate-x-0" />
                                                </div>
                                            </Link>
                                        ))}

                                        <CreateProjectDialog workspaceId={workspace.id} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {workspaces.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-[#222222]/50 rounded-2xl border border-dashed border-white/[0.08] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-violet-500/[0.03]" />
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
                                    <Layers className="w-10 h-10 text-zinc-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-200">لا توجد مساحات عمل</h3>
                                <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto">ابدأ بإنشاء مساحة عمل جديدة لتنظيم مشاريعك وفريقك</p>
                                <div className="mt-6">
                                    <CreateWorkspaceDialog />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
