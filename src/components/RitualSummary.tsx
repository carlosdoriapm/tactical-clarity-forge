
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"

interface RitualStreak {
  current: number
  best: number
  lastCompleted: string
}

interface RitualSummaryProps {
  rituals?: RitualStreak
}

export function RitualSummary({ rituals }: RitualSummaryProps) {
  const defaultRituals = {
    current: 7,
    best: 12,
    lastCompleted: "Morning Focus Session"
  }

  const ritualData = rituals || defaultRituals

  return (
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
          <span className="text-2xl font-bold text-orange-500">{ritualData.current}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-warfare-gray text-sm">Best Streak</span>
          <span className="text-lg font-semibold text-white">{ritualData.best}</span>
        </div>
        <div className="pt-2 border-t border-warfare-gray/20">
          <p className="text-warfare-gray text-xs">Last completed:</p>
          <p className="text-white text-sm font-medium">{ritualData.lastCompleted}</p>
        </div>
      </CardContent>
    </Card>
  )
}
