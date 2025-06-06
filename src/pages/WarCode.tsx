
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Code, Search, Plus, Hash } from "lucide-react"

const WarCode = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [codeFragments] = useState([
    {
      id: 1,
      rawPhrase: "Stay calm under pressure",
      symbolKeyword: "CALM_PRESSURE",
      mappedGlyph: "⚡︎",
      dateLogged: "2024-01-15",
      category: "Mindset"
    },
    {
      id: 2,
      rawPhrase: "Act with decisive clarity",
      symbolKeyword: "DECISIVE_CLARITY",
      mappedGlyph: "◆",
      dateLogged: "2024-01-14",
      category: "Action"
    },
    {
      id: 3,
      rawPhrase: "Adapt to changing circumstances",
      symbolKeyword: "ADAPT_CHANGE",
      mappedGlyph: "◎",
      dateLogged: "2024-01-13",
      category: "Strategy"
    },
    {
      id: 4,
      rawPhrase: "Trust your instincts",
      symbolKeyword: "TRUST_INSTINCT",
      mappedGlyph: "▲",
      dateLogged: "2024-01-12",
      category: "Mindset"
    },
    {
      id: 5,
      rawPhrase: "Focus on the mission",
      symbolKeyword: "FOCUS_MISSION",
      mappedGlyph: "●",
      dateLogged: "2024-01-11",
      category: "Focus"
    }
  ])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mindset': return 'bg-purple-500'
      case 'Action': return 'bg-red-500'
      case 'Strategy': return 'bg-blue-500'
      case 'Focus': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredFragments = codeFragments.filter(fragment =>
    fragment.rawPhrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fragment.symbolKeyword.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">War Code</h1>
            <p className="text-warfare-gray">Encrypted wisdom and tactical mnemonics</p>
          </div>
          <Button className="bg-warfare-accent hover:bg-warfare-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Fragment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{codeFragments.length}</p>
                  <p className="text-warfare-gray text-sm">Total Fragments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Hash className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-warfare-gray text-sm">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">◆</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-warfare-gray text-sm">Glyphs Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warfare-card border-warfare-gray/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">↑</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-warfare-gray text-sm">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-warfare-gray" />
            <Input
              placeholder="Search fragments by phrase or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-warfare-card border-warfare-gray/20 text-white placeholder:text-warfare-gray"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFragments.map((fragment) => (
            <Card key={fragment.id} className="bg-warfare-card border-warfare-gray/20 hover:border-warfare-accent/30 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={`${getCategoryColor(fragment.category)} text-white`}>
                    {fragment.category}
                  </Badge>
                  <span className="text-warfare-gray text-sm">{fragment.dateLogged}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{fragment.mappedGlyph}</div>
                    <p className="text-white font-medium">{fragment.rawPhrase}</p>
                  </div>
                  
                  <div className="border-t border-warfare-gray/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-warfare-gray text-sm">Keyword:</span>
                      <code className="text-warfare-accent text-sm bg-warfare-dark px-2 py-1 rounded">
                        {fragment.symbolKeyword}
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFragments.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-warfare-gray mx-auto mb-4" />
            <p className="text-warfare-gray">No code fragments found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WarCode
