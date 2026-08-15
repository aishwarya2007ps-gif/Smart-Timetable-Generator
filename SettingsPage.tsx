import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTimeSlots, addUserTimeSlot, deleteUserTimeSlot, updateUserTimeSlot } from '@/db/api';
import { TIME_SLOTS, type UserTimeSlot } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Clock, Edit2, Check, X, AlertCircle, Shield, Coffee } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
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

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [customTimeSlots, setCustomTimeSlots] = useState<UserTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [isBreak, setIsBreak] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingIsBreak, setEditingIsBreak] = useState(false);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (user) {
      loadTimeSlots();
    }
  }, [user]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await getUserTimeSlots();
      setCustomTimeSlots(data);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!isAdmin) {
      toast.error('Only admins can add time slots');
      return;
    }

    if (!newTimeSlot.trim()) {
      toast.error('Please enter a time slot');
      return;
    }

    // Check for duplicates
    const isDuplicate = customTimeSlots.some(
      (slot) => slot.time_slot.toLowerCase() === newTimeSlot.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error('This time slot already exists');
      return;
    }

    try {
      setSubmitting(true);
      const sortOrder = customTimeSlots.length;
      const newSlot = await addUserTimeSlot({
        time_slot: newTimeSlot.trim(),
        sort_order: sortOrder,
        is_break: isBreak,
      });

      setCustomTimeSlots([...customTimeSlots, newSlot]);
      setNewTimeSlot('');
      setIsBreak(false);
      toast.success('Time slot added successfully!');
    } catch (error: any) {
      console.error('Error adding time slot:', error);
      if (error.message?.includes('duplicate')) {
        toast.error('This time slot already exists');
      } else {
        toast.error('Failed to add time slot');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTimeSlot = async (slotId: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete time slots');
      return;
    }

    try {
      await deleteUserTimeSlot(slotId);
      setCustomTimeSlots(customTimeSlots.filter((slot) => slot.id !== slotId));
      toast.success('Time slot deleted successfully');
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('Failed to delete time slot');
    }
  };

  const handleStartEdit = (slot: UserTimeSlot) => {
    if (!isAdmin) {
      toast.error('Only admins can edit time slots');
      return;
    }
    setEditingId(slot.id);
    setEditingValue(slot.time_slot);
    setEditingIsBreak(slot.is_break);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
    setEditingIsBreak(false);
  };

  const handleSaveEdit = async (slotId: string) => {
    if (!editingValue.trim()) {
      toast.error('Time slot cannot be empty');
      return;
    }

    // Check for duplicates (excluding current slot)
    const isDuplicate = customTimeSlots.some(
      (slot) => slot.id !== slotId && slot.time_slot.toLowerCase() === editingValue.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error('This time slot already exists');
      return;
    }

    try {
      const updatedSlot = await updateUserTimeSlot(slotId, {
        time_slot: editingValue.trim(),
        is_break: editingIsBreak,
      });

      setCustomTimeSlots(
        customTimeSlots.map((slot) => (slot.id === slotId ? updatedSlot : slot))
      );
      setEditingId(null);
      setEditingValue('');
      setEditingIsBreak(false);
      toast.success('Time slot updated successfully');
    } catch (error) {
      console.error('Error updating time slot:', error);
      toast.error('Failed to update time slot');
    }
  };

  const handleUseDefaultSlots = async () => {
    if (!isAdmin) {
      toast.error('Only admins can add time slots');
      return;
    }

    try {
      setSubmitting(true);
      
      // Add all default time slots
      const promises = TIME_SLOTS.map((slot, index) =>
        addUserTimeSlot({
          time_slot: slot,
          sort_order: index,
        })
      );

      const newSlots = await Promise.all(promises);
      setCustomTimeSlots([...customTimeSlots, ...newSlots]);
      toast.success('Default time slots added successfully!');
    } catch (error: any) {
      console.error('Error adding default slots:', error);
      toast.error('Failed to add default time slots');
    } finally {
      setSubmitting(false);
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Timetable Settings</h1>
            <p className="text-muted-foreground">
              {isAdmin ? 'Manage global time slots for all users' : 'View configured time slots'}
            </p>
          </div>

          {!isAdmin && (
            <Card className="mb-8 border-warning/50 bg-warning/5">
              <CardContent className="pt-6">
                <p className="text-warning-foreground font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Read-Only Mode: Only administrators can modify global time slots.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {/* Add Time Slot */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Add Custom Time Slot
                  </CardTitle>
                  <CardDescription>
                    Create time slots that will be available to all users (e.g., "8:00 AM - 9:00 AM" or "Period 1")
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTimeSlot} className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="e.g., 8:00 AM - 9:00 AM"
                          value={newTimeSlot}
                          onChange={(e) => setNewTimeSlot(e.target.value)}
                          disabled={submitting}
                        />
                      </div>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isBreak" 
                        checked={isBreak} 
                        onCheckedChange={(checked) => setIsBreak(!!checked)} 
                      />
                      <Label htmlFor="isBreak" className="text-sm font-medium leading-none cursor-pointer">
                        Mark as a Break (no classes will be scheduled)
                      </Label>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Custom Time Slots List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Configured Time Slots</CardTitle>
                    <CardDescription>
                      {customTimeSlots.length === 0
                        ? 'No time slots configured yet.'
                        : `${customTimeSlots.length} time slot${customTimeSlots.length !== 1 ? 's' : ''} available for all users`}
                    </CardDescription>
                  </div>
                  {isAdmin && customTimeSlots.length === 0 && (
                    <Button variant="outline" onClick={handleUseDefaultSlots} disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Use Default Slots'
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {customTimeSlots.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No time slots configured yet.</p>
                    {isAdmin && <p className="text-sm mt-1">Add custom time slots or use the default ones.</p>}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {customTimeSlots.map((slot, index) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-muted-foreground w-8">
                          {index + 1}.
                        </span>
                        {editingId === slot.id ? (
                          <>
                            <div className="flex-1 space-y-2">
                              <Input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full"
                                autoFocus
                              />
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`edit-break-${slot.id}`} 
                                  checked={editingIsBreak} 
                                  onCheckedChange={(checked) => setEditingIsBreak(!!checked)} 
                                />
                                <Label htmlFor={`edit-break-${slot.id}`} className="text-xs font-medium leading-none cursor-pointer">
                                  Mark as Break
                                </Label>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveEdit(slot.id)}
                            >
                              <Check className="h-4 w-4 text-success" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 flex items-center gap-2">
                              <span className="font-medium">{slot.time_slot}</span>
                              {slot.is_break && (
                                <div className="flex items-center gap-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                  <Coffee className="h-2.5 w-2.5" />
                                  Break
                                </div>
                              )}
                            </div>
                            {isAdmin && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEdit(slot)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Time Slot?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will remove "{slot.time_slot}" from the system. Any timetable entries using this time slot will remain unchanged.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteTimeSlot(slot.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Time slots are shared across all users in the system</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{isAdmin ? 'As an admin, you can add, edit, or delete time slots' : 'Only administrators can modify time slots'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>When creating timetable entries, you can select from these time slots or enter a custom one</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
