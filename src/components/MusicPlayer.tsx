
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/context/MusicContext";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const MusicPlayer = ({ className }: { className?: string }) => {
  const { isPlaying, toggleMusic, volume, setVolume } = useMusic();
  const [isOpen, setIsOpen] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full hover-scale", className)}
          aria-label="Music controls"
        >
          <Music className={cn("h-5 w-5", isPlaying && "text-hostel-blue")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-4">
        <div className="space-y-4">
          <h4 className="font-medium">Background Music</h4>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMusic}
              className="hover-scale"
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <div className="w-36">
              <Slider
                defaultValue={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                disabled={!isPlaying}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {isPlaying ? "Playing" : "Paused"}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
