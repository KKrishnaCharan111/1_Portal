import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, MapPin, User, Download } from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { TimetableSlot } from '../../types';

export const TimetablePage: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    dataService.getTimetable().then(setSlots);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daySlots = slots.filter((s) => s.day_of_week === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Weekly Timetable & Classrooms
            </h1>
            <Badge variant="brand">Sem 6 - Sec A</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official departmental lecture schedule with assigned classroom and lab complexes
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          Print Schedule
        </Button>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const count = slots.filter((s) => s.day_of_week === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-2 ${
                selectedDay === day
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedDay === day ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Slots */}
      <div className="space-y-4">
        {daySlots.length === 0 ? (
          <Card className="p-12 text-center text-xs text-slate-400">
            No scheduled lectures on {selectedDay} (Self-study / Project work)
          </Card>
        ) : (
          daySlots.map((slot, idx) => (
            <Card
              key={slot.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-500/40 transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/50 flex flex-col items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                  <span className="text-xs font-black">0{idx + 1}</span>
                  <span className="text-[9px] font-semibold uppercase">Slot</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      {slot.subject_code}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {slot.start_time} - {slot.end_time}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {slot.subject_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {slot.faculty_name}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {slot.classroom_code}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="brand">Confirmed</Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
