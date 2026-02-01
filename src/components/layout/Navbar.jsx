import { useAuth } from '../../hooks/useAuth';
import { ArrowRightOnRectangleIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        {/* Hamburger menu for mobile */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 text-neutral-700 -ml-2"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>

                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-display font-bold text-neutral-900">Money Manager</h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-neutral-700">
                            <UserCircleIcon className="w-5 h-5 text-neutral-400" />
                            <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="flex items-center gap-2"
                        >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;