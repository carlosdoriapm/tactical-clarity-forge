
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, CheckCircle, Plus, Trash2 } from "lucide-react"
import { useRituals } from "@/hooks/useRituals"
import { RitualForm } from "@/components/RitualForm"
import { RitualTimer } from "@/components/RitualTimer"

const Rituals = () => {
  const { rituals, loading, createRitual, completeRitual, deleteRitual } = useRituals();
  const [showForm, setShowForm] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  const handleCreateRitual = async (ritualData: any) => {
    await createRitual(ritualData);
    setShowForm(false);
  };

  const handleStartRitual = (ritualId: string) => {
    setActiveTimer(ritualId);
  };

  const handleCompleteRitual = async () => {
    if (activeTimer) {
      await completeRitual(activeTimer);
      setActiveTimer(null);
    }
  };

  const formatLastCompleted = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const calculateStats = () => {
    const totalRituals = rituals.length;
    const totalMinutes = rituals.reduce((sum, ritual) => sum + ritual.duration_minutes, 0);
    const bestStreak = Math.max(...rituals.map(r => r.streak_count), 0);
    
    return { totalRituals, totalMinutes, bestStreak };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red"></div>
      </div>
    );
  }

  const stats = calculateStats();
  const activeRitual = activeTimer ? rituals.find(r => r.id === activeTimer) : null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Rituals</h1>
            <p className="text-warfare-gray">Structured practices for tactical excellence</p>
          </div>
          <Button 
            className="bg-warfare-accent hover:bg-warfare-accent/80"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ritual
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <RitualForm 
              onSubmit={handleCreateRitual}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {activeRitual && (
          <div className="mb-8">
            <RitualTimer
              ritual={activeRitual}
              onComplete={handleCompleteRitual}
              onCancel={() => setActiveTimer(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{stats.totalRituals}</p>
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
                  <p className="text-2xl font-bold text-white">{stats.totalMinutes}</p>
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
                  <p className="text-2xl font-bold text-white">{stats.bestStreak}</p>
                  <p className="text-warfare-gray text-sm">Best Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {rituals.length === 0 ? (
            <Card className="bg-warfare-card border-warfare-gray/20 col-span-full">
              <CardContent className="p-8 text-center">
                <p className="text-warfare-gray text-lg mb-4">No rituals yet</p>
                <p className="text-warfare-gray/70 mb-6">Create your first ritual to start building tactical discipline.</p>
                <Button 
                  className="bg-warfare-accent hover:bg-warfare-accent/80"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Ritual
                </Button>
              </CardContent>
            </Card>
          ) : (
            rituals.map((ritual) => (
              <Card key={ritual.id} className="bg-warfare-card border-warfare-gray/20 hover:border-warfare-accent/30 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={`${ritual.stake_attached ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
                      {ritual.stake_attached ? 'High Stakes' : 'Standard'}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <span className="text-warfare-gray text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {ritual.duration_minutes}m
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRitual(ritual.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">
                    {ritual.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-warfare-gray text-sm">Last completed:</span>
                      <span className="text-white text-sm">{formatLastCompleted(ritual.last_completed_at)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-warfare-gray text-sm">Streak:</span>
                      <span className="text-orange-500 text-sm font-bold">
                        🔥 {ritual.streak_count} days
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-warfare-accent hover:bg-warfare-accent/80"
                      onClick={() => handleStartRitual(ritual.id)}
                      disabled={activeTimer !== null}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Ritual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Rituals
