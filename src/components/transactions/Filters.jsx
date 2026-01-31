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
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center gap-2 mb-4">
                <FunnelIcon className="w-5 h-5 text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-900">Filters</h3>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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