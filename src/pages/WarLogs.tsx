
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, TrendingUp } from "lucide-react"

const WarLogs = () => {
  const [logs] = useState([
    {
      id: 1,
      date: "2024-01-15",
      dilemma: "Critical team restructuring decision",
      decision: "Implemented gradual transition plan",
      intensity: "High",
      result: "Successful team adaptation"
    },
    {
      id: 2,
      date: "2024-01-14",
      dilemma: "Resource allocation under pressure",
      decision: "Prioritized core objectives",
      intensity: "Medium",
      result: "Met primary targets"
    },
    {
      id: 3,
      date: "2024-01-13",
      dilemma: "Conflict resolution with stakeholder",
      decision: "Direct communication approach",
      intensity: "High",
      result: "Relationship strengthened"
    }
  ])

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'bg-red-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">War Logs</h1>
            <p className="text-warfare-gray">Tactical decision archive and analysis</p>
          </div>
          <Button className="bg-warfare-accent hover:bg-warfare-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            New Log Entry
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{logs.length}</p>
                  <p className="text-warfare-gray text-sm">Total Logs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">87%</p>
                  <p className="text-warfare-gray text-sm">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">2</p>
                  <p className="text-warfare-gray text-sm">High Intensity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-warfare-gray text-sm">Medium Intensity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id} className="bg-warfare-card border-warfare-gray/20 hover:border-warfare-accent/30 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">
                    {log.dilemma}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getIntensityColor(log.intensity)} text-white`}>
                      {log.intensity}
                    </Badge>
                    <span className="text-warfare-gray text-sm">{log.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-warfare-accent font-semibold mb-2">Decision Path</h4>
                    <p className="text-warfare-gray text-sm">{log.decision}</p>
                  </div>
                  <div>
                    <h4 className="text-warfare-accent font-semibold mb-2">Result</h4>
                    <p className="text-warfare-gray text-sm">{log.result}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WarLogs
