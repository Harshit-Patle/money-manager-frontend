import { useTransactions } from '../../hooks/useTransactions';

const CategorySummary = () => {
    const { categorySummary } = useTransactions();

    if (categorySummary.length === 0) {
        return (
            <div className="bg-white border border-neutral-200 rounded-lg p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-neutral-500">No category data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Category Summary</h3>
            <div className="space-y-2 sm:space-y-3">
                {categorySummary.map((item) => {
                    const total = item.totalExpense || item.totalIncome;
                    const isExpense = item.totalExpense > 0;

                    return (
                        <div key={item.category} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${isExpense ? 'bg-danger-500' : 'bg-success-500'
                                    }`} />
                                <span className="text-sm font-medium text-neutral-900">{item.category}</span>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-semibold ${isExpense ? 'text-danger-600' : 'text-success-600'
                                    }`}>
                                    {isExpense ? '-' : '+'}₹{total.toLocaleString('en-IN')}
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