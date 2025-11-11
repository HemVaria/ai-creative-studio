import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import MainApp from './MainApp';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-sans text-white flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return session ? <MainApp /> : <AuthPage />;
};

export default App;