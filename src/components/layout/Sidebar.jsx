import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    ChartBarIcon,
    ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const navItems = [
        { name: 'Home', path: '/home', icon: HomeIcon },
        { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
        { name: 'Transfer', path: '/transfer', icon: ArrowsRightLeftIcon }
    ];

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-4rem)] sticky top-16">
            <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
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
    );
};

export default Sidebar;