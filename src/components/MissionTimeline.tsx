
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target } from "lucide-react"

interface Mission {
  id: number
  date: string
  dilemma: string
  decisionSummary: string
  intensity: "High" | "Medium" | "Low"
  result: "Success" | "Partial" | "Failed"
}

interface MissionTimelineProps {
  missions?: Mission[]
}

export function MissionTimeline({ missions }: MissionTimelineProps) {
  const defaultMissions: Mission[] = [
    {
      id: 1,
      date: "2024-01-15",
      dilemma: "Critical team restructuring decision",
      decisionSummary: "Implemented gradual transition plan",
      intensity: "High",
      result: "Success"
    },
    {
      id: 2,
      date: "2024-01-14",
      dilemma: "Resource allocation under pressure",
      decisionSummary: "Prioritized core objectives",
      intensity: "Medium",
      result: "Success"
    },
    {
      id: 3,
      date: "2024-01-13",
      dilemma: "Conflict resolution with stakeholder",
      decisionSummary: "Direct communication approach",
      intensity: "High",
      result: "Success"
    },
    {
      id: 4,
      date: "2024-01-12",
      dilemma: "Budget constraints on project delivery",
      decisionSummary: "Negotiated scope reduction",
      intensity: "Medium",
      result: "Partial"
    }
  ]

  const missionData = missions || defaultMissions

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'bg-red-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Success': return 'bg-green-500 text-white'
      case 'Partial': return 'bg-yellow-500 text-white'
      case 'Failed': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <Card className="bg-warfare-card border-warfare-gray/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Mission Timeline
        </CardTitle>
        <CardDescription className="text-warfare-gray">
          Recent tactical decisions and outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missionData.map((mission, index) => (
            <div key={mission.id} className="relative">
              {index !== missionData.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-16 bg-warfare-gray/30"></div>
              )}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-warfare-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-warfare-gray text-xs">{mission.date}</span>
                    <div className="flex space-x-2">
                      <Badge className={getIntensityColor(mission.intensity)}>
                        {mission.intensity}
                      </Badge>
                      <Badge className={getResultColor(mission.result)}>
                        {mission.result}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-1">
                    {mission.dilemma}
                  </h4>
                  <p className="text-warfare-gray text-xs">
                    {mission.decisionSummary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
