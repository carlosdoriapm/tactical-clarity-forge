
import React from "react";
import { Mission } from "@/hooks/useMissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flag } from "lucide-react";

interface MissionListProps {
  missions: Mission[];
  onSelect?: (mission: Mission) => void;
  selectedMissionId?: string;
}

export const MissionList: React.FC<MissionListProps> = ({ missions, onSelect, selectedMissionId }) => {
  if (!missions || missions.length === 0) {
    return <div className="text-warfare-gray">No missions found.</div>;
  }
  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <Card
          key={mission.id}
          className={`bg-warfare-card border-warfare-gray/20 cursor-pointer ${selectedMissionId === mission.id ? "ring-2 ring-warfare-accent" : ""}`}
          onClick={() => onSelect && onSelect(mission)}
        >
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Flag className="w-4 h-4 mr-2 text-warfare-accent" />
              {mission.title}
            </CardTitle>
            <CardDescription className="text-warfare-gray">
              {mission.start_date && (
                <>
                  <Calendar className="inline w-4 h-4 mr-1" />
                  {new Date(mission.start_date).toLocaleDateString()}
                </>
              )}
              {mission.end_date && (
                <span className="ml-3">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  {new Date(mission.end_date).toLocaleDateString()}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-white text-sm">{mission.description}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
