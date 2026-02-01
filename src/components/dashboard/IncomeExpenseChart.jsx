import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../hooks/useTransactions';
import { format, subMonths, subWeeks, subYears, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { DATE_FILTERS } from '../../utils/constants';

const IncomeExpenseChart = () => {
    const { allTransactions = [], dashboardFilter } = useTransactions();

    const getChartData = () => {
        if (!allTransactions || allTransactions.length === 0) {
            return [];
        }

        const now = new Date();
        let periods = [];

        if (dashboardFilter === DATE_FILTERS.YEARLY) {
            // Show last 12 months
            for (let i = 11; i >= 0; i--) {
                const date = subMonths(now, i);
                const periodStart = startOfMonth(date);
                const periodEnd = endOfMonth(date);
                periods.push({
                    label: format(date, 'MMM yyyy'),
                    start: periodStart,
                    end: periodEnd,
                    income: 0,
                    expense: 0
                });
            }
        } else if (dashboardFilter === DATE_FILTERS.MONTHLY) {
            // Show last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const date = subWeeks(now, i);
                const periodStart = startOfWeek(date, { weekStartsOn: 1 });
                const periodEnd = endOfWeek(date, { weekStartsOn: 1 });
                periods.push({
                    label: `Week ${format(periodStart, 'dd MMM')}`,
                    start: periodStart,
                    end: periodEnd,
                    income: 0,
                    expense: 0
                });
            }
        } else if (dashboardFilter === DATE_FILTERS.WEEKLY) {
            // Show last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const periodStart = new Date(date.setHours(0, 0, 0, 0));
                const periodEnd = new Date(date.setHours(23, 59, 59, 999));
                periods.push({
                    label: format(date, 'EEE'),
                    start: periodStart,
                    end: periodEnd,
                    income: 0,
                    expense: 0
                });
            }
        }

        // Calculate income and expense for each period
        allTransactions.forEach(t => {
            const transactionDate = new Date(t.createdAt);

            periods.forEach(period => {
                if (transactionDate >= period.start && transactionDate <= period.end) {
                    if (t.type === 'income') {
                        period.income += t.amount;
                    } else {
                        period.expense += t.amount;
                    }
                }
            });
        });

        return periods;
    };

    const chartData = getChartData();

    if (chartData.length === 0) {
        return (
            <div className="bg-white border border-neutral-200 rounded-lg p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-neutral-500">No data available for chart</p>
            </div>
        );
    }

    const getPeriodLabel = () => {
        if (dashboardFilter === DATE_FILTERS.YEARLY) return 'Monthly Trend';
        if (dashboardFilter === DATE_FILTERS.MONTHLY) return 'Weekly Trend';
        return 'Daily Trend';
    };

    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4 sm:mb-6">
                Income vs Expense - {getPeriodLabel()}
            </h3>
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12, fill: '#737373' }}
                        stroke="#d4d4d4"
                        angle={dashboardFilter === DATE_FILTERS.YEARLY ? -45 : 0}
                        textAnchor={dashboardFilter === DATE_FILTERS.YEARLY ? 'end' : 'middle'}
                        height={dashboardFilter === DATE_FILTERS.YEARLY ? 80 : 30}
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