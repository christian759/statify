import { useStore } from '../store/useStore';
import type { AppState } from '../types';
import { BsCurrencyDollar, BsArrowUpRight, BsArrowDownRight, BsPeople, BsBagCheck, BsSpeedometer2 } from 'react-icons/bs';
import { cn } from '../utils/cn';
import type { IconType } from 'react-icons';

interface CardProps {
    title: string;
    value: string;
    trend?: number;
    icon: IconType;
    colorClass: string;
    iconColorClass: string;
    bgOpacityClass: string;
}

const Card = ({ title, value, trend, icon: Icon, colorClass, iconColorClass, bgOpacityClass }: CardProps) => (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group animate-in">
        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-150 group-hover:opacity-[0.08]", colorClass)} />
        <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</h3>
                {trend !== undefined && (
                    <div className={cn("flex items-center gap-1.5 mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit",
                        trend >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                        {trend >= 0 ? <BsArrowUpRight strokeWidth={1} /> : <BsArrowDownRight strokeWidth={1} />}
                        <span className="uppercase tracking-tighter">{Math.abs(trend)}% vs last month</span>
                    </div>
                )}
            </div>
            <div className={cn("p-3 rounded-xl glass shadow-lg shadow-black/5", bgOpacityClass)}>
                <Icon className={cn("text-xl", iconColorClass)} />
            </div>
        </div>
    </div>
);

export const MetricCards = () => {
    const metrics = useStore((state: AppState) => state.metrics);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
                title="Total Revenue"
                value={formatter.format(metrics.totalRevenue)}
                icon={BsCurrencyDollar}
                colorClass="bg-blue-600"
                iconColorClass="text-blue-600"
                bgOpacityClass="bg-blue-600/10"
            />
            <Card
                title="Active Users"
                value={metrics.activeUsers.toLocaleString()}
                icon={BsPeople}
                colorClass="bg-indigo-600"
                iconColorClass="text-indigo-600"
                bgOpacityClass="bg-indigo-600/10"
            />
            <Card
                title="Total Transactions"
                value={metrics.transactionCount.toLocaleString()}
                icon={BsBagCheck}
                colorClass="bg-emerald-600"
                iconColorClass="text-emerald-600"
                bgOpacityClass="bg-emerald-600/10"
            />
            <Card
                title="Avg. Order Value"
                value={formatter.format(metrics.avgOrderValue)}
                icon={BsSpeedometer2}
                colorClass="bg-amber-600"
                iconColorClass="text-amber-600"
                bgOpacityClass="bg-amber-600/10"
            />
        </div>
    );
};
