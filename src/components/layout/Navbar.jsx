import { useAuth } from '../../hooks/useAuth';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <h1 className="text-xl font-display font-bold text-neutral-900">Money Manager</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-neutral-700">
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
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;