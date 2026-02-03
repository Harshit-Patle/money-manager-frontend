import { useEffect, useMemo, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { useTransactions } from '../hooks/useTransactions';
import { ACCOUNTS } from '../utils/constants';
import {
    ArrowDownIcon,
    CheckCircleIcon,
    WalletIcon,
    BanknotesIcon,
    CreditCardIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { formatDateTime, canEditTransaction, getHoursRemaining } from '../utils/date';

const TransferPage = () => {
    const {
        transferBetweenAccounts,
        getAccountBalances,
        transfers = [],
        deleteTransfer,
        balanceTransactions = []
    } = useTransactions();

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
        switch (account) {
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
        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        if (
            formData.fromAccount &&
            formData.amount &&
            Number(formData.amount) > (accountBalances[formData.fromAccount] ?? 0)
        ) {
            newErrors.amount = `Insufficient balance. Available: ₹${(accountBalances[formData.fromAccount] ?? 0).toFixed(2)}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const transferAmount = parseFloat(formData.amount);
            await transferBetweenAccounts({
                ...formData,
                amount: transferAmount
            });

            // Optimistic UI update to avoid temporary mismatch.
            setAccountBalances(prev => {
                const from = formData.fromAccount;
                const to = formData.toAccount;
                const next = { ...prev };
                if (from && next[from] !== undefined) next[from] = Number(next[from]) - transferAmount;
                if (to && next[to] !== undefined) next[to] = Number(next[to]) + transferAmount;
                return next;
            });

            setSuccess(true);
            setFormData({
                fromAccount: '',
                toAccount: '',
                amount: '',
                description: ''
            });

            setTimeout(() => setSuccess(false), 3000);

            // The context will refetch and reconcile balances shortly.
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Transfer failed' });
        } finally {
            setLoading(false);
        }
    };

    const transferHistory = useMemo(() => {
        const byTransferId = new Map();
        for (const t of balanceTransactions) {
            if (t?.category === 'Transfer' && t?.transferId) {
                const key = String(t.transferId);
                const existing = byTransferId.get(key) || [];
                existing.push(t);
                byTransferId.set(key, existing);
            }
        }

        const legacyTransfers = [];
        for (const [transferId, items] of byTransferId.entries()) {
            const expenseSide = items.find(i => i.type === 'expense');
            const incomeSide = items.find(i => i.type === 'income');
            const primary = expenseSide || incomeSide || items[0];

            const createdAt = items.reduce((max, cur) => {
                const d = new Date(cur.createdAt);
                return d > max ? d : max;
            }, new Date(0));

            legacyTransfers.push({
                _id: `legacy-${transferId}`,
                __legacy: true,
                transferId,
                fromAccount: expenseSide?.account,
                toAccount: incomeSide?.account,
                amount: primary.amount,
                division: primary.division,
                description: primary.description,
                createdAt: createdAt.toISOString(),
            });
        }

        return [
            ...transfers.map(t => ({ ...t, __legacy: false })),
            ...legacyTransfers,
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [balanceTransactions, transfers]);

    return (
        <PageWrapper>
            <div className="max-w-6xl">
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100">Account Transfer</h1>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1">Transfer money between your accounts</p>
                </div>

                {/* Mobile balances (keep above form for better UX) */}
                <div className="lg:hidden mb-6">
                    <div className="flex items-baseline justify-between mb-3">
                        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Account Balances</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ACCOUNTS.map(account => (
                            <div
                                key={account}
                                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 flex-shrink-0">
                                        {getAccountIcon(account)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{account}</p>
                                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                            ₹{accountBalances[account]?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 sm:p-6">
                            {success && (
                                <div className="mb-6 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4 flex items-start gap-3">
                                    <CheckCircleIcon className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-success-900 dark:text-success-100">Transfer successful!</p>
                                        <p className="text-sm text-success-700 dark:text-success-300 mt-1">Your transfer has been recorded.</p>
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
                                    <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                                        {loading ? 'Processing...' : 'Transfer Money'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-1">
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

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Recent Transfers</h2>

                    {transferHistory.length === 0 ? (
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 text-center">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">No transfers yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transferHistory.slice(0, 10).map((t) => {
                                const canDelete = !t.__legacy && canEditTransaction(t.createdAt);
                                const hoursRemaining = getHoursRemaining(t.createdAt);

                                return (
                                    <div key={t._id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                    {t.fromAccount} → {t.toAccount}
                                                </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                    {formatDateTime(t.createdAt)} • {t.division || 'Personal'}{t.__legacy ? ' • Legacy' : ''}
                                                </p>
                                                {t.description && (
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 break-words">{t.description}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <p className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400">
                                                    ₹{Number(t.amount).toLocaleString('en-IN')}
                                                </p>

                                                {!t.__legacy && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (window.confirm('Delete this transfer?')) {
                                                                deleteTransfer(t._id);
                                                            }
                                                        }}
                                                        disabled={!canDelete}
                                                        title={canDelete ? `${hoursRemaining}h remaining to delete` : 'Delete time expired'}
                                                        className="text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default TransferPage;
