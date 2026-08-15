import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getTimetableEntries, addTimetableEntry, deleteTimetableEntry, getUserTimeSlots } from '@/db/api';
import { DAYS, TIME_SLOTS, SECTIONS, type DayOfWeek, type TimetableEntry, type UserTimeSlot } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Settings as SettingsIcon, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import TimetableGrid from '@/components/timetable/TimetableGrid';

export default function CreateTimetablePage() {
  const { user, profile } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [customTimeSlots, setCustomTimeSlots] = useState<UserTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [manualTimeSlot, setManualTimeSlot] = useState('');
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [viewSection, setViewSection] = useState('A');

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entriesData, timeSlotsData] = await Promise.all([
        getTimetableEntries('', viewSection),
        getUserTimeSlots(),
      ]);
      setEntries(entriesData);
      setCustomTimeSlots(timeSlotsData);
      
      // Set initial time slot
      if (timeSlotsData.length > 0) {
        setSelectedTimeSlot(timeSlotsData[0].time_slot);
      } else if (TIME_SLOTS.length > 0) {
        setSelectedTimeSlot(TIME_SLOTS[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  // Reload when view section changes
  useEffect(() => {
    loadData();
  }, [viewSection]);

  const getAvailableTimeSlots = () => {
    // Combine custom time slots with default ones
    const customSlots = customTimeSlots.map((slot) => slot.time_slot);
    const allSlots = customSlots.length > 0 ? customSlots : TIME_SLOTS;
    return allSlots;
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!isAdmin) {
      toast.error('Only administrators can add subjects');
      return;
    }

    if (!subject.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    if (!teacherName.trim()) {
      toast.error('Please enter a teacher name');
      return;
    }

    const timeSlotToUse = useManualEntry ? manualTimeSlot.trim() : selectedTimeSlot;

    if (!timeSlotToUse) {
      toast.error('Please enter or select a time slot');
      return;
    }

    // Check if slot is already occupied
    const existingEntry = entries.find(
      (entry) => entry.section === selectedSection && entry.day === selectedDay && entry.time_slot === timeSlotToUse
    );

    if (existingEntry) {
      toast.error('This time slot is already occupied for this section');
      return;
    }

    try {
      setSubmitting(true);
      const newEntry = await addTimetableEntry(user.id, {
        subject: subject.trim(),
        teacher_name: teacherName.trim(),
        section: selectedSection,
        day: selectedDay,
        time_slot: timeSlotToUse,
      });

      // Only add to entries if it matches the current view section
      if (newEntry.section === viewSection) {
        setEntries([...entries, newEntry]);
      }
      setSubject('');
      setTeacherName('');
      setManualTimeSlot('');
      toast.success(`Subject added successfully to Section ${selectedSection}!`);
    } catch (error: any) {
      console.error('Error adding entry:', error);
      if (error.message?.includes('duplicate')) {
        toast.error('This time slot is already occupied');
      } else {
        toast.error('Failed to add subject');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!user || !isAdmin) {
      toast.error('Only administrators can remove entries');
      return;
    }

    try {
      await deleteTimetableEntry(entryId);
      setEntries(entries.filter((entry) => entry.id !== entryId));
      toast.success('Entry removed successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to remove entry');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12 px-4 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Create Timetable</h1>
                <p className="text-muted-foreground">
                  {isAdmin 
                    ? 'Add subjects to the official weekly schedule' 
                    : 'View and manage subjects (Requires Admin access)'}
                </p>
              </div>
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link to="/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Manage Time Slots
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {!isAdmin && (
            <Card className="mb-8 border-warning/50 bg-warning/5">
              <CardContent className="pt-6">
                <p className="text-warning-foreground font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Read-Only Mode: Only administrators can modify the system-wide timetable.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Add Entry Form */}
            <div className="lg:col-span-1">
              <Card className={!isAdmin ? 'opacity-50 pointer-events-none' : ''}>
                <CardHeader>
                  <CardTitle>Add Subject</CardTitle>
                  <CardDescription>Enter subject details and select time slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEntry} className="space-y-4">
                    {/* ... (rest of the form stays the same) */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Name</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="e.g., Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teacher">Teacher Name</Label>
                      <Input
                        id="teacher"
                        type="text"
                        placeholder="e.g., Dr. Smith"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger id="section">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTIONS.map((section) => (
                            <SelectItem key={section} value={section}>
                              Section {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="day">Day</Label>
                      <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value as DayOfWeek)}>
                        <SelectTrigger id="day">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day: string) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="time-slot">Time Slot</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setUseManualEntry(!useManualEntry)}
                          className="h-auto py-1 px-2 text-xs"
                        >
                          {useManualEntry ? 'Use Dropdown' : 'Manual Entry'}
                        </Button>
                      </div>
                      
                      {useManualEntry ? (
                        <Input
                          id="time-slot"
                          type="text"
                          placeholder="e.g., 8:00 AM - 9:00 AM"
                          value={manualTimeSlot}
                          onChange={(e) => setManualTimeSlot(e.target.value)}
                          disabled={submitting}
                        />
                      ) : (
                        <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                          <SelectTrigger id="time-slot">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableTimeSlots().length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                No time slots configured.
                                <Link to="/settings" className="block text-primary hover:underline mt-1">
                                  Add time slots in Settings
                                </Link>
                              </div>
                            ) : (
                              getAvailableTimeSlots().map((slot: string) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Timetable
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Timetable Grid */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Timetable</CardTitle>
                      <CardDescription>
                        {entries.length === 0
                          ? 'No entries yet. Add your first subject to get started.'
                          : `${entries.length} subject${entries.length !== 1 ? 's' : ''} scheduled for Section ${viewSection}`}
                      </CardDescription>
                    </div>
                    <Select value={viewSection} onValueChange={setViewSection}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTIONS.map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <TimetableGrid entries={entries} onDelete={handleDeleteEntry} editable />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
