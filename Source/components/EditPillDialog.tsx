import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, X, Plus } from 'lucide-react';
import { Pill } from '@/types/pill';

interface EditPillDialogProps {
  pill: Pill;
  onEditPill: (id: string, pill: Omit<Pill, 'id' | 'taken' | 'createdAt'>) => void;
  onDeletePill: (id: string) => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

export const EditPillDialog = ({ pill, onEditPill, onDeletePill }: EditPillDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(pill.name);
  const [dosage, setDosage] = useState(pill.dosage);
  const [color, setColor] = useState(pill.color);
  const [times, setTimes] = useState<string[]>(pill.times);
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    setName(pill.name);
    setDosage(pill.dosage);
    setColor(pill.color);
    setTimes(pill.times);
  }, [pill]);

  const addTime = () => {
    if (newTime && !times.includes(newTime)) {
      setTimes([...times, newTime]);
      setNewTime('');
    }
  };

  const removeTime = (timeToRemove: string) => {
    setTimes(times.filter(t => t !== timeToRemove));
  };

  const handleSave = () => {
    if (name.trim() && dosage.trim() && times.length > 0) {
      onEditPill(pill.id, {
        name: name.trim(),
        dosage: dosage.trim(),
        color,
        times: times.sort(),
      });
      setOpen(false);
    }
  };

  const handleDelete = () => {
    onDeletePill(pill.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Medication</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Medication Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Aspirin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-foreground">Dosage</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 100mg"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === presetColor ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">Times</Label>
            <div className="flex gap-2">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addTime} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {times.map((time) => (
                <Badge key={time} variant="secondary" className="text-xs">
                  {time}
                  <button
                    type="button"
                    onClick={() => removeTime(time)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !dosage.trim() || times.length === 0}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};