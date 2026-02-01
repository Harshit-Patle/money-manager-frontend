import { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionItem from './TransactionItem';
import Loader from '../common/Loader';
import { InboxIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const TransactionList = ({ onEdit }) => {
    const { transactions, loading } = useTransactions();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = transactions.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader size="lg" text="Loading transactions..." />
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
                <InboxIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">No transactions found</h3>
                <p className="text-sm text-neutral-500">
                    Add your first transaction to get started
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-3">
                {currentTransactions.map((transaction) => (
                    <TransactionItem
                        key={transaction._id}
                        transaction={transaction}
                        onEdit={onEdit}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 p-4 bg-white border border-neutral-200 rounded-lg">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <span className="text-xs text-neutral-500">
                            ({transactions.length} total)
                        </span>
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionList;