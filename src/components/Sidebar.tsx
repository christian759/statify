import { useStore } from '../store/useStore';
import type { AppState } from '../types';
import { cn } from '../utils/cn';
import {
    LuLayoutDashboard,
    LuUsers,
    LuArrowLeftRight,
    LuSettings,
    LuChevronLeft,
    LuChevronRight,
    LuActivity,
    LuFileUp
} from 'react-icons/lu';

const menuItems = [
    { icon: LuLayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: LuActivity, label: 'Analytics', id: 'analytics' },
    { icon: LuUsers, label: 'Users', id: 'users' },
    { icon: LuArrowLeftRight, label: 'Transactions', id: 'transactions' },
    { icon: LuFileUp, label: 'Import Data', id: 'import' },
    { icon: LuSettings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
    mobileMode?: boolean;
}

export const Sidebar = ({ mobileMode }: SidebarProps) => {
    const sidebarOpen = useStore((state: AppState) => state.sidebarOpen);
    const toggleSidebar = useStore((state: AppState) => state.toggleSidebar);
    const currentView = useStore((state: AppState) => state.currentView);
    const setView = useStore((state: AppState) => state.setView);

    const isCollapsed = !mobileMode && !sidebarOpen;

    return (
        <aside
            className={cn(
                'z-40 h-screen transition-all duration-300 ease-in-out border-r border-white/5 bg-white dark:bg-slate-950/50 backdrop-blur-xl',
                mobileMode ? 'w-full relative h-full bg-transparent border-none' : 'fixed left-0 top-0',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
                    {(!isCollapsed || mobileMode) && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-2">
                            Statify
                        </span>
                    )}
                    {!mobileMode && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 ml-auto rounded-xl hover:bg-white/10 transition-colors"
                        >
                            {sidebarOpen ? <LuChevronLeft size={20} /> : <LuChevronRight size={20} />}
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={cn(
                                    'flex items-center w-full px-4 py-3 text-sm font-semibold rounded-2xl transition-all group relative border border-transparent',
                                    isActive
                                        ? 'bg-primary/10 text-primary border-primary/10 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]'
                                        : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-700 dark:hover:text-slate-300 hover:scale-[1.02]',
                                    'active:scale-95'
                                )}
                            >
                                <Icon size={20} className={cn("shrink-0 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                                {(!isCollapsed || mobileMode) && <span className="ml-4 truncate">{item.label}</span>}
                                {isCollapsed && !mobileMode && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50 shadow-2xl pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="p-4 rounded-3xl premium-gradient text-white shadow-lg shadow-indigo-500/20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">System Status</p>
                        <p className="text-sm font-bold mt-1">Operational</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
