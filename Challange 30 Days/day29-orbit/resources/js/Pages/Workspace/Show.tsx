import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Workspace, Project, User } from '@/types/models';
import {
    FolderOpen, Users, Crown, ArrowLeft, Plus,
    LayoutGrid, Calendar, ListTodo, Settings2, UserPlus
} from 'lucide-react';
import CreateProjectDialog from '@/Components/Workspace/CreateProjectDialog';

interface WorkspaceShowProps {
    workspace: Workspace & {
        projects_count: number;
        members_count: number;
        owner: User;
        projects: (Project & { tasks_count: number })[];
        members: User[];
    };
}

export default function Show({ workspace }: WorkspaceShowProps) {
    const colors = [
        { from: 'from-indigo-500', to: 'to-blue-500', bg: 'bg-indigo-500', text: 'text-indigo-400' },
        { from: 'from-violet-500', to: 'to-purple-500', bg: 'bg-violet-500', text: 'text-violet-400' },
        { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-500', text: 'text-emerald-400' },
        { from: 'from-amber-500', to: 'to-orange-500', bg: 'bg-amber-500', text: 'text-amber-400' },
        { from: 'from-rose-500', to: 'to-pink-500', bg: 'bg-rose-500', text: 'text-rose-400' },
        { from: 'from-cyan-500', to: 'to-sky-500', bg: 'bg-cyan-500', text: 'text-cyan-400' },
    ];

    return (
        <AppLayout>
            <Head title={workspace.name} />

            <div className="p-6 md:p-8 space-y-8">
                {/* Workspace Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/20 via-[#222222] to-violet-600/20 border border-white/[0.06] p-8">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        {/* Breadcrumb */}
                        <Link href={route('dashboard')} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm mb-4">
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                            العودة للرئيسية
                        </Link>

                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20 border border-white/10">
                                    {workspace.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">{workspace.name}</h1>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-zinc-400 text-sm flex items-center gap-1.5">
                                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                                            {workspace.owner?.name}
                                        </span>
                                        <span className="text-zinc-600">|</span>
                                        <span className="text-zinc-400 text-sm flex items-center gap-1.5">
                                            <FolderOpen className="w-3.5 h-3.5" />
                                            {workspace.projects_count} مشاريع
                                        </span>
                                        <span className="text-zinc-600">|</span>
                                        <span className="text-zinc-400 text-sm flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5" />
                                            {workspace.members_count} أعضاء
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <LayoutGrid className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{workspace.projects_count}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">مشاريع</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{workspace.members_count}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">أعضاء الفريق</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <ListTodo className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {workspace.projects?.reduce((sum, p) => sum + (p.tasks_count || 0), 0) || 0}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">مهام إجمالية</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Projects Section - 2/3 */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                                <FolderOpen className="w-5 h-5 text-indigo-400" />
                                المشاريع
                            </h2>
                            <CreateProjectDialog workspaceId={workspace.id} />
                        </div>

                        {workspace.projects?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {workspace.projects.map((project, idx) => {
                                    const color = colors[idx % colors.length];
                                    return (
                                        <Link
                                            key={project.id}
                                            href={route('projects.show', project.id)}
                                            className="group bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-xl hover:shadow-black/20 overflow-hidden"
                                        >
                                            {/* Accent bar */}
                                            <div className={`h-1 bg-gradient-to-r ${color.from} ${color.to} opacity-60 group-hover:opacity-100 transition-opacity`} />

                                            <div className="p-5">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.from}/20 ${color.to}/20 flex items-center justify-center ${color.text} font-bold border border-white/5`}>
                                                        {project.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">{project.name}</h3>
                                                        {project.description && (
                                                            <p className="text-xs text-zinc-500 truncate mt-0.5">{project.description}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                            <ListTodo className="w-3 h-3" />
                                                            {project.tasks_count || 0} مهام
                                                        </span>
                                                    </div>
                                                    <ArrowLeft className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-all opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-[#222222]/50 rounded-2xl border border-dashed border-white/[0.08]">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                                    <FolderOpen className="w-8 h-8 text-zinc-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-200">لا توجد مشاريع بعد</h3>
                                <p className="text-zinc-500 mt-2 text-sm">ابدأ بإنشاء مشروعك الأول</p>
                                <div className="mt-4">
                                    <CreateProjectDialog workspaceId={workspace.id} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Members Section - 1/3 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                                <Users className="w-5 h-5 text-violet-400" />
                                الأعضاء
                            </h2>
                        </div>

                        <div className="bg-[#222222]/70 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-4 space-y-2">
                            {workspace.members?.map((member) => (
                                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/5">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-zinc-200 truncate">{member.name}</p>
                                        <p className="text-xs text-zinc-500 truncate" dir="ltr">{member.email}</p>
                                    </div>
                                    {workspace.owner_id === member.id && (
                                        <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                    )}
                                </div>
                            ))}

                            {/* Invite placeholder */}
                            <div className="pt-2 border-t border-white/[0.06]">
                                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all text-sm">
                                    <UserPlus className="w-4 h-4" />
                                    دعوة عضو جديد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
