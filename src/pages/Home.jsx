import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import TransactionList from '../components/transactions/TransactionList';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import Filters from '../components/transactions/Filters';
import Button from '../components/common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState(null);

    const handleAddClick = () => {
        setEditTransaction(null);
        setIsModalOpen(true);
    };

    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditTransaction(null);
    };

    return (
        <PageWrapper>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">Transactions</h1>
                        <p className="text-sm sm:text-base text-neutral-600 mt-1">View and manage your income and expenses</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleAddClick}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Transaction</span>
                    </Button>
                </div>

                <Filters />

                <TransactionList onEdit={handleEdit} />

                <AddTransactionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    editTransaction={editTransaction}
                />
            </div>
        </PageWrapper>
    );
};

export default Home;