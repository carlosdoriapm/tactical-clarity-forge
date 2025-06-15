
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('admin_dashboard')}</h1>
          <p className="text-warfare-gray">{t('welcome')}, {user?.email}</p>
        </header>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Key Metrics</h2>
          <p className="text-warfare-gray">
            The administration area is under development. Soon, application usage metrics will be available here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
