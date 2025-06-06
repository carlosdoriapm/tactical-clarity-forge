
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, TrendingUp } from "lucide-react"
import { useWarLogs } from "@/hooks/useWarLogs"
import { WarLogForm } from "@/components/WarLogForm"

const WarLogs = () => {
  const { logs, loading, createWarLog } = useWarLogs();
  const [showForm, setShowForm] = useState(false);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'bg-red-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  }

  const handleCreateLog = async (logData: any) => {
    await createWarLog(logData);
    setShowForm(false);
  }

  const calculateStats = () => {
    const totalLogs = logs.length;
    const highIntensity = logs.filter(log => log.intensity === 'High').length;
    const mediumIntensity = logs.filter(log => log.intensity === 'Medium').length;
    const successRate = logs.length > 0 ? Math.round((logs.filter(log => 
      log.result.toLowerCase().includes('success') || 
      log.result.toLowerCase().includes('achieved') ||
      log.result.toLowerCase().includes('completed')
    ).length / logs.length) * 100) : 0;

    return { totalLogs, highIntensity, mediumIntensity, successRate };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red"></div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">War Logs</h1>
            <p className="text-warfare-gray">Tactical decision archive and analysis</p>
          </div>
          <Button 
            className="bg-warfare-accent hover:bg-warfare-accent/80"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Log Entry
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <WarLogForm 
              onSubmit={handleCreateLog}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{stats.totalLogs}</p>
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
                  <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
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
                  <p className="text-2xl font-bold text-white">{stats.highIntensity}</p>
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
                  <p className="text-2xl font-bold text-white">{stats.mediumIntensity}</p>
                  <p className="text-warfare-gray text-sm">Medium Intensity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {logs.length === 0 ? (
            <Card className="bg-warfare-card border-warfare-gray/20">
              <CardContent className="p-8 text-center">
                <p className="text-warfare-gray text-lg mb-4">No war logs yet</p>
                <p className="text-warfare-gray/70 mb-6">Start documenting your tactical decisions and build your strategic knowledge base.</p>
                <Button 
                  className="bg-warfare-accent hover:bg-warfare-accent/80"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Log
                </Button>
              </CardContent>
            </Card>
          ) : (
            logs.map((log) => (
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
                      <span className="text-warfare-gray text-sm">{formatDate(log.date)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-warfare-accent font-semibold mb-2">Decision Path</h4>
                      <p className="text-warfare-gray text-sm">{log.decision_path}</p>
                    </div>
                    <div>
                      <h4 className="text-warfare-accent font-semibold mb-2">Result</h4>
                      <p className="text-warfare-gray text-sm">{log.result}</p>
                    </div>
                  </div>
                  {log.reflections && (
                    <div className="mt-4">
                      <h4 className="text-warfare-accent font-semibold mb-2">Tactical Reflections</h4>
                      <p className="text-warfare-gray text-sm">{log.reflections}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default WarLogs
