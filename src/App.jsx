import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AppRoutes />
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;