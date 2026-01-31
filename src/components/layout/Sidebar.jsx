import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    ChartBarIcon,
    ArrowsRightLeftIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Home', path: '/home', icon: HomeIcon },
        { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
        { name: 'Transfer', path: '/transfer', icon: ArrowsRightLeftIcon }
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-16 left-0 z-50
                w-64 bg-white border-r border-neutral-200 
                min-h-[calc(100vh-4rem)] 
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Close button for mobile */}
                <div className="lg:hidden flex justify-end p-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-neutral-700 hover:bg-neutral-100'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;