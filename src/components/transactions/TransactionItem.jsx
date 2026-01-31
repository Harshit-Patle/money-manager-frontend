import { useState } from 'react';
import {
    PencilIcon,
    TrashIcon,
    BanknotesIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { formatDateTime, canEditTransaction, getHoursRemaining } from '../../utils/date';
import { useTransactions } from '../../hooks/useTransactions';
import Button from '../common/Button';

const TransactionItem = ({ transaction, onEdit }) => {
    const { deleteTransaction } = useTransactions();
    const [deleting, setDeleting] = useState(false);

    const isIncome = transaction.type === 'income';
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
        <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isIncome ? 'bg-success-100' : 'bg-danger-100'
                        }`}>
                        <BanknotesIcon className={`w-5 h-5 ${isIncome ? 'text-success-600' : 'text-danger-600'
                            }`} />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-900">{transaction.category}</h4>
                                <p className="text-xs text-neutral-500 mt-0.5">{formatDateTime(transaction.createdAt)}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-lg font-bold ${isIncome ? 'text-success-600' : 'text-danger-600'
                                    }`}>
                                    {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-neutral-100 text-neutral-700">
                                {transaction.division}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-neutral-100 text-neutral-700">
                                {transaction.account}
                            </span>
                            {!canEdit && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-neutral-200 text-neutral-600">
                                    <ClockIcon className="w-3 h-3 mr-1" />
                                    Locked
                                </span>
                            )}
                        </div>

                        {transaction.description && (
                            <p className="text-sm text-neutral-600 mt-2">{transaction.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    {canEdit ? (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(transaction)}
                                className="flex items-center gap-1"
                                title={`${hoursRemaining}h remaining to edit`}
                            >
                                <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-1 text-danger-600 hover:bg-danger-50"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-1 text-danger-600 hover:bg-danger-50"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionItem;