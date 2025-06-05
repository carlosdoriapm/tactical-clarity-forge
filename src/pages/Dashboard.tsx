import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Book, Code, TrendingUp } from "lucide-react"
import { MissionCard } from "@/components/MissionCard"
import { RitualSummary } from "@/components/RitualSummary"
import { WarCodePreview } from "@/components/WarCodePreview"
import { MissionTimeline } from "@/components/MissionTimeline"

const Dashboard = () => {
  const stats = [
    {
      title: "War Logs",
      value: "12",
      description: "Tactical decisions logged",
      icon: Book,
      color: "text-blue-500"
    },
    {
      title: "Rituals",
      value: "8",
      description: "Completed this week",
      icon: Activity,
      color: "text-green-500"
    },
    {
      title: "War Code",
      value: "24",
      description: "Fragments captured",
      icon: Code,
      color: "text-purple-500"
    },
    {
      title: "Performance",
      value: "94%",
      description: "Mission success rate",
      icon: TrendingUp,
      color: "text-orange-500"
    }
  ]

  // Sample data - could come from props or API calls
  const lastMission = {
    dilemma: "Resource allocation under pressure",
    decisionPath: "Prioritized core objectives",
    outcome: "Met primary targets",
    date: "2024-01-14"
  }

  const rituals = {
    current: 7,
    best: 12,
    lastCompleted: "Morning Focus Session"
  }

  const fragments = [
    { symbol: "⚡", mantra: "Strike with precision" },
    { symbol: "🔥", mantra: "Forge through resistance" },
    { symbol: "⚔️", mantra: "Embrace the struggle" },
    { symbol: "🎯", mantra: "Focus cuts through chaos" }
  ]

  return (
    <div className="min-h-screen bg-warfare-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="p-6">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Operator</h1>
          <p className="text-warfare-gray text-lg mb-8">
            Command Center operational. Your tactical overview awaits.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <MissionCard mission={lastMission} />
            <RitualSummary rituals={rituals} />
            <WarCodePreview fragments={fragments} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">War log completed</p>
                    <p className="text-warfare-gray text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Ritual session finished</p>
                    <p className="text-warfare-gray text-xs">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">War code fragment saved</p>
                    <p className="text-warfare-gray text-xs">6 hours ago</p>
                  </div>
                </div>
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
                  <span className="text-green-500 text-xs">DONE</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warfare-dark rounded-lg">
                  <span className="text-white text-sm">Log tactical decision</span>
                  <span className="text-yellow-500 text-xs">PENDING</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warfare-dark rounded-lg">
                  <span className="text-white text-sm">Review war codes</span>
                  <span className="text-yellow-500 text-xs">PENDING</span>
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
