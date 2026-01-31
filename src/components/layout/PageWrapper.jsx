import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PageWrapper = ({ children }) => {
    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PageWrapper;