'use client';

import { useState } from 'react';
import { Save, Bell, Shield, Database, Mail, Globe, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { GoogleCalendarIntegration } from '@/components/calendar/GoogleCalendarIntegration';

export default function SettingsPage() {
  const { user } = useAuth();
  const { tenant, updateTenantSettings } = useTenant();
  const [isSaving, setIsSaving] = useState(false);

  const canAccessSettings = user?.role === 'admin' || user?.role === 'hr';

  if (!canAccessSettings) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }

  const [companySettings, setCompanySettings] = useState({
    name: 'HRMS Pro Corporation',
    address: '123 Business Ave, Suite 100, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@hrmspro.com',
    website: 'https://hrmspro.com',
    timezone: 'America/New_York',
    currency: 'USD',
    fiscalYearStart: 'January'
  });

  const [hrSettings, setHrSettings] = useState({
    autoApproveLeaves: false,
    maxLeaveDays: 30,
    probationPeriod: 90,
    workingHoursPerDay: 8,
    workingDaysPerWeek: 5,
    overtimeRate: 1.5,
    allowSelfCheckIn: true,
    requireManagerApproval: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    leaveRequestNotifications: true,
    attendanceAlerts: true,
    systemUpdates: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiry: 90,
    sessionTimeout: 30,
    twoFactorAuth: false,
    loginAttempts: 5,
    auditLogging: true,
    dataRetention: 365
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'System Settings' : 'HR Settings'}
          </h1>
          <p className="text-gray-600">
            {isAdmin 
              ? 'Configure system-wide settings and preferences' 
              : 'Manage HR policies and configurations'
            }
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-blue-700">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue={isAdmin ? "company" : "hr"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {isAdmin && (
            <TabsTrigger value="company" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Company</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="hr" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>HR Policies</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings - Admin Only */}
        {isAdmin && (
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Company Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone">Phone Number</Label>
                    <Input
                      id="companyPhone"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={companySettings.timezone} onValueChange={(value) => setCompanySettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={companySettings.currency} onValueChange={(value) => setCompanySettings(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* HR Settings */}
        <TabsContent value="hr">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-approve leave requests</Label>
                    <p className="text-sm text-gray-500">Automatically approve leave requests under certain conditions</p>
                  </div>
                  <Switch
                    checked={hrSettings.autoApproveLeaves}
                    onCheckedChange={(checked) => setHrSettings(prev => ({ ...prev, autoApproveLeaves: checked }))}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxLeaveDays">Maximum leave days per year</Label>
                    <Input
                      id="maxLeaveDays"
                      type="number"
                      value={hrSettings.maxLeaveDays}
                      onChange={(e) => setHrSettings(prev => ({ ...prev, maxLeaveDays: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="probationPeriod">Probation period (days)</Label>
                    <Input
                      id="probationPeriod"
                      type="number"
                      value={hrSettings.probationPeriod}
                      onChange={(e) => setHrSettings(prev => ({ ...prev, probationPeriod: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="workingHours">Working hours per day</Label>
                    <Input
                      id="workingHours"
                      type="number"
                      value={hrSettings.workingHoursPerDay}
                      onChange={(e) => setHrSettings(prev => ({ ...prev, workingHoursPerDay: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workingDays">Working days per week</Label>
                    <Input
                      id="workingDays"
                      type="number"
                      value={hrSettings.workingDaysPerWeek}
                      onChange={(e) => setHrSettings(prev => ({ ...prev, workingDaysPerWeek: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="overtimeRate">Overtime rate multiplier</Label>
                    <Input
                      id="overtimeRate"
                      type="number"
                      step="0.1"
                      value={hrSettings.overtimeRate}
                      onChange={(e) => setHrSettings(prev => ({ ...prev, overtimeRate: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow self check-in</Label>
                    <p className="text-sm text-gray-500">Employees can check in/out themselves</p>
                  </div>
                  <Switch
                    checked={hrSettings.allowSelfCheckIn}
                    onCheckedChange={(checked) => setHrSettings(prev => ({ ...prev, allowSelfCheckIn: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require manager approval</Label>
                    <p className="text-sm text-gray-500">Manager approval required for attendance modifications</p>
                  </div>
                  <Switch
                    checked={hrSettings.requireManagerApproval}
                    onCheckedChange={(checked) => setHrSettings(prev => ({ ...prev, requireManagerApproval: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Leave request notifications</Label>
                  <p className="text-sm text-gray-500">Get notified about leave requests</p>
                </div>
                <Switch
                  checked={notificationSettings.leaveRequestNotifications}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, leaveRequestNotifications: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Attendance alerts</Label>
                  <p className="text-sm text-gray-500">Alerts for attendance issues</p>
                </div>
                <Switch
                  checked={notificationSettings.attendanceAlerts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, attendanceAlerts: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>System updates</Label>
                  <p className="text-sm text-gray-500">Notifications about system updates</p>
                </div>
                <Switch
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Monthly reports</Label>
                  <p className="text-sm text-gray-500">Receive monthly summary reports</p>
                </div>
                <Switch
                  checked={notificationSettings.monthlyReports}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, monthlyReports: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings - Admin Only */}
        {isAdmin && (
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="passwordExpiry">Password expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loginAttempts">Max login attempts</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataRetention">Data retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={securitySettings.dataRetention}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, dataRetention: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-factor authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all users</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit logging</Label>
                      <p className="text-sm text-gray-500">Log all user activities</p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-party Integrations</CardTitle>
                <p className="text-sm text-gray-600">
                  Connect external services to enhance your HRMS experience
                </p>
              </CardHeader>
              <CardContent>
                <GoogleCalendarIntegration />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}