import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    WalletIcon
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats }) => {
    const statCards = [
        {
            label: 'Total Income',
            value: stats.totalIncome,
            icon: ArrowTrendingUpIcon,
            color: 'success',
            bgColor: 'bg-success-50',
            textColor: 'text-success-600',
            iconColor: 'text-success-600'
        },
        {
            label: 'Total Expense',
            value: stats.totalExpense,
            icon: ArrowTrendingDownIcon,
            color: 'danger',
            bgColor: 'bg-danger-50',
            textColor: 'text-danger-600',
            iconColor: 'text-danger-600'
        },
        {
            label: 'Balance',
            value: stats.balance,
            icon: WalletIcon,
            color: stats.balance >= 0 ? 'primary' : 'danger',
            bgColor: stats.balance >= 0 ? 'bg-primary-50' : 'bg-danger-50',
            textColor: stats.balance >= 0 ? 'text-primary-600' : 'text-danger-600',
            iconColor: stats.balance >= 0 ? 'text-primary-600' : 'text-danger-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {statCards.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} dark:opacity-80 rounded-lg flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{stat.label}</p>
                    <p
                        className={`text-2xl sm:text-3xl font-bold ${stat.textColor} truncate`}
                        title={`₹${Math.abs(stat.value).toLocaleString('en-IN')}`}
                    >
                        ₹{Math.abs(stat.value).toLocaleString('en-IN')}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;