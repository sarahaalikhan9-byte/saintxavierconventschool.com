import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';

interface EventData {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Holiday' | 'PTM' | 'Sports' | 'Other';
}

export default function SchoolCalendar({ role = 'student', theme = 'glassNavy' }: { role?: 'student' | 'teacher', theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald' }) {
  const isGlass = theme === 'glassNavy';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<EventData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sxc_school_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {}
    } else {
      const defaultEvents: EventData[] = [
        { id: '1', title: 'Summer Break Begins', date: '2026-06-25', type: 'Holiday' },
        { id: '2', title: 'Parent-Teacher Meeting', date: '2026-06-15', type: 'PTM' },
        { id: '3', title: 'Annual Sports Day', date: '2026-06-28', type: 'Sports' }
      ];
      setEvents(defaultEvents);
      localStorage.setItem('sxc_school_events', JSON.stringify(defaultEvents));
    }
  }, []);

  const saveEvents = (newEvents: EventData[]) => {
    setEvents(newEvents);
    localStorage.setItem('sxc_school_events', JSON.stringify(newEvents));
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDragStart = (e: React.DragEvent, event: EventData) => {
    if (role !== 'teacher') return;
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (role !== 'teacher') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dayStamp: string) => {
    if (role !== 'teacher' || !draggedEvent) return;
    e.preventDefault();
    const updatedEvents = events.map(ev => 
      ev.id === draggedEvent.id ? { ...ev, date: dayStamp } : ev
    );
    saveEvents(updatedEvents);
    setDraggedEvent(null);
  };

  const addEvent = () => {
    if (role !== 'teacher') return;
    const title = prompt('Event Title:');
    if (!title) return;
    const typeChoice = prompt('Type (Holiday, PTM, Sports, Other):', 'Other');
    const validTypes = ['Holiday', 'PTM', 'Sports', 'Other'];
    const type = validTypes.includes(typeChoice as string) ? typeChoice : 'Other';
    const day = prompt('Date (YYYY-MM-DD):', `${year}-${String(month + 1).padStart(2, '0')}-01`);
    if (!day) return;

    const newEvent: EventData = {
      id: Date.now().toString(),
      title,
      type: type as any,
      date: day
    };
    saveEvents([...events, newEvent]);
  };

  const removeEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (role !== 'teacher') return;
    saveEvents(events.filter(ev => ev.id !== id));
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 md:p-4 opacity-50 bg-gray-500/5 min-h-[100px] border border-gray-500/10"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const defaultDayStamp = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayEvents = events.filter(ev => ev.date === defaultDayStamp);
    
    days.push(
      <div 
        key={i} 
        className={`p-2 min-h-[120px] border transition-colors ${
          isGlass ? 'bg-white/50 border-gray-200' : 'bg-[#0F0F12] border-gray-800'
        } ${role === 'teacher' ? 'hover:bg-blue-500/5' : ''}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, defaultDayStamp)}
      >
        <span className="font-bold opacity-70 text-sm mb-2 block">{i}</span>
        <div className="space-y-1">
          {dayEvents.map(ev => (
            <div 
              key={ev.id}
              draggable={role === 'teacher'}
              onDragStart={(e) => handleDragStart(e, ev)}
              className={`text-[10px] sm:text-[11px] p-1.5 rounded flex items-center justify-between group ${
                ev.type === 'Holiday' ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400' :
                ev.type === 'PTM' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                ev.type === 'Sports' ? 'bg-rose-500/20 text-emerald-700 dark:text-emerald-400' :
                'bg-blue-500/20 text-blue-700 dark:text-blue-400'
              } ${role === 'teacher' ? 'cursor-move' : ''}`}
            >
              <div className="flex items-center gap-1 overflow-hidden">
                {role === 'teacher' && <GripVertical className="w-3 h-3 opacity-50 shrink-0 hidden sm:block" />}
                <span className="truncate flex-1 font-bold">{ev.title}</span>
              </div>
              {role === 'teacher' && (
                 <button onClick={(e) => removeEvent(ev.id, e)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/10 rounded ml-1 transition-opacity">
                   <Trash2 className="w-3 h-3" />
                 </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border shadow-sm animate-slideUp ${isGlass ? 'bg-white/70 backdrop-blur-xl border-gray-200 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6 border-gray-500/10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-500" />
            School Event Calendar
          </h2>
          <p className="text-sm opacity-60 mt-1 font-medium">
            {role === 'teacher' ? 'Manage and drag events to reschedule them across the month.' : 'View upcoming school holidays, meetings, and sports events.'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {role === 'teacher' && (
            <button onClick={addEvent} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition shrink-0">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          )}
          <div className={`flex items-center gap-2 p-1 rounded-xl border ${isGlass ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#0F0F12] border-gray-800'}`}>
            <button onClick={prevMonth} className={`p-2 rounded-lg transition ${isGlass ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-bold min-w-[130px] text-center text-sm">{monthNames[month]} {year}</span>
            <button onClick={nextMonth} className={`p-2 rounded-lg transition ${isGlass ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border border-gray-500/20 bg-gray-500/20">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`p-3 text-center text-[10px] sm:text-xs font-black uppercase tracking-wider ${isGlass ? 'bg-gray-50 text-gray-500' : 'bg-[#1C1C1F] text-gray-400'}`}>
            {day}
          </div>
        ))}
        {days}
      </div>
      
      <div className="mt-8 flex flex-wrap gap-6 items-center justify-center md:justify-start text-xs font-bold opacity-80">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div> Holiday</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div> PTM</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div> Sports</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div> Other Events</div>
      </div>
    </div>
  );
}
