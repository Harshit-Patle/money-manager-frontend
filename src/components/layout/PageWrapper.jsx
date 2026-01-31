import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PageWrapper = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PageWrapper;