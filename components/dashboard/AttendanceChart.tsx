'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { day: 'Mon', present: 45, absent: 5, late: 3 },
  { day: 'Tue', present: 47, absent: 3, late: 3 },
  { day: 'Wed', present: 46, absent: 4, late: 3 },
  { day: 'Thu', present: 48, absent: 2, late: 3 },
  { day: 'Fri', present: 44, absent: 6, late: 3 },
];

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="present" fill="#10B981" name="Present" />
            <Bar dataKey="late" fill="#F59E0B" name="Late" />
            <Bar dataKey="absent" fill="#EF4444" name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}