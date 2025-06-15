
import React from 'react';
import { LayoutDashboard } from 'lucide-react';

interface DashboardButtonProps {
  onClick: () => void;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({ onClick }) => (
  <div className="fixed top-4 right-4 z-50">
    <button
      onClick={onClick}
      className="bg-warfare-blue/90 text-white rounded-lg px-4 py-2 font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition flex items-center gap-2"
    >
      <LayoutDashboard className="h-4 w-4" />
      <span>Dashboard</span>
    </button>
  </div>
);

export default DashboardButton;
