'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Users, Clock, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsPage() {
  const { user } = useAuth();
  const { employees, leaveRequests, attendanceRecords, performanceReviews, exportData } = useData();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const canAccessReports = user?.role === 'admin' || user?.role === 'hr';

  if (!canAccessReports) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access reports.</p>
      </div>
    );
  }

  const reportTypes = [
    {
      id: 'employees',
      title: 'Employee Report',
      description: 'Complete employee information and profiles',
      icon: Users,
      color: 'blue',
      count: employees.length
    },
    {
      id: 'leave',
      title: 'Leave Report',
      description: 'Leave requests, approvals, and balances',
      icon: Calendar,
      color: 'green',
      count: leaveRequests.length
    },
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'Daily attendance and working hours',
      icon: Clock,
      color: 'purple',
      count: attendanceRecords.length
    },
    {
      id: 'performance',
      title: 'Performance Report',
      description: 'Performance reviews and ratings',
      icon: TrendingUp,
      color: 'orange',
      count: performanceReviews.length
    }
  ];

  const handleExport = (type: 'employees' | 'leave' | 'attendance', format: 'csv' | 'pdf') => {
    exportData(type, format);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and export comprehensive HR reports</p>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.id} className="transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg border ${getColorClasses(report.color)}`}>
                      <report.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{report.count} records</Badge>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(report.id as any, 'csv')}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(report.id as any, 'pdf')}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Employees</span>
                    <span className="font-semibold">{employees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Employees</span>
                    <span className="font-semibold text-green-600">
                      {employees.filter(emp => emp.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departments</span>
                    <span className="font-semibold">
                      {new Set(employees.map(emp => emp.department)).size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Salary</span>
                    <span className="font-semibold">
                      ${Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Requests</span>
                    <span className="font-semibold">{leaveRequests.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved</span>
                    <span className="font-semibold text-green-600">
                      {leaveRequests.filter(req => req.status === 'approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="font-semibold text-yellow-600">
                      {leaveRequests.filter(req => req.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rejected</span>
                    <span className="font-semibold text-red-600">
                      {leaveRequests.filter(req => req.status === 'rejected').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Records</span>
                    <span className="font-semibold">{attendanceRecords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Present</span>
                    <span className="font-semibold text-green-600">
                      {attendanceRecords.filter(rec => rec.status === 'present').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late</span>
                    <span className="font-semibold text-yellow-600">
                      {attendanceRecords.filter(rec => rec.status === 'late').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Absent</span>
                    <span className="font-semibold text-red-600">
                      {attendanceRecords.filter(rec => rec.status === 'absent').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Reviews</span>
                    <span className="font-semibold">{performanceReviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-semibold text-green-600">
                      {performanceReviews.filter(rev => rev.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span className="font-semibold text-blue-600">
                      {performanceReviews.filter(rev => rev.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Rating</span>
                    <span className="font-semibold">
                      {performanceReviews.length > 0 
                        ? (performanceReviews.reduce((sum, rev) => sum + rev.overallRating, 0) / performanceReviews.length).toFixed(1)
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    employees.reduce((acc, emp) => {
                      acc[emp.department] = (acc[emp.department] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center">
                      <span>{dept}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / employees.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>Advanced analytics charts would be displayed here</p>
                  <p className="text-sm">Integration with charting library recommended</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}