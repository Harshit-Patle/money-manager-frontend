import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useTransactions } from '../../hooks/useTransactions';
import { CATEGORIES, DIVISIONS, ACCOUNTS, TRANSACTION_TYPES } from '../../utils/constants';
import { canEditTransaction } from '../../utils/date';

const AddTransactionModal = ({ isOpen, onClose, editTransaction = null }) => {
    const { addTransaction, updateTransaction } = useTransactions();
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        type: TRANSACTION_TYPES.EXPENSE,
        amount: '',
        category: '',
        division: '',
        account: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (editTransaction) {
                const accountValue = editTransaction.account || 'Cash'; // Default to Cash if undefined
                
                setFormData({
                    type: editTransaction.type || TRANSACTION_TYPES.EXPENSE,
                    amount: String(editTransaction.amount || ''),
                    category: editTransaction.category || '',
                    division: editTransaction.division || '',
                    account: accountValue,
                    description: editTransaction.description || ''
                });
                setSelectedTab(editTransaction.type === TRANSACTION_TYPES.INCOME ? 0 : 1);
                setErrors({}); // Clear any previous errors
            } else {
                resetForm();
            }
        }
    }, [editTransaction, isOpen]);

    const resetForm = () => {
        setFormData({
            type: selectedTab === 0 ? TRANSACTION_TYPES.INCOME : TRANSACTION_TYPES.EXPENSE,
            amount: '',
            category: '',
            division: '',
            account: '',
            description: ''
        });
        setErrors({});
    };

    const handleTabChange = (index) => {
        setSelectedTab(index);
        setFormData(prev => ({
            ...prev,
            type: index === 0 ? TRANSACTION_TYPES.INCOME : TRANSACTION_TYPES.EXPENSE
        }));
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        if (!formData.division) {
            newErrors.division = 'Division is required';
        }
        if (!formData.account) {
            newErrors.account = 'Account is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Check if editing and time limit exceeded
        if (editTransaction && !canEditTransaction(editTransaction.createdAt)) {
            alert('Cannot edit transaction after 12 hours');
            return;
        }

        setLoading(true);
        try {
            const transactionData = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            if (editTransaction) {
                await updateTransaction(editTransaction._id, transactionData);
            } else {
                await addTransaction(transactionData);
            }

            resetForm();
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editTransaction ? 'Edit Transaction' : 'Add Transaction'}
            size="md"
        >
            <Tab.Group selectedIndex={selectedTab} onChange={editTransaction ? undefined : handleTabChange}>
                {!editTransaction && (
                    <Tab.List className="flex gap-2 mb-4 sm:mb-6">
                        <Tab
                            className={({ selected }) =>
                                `flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none ${selected
                                    ? 'bg-success-600 text-white shadow'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`
                            }
                        >
                            Income
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                `flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none ${selected
                                    ? 'bg-orange-500 text-white shadow'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`
                            }
                        >
                            Expense
                        </Tab>
                    </Tab.List>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-3 sm:space-y-4">
                        <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            error={errors.amount}
                            required
                        />

                        <Select
                            label="Category"
                            options={CATEGORIES}
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            error={errors.category}
                            required
                        />

                        <Select
                            label="Division"
                            options={DIVISIONS}
                            value={formData.division}
                            onChange={(e) => handleChange('division', e.target.value)}
                            error={errors.division}
                            required
                        />

                        <Select
                            label="Account"
                            options={ACCOUNTS}
                            value={formData.account}
                            onChange={(e) => handleChange('account', e.target.value)}
                            error={errors.account}
                            required
                        />

                        <Input
                            label="Description"
                            placeholder="Add a note (optional)"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={formData.type === TRANSACTION_TYPES.INCOME ? 'success' : 'warning'}
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : editTransaction ? 'Update' : 'Add Transaction'}
                        </Button>
                    </div>
                </form>
            </Tab.Group>
        </Modal>
    );
};

export default AddTransactionModal;