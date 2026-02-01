import PageWrapper from '../components/layout/PageWrapper';
import DashboardStats from '../components/dashboard/DashboardStats';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import Select from '../components/common/Select';
import { useTransactions } from '../hooks/useTransactions';
import { DATE_FILTERS } from '../utils/constants';

const Dashboard = () => {
    const { dashboardFilter, setDashboardFilter, getStats } = useTransactions();
    const stats = getStats();

    const filterOptions = [
        { label: 'Weekly', value: DATE_FILTERS.WEEKLY },
        { label: 'Monthly', value: DATE_FILTERS.MONTHLY },
        { label: 'Yearly', value: DATE_FILTERS.YEARLY }
    ];

    return (
        <PageWrapper>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">Dashboard</h1>
                        <p className="text-sm sm:text-base text-neutral-600 mt-1">Overview of your financial activity</p>
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={dashboardFilter}
                            onChange={(e) => setDashboardFilter(e.target.value)}
                            options={filterOptions}
                            placeholder="Select period"
                        />
                    </div>
                </div>

                <DashboardStats stats={stats} />

                <IncomeExpenseChart />

                <RecentTransactions />
            </div>
        </PageWrapper>
    );
};

export default Dashboard;