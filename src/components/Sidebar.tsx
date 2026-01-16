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
    LuFileUp,
    LuBell
} from 'react-icons/lu';

const menuItems = [
    { icon: LuLayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: LuActivity, label: 'Analytics', id: 'analytics' },
    { icon: LuUsers, label: 'Users', id: 'users' },
    { icon: LuArrowLeftRight, label: 'Transactions', id: 'transactions' },
    { icon: LuFileUp, label: 'Import Data', id: 'import' },
    { icon: LuSettings, label: 'Settings', id: 'settings' },
];

export const Sidebar = () => {
    const sidebarOpen = useStore((state: AppState) => state.sidebarOpen);
    const toggleSidebar = useStore((state: AppState) => state.toggleSidebar);

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950',
                sidebarOpen ? 'w-64' : 'w-20'
            )}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
                    {sidebarOpen && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Statify
                        </span>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 ml-auto rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                    >
                        {sidebarOpen ? <LuChevronLeft size={20} /> : <LuChevronRight size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={cn(
                                    'flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all group relative',
                                    'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400',
                                    'text-slate-600 dark:text-slate-400'
                                )}
                            >
                                <Icon size={22} className="shrink-0" />
                                {sidebarOpen && <span className="ml-3 truncate">{item.label}</span>}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};
