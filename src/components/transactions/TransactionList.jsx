import { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionItem from './TransactionItem';
import Loader from '../common/Loader';
import { InboxIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const TransactionList = ({ onEdit }) => {
    const { transactions, loading } = useTransactions();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const displayTransactions = (() => {
        if (!transactions || transactions.length === 0) return [];

        const byTransferId = new Map();
        const result = [];

        for (const t of transactions) {
            if (t?.category === 'Transfer' && t?.transferId) {
                const key = String(t.transferId);
                const existing = byTransferId.get(key) || [];
                existing.push(t);
                byTransferId.set(key, existing);
            } else {
                result.push(t);
            }
        }

        for (const [transferId, items] of byTransferId.entries()) {
            const expenseSide = items.find(i => i.type === 'expense');
            const incomeSide = items.find(i => i.type === 'income');
            const primary = expenseSide || incomeSide || items[0];
            const createdAt = items.reduce((max, cur) => {
                const d = new Date(cur.createdAt);
                return d > max ? d : max;
            }, new Date(0));

            result.push({
                _id: primary._id,
                transferId,
                __isTransfer: true,
                type: 'transfer',
                amount: primary.amount,
                category: 'Transfer',
                division: primary.division,
                description: primary.description,
                fromAccount: expenseSide?.account,
                toAccount: incomeSide?.account,
                createdAt: createdAt.toISOString(),
            });
        }

        return result;
    })();

    const totalPages = Math.ceil(displayTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = displayTransactions.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader size="lg" text="Loading transactions..." />
            </div>
        );
    }

    if (displayTransactions.length === 0) {
        return (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-12 text-center">
                <InboxIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">No transactions found</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
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
                <div className="flex items-center justify-between mt-6 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            ({displayTransactions.length} total)
                        </span>
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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