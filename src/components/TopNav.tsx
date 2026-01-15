import { useStore } from '../store';
import { cn } from '../utils/cn';
import { LuSearch, LuSun, LuMoon, LuBell, LuCalendar } from 'react-icons/lu';

export const TopNav = () => {
    const sidebarOpen = useStore((state) => state.sidebarOpen);
    const theme = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);

    return (
        <header
            className={cn(
                'fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 transition-all duration-300',
                isSidebarOpen ? 'left-64' : 'left-20'
            )}
        >
            <div className="flex flex-1 items-center gap-4">
                <div className="relative w-full max-w-md group">
                    <LuSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search transactions, users, or metrics..."
                        className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-900 border-transparent rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors">
                    <LuCalendar size={18} />
                    <span>Last 30 Days</span>
                </button>

                <div className="w-px h-6 mx-2 bg-slate-200 dark:border-slate-800" />

                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
                >
                    {theme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
                </button>

                <button className="p-2 relative text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors">
                    <LuBell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
                </button>
            </div>
        </header>
    );
};
