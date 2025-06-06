
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Book, Code, TrendingUp } from "lucide-react"
import { MissionCard } from "@/components/MissionCard"
import { RitualSummary } from "@/components/RitualSummary"
import { WarCodePreview } from "@/components/WarCodePreview"
import { MissionTimeline } from "@/components/MissionTimeline"
import { useDashboardData } from "@/hooks/useDashboardData"

const Dashboard = () => {
  const { loading, stats, recentActivity, lastMission, ritualsSummary } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red"></div>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "War Logs",
      value: stats.warLogsCount.toString(),
      description: "Tactical decisions logged",
      icon: Book,
      color: "text-blue-500"
    },
    {
      title: "Rituals",
      value: stats.ritualsCount.toString(),
      description: "Active rituals tracked",
      icon: Activity,
      color: "text-green-500"
    },
    {
      title: "War Code",
      value: stats.warCodeFragmentsCount.toString(),
      description: "Fragments captured",
      icon: Code,
      color: "text-purple-500"
    },
    {
      title: "Best Streak",
      value: stats.currentStreak.toString(),
      description: "Days consecutive",
      icon: TrendingUp,
      color: "text-orange-500"
    }
  ];

  // Default war code fragments for display
  const fragments = [
    { symbol: "⚡", mantra: "Strike with precision" },
    { symbol: "🔥", mantra: "Forge through resistance" },
    { symbol: "⚔️", mantra: "Embrace the struggle" },
    { symbol: "🎯", mantra: "Focus cuts through chaos" }
  ];

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'war_log':
        return status === 'success' ? 'text-green-500' : 
               status === 'fail' ? 'text-red-500' : 'text-blue-500';
      case 'ritual':
        return 'text-green-500';
      case 'war_code':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Operator</h1>
          <p className="text-warfare-gray text-lg mb-8">
            Command Center operational. Your tactical overview awaits.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <MissionCard mission={lastMission} />
            <RitualSummary rituals={ritualsSummary} />
            <WarCodePreview fragments={fragments} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="bg-warfare-card border-warfare-gray/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-warfare-gray">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-warfare-gray">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-warfare-gray">
                Latest tactical operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-warfare-gray text-sm">No recent activity. Start your first mission!</p>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${getActivityIcon(activity.type, activity.status)}`}></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.description}</p>
                        <p className="text-warfare-gray text-xs">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardHeader>
              <CardTitle className="text-white">Mission Briefing</CardTitle>
              <CardDescription className="text-warfare-gray">
                Today's objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-warfare-dark rounded-lg">
                  <span className="text-white text-sm">Complete morning ritual</span>
                  <span className={`text-xs ${stats.currentStreak > 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {stats.currentStreak > 0 ? 'DONE' : 'PENDING'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warfare-dark rounded-lg">
                  <span className="text-white text-sm">Log tactical decision</span>
                  <span className={`text-xs ${stats.warLogsCount > 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {stats.warLogsCount > 0 ? 'ACTIVE' : 'PENDING'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warfare-dark rounded-lg">
                  <span className="text-white text-sm">Review war codes</span>
                  <span className={`text-xs ${stats.warCodeFragmentsCount > 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {stats.warCodeFragmentsCount > 0 ? 'ACTIVE' : 'PENDING'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <MissionTimeline />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
