import { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { useTransactions } from '../hooks/useTransactions';
import { ACCOUNTS } from '../utils/constants';
import { ArrowDownIcon,ArrowRightIcon, CheckCircleIcon, WalletIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const Transfer = () => {
    const { transferBetweenAccounts, getAccountBalances } = useTransactions();
    const [accountBalances, setAccountBalances] = useState({ Cash: 0, Bank: 0, Wallet: 0 });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
    });

    useEffect(() => {
        if (getAccountBalances) {
            setAccountBalances(getAccountBalances());
        }
    }, [getAccountBalances]);

    const getAccountIcon = (account) => {
        switch(account) {
            case 'Cash':
                return <BanknotesIcon className="w-5 h-5" />;
            case 'Bank':
                return <CreditCardIcon className="w-5 h-5" />;
            case 'Wallet':
                return <WalletIcon className="w-5 h-5" />;
            default:
                return <WalletIcon className="w-5 h-5" />;
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        setSuccess(false);
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fromAccount) {
            newErrors.fromAccount = 'From account is required';
        }
        if (!formData.toAccount) {
            newErrors.toAccount = 'To account is required';
        }
        if (formData.fromAccount && formData.toAccount && formData.fromAccount === formData.toAccount) {
            newErrors.toAccount = 'Cannot transfer to the same account';
        }
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        if (formData.fromAccount && formData.amount && parseFloat(formData.amount) > accountBalances[formData.fromAccount]) {
            newErrors.amount = `Insufficient balance. Available: ₹${accountBalances[formData.fromAccount].toFixed(2)}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await transferBetweenAccounts({
                ...formData,
                amount: parseFloat(formData.amount)
            });

            setSuccess(true);
            setFormData({
                fromAccount: '',
                toAccount: '',
                amount: '',
                description: ''
            });

            setTimeout(() => setSuccess(false), 3000);
            
            // Update balances after transfer
            if (getAccountBalances) {
                setAccountBalances(getAccountBalances());
            }
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Transfer failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-6xl">
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100">Account Transfer</h1>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1">Transfer money between your accounts</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transfer Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 sm:p-6">
                    {success && (
                        <div className="mb-6 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-success-900 dark:text-success-100">Transfer successful!</p>
                                <p className="text-sm text-success-700 dark:text-success-300 mt-1">
                                    Your transfer has been recorded in both accounts.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 gap-4 items-end">
                            <Select
                                label="From Account"
                                options={ACCOUNTS}
                                value={formData.fromAccount}
                                onChange={(e) => handleChange('fromAccount', e.target.value)}
                                error={errors.fromAccount}
                                required
                            />

                            <div className="hidden md:flex items-center justify-center pt-2">
                                <ArrowDownIcon className="w-7 h-7 text-neutral-400 dark:text-neutral-600" />
                            </div>

                            <Select
                                label="To Account"
                                options={ACCOUNTS}
                                value={formData.toAccount}
                                onChange={(e) => handleChange('toAccount', e.target.value)}
                                error={errors.toAccount}
                                required
                            />
                        </div>

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

                        <Input
                            label="Description"
                            placeholder="Add a note (optional)"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />

                        {errors.submit && (
                            <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-3">
                                <p className="text-sm text-danger-700 dark:text-danger-300">{errors.submit}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Transfer Money'}
                            </Button>
                        </div>
                    </form>
                        </div>
                    </div>

                    {/* Account Balances */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Account Balances</h2>
                            <div className="space-y-4">
                                {ACCOUNTS.map(account => (
                                    <div key={account} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600">
                                                {getAccountIcon(account)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{account}</p>
                                                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                                    ₹{accountBalances[account]?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Transfer;