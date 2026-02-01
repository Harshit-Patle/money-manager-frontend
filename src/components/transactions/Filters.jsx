import { useTransactions } from '../../hooks/useTransactions';
import { CATEGORIES, DIVISIONS } from '../../utils/constants';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Filters = () => {
    const { filters, updateFilters, clearFilters } = useTransactions();

    const handleFilterChange = (field, value) => {
        updateFilters({ [field]: value });
    };

    const hasActiveFilters = Object.values(filters).some(v => v);

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FunnelIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Filters</h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="ml-auto flex items-center gap-1 text-xs"
                    >
                        <XMarkIcon className="w-4 h-4" />
                        Clear
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Select
                    label="Category"
                    options={CATEGORIES}
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    placeholder="All Categories"
                />

                <Select
                    label="Division"
                    options={DIVISIONS}
                    value={filters.division}
                    onChange={(e) => handleFilterChange('division', e.target.value)}
                    placeholder="All Divisions"
                />

                <Input
                    label="From Date"
                    type="date"
                    value={filters.from}
                    onChange={(e) => handleFilterChange('from', e.target.value)}
                />

                <Input
                    label="To Date"
                    type="date"
                    value={filters.to}
                    onChange={(e) => handleFilterChange('to', e.target.value)}
                />
            </div>
        </div>
    );
};

export default Filters;