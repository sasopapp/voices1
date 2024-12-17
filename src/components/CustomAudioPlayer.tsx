import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

interface CustomAudioPlayerProps {
  url: string;
  className?: string;
}

export const CustomAudioPlayer = ({ url, className }: CustomAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", () => setIsPlaying(false));
        audioRef.current.pause();
      }
    };
  }, [url]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const time = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value[0]);
    }
  };

  const handleSliderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={cn(
        "py-2 px-3 bg-secondary/50 border-none shadow-none", 
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-secondary" 
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div className="flex-1">
          <Slider
            value={[progress]}
            onValueChange={handleSliderChange}
            max={100}
            step={0.1}
            className="my-1"
            onClick={handleSliderClick}
          />
        </div>
      </div>
    </Card>
  );
};