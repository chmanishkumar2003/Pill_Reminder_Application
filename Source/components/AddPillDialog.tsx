import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface AddPillDialogProps {
  onAddPill: (pill: {
    name: string;
    dosage: string;
    color: string;
    times: string[];
  }) => void;
}

const PRESET_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export const AddPillDialog = ({ onAddPill }: AddPillDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [times, setTimes] = useState<string[]>([]);
  const [newTime, setNewTime] = useState('');

  const handleAddTime = () => {
    if (newTime && !times.includes(newTime)) {
      setTimes(prev => [...prev, newTime].sort());
      setNewTime('');
    }
  };

  const handleRemoveTime = (timeToRemove: string) => {
    setTimes(prev => prev.filter(t => t !== timeToRemove));
  };

  const handleSubmit = () => {
    if (name.trim() && dosage.trim() && times.length > 0) {
      onAddPill({
        name: name.trim(),
        dosage: dosage.trim(),
        color,
        times,
      });
      
      // Reset form
      setName('');
      setDosage('');
      setColor(PRESET_COLORS[0]);
      setTimes([]);
      setNewTime('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-button bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Medication</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Aspirin"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 100mg"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {PRESET_COLORS.map(presetColor => (
                <button
                  key={presetColor}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === presetColor ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <Label>Reminder Times</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddTime} size="sm">
                Add
              </Button>
            </div>
            
            {times.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {times.map(time => (
                  <Badge key={time} variant="secondary" className="flex items-center gap-1">
                    {time}
                    <button 
                      onClick={() => handleRemoveTime(time)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!name.trim() || !dosage.trim() || times.length === 0}
              className="flex-1 bg-gradient-primary shadow-button"
            >
              Add Medication
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};