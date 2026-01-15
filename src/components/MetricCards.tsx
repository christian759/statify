import { useStore } from '../store';
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
    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-125", colorClass)} />
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
                {trend !== undefined && (
                    <div className={cn("flex items-center gap-1 mt-2 text-xs font-bold", trend >= 0 ? "text-emerald-500" : "text-rose-500")}>
                        {trend >= 0 ? <BsArrowUpRight strokeWidth={1} /> : <BsArrowDownRight strokeWidth={1} />}
                        <span className="uppercase tracking-tighter">{Math.abs(trend)}% vs last month</span>
                    </div>
                )}
            </div>
            <div className={cn("p-3 rounded-xl", bgOpacityClass)}>
                <Icon className={cn("text-xl", iconColorClass)} />
            </div>
        </div>
    </div>
);

export const MetricCards = () => {
    const metrics = useStore((state) => state.metrics);

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
                trend={12.5}
                icon={BsCurrencyDollar}
                colorClass="bg-blue-600"
                iconColorClass="text-blue-600"
                bgOpacityClass="bg-blue-600/10"
            />
            <Card
                title="Active Users"
                value={metrics.activeUsers.toLocaleString()}
                trend={5.2}
                icon={BsPeople}
                colorClass="bg-indigo-600"
                iconColorClass="text-indigo-600"
                bgOpacityClass="bg-indigo-600/10"
            />
            <Card
                title="Total Transactions"
                value={metrics.transactionCount.toLocaleString()}
                trend={-2.4}
                icon={BsBagCheck}
                colorClass="bg-emerald-600"
                iconColorClass="text-emerald-600"
                bgOpacityClass="bg-emerald-600/10"
            />
            <Card
                title="Avg. Order Value"
                value={formatter.format(metrics.avgOrderValue)}
                trend={8.1}
                icon={BsSpeedometer2}
                colorClass="bg-amber-600"
                iconColorClass="text-amber-600"
                bgOpacityClass="bg-amber-600/10"
            />
        </div>
    );
};
