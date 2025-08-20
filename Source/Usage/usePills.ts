import { useState, useEffect } from 'react';
import { Pill, PillSchedule } from '@/types/pill';

const STORAGE_KEY = 'pill-pal-medications';

export const usePills = () => {
  const [pills, setPills] = useState<Pill[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPills(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
      } catch (error) {
        console.error('Error parsing stored pills:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pills));
  }, [pills]);

  const addPill = (pill: Omit<Pill, 'id' | 'taken' | 'createdAt'>) => {
    const newPill: Pill = {
      ...pill,
      id: crypto.randomUUID(),
      taken: {},
      createdAt: new Date(),
    };
    setPills(prev => [...prev, newPill]);
  };

  const removePill = (id: string) => {
    setPills(prev => prev.filter(p => p.id !== id));
  };

  const editPill = (id: string, updatedPill: Omit<Pill, 'id' | 'taken' | 'createdAt'>) => {
    setPills(prev => prev.map(pill => 
      pill.id === id 
        ? { ...pill, ...updatedPill }
        : pill
    ));
  };

  const markTaken = (pillId: string, time: string, taken: boolean) => {
    const today = new Date().toDateString();
    const key = `${today}-${time}`;
    
    setPills(prev => prev.map(pill => 
      pill.id === pillId 
        ? { ...pill, taken: { ...pill.taken, [key]: taken } }
        : pill
    ));
  };

  const getTodaySchedule = (): PillSchedule[] => {
    const today = new Date().toDateString();
    const now = new Date();
    const schedule: PillSchedule[] = [];

    pills.forEach(pill => {
      pill.times.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduleTime = new Date();
        scheduleTime.setHours(hours, minutes, 0, 0);
        
        const key = `${today}-${time}`;
        const taken = pill.taken[key] || false;
        const isPast = scheduleTime < now;

        schedule.push({
          pill,
          time,
          taken,
          isPast,
        });
      });
    });

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  return {
    pills,
    addPill,
    editPill,
    removePill,
    markTaken,
    getTodaySchedule,
  };
};