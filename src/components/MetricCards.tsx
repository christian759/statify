import { useStore } from '../store/useStore';
import { BsCurrencyDollar, BsArrowUpRight, BsArrowDownRight, BsPeople, BsBagCheck, BsSpeedometer2 } from 'react-icons/bs';
import { cn } from '../utils/cn';

const Card = ({ title, value, trend, icon: Icon, color }: { title: string, value: string, trend?: number, icon: any, color: string }) => (
    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-125", color)} />
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
                {trend !== undefined && (
                    <div className={cn("flex items-center gap-1 mt-2 text-xs font-semibold", trend >= 0 ? "text-emerald-500" : "text-rose-500")}>
                        {trend >= 0 ? <BsArrowUpRight /> : <BsArrowDownRight />}
                        <span>{Math.abs(trend)}% from last month</span>
                    </div>
                )}
            </div>
            <div className={cn("p-3 rounded-xl", color.replace('bg-', 'bg-').replace('opacity-10', 'bg-opacity-20'))}>
                <Icon className={cn("text-xl", color.replace('bg-', 'text-'))} />
            </div>
        </div>
    </div>
);

export const MetricCards = () => {
    const { metrics } = useStore();

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
                color="bg-primary"
            />
            <Card
                title="Active Users"
                value={metrics.activeUsers.toLocaleString()}
                trend={5.2}
                icon={BsPeople}
                color="bg-blue-500"
            />
            <Card
                title="Total Transactions"
                value={metrics.transactionCount.toLocaleString()}
                trend={-2.4}
                icon={BsBagCheck}
                color="bg-emerald-500"
            />
            <Card
                title="Avg. Order Value"
                value={formatter.format(metrics.avgOrderValue)}
                trend={8.1}
                icon={BsSpeedometer2}
                color="bg-amber-500"
            />
        </div>
    );
};
