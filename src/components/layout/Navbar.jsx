import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserCircleIcon, Bars3Icon, ArrowRightOnRectangleIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        {/* Hamburger menu for mobile */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 -ml-2"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>

                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">Money Manager</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <SunIcon className="w-5 h-5" />
                            ) : (
                                <MoonIcon className="w-5 h-5" />
                            )}
                        </button>

                        {/* User Profile Dropdown */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                <UserCircleIcon className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                                <span className="hidden sm:inline text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {user?.name}
                                </span>
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-neutral-700 focus:outline-none">
                                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={logout}
                                                    className={`${
                                                        active ? 'bg-danger-600 text-white' : 'bg-danger-50 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
                                                    } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:shadow-sm`}
                                                >
                                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                                    Logout
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;