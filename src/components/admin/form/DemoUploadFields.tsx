import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Demo } from "@/types/voiceover";
import { Trash2, Music } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DemoUploadFieldsProps {
  demos: Demo[];
  onDemoAdd: (file: File, name: string, isMain: boolean) => void;
  onDemoRemove: (demoId: string) => void;
  onDemoNameChange: (demoId: string, name: string) => void;
}

export const DemoUploadFields = ({
  demos,
  onDemoAdd,
  onDemoRemove,
  onDemoNameChange,
}: DemoUploadFieldsProps) => {
  const [newDemoName, setNewDemoName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newDemoName) {
      const isMain = demos.length === 0;
      onDemoAdd(file, newDemoName, isMain);
      setNewDemoName("");
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Demo Tracks (up to 4)</Label>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {demos.map((demo) => (
            <div key={demo.id} className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-gray-500" />
                <Input
                  value={demo.name}
                  onChange={(e) => onDemoNameChange(demo.id, e.target.value)}
                  placeholder="Demo name"
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDemoRemove(demo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <audio controls className="w-full">
                <source src={demo.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </ScrollArea>
      </div>

      {demos.length < 4 && (
        <div className="space-y-2">
          <Label>Add New Demo</Label>
          <div className="flex gap-2">
            <Input
              value={newDemoName}
              onChange={(e) => setNewDemoName(e.target.value)}
              placeholder="Demo name"
              className="flex-1"
            />
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={!newDemoName}
            />
          </div>
        </div>
      )}
    </div>
  );
};