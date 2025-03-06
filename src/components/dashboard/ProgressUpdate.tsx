import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProgressUpdateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProgress: number;
  onSubmit: (progress: number) => void;
}

export default function ProgressUpdate({
  open,
  onOpenChange,
  currentProgress,
  onSubmit,
}: ProgressUpdateProps) {
  const [progress, setProgress] = useState(currentProgress);

  const handleSliderChange = (value: number[]) => {
    setProgress(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setProgress(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(progress);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Adjust the slider to update the project completion percentage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="progress">Completion Percentage</Label>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Slider
                id="progress-slider"
                min={0}
                max={100}
                step={1}
                value={[progress]}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="flex items-center space-x-2">
                <Input
                  id="progress"
                  type="number"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleInputChange}
                  className="w-20"
                />
                <span className="text-sm">%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Progress</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
