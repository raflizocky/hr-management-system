'use client';

import { useState } from 'react';
import { Plus, Calendar, Clock, Users, MapPin, Edit, Trash2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shift, ShiftTemplate } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ShiftsPage() {
  const { user } = useAuth();
  const { shifts, shiftTemplates, employees, addShift, updateShift, deleteShift, addShiftTemplate } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const canManageShifts = user?.role === 'admin' || user?.role === 'hr';

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    employeeId: '',
    department: '',
    location: '',
    notes: ''
  });

  const filteredShifts = user?.role === 'employee' 
    ? shifts.filter(shift => shift.employeeId === user.employeeId)
    : shifts;

  const handleCreateShift = () => {
    setSelectedShift(undefined);
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      employeeId: '',
      department: '',
      location: '',
      notes: ''
    });
    setIsFormOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setFormData({
      title: shift.title,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      employeeId: shift.employeeId,
      department: shift.department,
      location: shift.location || '',
      notes: shift.notes || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = employees.find(emp => emp.employeeId === formData.employeeId);
    if (!employee) return;

    const shiftData = {
      ...formData,
      employeeName: employee.name,
      status: 'scheduled' as const,
      createdBy: user?.name || '',
      createdDate: new Date().toISOString().split('T')[0]
    };

    if (selectedShift) {
      updateShift(selectedShift.id, shiftData);
    } else {
      addShift(shiftData);
    }
    
    setIsFormOpen(false);
  };

  const handleDeleteShift = (id: string) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      deleteShift(id);
    }
  };

  const handleShiftAction = (shiftId: string, action: 'confirm' | 'complete' | 'cancel') => {
    const statusMap = {
      confirm: 'confirmed',
      complete: 'completed',
      cancel: 'cancelled'
    };
    updateShift(shiftId, { status: statusMap[action] as any });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
    }
  };

  // Generate calendar view data
  const generateCalendarDays = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const days = [];

    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayShifts = filteredShifts.filter(shift => shift.date === dateStr);
      days.push({
        date: new Date(d),
        dateStr,
        shifts: dayShifts,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-gray-600">
            {user?.role === 'employee' 
              ? 'View your scheduled shifts and availability' 
              : 'Manage employee shifts and schedules'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex rounded-md shadow-sm">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="rounded-r-none"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <Users className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          {canManageShifts && (
            <Button onClick={handleCreateShift} className="bg-gradient-to-r from-blue-600 to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Shift
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="shifts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="space-y-6">
          {viewMode === 'calendar' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Shift Calendar - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border rounded-lg ${
                        day.isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        day.isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {day.shifts.slice(0, 2).map((shift) => (
                          <div
                            key={shift.id}
                            className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                            title={`${shift.employeeName} - ${shift.startTime}-${shift.endTime}`}
                          >
                            {shift.employeeName}
                          </div>
                        ))}
                        {day.shifts.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{day.shifts.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Shift Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        {canManageShifts && <TableHead>Employee</TableHead>}
                        <TableHead>Shift</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>{shift.date}</TableCell>
                          {canManageShifts && (
                            <TableCell>
                              <div className="font-medium">{shift.employeeName}</div>
                            </TableCell>
                          )}
                          <TableCell>{shift.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              {shift.startTime} - {shift.endTime}
                            </div>
                          </TableCell>
                          <TableCell>{shift.department}</TableCell>
                          <TableCell>{getStatusBadge(shift.status)}</TableCell>
                          <TableCell>
                            {shift.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {shift.location}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {user?.role === 'employee' && shift.status === 'scheduled' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShiftAction(shift.id, 'confirm')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {canManageShifts && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditShift(shift)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteShift(shift.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shift Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p>Shift templates will be displayed here</p>
                <p className="text-sm">Create reusable templates for common shift patterns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                    <p className="text-3xl font-bold text-gray-900">{shifts.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {shifts.filter(s => s.status === 'confirmed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                      {shifts.filter(s => s.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Missed</p>
                    <p className="text-3xl font-bold text-red-600">
                      {shifts.filter(s => s.status === 'missed').length}
                    </p>
                  </div>
                  <X className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Shift Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedShift ? 'Edit Shift' : 'Create New Shift'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Shift Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Morning Shift"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee</Label>
                <Select value={formData.employeeId} onValueChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.employeeId}>
                        {employee.name} ({employee.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Department"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Work location (optional)"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700">
                {selectedShift ? 'Update Shift' : 'Create Shift'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}