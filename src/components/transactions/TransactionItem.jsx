import { useState } from 'react';
import {
    PencilIcon,
    TrashIcon,
    BanknotesIcon,
    ArrowsRightLeftIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { formatDateTime, canEditTransaction, getHoursRemaining } from '../../utils/date';
import { useTransactions } from '../../hooks/useTransactions';
import Button from '../common/Button';

const TransactionItem = ({ transaction, onEdit }) => {
    const { deleteTransaction } = useTransactions();
    const [deleting, setDeleting] = useState(false);

    const isTransfer = transaction.__isTransfer === true || transaction.type === 'transfer';
    const isIncome = !isTransfer && transaction.type === 'income';
    const canEdit = canEditTransaction(transaction.createdAt);
    const hoursRemaining = getHoursRemaining(transaction.createdAt);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            setDeleting(true);
            try {
                await deleteTransaction(transaction._id);
            } catch (error) {
                alert('Failed to delete transaction');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isTransfer
                        ? 'bg-primary-100 dark:bg-primary-900/30'
                        : isIncome
                            ? 'bg-success-100'
                            : 'bg-danger-100'
                        }`}>
                        {isTransfer ? (
                            <ArrowsRightLeftIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        ) : (
                            <BanknotesIcon className={`w-5 h-5 ${isIncome ? 'text-success-600' : 'text-danger-600'
                                }`} />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{transaction.category}</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{formatDateTime(transaction.createdAt)}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className={`text-lg font-bold ${isTransfer
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : isIncome
                                        ? 'text-success-600'
                                        : 'text-danger-600'
                                    }`}>
                                    {isTransfer
                                        ? `₹${transaction.amount.toLocaleString('en-IN')}`
                                        : `${isIncome ? '+' : '-'}₹${transaction.amount.toLocaleString('en-IN')}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                {transaction.division}
                            </span>
                            {isTransfer ? (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                    {(transaction.fromAccount || '—')} → {(transaction.toAccount || '—')}
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                    {transaction.account || 'Cash'}
                                </span>
                            )}
                            {!canEdit && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                                    <ClockIcon className="w-3 h-3 mr-1" />
                                    Locked
                                </span>
                            )}
                        </div>

                        {transaction.description && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{transaction.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:ml-4 justify-end sm:justify-start">
                    {!isTransfer && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(transaction)}
                            disabled={!canEdit}
                            className="flex items-center gap-1"
                            title={canEdit ? `${hoursRemaining}h remaining to edit` : 'Edit time expired'}
                        >
                            <PencilIcon className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting || !canEdit}
                        className="flex items-center gap-1 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                        title={canEdit ? `${hoursRemaining}h remaining to delete` : 'Delete time expired'}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TransactionItem;