'use client';

import { Settings, Bell, Shield, Globe, Monitor, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
                <p className="text-gray-400 mt-2">Configure your dashboard preferences and account security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { name: 'General', icon: Settings, active: true },
                        { name: 'Notifications', icon: Bell },
                        { name: 'Security', icon: Shield },
                        { name: 'Language & Region', icon: Globe },
                        { name: 'Display', icon: Monitor },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all ${item.active
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card border border-white/5 p-6 rounded-2xl space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 ms-1">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Super Admin"
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 ms-1">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="admin@fleetrun.com"
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all opacity-50"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-lg font-semibold text-white mb-6">System Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div>
                                        <p className="text-white font-medium">Automatic Backups</p>
                                        <p className="text-xs text-gray-500">Regularly backup all shipment data</p>
                                    </div>
                                    <div className="h-6 w-11 bg-indigo-600 rounded-full relative">
                                        <div className="h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div>
                                        <p className="text-white font-medium">RTL Mode</p>
                                        <p className="text-xs text-gray-500">Enable Right-to-Left layout support</p>
                                    </div>
                                    <div className="h-6 w-11 bg-indigo-600 rounded-full relative">
                                        <div className="h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end">
                            <button className="flex items-center space-x-2 space-x-reverse bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-indigo-600/20">
                                <Save className="h-5 w-5" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
