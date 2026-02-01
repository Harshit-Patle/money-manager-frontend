import { useTransactions } from '../../hooks/useTransactions';
import { getDateRangeForFilter } from '../../utils/date';
import { ClockIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const RecentTransactions = () => {
    const { allTransactions = [], dashboardFilter } = useTransactions();

    const getFilteredTransactions = () => {
        if (!allTransactions || allTransactions.length === 0) {
            return [];
        }

        const dateRange = getDateRangeForFilter(dashboardFilter);
        const filtered = allTransactions.filter(t => {
            const date = new Date(t.createdAt);
            return date >= dateRange.from && date <= dateRange.to;
        });

        // Sort by date (most recent first) and limit to 10
        return filtered
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
    };

    const transactions = getFilteredTransactions();

    if (transactions.length === 0) {
        return (
            <div className="bg-white border border-neutral-200 rounded-lg p-6 sm:p-8 text-center">
                <ClockIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-neutral-500">No transactions in this period</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                    Transaction History
                </h3>
                <span className="text-xs sm:text-sm text-neutral-500">
                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-2">
                {transactions.map((transaction) => {
                    const isIncome = transaction.type === 'income';

                    return (
                        <div
                            key={transaction._id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-100"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isIncome ? 'bg-success-50' : 'bg-danger-50'
                                    }`}>
                                    {isIncome ? (
                                        <ArrowTrendingUpIcon className="w-5 h-5 text-success-600" />
                                    ) : (
                                        <ArrowTrendingDownIcon className="w-5 h-5 text-danger-600" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium text-neutral-900 truncate">
                                            {transaction.category}
                                        </p>
                                        {transaction.description && (
                                            <span className="text-xs text-neutral-500 truncate">
                                                • {transaction.description}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <span>{transaction.division || 'General'}</span>
                                        <span>•</span>
                                        <span>{transaction.account || 'Cash'}</span>
                                        <span>•</span>
                                        <span>{format(new Date(transaction.createdAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0 ml-3">
                                <p className={`text-sm sm:text-base font-semibold ${isIncome ? 'text-success-600' : 'text-danger-600'
                                    }`}>
                                    {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentTransactions;
