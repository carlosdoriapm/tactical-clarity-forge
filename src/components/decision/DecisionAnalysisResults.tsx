
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DecisionAnalysis } from '@/types/decision-framework';
import { 
  Eye, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  TrendingDown,
  CheckCircle
} from 'lucide-react';

interface DecisionAnalysisResultsProps {
  analysis: DecisionAnalysis;
  onStartNewAnalysis: () => void;
  onContinueChat: () => void;
}

const DecisionAnalysisResults: React.FC<DecisionAnalysisResultsProps> = ({
  analysis,
  onStartNewAnalysis,
  onContinueChat
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Strategic Analysis Complete</h2>
        <p className="text-warfare-blue">Multi-perspective analysis for: {analysis.template.name}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Perspectives Analysis */}
        <Card className="bg-warfare-card border-warfare-blue/20 p-6">
          <div className="flex items-center mb-4">
            <Eye className="w-5 h-5 text-warfare-red mr-2" />
            <h3 className="text-white font-bold">Multiple Perspectives</h3>
          </div>
          <div className="space-y-4">
            {analysis.perspectives.slice(0, 3).map((perspective, index) => (
              <div key={index} className="border-l-2 border-warfare-blue pl-3">
                <h4 className="text-warfare-blue font-semibold text-sm mb-1">
                  {perspective.perspective}
                </h4>
                <p className="text-warfare-gray text-xs mb-2">{perspective.viewpoint}</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">
                    {perspective.opportunities.length} opportunities
                  </span>
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-red-400">
                    {perspective.risks.length} risks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bias Warnings */}
        <Card className="bg-warfare-card border-warfare-blue/20 p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="text-white font-bold">Cognitive Bias Alerts</h3>
          </div>
          <div className="space-y-3">
            {analysis.bias_warnings.map((warning, index) => (
              <div key={index} className="bg-yellow-400/10 border border-yellow-400/20 rounded p-3">
                <p className="text-yellow-400 text-sm">{warning}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-warfare-card border-warfare-blue/20 p-6 mb-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 text-warfare-red mr-2" />
          <h3 className="text-white font-bold">Strategic Recommendations</h3>
        </div>
        <div className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-warfare-red rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                {index + 1}
              </div>
              <p className="text-white">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="bg-warfare-card border-warfare-blue/20 p-6 mb-8">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-green-400 mr-2" />
          <h3 className="text-white font-bold">Immediate Next Steps</h3>
        </div>
        <div className="space-y-2">
          {analysis.next_steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-green-400 rounded"></div>
              <p className="text-warfare-blue">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={onContinueChat}
          className="bg-warfare-red hover:bg-warfare-red/80"
        >
          Continue Strategic Discussion
        </Button>
        <Button
          onClick={onStartNewAnalysis}
          variant="outline"
          className="text-warfare-blue border-warfare-blue/30 hover:bg-warfare-blue/10"
        >
          Start New Analysis
        </Button>
      </div>
    </div>
  );
};

export default DecisionAnalysisResults;
