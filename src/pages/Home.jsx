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
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-neutral-900">Transactions</h1>
                        <p className="text-neutral-600 mt-1">View and manage your income and expenses</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleAddClick}
                        className="flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Transaction
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