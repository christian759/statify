import React from 'react';
import { useStore } from '../store/useStore';
import {
    BsGraphUp,
    BsPeople,
    BsCreditCard,
    BsGear,
    BsLayoutSidebarInset,
    BsBoxArrowRight,
    BsCloudArrowUp
} from 'react-icons/bs';
import { cn } from '../utils/cn';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center w-full gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
            active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
    >
        <Icon className={cn("text-xl transition-transform group-hover:scale-110")} />
        <span className="font-medium">{label}</span>
    </button>
);

export const Sidebar = () => {
    const { sidebarOpen, toggleSidebar } = useStore();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50 flex flex-col",
                sidebarOpen ? "w-64" : "w-20"
            )}
        >
            <div className="flex items-center justify-between p-6">
                <div className={cn("flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all", sidebarOpen ? "opacity-100" : "opacity-0 w-0")}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">S</div>
                    <span className="text-xl font-bold tracking-tight">Statify</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
                >
                    <BsLayoutSidebarInset className={cn("transition-transform duration-300", !sidebarOpen && "rotate-180")} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                <SidebarItem icon={BsGraphUp} label="Dashboard" active={sidebarOpen} />
                <SidebarItem icon={BsPeople} label="Users" />
                <SidebarItem icon={BsCreditCard} label="Transactions" />
                <SidebarItem icon={BsCloudArrowUp} label="Data Analysis" />
            </nav>

            <div className="p-4 border-t border-border mt-auto space-y-2">
                <SidebarItem icon={BsGear} label="Settings" />
                <SidebarItem icon={BsBoxArrowRight} label="Logout" />
            </div>
        </aside>
    );
};
