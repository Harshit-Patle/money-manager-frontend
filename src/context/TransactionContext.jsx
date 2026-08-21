import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { transactionAPI } from '../api/transaction.api';
import { transferAPI } from '../api/transfer.api';
import { useAuth } from '../hooks/useAuth';
import { getDateRangeForFilter } from '../utils/date';
import { DATE_FILTERS } from '../utils/constants';

export const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [balanceTransactions, setBalanceTransactions] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [categorySummary, setCategorySummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        division: '',
        from: '',
        to: ''
    });
    const [dashboardFilter, setDashboardFilter] = useState(DATE_FILTERS.MONTHLY);

    const fetchTransactions = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        try {
            const data = await transactionAPI.getTransactions(filters);
            setTransactions(data);

            // Also fetch all transactions for dashboard stats
            const allData = await transactionAPI.getTransactions({});
            setAllTransactions(allData);

            // Fetch legacy-inclusive transactions for balance computation only (kept out of UI).
            const balanceData = await transactionAPI.getTransactions({ includeTransfers: true });
            setBalanceTransactions(balanceData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, filters.category, filters.division, filters.from, filters.to]);

    const fetchTransfers = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const data = await transferAPI.getTransfers({});
            setTransfers(data);
        } catch (error) {
            console.error('Error fetching transfers:', error);
        }
    }, [isAuthenticated]);

    const fetchCategorySummary = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const dateRange = getDateRangeForFilter(dashboardFilter);
            const data = await transactionAPI.getCategorySummary({
                from: dateRange.from.toISOString(),
                to: dateRange.to.toISOString()
            });
            setCategorySummary(data);
        } catch (error) {
            console.error('Error fetching category summary:', error);
        }
    }, [isAuthenticated, dashboardFilter]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTransactions();
            fetchTransfers();
            fetchCategorySummary();
        } else {
            // Reset state on logout
            setTransactions([]);
            setAllTransactions([]);
            setBalanceTransactions([]);
            setTransfers([]);
            setCategorySummary([]);
        }
    }, [isAuthenticated, fetchTransactions, fetchTransfers, fetchCategorySummary]);

    const addTransaction = useCallback(async (transactionData) => {
        const data = await transactionAPI.addTransaction(transactionData);
        setTransactions(prev => [data, ...prev]);
        setAllTransactions(prev => [data, ...prev]);
        fetchCategorySummary();
        return data;
    }, [fetchCategorySummary]);

    const updateTransaction = useCallback(async (id, transactionData) => {
        const data = await transactionAPI.updateTransaction(id, transactionData);
        await fetchTransactions();
        fetchCategorySummary();
        return data;
    }, [fetchTransactions, fetchCategorySummary]);

    const deleteTransaction = useCallback(async (id) => {
        await transactionAPI.deleteTransaction(id);
        await fetchTransactions();
        fetchCategorySummary();
    }, [fetchTransactions, fetchCategorySummary]);

    const transferBetweenAccounts = useCallback(async (transferData) => {
        const data = await transferAPI.createTransfer(transferData);
        await fetchTransfers();
        await fetchTransactions();
        fetchCategorySummary();
        return data;
    }, [fetchTransfers, fetchTransactions, fetchCategorySummary]);

    const deleteTransfer = useCallback(async (id) => {
        await transferAPI.deleteTransfer(id);
        await fetchTransfers();
        await fetchTransactions();
        fetchCategorySummary();
    }, [fetchTransfers, fetchTransactions, fetchCategorySummary]);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            category: '',
            division: '',
            from: '',
            to: ''
        });
    }, []);

    const getStats = useCallback(() => {
        if (!allTransactions || allTransactions.length === 0) {
            return {
                totalIncome: 0,
                totalExpense: 0,
                balance: 0
            };
        }

        const dateRange = getDateRangeForFilter(dashboardFilter);
        const filteredTransactions = allTransactions.filter(t => {
            const transactionDate = new Date(t.createdAt);
            return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
        });

        const totalIncome = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };
    }, [allTransactions, dashboardFilter]);

    const getAccountBalances = useCallback(() => {
        if ((!balanceTransactions || balanceTransactions.length === 0) && (!transfers || transfers.length === 0)) {
            return {
                Cash: 0,
                Bank: 0,
                Wallet: 0
            };
        }

        const balances = {
            Cash: 0,
            Bank: 0,
            Wallet: 0
        };

        // Base balances from income/expense transactions (including legacy transfers stored as transactions).
        balanceTransactions.forEach(transaction => {
            const account = transaction.account || 'Cash';
            if (transaction.type === 'income') {
                balances[account] += transaction.amount;
            } else {
                balances[account] -= transaction.amount;
            }
        });

        // Apply dedicated transfer documents (new system)
        transfers.forEach(t => {
            const from = t.fromAccount;
            const to = t.toAccount;
            const amount = Number(t.amount) || 0;
            if (from && balances[from] !== undefined) balances[from] -= amount;
            if (to && balances[to] !== undefined) balances[to] += amount;
        });

        return balances;
    }, [balanceTransactions, transfers]);

    const value = useMemo(() => ({
        transactions,
        allTransactions,
        balanceTransactions,
        transfers,
        categorySummary,
        loading,
        filters,
        dashboardFilter,
        setDashboardFilter,
        updateFilters,
        clearFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        transferBetweenAccounts,
        deleteTransfer,
        fetchTransactions,
        fetchTransfers,
        getStats,
        getAccountBalances
    }), [
        transactions,
        allTransactions,
        balanceTransactions,
        transfers,
        categorySummary,
        loading,
        filters,
        dashboardFilter,
        updateFilters,
        clearFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        transferBetweenAccounts,
        deleteTransfer,
        fetchTransactions,
        fetchTransfers,
        getStats,
        getAccountBalances
    ]);

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};