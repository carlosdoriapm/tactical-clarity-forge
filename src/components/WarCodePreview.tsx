
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2 } from "lucide-react"

interface WarCodeFragment {
  symbol: string
  mantra: string
}

interface WarCodePreviewProps {
  fragments?: WarCodeFragment[]
}

export function WarCodePreview({ fragments }: WarCodePreviewProps) {
  const defaultFragments = [
    { symbol: "⚡", mantra: "Strike with precision" },
    { symbol: "🔥", mantra: "Forge through resistance" },
    { symbol: "⚔️", mantra: "Embrace the struggle" },
    { symbol: "🎯", mantra: "Focus cuts through chaos" }
  ]

  const fragmentData = fragments || defaultFragments

  return (
    <Card className="bg-warfare-card border-warfare-gray/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Code2 className="w-5 h-5 mr-2 text-purple-500" />
          WAR CODE Preview
        </CardTitle>
        <CardDescription className="text-warfare-gray">
          Your tactical mantras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fragmentData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-2xl">{item.symbol}</span>
              <span className="text-warfare-gray text-sm">{item.mantra}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
