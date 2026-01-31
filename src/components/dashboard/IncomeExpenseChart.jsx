import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../hooks/useTransactions';
import { getDateRangeForFilter } from '../../utils/date';

const IncomeExpenseChart = () => {
    const { allTransactions = [], dashboardFilter } = useTransactions();

    const getChartData = () => {
        if (!allTransactions || allTransactions.length === 0) {
            return [];
        }

        const dateRange = getDateRangeForFilter(dashboardFilter);
        const filteredTransactions = allTransactions.filter(t => {
            const date = new Date(t.createdAt);
            return date >= dateRange.from && date <= dateRange.to;
        });

        // Group by category
        const categoryMap = {};

        filteredTransactions.forEach(t => {
            if (!categoryMap[t.category]) {
                categoryMap[t.category] = { category: t.category, income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                categoryMap[t.category].income += t.amount;
            } else {
                categoryMap[t.category].expense += t.amount;
            }
        });

        return Object.values(categoryMap).sort((a, b) =>
            (b.income + b.expense) - (a.income + a.expense)
        ).slice(0, 8); // Top 8 categories
    };

    const chartData = getChartData();

    if (chartData.length === 0) {
        return (
            <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                <p className="text-neutral-500">No data available for chart</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Income vs Expense by Category</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: '#737373' }}
                        stroke="#d4d4d4"
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#737373' }}
                        stroke="#d4d4d4"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e5e5',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                        formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeExpenseChart;