import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

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
    e.stopPropagation(); // Prevent event from bubbling up to parent card
    
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
    e.stopPropagation(); // Prevent event from bubbling up to parent card
  };

  return (
    <div 
      className={cn("flex items-center gap-4 w-full", className)}
      onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up to parent card
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 shrink-0" 
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
      <Slider
        value={[progress]}
        onValueChange={handleSliderChange}
        max={100}
        step={0.1}
        className="flex-1"
        onClick={handleSliderClick}
      />
    </div>
  );
};