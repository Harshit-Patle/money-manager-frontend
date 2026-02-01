import { useState, useEffect } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { getDateRangeForFilter } from '../../utils/date';
import { ClockIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const RecentTransactions = () => {
    const { allTransactions = [], dashboardFilter } = useTransactions();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const getFilteredTransactions = () => {
        if (!allTransactions || allTransactions.length === 0) {
            return [];
        }

        const dateRange = getDateRangeForFilter(dashboardFilter);
        const filtered = allTransactions.filter(t => {
            const date = new Date(t.createdAt);
            return date >= dateRange.from && date <= dateRange.to;
        });

        // Sort by date (most recent first)
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const allFilteredTransactions = getFilteredTransactions();
    const totalPages = Math.ceil(allFilteredTransactions.length / itemsPerPage);
    
    // Get transactions for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const transactions = allFilteredTransactions.slice(startIndex, endIndex);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [dashboardFilter]);

    if (transactions.length === 0) {
        return (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 sm:p-8 text-center">
                <ClockIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">No transactions in this period</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 sm:p-6">
            <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Transaction History
                </h3>
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    {allFilteredTransactions.length} transaction{allFilteredTransactions.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-2">
                {transactions.map((transaction) => {
                    const isIncome = transaction.type === 'income';

                    return (
                        <div
                            key={transaction._id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors border border-neutral-100 dark:border-neutral-700"
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
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                            {transaction.category}
                                        </p>
                                        {transaction.description && (
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                                • {transaction.description}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;
