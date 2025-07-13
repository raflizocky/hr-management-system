'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Settings, FolderSync as Sync, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GoogleCalendarService } from '@/lib/google-calendar';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

export function GoogleCalendarIntegration() {
  const { tenant } = useTenant();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    syncLeaves: true,
    syncShifts: true,
    syncMeetings: true,
    syncHolidays: true
  });

  const handleConnect = async () => {
    if (!tenant?.settings.allowGoogleCalendar) {
      alert('Google Calendar integration is not enabled for your organization');
      return;
    }

    setIsConnecting(true);
    try {
      // In production, this would redirect to Google OAuth
      const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&scope=https://www.googleapis.com/auth/calendar&response_type=code&access_type=offline`;
      
      // For demo purposes, simulate connection
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
      }, 2000);
      
      // window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleSyncNow = async () => {
    // Trigger manual sync
    console.log('Syncing calendar events...');
  };

  const updateSyncSetting = (setting: keyof typeof syncSettings, value: boolean) => {
    setSyncSettings(prev => ({ ...prev, [setting]: value }));
  };

  if (!tenant?.settings.allowGoogleCalendar) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Google Calendar Integration</h3>
          <p className="text-gray-600">
            Google Calendar integration is not available for your organization.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Google Calendar Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Connection Status</h4>
                <p className="text-sm text-gray-600">
                  {isConnected ? 'Connected to Google Calendar' : 'Not connected'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleDisconnect}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
                  </Button>
                )}
              </div>
            </div>

            {isConnected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4 border-t"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Sync Settings</h4>
                  <Button variant="outline" size="sm" onClick={handleSyncNow}>
                    <Sync className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-leaves">Sync Leave Requests</Label>
                    <Switch
                      id="sync-leaves"
                      checked={syncSettings.syncLeaves}
                      onCheckedChange={(checked) => updateSyncSetting('syncLeaves', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-shifts">Sync Work Shifts</Label>
                    <Switch
                      id="sync-shifts"
                      checked={syncSettings.syncShifts}
                      onCheckedChange={(checked) => updateSyncSetting('syncShifts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-meetings">Sync Meetings</Label>
                    <Switch
                      id="sync-meetings"
                      checked={syncSettings.syncMeetings}
                      onCheckedChange={(checked) => updateSyncSetting('syncMeetings', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-holidays">Sync Company Holidays</Label>
                    <Switch
                      id="sync-holidays"
                      checked={syncSettings.syncHolidays}
                      onCheckedChange={(checked) => updateSyncSetting('syncHolidays', checked)}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h5 className="font-medium text-blue-900">Sync Information</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        Events will be automatically synced to your Google Calendar. 
                        Changes made in Google Calendar will not sync back to the HRMS.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}