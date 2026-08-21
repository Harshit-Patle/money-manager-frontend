import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '../../hooks/useTransactions';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

const CategorySummary = () => {
    const { transactions = [] } = useTransactions();

    // Calculate category data from expense transactions only
    const getCategoryData = () => {
        if (!transactions || transactions.length === 0) {
            return [];
        }

        const categoryMap = {};

        transactions.forEach(t => {
            // Only include expense transactions
            if (t.type === 'expense') {
                if (!categoryMap[t.category]) {
                    categoryMap[t.category] = { name: t.category, value: 0 };
                }
                categoryMap[t.category].value += Number(t.amount) || 0;
            }
        });

        return Object.values(categoryMap).sort((a, b) => b.value - a.value);
    };

    const categoryData = getCategoryData();
    const totalAmount = categoryData.reduce((sum, cat) => sum + cat.value, 0);

    if (categoryData.length === 0) {
        return (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">No category data available</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const percentage = ((payload[0].value / totalAmount) * 100).toFixed(1);
            return (
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{payload[0].name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        ₹{payload[0].value.toLocaleString('en-IN')} ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 sm:p-6">
            <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">Expense by Category</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Total Expenses: ₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={95}
                            innerRadius={55}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={2}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-1.5">
                {categoryData.map((item, index) => {
                    const percentage = ((item.value / totalAmount) * 100).toFixed(1);
                    
                    return (
                        <div 
                            key={item.name} 
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <div 
                                className="w-4 h-4 rounded flex-shrink-0" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{item.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all"
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: COLORS[index % COLORS.length]
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    ₹{item.value.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {percentage}%
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySummary;