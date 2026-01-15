import React from 'react';
import { useStore } from '../store/useStore';
import { BsSearch, BsSun, BsMoonStars, BsBell, BsCalendar4Range } from 'react-icons/bs';
import { cn } from '../utils/cn';

export const TopNav = () => {
    const { theme, setTheme, filters, setFilters } = useStore();

    return (
        <header className="sticky top-0 z-40 w-full h-16 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search transactions, users, or IDs..."
                            className="w-full bg-secondary/50 border-border border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm font-medium hover:bg-secondary transition-colors">
                        <BsCalendar4Range className="text-muted-foreground" />
                        <span>Last 30 Days</span>
                    </button>

                    <div className="h-6 w-px bg-border mx-2" />

                    <button className="p-2 rounded-full hover:bg-secondary relative text-muted-foreground transition-all">
                        <BsBell className="text-xl" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                    </button>

                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-all"
                    >
                        {theme === 'dark' ? <BsSun className="text-xl" /> : <BsMoonStars className="text-xl" />}
                    </button>

                    <div className="flex items-center gap-3 pl-2 border-l border-border">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold leading-none">John Doe</p>
                            <p className="text-xs text-muted-foreground mt-1">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 border-2 border-background shadow-md" />
                    </div>
                </div>
            </div>
        </header>
    );
};
