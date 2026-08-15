import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getTimetableEntries, deleteAllTimetableEntries, deleteTimetableEntry, updateTimetableEntry, addTimetableEntry, getUserTimeSlots } from '@/db/api';
import { SECTIONS, type TimetableEntry, type DayOfWeek, type UserTimeSlot } from '@/types';
import { toast } from 'sonner';
import { Download, Trash2, Loader2, RefreshCw, Edit2, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import MainLayout from '@/components/layouts/MainLayout';
import TimetableGrid from '@/components/timetable/TimetableGrid';

export default function ViewTimetablePage() {
  const { user, profile } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [timeSlots, setTimeSlots] = useState<UserTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [selectedSection, setSelectedSection] = useState('A');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [selectedSection]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const [entriesData, slotsData] = await Promise.all([
        getTimetableEntries('', selectedSection),
        getUserTimeSlots()
      ]);
      setEntries(entriesData);
      setTimeSlots(slotsData);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!profile || profile.role !== 'admin') {
      toast.error('Only administrators can reset the timetable');
      return;
    }

    try {
      setResetting(true);
      await deleteAllTimetableEntries();
      setEntries([]);
      toast.success('Timetable reset successfully');
    } catch (error) {
      console.error('Error resetting timetable:', error);
      toast.error('Failed to reset timetable');
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteTimetableEntry(entryId);
      setEntries(entries.filter(e => e.id !== entryId));
      toast.success('Entry deleted');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const handleUpdateEntry = async (entryId: string, updates: Partial<TimetableEntry>) => {
    try {
      await updateTimetableEntry(entryId, updates);
      setEntries(entries.map(e => e.id === entryId ? { ...e, ...updates } as TimetableEntry : e));
      toast.success('Entry updated');
    } catch (error) {
      toast.error('Failed to update entry');
    }
  };

  const handleAddEntry = async (day: string, timeSlot: string) => {
    if (!user) {
      toast.error('Please log in to add entries');
      return;
    }

    try {
      const newEntry = await addTimetableEntry(user.id, {
        subject: 'New Subject',
        teacher_name: 'Teacher Name',
        section: selectedSection,
        day: day as DayOfWeek,
        time_slot: timeSlot,
      });
      setEntries([...entries, newEntry]);
      toast.success('New entry added. You can now edit its details.');
    } catch (error) {
      toast.error('Failed to add entry');
    }
  };

  const handleDownloadPDF = () => {
    // Use browser's print functionality to save as PDF
    window.print();
    toast.success('Print dialog opened. You can save as PDF from there.');
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">View Timetable</h1>
                <p className="text-muted-foreground">
                  {profile?.username}'s weekly schedule
                </p>
              </div>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
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

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={loadEntries}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>

              <Button 
                variant={isEditMode ? "default" : "outline"} 
                onClick={() => setIsEditMode(!isEditMode)}
                className={isEditMode ? "neon-glow" : ""}
              >
                {isEditMode ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Edit2 className="mr-2 h-4 w-4" />}
                {isEditMode ? "Finish Editing" : "Edit Timetable"}
              </Button>

              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>

              {profile?.role === 'admin' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={entries.length === 0}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all entries from the timetable. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset} disabled={resetting}>
                        {resetting ? 'Resetting...' : 'Reset Timetable'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule - Section {selectedSection}</CardTitle>
              <CardDescription>
                {entries.length === 0
                  ? 'Your timetable is empty. Go to Create Timetable to add subjects.'
                  : `${entries.length} subject${entries.length !== 1 ? 's' : ''} scheduled this week`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimetableGrid 
                entries={entries} 
                editable={isEditMode} 
                onDelete={handleDeleteEntry}
                onUpdate={handleUpdateEntry}
                onAdd={handleAddEntry}
                timeSlots={timeSlots}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          header, footer, button {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}
