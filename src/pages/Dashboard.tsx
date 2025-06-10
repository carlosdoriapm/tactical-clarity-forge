
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-warfare-gray">Bem-vindo, {user?.email}</p>
        </header>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Painel Principal</h2>
          <p className="text-warfare-gray">
            Este é o seu painel principal. Aqui você pode acessar todas as funcionalidades do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
