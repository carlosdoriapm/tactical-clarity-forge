
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Painel do Administrador</h1>
          <p className="text-warfare-gray">Bem-vindo, {user?.email}</p>
        </header>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Métricas Principais</h2>
          <p className="text-warfare-gray">
            A área de administração está em desenvolvimento. Em breve, as métricas de uso da aplicação estarão disponíveis aqui.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
