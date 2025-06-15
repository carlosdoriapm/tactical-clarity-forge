
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, MessageSquare, BarChart, Target } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const features = [
  {
    label: "Performance Dashboard",
    description: "Monitore suas metas com gráficos intuitivos e motivadores.",
    icon: <BarChart className="w-7 h-7 text-green-400" />,
    route: "/performance",
    badge: "New"
  },
  {
    label: "Decision Time-Machine",
    description: "Visualize timelines for complex decisions with AI.",
    icon: <LayoutDashboard className="w-7 h-7 text-cyan-400" />,
    route: "/time-machine-demo",
    badge: "Updated"
  },
  {
    label: "Chat Advisor",
    description: "Chat with AI for strategic advice.",
    icon: <MessageSquare className="w-7 h-7 text-warfare-yellow" />,
    route: "/chat",
    badge: null
  },
  {
    label: "Tactical Dashboard",
    description: "Complete warrior dashboard with rituals and missions.",
    icon: <Target className="w-7 h-7 text-red-400" />,
    route: "/dashboard",
    badge: null
  }
];

export default function MainDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-warfare-dark flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full max-w-4xl">
        {features.map((feat) => (
          <button
            key={feat.label}
            onClick={() => navigate(feat.route)}
            className="group relative bg-white/10 border border-white/10 hover:border-cyan-400 transition-shadow hover:shadow-lg rounded-2xl px-6 py-7 flex items-center gap-5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="shrink-0">
              {feat.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">{feat.label}</span>
                {feat.badge && (
                  <span className="bg-cyan-500/80 text-xs text-white px-2 py-0.5 rounded">
                    {feat.badge}
                  </span>
                )}
              </div>
              <p className="text-white/70 text-sm mt-1">{feat.description}</p>
            </div>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-400 text-xl opacity-70 group-hover:opacity-100 transition-opacity">&#8594;</span>
          </button>
        ))}
      </div>
      <div className="mt-12 text-center text-warfare-gray text-base opacity-70">
        Dashboards intuitivos e estratégicos para acelerar suas decisões.<br />
        Suporte para novas funcionalidades será exibido aqui!
      </div>
    </div>
  );
}
