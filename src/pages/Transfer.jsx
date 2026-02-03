export { default } from './TransferPage';

useEffect(() => {
    if (getAccountBalances) {
        setAccountBalances(getAccountBalances());
    }
}, [getAccountBalances]);

const getAccountIcon = (account) => {
    switch (account) {
        case 'Cash':
            {/* Transfer History */ }
        case 'Bank':
            return <CreditCardIcon className="w-5 h-5" />;

            {
                (() => {
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

                    const allTransfers = [
                        ...transfers.map(t => ({ ...t, __legacy: false })),
                        ...legacyTransfers,
                    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    if (allTransfers.length === 0) {
                        return (
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 text-center">
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">No transfers yet</p>
                            </div>
                        );
                    }

                    return (
                        <div className="space-y-3">
                            {allTransfers.slice(0, 10).map((t) => {
                                const canDelete = !t.__legacy && canEditTransaction(t.createdAt);
                                const hoursRemaining = getHoursRemaining(t.createdAt);

                                return (
                                    <div
                                        key={t._id}
                                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                    {t.fromAccount} → {t.toAccount}
                                                </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                    {formatDateTime(t.createdAt)} • {t.division || 'Personal'}
                                                    {t.__legacy ? ' • Legacy' : ''}
                                                </p>
                                                {t.description && (
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 break-words">
                                                        {t.description}
                                                    </p>
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
                    );
                })()
            }

            {
                false ? (
                return <WalletIcon className="w-5 h-5" />;
            default:
            return <WalletIcon className="w-5 h-5" />;
            toAccount: '',
                <></>
            error = { errors.fromAccount }
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
                        </div >

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

{
    errors.submit && (
        <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-3">
            <p className="text-sm text-danger-700 dark:text-danger-300">{errors.submit}</p>
        </div>
    )
}

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
                    </form >
                        </div >
                    </div >

    {/* Account Balances */ }
    < div className = "lg:col-span-1" >
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
                    </div >
                </div >

    {/* Transfer History */ }
    < div className = "mt-6" >
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Recent Transfers</h2>
{
    transfers.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No transfers yet</p>
        </div>
    ) : (
    <div className="space-y-3">
        {transfers.slice(0, 10).map((t) => {
            const canDelete = canEditTransaction(t.createdAt);
            const hoursRemaining = getHoursRemaining(t.createdAt);

            return (
                <div
                    key={t._id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                {t.fromAccount} → {t.toAccount}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {formatDateTime(t.createdAt)} • {t.division || 'Personal'}
                            </p>
                            {t.description && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 break-words">
                                    {t.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <p className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400">
                                ₹{Number(t.amount).toLocaleString('en-IN')}
                            </p>
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
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
)
}
                </div >
            </div >
        </PageWrapper >
    );
};

export default Transfer;