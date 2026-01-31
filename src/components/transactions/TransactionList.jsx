import { useTransactions } from '../../hooks/useTransactions';
import TransactionItem from './TransactionItem';
import Loader from '../common/Loader';
import { InboxIcon } from '@heroicons/react/24/outline';

const TransactionList = ({ onEdit }) => {
    const { transactions, loading } = useTransactions();

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
        <div className="space-y-3">
            {transactions.map((transaction) => (
                <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default TransactionList;