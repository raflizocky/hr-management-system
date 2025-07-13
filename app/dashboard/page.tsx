'use client';

import { Users, Building2, Calendar, Clock, TrendingUp, UserCheck, UserX, Timer } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { dashboardStats } = useData();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isHR && (
          <>
            <StatCard
              title="Total Employees"
              value={dashboardStats.totalEmployees}
              icon={Users}
              color="blue"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Departments"
              value={dashboardStats.totalDepartments}
              icon={Building2}
              color="green"
            />
          </>
        )}
        <StatCard
          title="Pending Leaves"
          value={dashboardStats.pendingLeaves}
          icon={Calendar}
          color="yellow"
        />
        <StatCard
          title="Present Today"
          value={dashboardStats.presentToday}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Pending Reviews"
          value={dashboardStats.pendingReviews}
          icon={TrendingUp}
          color="purple"
        />
        {isHR && (
          <>
            <StatCard
              title="Late Today"
              value={dashboardStats.lateToday}
              icon={Timer}
              color="yellow"
            />
            <StatCard
              title="Absent Today"
              value={dashboardStats.absentToday}
              icon={UserX}
              color="red"
            />
            <StatCard
              title="New Hires"
              value={dashboardStats.newHiresThisMonth}
              icon={TrendingUp}
              color="purple"
            />
            <StatCard
              title="Avg. Working Hours"
              value={`${dashboardStats.averageWorkingHours}h`}
              icon={Clock}
              color="blue"
            />
            <StatCard
              title="Active Onboarding"
              value={dashboardStats.activeOnboarding}
              icon={UserCheck}
              color="green"
            />
            <StatCard
              title="Upcoming Shifts"
              value={dashboardStats.upcomingShifts}
              icon={Calendar}
              color="blue"
            />
          </>
        )}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isHR && <AttendanceChart />}
        <RecentActivity />
      </div>
    </div>
  );
}