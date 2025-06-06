
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, CheckCircle, Plus } from "lucide-react"

const Rituals = () => {
  const [rituals] = useState([
    {
      id: 1,
      name: "Morning Combat Readiness",
      description: "5-minute focus and preparation routine",
      duration: "5 min",
      frequency: "Daily",
      lastCompleted: "Today",
      streak: 12,
      category: "Focus"
    },
    {
      id: 2,
      name: "Strategic Review",
      description: "Weekly tactical assessment and planning",
      duration: "15 min",
      frequency: "Weekly",
      lastCompleted: "2 days ago",
      streak: 8,
      category: "Planning"
    },
    {
      id: 3,
      name: "Decision Debrief",
      description: "Evening reflection on key decisions",
      duration: "10 min",
      frequency: "Daily",
      lastCompleted: "Yesterday",
      streak: 15,
      category: "Reflection"
    }
  ])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Focus': return 'bg-blue-500'
      case 'Planning': return 'bg-purple-500'
      case 'Reflection': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Rituals</h1>
            <p className="text-warfare-gray">Structured practices for tactical excellence</p>
          </div>
          <Button className="bg-warfare-accent hover:bg-warfare-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            Create Ritual
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{rituals.length}</p>
                  <p className="text-warfare-gray text-sm">Active Rituals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">30</p>
                  <p className="text-warfare-gray text-sm">Minutes/Day</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🔥</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">15</p>
                  <p className="text-warfare-gray text-sm">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {rituals.map((ritual) => (
            <Card key={ritual.id} className="bg-warfare-card border-warfare-gray/20 hover:border-warfare-accent/30 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={`${getCategoryColor(ritual.category)} text-white`}>
                    {ritual.category}
                  </Badge>
                  <span className="text-warfare-gray text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {ritual.duration}
                  </span>
                </div>
                <CardTitle className="text-white text-lg">
                  {ritual.name}
                </CardTitle>
                <CardDescription className="text-warfare-gray">
                  {ritual.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-warfare-gray text-sm">Frequency:</span>
                    <span className="text-white text-sm">{ritual.frequency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-warfare-gray text-sm">Last completed:</span>
                    <span className="text-white text-sm">{ritual.lastCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-warfare-gray text-sm">Streak:</span>
                    <span className="text-orange-500 text-sm font-bold">
                      🔥 {ritual.streak} days
                    </span>
                  </div>
                  <Button className="w-full bg-warfare-accent hover:bg-warfare-accent/80">
                    <Play className="w-4 h-4 mr-2" />
                    Start Ritual
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Rituals
