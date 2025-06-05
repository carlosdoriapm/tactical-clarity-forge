
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"

interface Mission {
  dilemma: string
  decisionPath: string
  outcome: string
  date: string
}

interface MissionCardProps {
  mission?: Mission
}

export function MissionCard({ mission }: MissionCardProps) {
  const defaultMission = {
    dilemma: "Resource allocation under pressure",
    decisionPath: "Prioritized core objectives",
    outcome: "Met primary targets",
    date: "2024-01-14"
  }

  const missionData = mission || defaultMission

  return (
    <Card className="bg-warfare-card border-warfare-gray/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-warfare-accent" />
          Last Mission
        </CardTitle>
        <CardDescription className="text-warfare-gray text-xs">
          {missionData.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-warfare-accent text-sm font-semibold mb-1">Dilemma</h4>
          <p className="text-white text-sm">{missionData.dilemma}</p>
        </div>
        <div>
          <h4 className="text-warfare-accent text-sm font-semibold mb-1">Decision Path</h4>
          <p className="text-warfare-gray text-sm">{missionData.decisionPath}</p>
        </div>
        <div>
          <h4 className="text-warfare-accent text-sm font-semibold mb-1">Outcome</h4>
          <Badge className="bg-green-500 text-white text-xs">
            {missionData.outcome}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
