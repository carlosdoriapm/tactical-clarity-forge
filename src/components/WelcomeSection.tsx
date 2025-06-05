
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Target, Code2 } from "lucide-react"

interface WelcomeSectionProps {
  operatorName?: string
  lastMission?: {
    dilemma: string
    decisionPath: string
    outcome: string
    date: string
  }
  ritualStreak?: {
    current: number
    best: number
    lastCompleted: string
  }
  warCodePreview?: Array<{
    symbol: string
    mantra: string
  }>
}

export function WelcomeSection({ 
  operatorName = "Operator",
  lastMission,
  ritualStreak,
  warCodePreview 
}: WelcomeSectionProps) {
  const defaultMission = {
    dilemma: "Resource allocation under pressure",
    decisionPath: "Prioritized core objectives",
    outcome: "Met primary targets",
    date: "2024-01-14"
  }

  const defaultStreak = {
    current: 7,
    best: 12,
    lastCompleted: "Morning Focus Session"
  }

  const defaultWarCode = [
    { symbol: "⚡", mantra: "Strike with precision" },
    { symbol: "🔥", mantra: "Forge through resistance" },
    { symbol: "⚔️", mantra: "Embrace the struggle" },
    { symbol: "🎯", mantra: "Focus cuts through chaos" }
  ]

  const mission = lastMission || defaultMission
  const streak = ritualStreak || defaultStreak
  const warCode = warCodePreview || defaultWarCode

  return (
    <div className="space-y-6 mb-8">
      {/* Welcome Greeting */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {operatorName}
        </h1>
        <p className="text-warfare-gray text-lg">
          Command Center operational. Your tactical overview awaits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Last Mission */}
        <Card className="bg-warfare-card border-warfare-gray/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-warfare-accent" />
              Last Mission
            </CardTitle>
            <CardDescription className="text-warfare-gray text-xs">
              {mission.date}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="text-warfare-accent text-sm font-semibold mb-1">Dilemma</h4>
              <p className="text-white text-sm">{mission.dilemma}</p>
            </div>
            <div>
              <h4 className="text-warfare-accent text-sm font-semibold mb-1">Decision Path</h4>
              <p className="text-warfare-gray text-sm">{mission.decisionPath}</p>
            </div>
            <div>
              <h4 className="text-warfare-accent text-sm font-semibold mb-1">Outcome</h4>
              <Badge className="bg-green-500 text-white text-xs">
                {mission.outcome}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Ritual Streak */}
        <Card className="bg-warfare-card border-warfare-gray/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Flame className="w-5 h-5 mr-2 text-orange-500" />
              Ritual Streak
            </CardTitle>
            <CardDescription className="text-warfare-gray">
              Maintain the momentum
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-warfare-gray text-sm">Current Streak</span>
              <span className="text-2xl font-bold text-orange-500">{streak.current}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-warfare-gray text-sm">Best Streak</span>
              <span className="text-lg font-semibold text-white">{streak.best}</span>
            </div>
            <div className="pt-2 border-t border-warfare-gray/20">
              <p className="text-warfare-gray text-xs">Last completed:</p>
              <p className="text-white text-sm font-medium">{streak.lastCompleted}</p>
            </div>
          </CardContent>
        </Card>

        {/* WAR CODE Preview */}
        <Card className="bg-warfare-card border-warfare-gray/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Code2 className="w-5 h-5 mr-2 text-purple-500" />
              WAR CODE Preview
            </CardTitle>
            <CardDescription className="text-warfare-gray">
              Your tactical mantras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warCode.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-2xl">{item.symbol}</span>
                  <span className="text-warfare-gray text-sm">{item.mantra}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
