import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic } from "lucide-react"
import { Demo } from "@/types/voiceover"

interface DemosListProps {
  demos: Demo[]
}

export const DemosList = ({ demos }: DemosListProps) => {
  return (
    <ScrollArea className="h-[500px] rounded-md border">
      <div className="space-y-4 p-4">
        {demos?.map((demo) => (
          <Card key={demo.id}>
            <CardContent className="p-4">
              <div className="mb-2 font-semibold flex items-center gap-2">
                {demo.name}
                {demo.is_main && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                    Main Demo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-4">
                <Mic className="h-5 w-5 text-primary" />
                <audio controls className="w-full">
                  <source src={demo.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}