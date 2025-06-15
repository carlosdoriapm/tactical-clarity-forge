
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Calendar, 
  Zap, 
  CheckCircle2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface PerformanceDashboardProps {
  rituals?: any[];
  className?: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
  rituals = [],
  className = '' 
}) => {
  // Dados simulados para demonstração
  const weeklyData = [
    { day: 'Seg', completed: 8, planned: 10, streak: 5 },
    { day: 'Ter', completed: 9, planned: 10, streak: 6 },
    { day: 'Qua', completed: 7, planned: 10, streak: 4 },
    { day: 'Qui', completed: 10, planned: 10, streak: 7 },
    { day: 'Sex', completed: 8, planned: 10, streak: 5 },
    { day: 'Sáb', completed: 6, planned: 8, streak: 3 },
    { day: 'Dom', completed: 5, planned: 8, streak: 2 }
  ];

  const monthlyProgress = [
    { month: 'Jan', performance: 75, goals: 85 },
    { month: 'Fev', performance: 82, goals: 85 },
    { month: 'Mar', performance: 88, goals: 85 },
    { month: 'Abr', performance: 91, goals: 90 },
    { month: 'Mai', performance: 85, goals: 90 },
    { month: 'Jun', performance: 94, goals: 95 }
  ];

  const goalCategories = [
    { name: 'Físico', value: 85, color: '#10b981' },
    { name: 'Mental', value: 78, color: '#3b82f6' },
    { name: 'Profissional', value: 92, color: '#f59e0b' },
    { name: 'Relacionamentos', value: 67, color: '#ef4444' }
  ];

  const metrics: PerformanceMetric[] = [
    { name: 'Rituais Concluídos', current: 8, target: 10, unit: '/dia', trend: 'up', color: 'bg-green-500' },
    { name: 'Sequência Atual', current: 14, target: 30, unit: 'dias', trend: 'up', color: 'bg-blue-500' },
    { name: 'Eficiência Semanal', current: 87, target: 90, unit: '%', trend: 'up', color: 'bg-yellow-500' },
    { name: 'Metas Atingidas', current: 6, target: 8, unit: '/mês', trend: 'stable', color: 'bg-purple-500' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-warfare-gray">{metric.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{metric.current}</span>
                  <span className="text-sm text-warfare-gray">/ {metric.target}{metric.unit}</span>
                </div>
                <Progress 
                  value={calculateProgress(metric.current, metric.target)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Performance Semanal */}
        <Card className="bg-warfare-card border-warfare-gray/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-warfare-blue" />
              Performance Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: { label: "Concluído", color: "#10b981" },
                planned: { label: "Planejado", color: "#6b7280" }
              }}
              className="h-[300px]"
            >
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="planned" fill="#6b7280" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Progresso Mensal */}
        <Card className="bg-warfare-card border-warfare-gray/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-warfare-accent" />
              Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                performance: { label: "Performance", color: "#3b82f6" },
                goals: { label: "Meta", color: "#f59e0b" }
              }}
              className="h-[300px]"
            >
              <AreaChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="goals" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card className="bg-warfare-card border-warfare-gray/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-green-400" />
              Distribuição de Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Progresso", color: "#8b5cf6" }
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={goalCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {goalCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {goalCategories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-warfare-gray">{category.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.value}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Conquistas */}
        <Card className="bg-warfare-card border-warfare-gray/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="h-5 w-5 text-warfare-yellow" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">Sequência de 14 dias</p>
                <p className="text-xs text-warfare-gray">Meta de consistência atingida</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Zap className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">90% de eficiência</p>
                <p className="text-xs text-warfare-gray">Melhor semana do mês</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Target className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-white">6 metas concluídas</p>
                <p className="text-xs text-warfare-gray">Este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
