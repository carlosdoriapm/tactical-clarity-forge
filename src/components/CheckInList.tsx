
import React from "react";
import { CheckIn } from "@/hooks/useCheckIns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

interface CheckInListProps {
  checkIns: CheckIn[];
}

export const CheckInList: React.FC<CheckInListProps> = ({ checkIns }) => {
  if (!checkIns || checkIns.length === 0) {
    return <div className="text-warfare-gray">Nenhum check-in para esta missão.</div>;
  }
  return (
    <div className="space-y-2">
      {checkIns.map((checkIn) => (
        <Card
          key={checkIn.id}
          className="bg-warfare-card border-warfare-gray/20"
        >
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ListChecks className="w-4 h-4 mr-2 text-warfare-accent" /> Check-in
            </CardTitle>
            <CardDescription className="text-warfare-gray">
              {new Date(checkIn.created_at).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-white whitespace-pre-wrap">{JSON.stringify(checkIn.payload, null, 2)}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
