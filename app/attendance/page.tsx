'use client';

import { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AttendancePage() {
  const { attendanceRecords, addAttendanceRecord } = useData();
  const { user } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);

  const filteredRecords = user?.role === 'employee' 
    ? attendanceRecords.filter(record => record.employeeId === user.employeeId)
    : attendanceRecords;

  const todayDate = new Date().toISOString().split('T')[0];
  const todayRecord = filteredRecords.find(record => 
    record.date === todayDate && 
    (user?.role === 'employee' ? record.employeeId === user.employeeId : true)
  );

  const handleCheckIn = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    addAttendanceRecord({
      employeeId: user?.employeeId || '1',
      employeeName: user?.name || 'Unknown',
      date: todayDate,
      checkIn: currentTime,
      status: 'present'
    });
    
    setCheckedIn(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'half-day':
        return <Badge className="bg-blue-100 text-blue-800">Half Day</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">Track daily attendance and working hours</p>
      </div>

      {/* Check-in/out card for employees */}
      {user?.role === 'employee' && (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="font-medium">{todayDate}</span>
              </div>
              
              {todayRecord ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Check-in:</span>
                    <span className="font-medium">{todayRecord.checkIn}</span>
                  </div>
                  {todayRecord.checkOut && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Check-out:</span>
                      <span className="font-medium">{todayRecord.checkOut}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge(todayRecord.status)}
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleCheckIn} 
                  disabled={checkedIn}
                  className="w-full"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {checkedIn ? 'Checked In' : 'Check In'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance records table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {(user?.role === 'admin' || user?.role === 'hr') && (
                    <TableHead>Employee</TableHead>
                  )}
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    {(user?.role === 'admin' || user?.role === 'hr') && (
                      <TableCell>
                        <div className="font-medium">{record.employeeName}</div>
                      </TableCell>
                    )}
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut || '-'}</TableCell>
                    <TableCell>{record.workingHours ? `${record.workingHours}h` : '-'}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}