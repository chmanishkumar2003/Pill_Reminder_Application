import { Clock, Check, X, Pill as PillIcon, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PillSchedule, Pill } from '@/types/pill';
import { cn } from '@/lib/utils';
import { EditPillDialog } from './EditPillDialog';
import { useToast } from '@/hooks/use-toast';

interface PillCardProps {
  schedule: PillSchedule;
  onMarkTaken: (taken: boolean) => void;
  onEditPill: (id: string, pill: Omit<Pill, 'id' | 'taken' | 'createdAt'>) => void;
  onDeletePill: (id: string) => void;
}

export const PillCard = ({ schedule, onMarkTaken, onEditPill, onDeletePill }: PillCardProps) => {
  const { pill, time, taken, isPast } = schedule;
  const { toast } = useToast();

  const handleMarkTaken = (taken: boolean) => {
    onMarkTaken(taken);
    if (taken) {
      toast({
        title: "Medication Taken",
        description: `${pill.name} marked as taken for ${time}`,
        duration: 3000,
      });
    }
  };
  
  const getStatusColor = () => {
    if (taken) return 'bg-pill-taken border-accent/30';
    if (isPast) return 'bg-pill-missed border-destructive/30';
    return 'bg-pill-pending border-primary/30';
  };

  const getStatusIcon = () => {
    if (taken) return <Check className="h-4 w-4 text-accent" />;
    if (isPast) return <X className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-primary" />;
  };

  const getStatusText = () => {
    if (taken) return 'Taken';
    if (isPast) return 'Missed';
    return 'Pending';
  };

  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-pill bg-gradient-card border-2",
      getStatusColor(),
      taken && "opacity-75"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full shadow-sm" 
            style={{ backgroundColor: pill.color }}
          />
          <div>
            <h4 className="font-semibold text-foreground">{pill.name}</h4>
            <p className="text-sm text-muted-foreground">{pill.dosage}</p>
          </div>
          <EditPillDialog 
            pill={pill}
            onEditPill={onEditPill}
            onDeletePill={onDeletePill}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">{time}</p>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="text-xs font-medium">{getStatusText()}</span>
            </div>
          </div>
          
          {!taken && (
            <Button
              size="sm"
              variant={isPast ? "destructive" : "default"}
              onClick={() => handleMarkTaken(true)}
              className="shadow-button"
            >
              <PillIcon className="h-4 w-4 mr-1" />
              Take
            </Button>
          )}
          
          {taken && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleMarkTaken(false)}
            >
              Undo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};