import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import {
  getTeachers,
  getSubjects,
  getClassrooms,
  getUserTimeSlots,
  addTimetableEntry,
  getTimetableEntries,
  addTeacher,
  addSubject,
  addClassroom,
  deleteTeacher,
  deleteSubject,
  deleteClassroom,
  deleteAllTimetableEntries,
  getTeacherSubjectMappings,
  addTeacherSubjectMapping,
  deleteTeacherSubjectMapping,
  addUserTimeSlot,
  deleteUserTimeSlot,
  updateUserTimeSlot
} from '@/db/api';
import { DAYS, SECTIONS, TIME_SLOTS, type Teacher, type Subject, type Classroom, type UserTimeSlot, type DayOfWeek, type TeacherSubjectMapping } from '@/types';
import { toast } from 'sonner';
import { Wand2, Loader2, Plus, Trash2, AlertCircle, CheckCircle2, Shield, Info, Clock, Coffee } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

interface GenerationConfig {
  sections: string[];
  subjectsPerDay: number;
  avoidTeacherClash: boolean;
  avoidClassroomClash: boolean;
}

interface Conflict {
  type: 'teacher' | 'classroom';
  message: string;
}

export default function AutoGeneratePage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const isAdmin = profile?.role === 'admin';

  // Resources
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [timeSlots, setTimeSlots] = useState<UserTimeSlot[]>([]);
  const [mappings, setMappings] = useState<TeacherSubjectMapping[]>([]);

  // Configuration
  const [config, setConfig] = useState<GenerationConfig>({
    sections: ['A'],
    subjectsPerDay: 5,
    avoidTeacherClash: true,
    avoidClassroomClash: true,
  });

  // Add resource forms
  const [newTeacher, setNewTeacher] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newClassroom, setNewClassroom] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [isBreak, setIsBreak] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [newWeeklyHours, setNewWeeklyHours] = useState('1');

  // Results
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [generatedCount, setGeneratedCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadResources();
    }
  }, [user]);

  const loadResources = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [teachersData, subjectsData, classroomsData, timeSlotsData, mappingsData] = await Promise.all([
        getTeachers(),
        getSubjects(),
        getClassrooms(),
        getUserTimeSlots(),
        getTeacherSubjectMappings(),
      ]);

      setTeachers(teachersData);
      setSubjects(subjectsData);
      setClassrooms(classroomsData);
      setTimeSlots(timeSlotsData);
      setMappings(mappingsData);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!user || !newTeacher.trim()) return;

    if (!isAdmin) {
      toast.error('Only admins can add teachers');
      return;
    }

    try {
      const teacher = await addTeacher({ name: newTeacher.trim() });
      setTeachers([...teachers, teacher]);
      setNewTeacher('');
      toast.success('Teacher added');
    } catch (error) {
      toast.error('Failed to add teacher');
    }
  };

  const handleAddSubject = async () => {
    if (!user || !newSubject.trim()) return;

    if (!isAdmin) {
      toast.error('Only admins can add subjects');
      return;
    }

    try {
      const subject = await addSubject({ name: newSubject.trim() });
      setSubjects([...subjects, subject]);
      setNewSubject('');
      toast.success('Subject added');
    } catch (error) {
      toast.error('Failed to add subject');
    }
  };

  const handleAddClassroom = async () => {
    if (!user || !newClassroom.trim()) return;

    if (!isAdmin) {
      toast.error('Only admins can add classrooms');
      return;
    }

    try {
      const classroom = await addClassroom({ name: newClassroom.trim() });
      setClassrooms([...classrooms, classroom]);
      setNewClassroom('');
      toast.success('Classroom added');
    } catch (error) {
      toast.error('Failed to add classroom');
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter(t => t.id !== id));
      toast.success('Teacher removed');
    } catch (error) {
      toast.error('Failed to remove teacher');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter(s => s.id !== id));
      toast.success('Subject removed');
    } catch (error) {
      toast.error('Failed to remove subject');
    }
  };

  const handleDeleteClassroom = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteClassroom(id);
      setClassrooms(classrooms.filter(c => c.id !== id));
      toast.success('Classroom removed');
    } catch (error) {
      toast.error('Failed to remove classroom');
    }
  };

  const handleClearAllEntries = async () => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to clear ALL timetable entries? This cannot be undone.')) return;

    try {
      setLoading(true);
      await deleteAllTimetableEntries();
      setGeneratedCount(0);
      setConflicts([]);
      toast.success('All timetable entries cleared');
    } catch (error) {
      toast.error('Failed to clear entries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMapping = async () => {
    if (!selectedTeacherId || !selectedSubjectId) {
      toast.error('Please select both a teacher and a subject');
      return;
    }

    const hours = parseInt(newWeeklyHours);
    if (isNaN(hours) || hours < 1) {
      toast.error('Please enter a valid number of weekly hours');
      return;
    }

    try {
      await addTeacherSubjectMapping(selectedTeacherId, selectedSubjectId, hours);
      // Fetch mappings again to get populated names
      const updatedMappings = await getTeacherSubjectMappings();
      setMappings(updatedMappings);
      setNewWeeklyHours('1');
      setSelectedTeacherId('');
      setSelectedSubjectId('');
      toast.success('Teacher-Subject mapping added');
    } catch (error) {
      toast.error('Failed to add mapping');
    }
  };

  const handleDeleteMapping = async (id: string) => {
    try {
      await deleteTeacherSubjectMapping(id);
      setMappings(mappings.filter(m => m.id !== id));
      toast.success('Mapping removed');
    } catch (error) {
      toast.error('Failed to remove mapping');
    }
  };

  const handleAddTimeSlot = async () => {
    if (!isAdmin) return;
    if (!newTimeSlot.trim()) {
      toast.error('Please enter a time slot');
      return;
    }

    try {
      const slot = await addUserTimeSlot({
        time_slot: newTimeSlot.trim(),
        sort_order: timeSlots.length,
        is_break: isBreak,
      });
      setTimeSlots([...timeSlots, slot]);
      setNewTimeSlot('');
      setIsBreak(false);
      toast.success('Time slot added');
    } catch (error) {
      toast.error('Failed to add time slot');
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteUserTimeSlot(id);
      setTimeSlots(timeSlots.filter(s => s.id !== id));
      toast.success('Time slot removed');
    } catch (error) {
      toast.error('Failed to remove time slot');
    }
  };

  const handleGenerate = async () => {
    if (!user) return;

    // Validation
    if (subjects.length === 0) {
      toast.error('Please add at least one subject');
      return;
    }

    if (teachers.length === 0) {
      toast.error('Please add at least one teacher');
      return;
    }

    if (config.sections.length === 0) {
      toast.error('Please select at least one section');
      return;
    }

    // All slots including breaks
    const allTimeSlots = timeSlots.length > 0 ? timeSlots : TIME_SLOTS.map((slot, i) => ({ 
      id: String(i), 
      time_slot: slot, 
      is_break: false, 
      sort_order: i, 
      created_at: '' 
    }));

    if (allTimeSlots.length === 0) {
      toast.error('Please configure time slots in Settings');
      return;
    }

    const availableTimeSlotsCount = allTimeSlots.filter(s => !s.is_break).length;
    const actualAvailableSlotsPerDay = Math.min(availableTimeSlotsCount, config.subjectsPerDay);
    const totalSlotsInWeek = actualAvailableSlotsPerDay * DAYS.length;
    const totalRequiredHours = mappings.reduce((sum, m) => sum + m.weekly_hours, 0);

    if (totalRequiredHours > totalSlotsInWeek) {
      toast.warning(`Total required hours (${totalRequiredHours}) exceed available slots per week (${totalSlotsInWeek}) based on your "Subjects per Day" setting. Some subjects may not be fully scheduled.`);
    }

    try {
      setGenerating(true);
      setConflicts([]);
      setGeneratedCount(0);

      const detectedConflicts: Conflict[] = [];
      let entriesCreated = 0;

      // Load existing entries to check for conflicts
      const existingEntries = await getTimetableEntries(user.id);

      // Track teacher and classroom assignments
      const teacherSchedule = new Map<string, Set<string>>(); // teacher -> Set of "day-timeslot"
      const classroomSchedule = new Map<string, Set<string>>(); // classroom -> Set of "day-timeslot"

      // Initialize with existing entries
      existingEntries.forEach(entry => {
        const key = `${entry.day}-${entry.time_slot}`;
        
        if (!teacherSchedule.has(entry.teacher_name)) {
          teacherSchedule.set(entry.teacher_name, new Set());
        }
        teacherSchedule.get(entry.teacher_name)?.add(key);

        if (entry.classroom_id) {
          if (!classroomSchedule.has(entry.classroom_id)) {
            classroomSchedule.set(entry.classroom_id, new Set());
          }
          classroomSchedule.get(entry.classroom_id)?.add(key);
        }
      });

      // Generate timetable for each section
      for (const section of config.sections) {
        // Track section-specific slots
        const sectionSlots = new Set<string>();
        
        // Get existing entries for this section
        const sectionExistingEntries = existingEntries.filter(e => e.section === section);
        sectionExistingEntries.forEach(e => sectionSlots.add(`${e.day}-${e.time_slot}`));

        // Create a pool of lessons to be scheduled for this section based on mappings and weekly_hours
        const lessonPool: { subject: Subject; teacher: Teacher; weekly_hours: number; scheduled: number }[] = [];
        
        mappings.forEach(mapping => {
          const subject = subjects.find(s => s.id === mapping.subject_id);
          const teacher = teachers.find(t => t.id === mapping.teacher_id);
          if (subject && teacher) {
            lessonPool.push({
              subject,
              teacher,
              weekly_hours: mapping.weekly_hours,
              scheduled: sectionExistingEntries.filter(e => e.subject_id === subject.id).length
            });
          }
        });

        // Track classroom index for round-robin classroom assignment if needed
        let classroomIndex = 0;

        for (const day of DAYS) {
          let slotsAddedToday = 0;

          for (const slot of allTimeSlots) {
            // Skip breaks
            if (slot.is_break) continue;

            // Check if slot is already occupied for this section
            const timeSlot = slot.time_slot;
            const slotKey = `${day}-${timeSlot}`;
            if (sectionSlots.has(slotKey)) {
              slotsAddedToday++;
              continue;
            }

            if (slotsAddedToday >= config.subjectsPerDay) break;

            // Find an available lesson from the pool
            const availableLesson = lessonPool.find(l => 
              l.scheduled < l.weekly_hours && 
              (!config.avoidTeacherClash || !teacherSchedule.get(l.teacher.name)?.has(slotKey))
            );

            if (!availableLesson) {
              // No more lessons to schedule or all remaining lessons have teacher clashes
              if (lessonPool.some(l => l.scheduled < l.weekly_hours)) {
                detectedConflicts.push({
                  type: 'teacher',
                  message: `Could not find a clash-free teacher for ${section} at ${day} ${timeSlot}`,
                });
              }
              continue;
            }

            const subject = availableLesson.subject;
            const teacher = availableLesson.teacher;
            const classroom = classrooms.length > 0 ? classrooms[classroomIndex % classrooms.length] : null;

            // Check for classroom clash
            if (config.avoidClassroomClash && classroom && classroomSchedule.get(classroom.id)?.has(slotKey)) {
              detectedConflicts.push({
                type: 'classroom',
                message: `Classroom ${classroom.name} has a clash at ${day} ${timeSlot}`,
              });
              classroomIndex++;
              // Try to find another classroom? For now, we'll just skip or use what we have.
              // To be more robust, we should probably iterate through classrooms.
              continue;
            }

            // Create entry
            try {
              await addTimetableEntry(user.id, {
                subject: subject.name,
                teacher_name: teacher.name,
                section,
                day: day as DayOfWeek,
                time_slot: timeSlot,
                classroom_id: classroom?.id,
                subject_id: subject.id,
              });

              // Update tracking
              if (!teacherSchedule.has(teacher.name)) {
                teacherSchedule.set(teacher.name, new Set());
              }
              teacherSchedule.get(teacher.name)?.add(slotKey);

              if (classroom) {
                if (!classroomSchedule.has(classroom.id)) {
                  classroomSchedule.set(classroom.id, new Set());
                }
                classroomSchedule.get(classroom.id)?.add(slotKey);
              }

              sectionSlots.add(slotKey);
              availableLesson.scheduled++;
              entriesCreated++;
              slotsAddedToday++;
              classroomIndex++;
            } catch (error) {
              console.error('Error creating entry:', error);
            }
          }
        }
      }

      setConflicts(detectedConflicts);
      setGeneratedCount(entriesCreated);

      if (entriesCreated > 0) {
        toast.success(`Generated ${entriesCreated} timetable entries!`);
      } else {
        toast.warning('No new entries were generated. Check conflicts or existing entries.');
      }
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast.error('Failed to generate timetable');
    } finally {
      setGenerating(false);
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Auto-Generate Timetable</h1>
            <p className="text-muted-foreground">
              {isAdmin 
                ? 'Automatically create optimized timetables with intelligent conflict detection' 
                : 'View available resources and generate timetables (resource management requires admin access)'}
            </p>
          </div>

          {!isAdmin && (
            <Card className="mb-8 border-warning/50 bg-warning/5">
              <CardContent className="pt-6">
                <p className="text-warning-foreground font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Read-Only Mode: Only administrators can generate new timetables.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Resources Management */}
            <div className="space-y-6">
              {/* Teachers */}
              <Card>
                <CardHeader>
                  <CardTitle>Teachers ({teachers.length})</CardTitle>
                  <CardDescription>Add faculty members who will teach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Teacher name"
                        value={newTeacher}
                        onChange={(e) => setNewTeacher(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTeacher()}
                      />
                      <Button onClick={handleAddTeacher} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="text-sm p-2 bg-muted rounded flex justify-between items-center group">
                        <span>{teacher.name}</span>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {teachers.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No teachers added yet{isAdmin && '. Add your first teacher above.'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subjects */}
              <Card>
                <CardHeader>
                  <CardTitle>Subjects ({subjects.length})</CardTitle>
                  <CardDescription>Add subjects to be scheduled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Subject name"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                      />
                      <Button onClick={handleAddSubject} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="text-sm p-2 bg-muted rounded flex justify-between items-center group">
                        <span>{subject.name}</span>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {subjects.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No subjects added yet{isAdmin && '. Add your first subject above.'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Classrooms */}
              <Card>
                <CardHeader>
                  <CardTitle>Classrooms ({classrooms.length})</CardTitle>
                  <CardDescription>Add available classrooms (optional)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Classroom name"
                        value={newClassroom}
                        onChange={(e) => setNewClassroom(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddClassroom()}
                      />
                      <Button onClick={handleAddClassroom} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {classrooms.map((classroom) => (
                      <div key={classroom.id} className="text-sm p-2 bg-muted rounded flex justify-between items-center group">
                        <span>{classroom.name}</span>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteClassroom(classroom.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {classrooms.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No classrooms added yet{isAdmin && '. Add classrooms above (optional).'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots & Breaks */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Time Slots & Breaks ({timeSlots.length})
                  </CardTitle>
                  <CardDescription>Configure timings and breaks for generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAdmin && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. 09:00 - 10:00"
                          value={newTimeSlot}
                          onChange={(e) => setNewTimeSlot(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTimeSlot()}
                        />
                        <Button onClick={handleAddTimeSlot} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="isBreak-auto" 
                          checked={isBreak} 
                          onCheckedChange={(checked) => setIsBreak(!!checked)} 
                        />
                        <Label htmlFor="isBreak-auto" className="text-xs font-medium leading-none cursor-pointer">
                          Mark as a Break (no classes)
                        </Label>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <div key={slot.id} className="text-sm p-2 bg-muted rounded flex justify-between items-center group">
                        <div className="flex items-center gap-2">
                          <span>{slot.time_slot}</span>
                          {slot.is_break && (
                            <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
                              <Coffee className="h-2 w-2" /> BREAK
                            </span>
                          )}
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteTimeSlot(slot.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {timeSlots.length === 0 && (
                      <div className="text-xs text-muted-foreground text-center py-4 italic border-2 border-dashed rounded-lg">
                        No time slots configured. Using default 8 AM - 5 PM slots.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Teacher-Subject Mapping */}
              <Card className="border-accent/30 bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-accent" />
                    Teacher-Subject Mapping
                  </CardTitle>
                  <CardDescription>Assign specific teachers to subjects for auto-generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAdmin && (
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label>Teacher</Label>
                        <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Subject</Label>
                        <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(s => (
                              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Weekly Hours</Label>
                        <Input
                          type="number"
                          min="1"
                          max="40"
                          value={newWeeklyHours}
                          onChange={(e) => setNewWeeklyHours(e.target.value)}
                          placeholder="Hours per week"
                        />
                      </div>
                      <Button onClick={handleAddMapping} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Mapping
                      </Button>
                    </div>
                  )}
                  <div className="space-y-1 mt-4 max-h-48 overflow-y-auto">
                    {mappings.map((mapping) => (
                      <div key={mapping.id} className="text-sm p-2 bg-background border border-border rounded flex justify-between items-center group">
                        <div className="flex flex-col">
                          <span className="font-medium text-primary">{mapping.subjects?.name}</span>
                          <span className="text-xs text-muted-foreground">{mapping.teachers?.name} • {mapping.weekly_hours} hrs/week</span>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteMapping(mapping.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {mappings.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No mappings added yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration & Generation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generation Settings</CardTitle>
                  <CardDescription>Configure timetable generation parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Sections to Generate</Label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {SECTIONS.map((section) => (
                        <button
                          key={section}
                          onClick={() => {
                            const newSections = config.sections.includes(section)
                              ? config.sections.filter((s) => s !== section)
                              : [...config.sections, section];
                            setConfig({ ...config, sections: newSections });
                          }}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            config.sections.includes(section)
                              ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(0,191,255,0.4)]'
                              : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                          }`}
                        >
                          Section {section}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subjects Per Day</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={config.subjectsPerDay}
                      onChange={(e) =>
                        setConfig({ ...config, subjectsPerDay: Number.parseInt(e.target.value) || 5 })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Conflict Detection</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="teacher-clash"
                        checked={config.avoidTeacherClash}
                        onChange={(e) => setConfig({ ...config, avoidTeacherClash: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <label htmlFor="teacher-clash" className="text-sm">
                        Avoid teacher clashes
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="classroom-clash"
                        checked={config.avoidClassroomClash}
                        onChange={(e) => setConfig({ ...config, avoidClassroomClash: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <label htmlFor="classroom-clash" className="text-sm">
                        Avoid classroom overlaps
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleGenerate} disabled={generating} className="flex-1" size="lg">
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" />
                          Generate Timetable
                        </>
                      )}
                    </Button>
                    {isAdmin && (
                      <Button 
                        onClick={handleClearAllEntries} 
                        variant="outline" 
                        size="lg"
                        className="text-destructive hover:bg-destructive/10"
                        title="Clear all entries"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              {generatedCount > 0 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Generated {generatedCount} timetable entries. View them in the View Timetable page.
                  </AlertDescription>
                </Alert>
              )}

              {/* Conflicts */}
              {conflicts.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Conflicts Detected ({conflicts.length})</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {conflicts.slice(0, 10).map((conflict, index) => (
                        <div key={index} className="text-xs">
                          • {conflict.message}
                        </div>
                      ))}
                      {conflicts.length > 10 && (
                        <div className="text-xs italic">...and {conflicts.length - 10} more</div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Info */}
              <Card className="bg-accent/50">
                <CardContent className="pt-6">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">🤖</span>
                      <span>Intelligent algorithm distributes subjects evenly across days</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">⚡</span>
                      <span>Automatic conflict detection prevents teacher and classroom clashes</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">⏳</span>
                      <span>Saves hours of manual scheduling work</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">🌐</span>
                      <span>Optimizes resource utilization automatically</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
