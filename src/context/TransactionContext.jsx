import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { transactionAPI } from '../api/transaction.api';
import { getDateRangeForFilter } from '../utils/date';
import { DATE_FILTERS } from '../utils/constants';

export const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [categorySummary, setCategorySummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        division: '',
        from: '',
        to: ''
    });
    const [dashboardFilter, setDashboardFilter] = useState(DATE_FILTERS.MONTHLY);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const fetchTransactions = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return; // Don't fetch if not authenticated

        setLoading(true);
        try {
            const data = await transactionAPI.getTransactions(filters);
            setTransactions(data);

            // Also fetch all transactions for dashboard stats
            const allData = await transactionAPI.getTransactions({});
            setAllTransactions(allData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [filters.category, filters.division, filters.from, filters.to]);

    const fetchCategorySummary = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return; // Don't fetch if not authenticated

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
    }, [dashboardFilter]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchTransactions();
        }
    }, [fetchTransactions, isAuthenticated]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCategorySummary();
        }
    }, [fetchCategorySummary, isAuthenticated]);

    const addTransaction = useCallback(async (transactionData) => {
        const data = await transactionAPI.addTransaction(transactionData);
        setTransactions(prev => [data, ...prev]);
        setAllTransactions(prev => [data, ...prev]);
        fetchCategorySummary();
        return data;
    }, [fetchCategorySummary]);

    const updateTransaction = useCallback(async (id, transactionData) => {
        const data = await transactionAPI.updateTransaction(id, transactionData);
        setTransactions(prev => prev.map(t => t._id === id ? data : t));
        setAllTransactions(prev => prev.map(t => t._id === id ? data : t));
        fetchCategorySummary();
        return data;
    }, [fetchCategorySummary]);

    const deleteTransaction = useCallback(async (id) => {
        await transactionAPI.deleteTransaction(id);
        setTransactions(prev => prev.filter(t => t._id !== id));
        setAllTransactions(prev => prev.filter(t => t._id !== id));
        fetchCategorySummary();
    }, [fetchCategorySummary]);

    const transferBetweenAccounts = useCallback(async (transferData) => {
        const data = await transactionAPI.transferBetweenAccounts(transferData);
        fetchTransactions();
        fetchCategorySummary();
        return data;
    }, [fetchTransactions, fetchCategorySummary]);

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

    const value = useMemo(() => ({
        transactions,
        allTransactions,
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
        fetchTransactions,
        getStats
    }), [
        transactions,
        allTransactions,
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
        fetchTransactions,
        getStats
    ]);

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};