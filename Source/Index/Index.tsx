import { Heart, Calendar, Clock, Pill } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PillCard } from '@/components/PillCard';
import { AddPillDialog } from '@/components/AddPillDialog';
import { usePills } from '@/hooks/usePills';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const { pills, addPill, editPill, removePill, markTaken, getTodaySchedule } = usePills();
  const todaySchedule = getTodaySchedule();
  
  const stats = {
    total: todaySchedule.length,
    taken: todaySchedule.filter(s => s.taken).length,
    pending: todaySchedule.filter(s => !s.taken && !s.isPast).length,
    missed: todaySchedule.filter(s => !s.taken && s.isPast).length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-button">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Pill Reminder Application</h1>
          </div>
          <p className="text-xl text-muted-foreground">Your smart medication companion</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center bg-gradient-card shadow-card">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Today's Pills</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-card shadow-card">
            <div className="text-2xl font-bold text-accent">{stats.taken}</div>
            <div className="text-sm text-muted-foreground">Taken</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-card shadow-card">
            <div className="text-2xl font-bold text-primary">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-card shadow-card">
            <div className="text-2xl font-bold text-destructive">{stats.missed}</div>
            <div className="text-sm text-muted-foreground">Missed</div>
          </Card>
        </div>

        {/* Progress */}
        {stats.total > 0 && (
          <Card className="p-6 mb-8 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Today's Progress</h3>
              <Badge variant={completionRate === 100 ? "default" : "secondary"} className="text-sm">
                {completionRate}% Complete
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </Card>
        )}

        {/* Action Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Today's Schedule</h2>
          </div>
          <AddPillDialog onAddPill={addPill} />
        </div>

        {/* Schedule */}
        {todaySchedule.length > 0 ? (
          <div className="space-y-3">
            {todaySchedule.map((schedule, index) => (
              <PillCard
                key={`${schedule.pill.id}-${schedule.time}`}
                schedule={schedule}
                onMarkTaken={(taken) => markTaken(schedule.pill.id, schedule.time, taken)}
                onEditPill={editPill}
                onDeletePill={removePill}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-gradient-card shadow-card">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-muted rounded-full">
                <Pill className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No medications yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first medication to get started with personalized reminders
              </p>
              <AddPillDialog onAddPill={addPill} />
            </div>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Always consult your healthcare provider for medical advice
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;