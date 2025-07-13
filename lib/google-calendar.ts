import { google } from 'googleapis';
import { CalendarEvent, GoogleCalendarIntegration } from '@/types';

const calendar = google.calendar('v3');

export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  
  static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  async authenticateUser(tenantId: string, employeeId: string, authCode: string) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const { tokens } = await oauth2Client.getToken(authCode);
      oauth2Client.setCredentials(tokens);

      // Store tokens securely (in production, use encrypted database)
      const integration: GoogleCalendarIntegration = {
        id: Date.now().toString(),
        tenantId,
        employeeId,
        googleCalendarId: 'primary',
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        isEnabled: true,
        syncSettings: {
          syncLeaves: true,
          syncShifts: true,
          syncMeetings: true,
          syncHolidays: true
        }
      };

      return integration;
    } catch (error) {
      console.error('Google Calendar authentication failed:', error);
      throw new Error('Failed to authenticate with Google Calendar');
    }
  }

  async createEvent(integration: GoogleCalendarIntegration, event: CalendarEvent) {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: integration.accessToken,
        refresh_token: integration.refreshToken
      });

      const calendarEvent = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.isAllDay ? undefined : new Date(event.startDate).toISOString(),
          date: event.isAllDay ? event.startDate : undefined,
          timeZone: 'UTC'
        },
        end: {
          dateTime: event.isAllDay ? undefined : new Date(event.endDate).toISOString(),
          date: event.isAllDay ? event.endDate : undefined,
          timeZone: 'UTC'
        },
        location: event.location,
        attendees: event.attendees?.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: event.reminders?.map(reminder => ({
            method: reminder.method,
            minutes: reminder.minutes
          }))
        },
        colorId: this.getEventColor(event.type)
      };

      const response = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: integration.googleCalendarId,
        requestBody: calendarEvent
      });

      return response.data.id;
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
      throw new Error('Failed to sync event to Google Calendar');
    }
  }

  async updateEvent(integration: GoogleCalendarIntegration, event: CalendarEvent) {
    if (!event.googleEventId) return;

    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: integration.accessToken,
        refresh_token: integration.refreshToken
      });

      const calendarEvent = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.isAllDay ? undefined : new Date(event.startDate).toISOString(),
          date: event.isAllDay ? event.startDate : undefined,
          timeZone: 'UTC'
        },
        end: {
          dateTime: event.isAllDay ? undefined : new Date(event.endDate).toISOString(),
          date: event.isAllDay ? event.endDate : undefined,
          timeZone: 'UTC'
        },
        location: event.location,
        colorId: this.getEventColor(event.type)
      };

      await calendar.events.update({
        auth: oauth2Client,
        calendarId: integration.googleCalendarId,
        eventId: event.googleEventId,
        requestBody: calendarEvent
      });
    } catch (error) {
      console.error('Failed to update Google Calendar event:', error);
    }
  }

  async deleteEvent(integration: GoogleCalendarIntegration, googleEventId: string) {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: integration.accessToken,
        refresh_token: integration.refreshToken
      });

      await calendar.events.delete({
        auth: oauth2Client,
        calendarId: integration.googleCalendarId,
        eventId: googleEventId
      });
    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error);
    }
  }

  private getEventColor(type: string): string {
    const colorMap = {
      leave: '2', // Green
      shift: '9', // Blue
      meeting: '5', // Yellow
      training: '6', // Orange
      holiday: '11' // Red
    };
    return colorMap[type as keyof typeof colorMap] || '1';
  }

  async syncLeaveRequest(integration: GoogleCalendarIntegration, leaveRequest: any) {
    if (!integration.syncSettings.syncLeaves) return;

    const event: CalendarEvent = {
      id: `leave-${leaveRequest.id}`,
      tenantId: integration.tenantId,
      employeeId: integration.employeeId,
      title: `${leaveRequest.type.charAt(0).toUpperCase() + leaveRequest.type.slice(1)} Leave`,
      description: `Leave request: ${leaveRequest.reason}`,
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate,
      type: 'leave',
      isAllDay: true,
      status: 'confirmed',
      createdBy: leaveRequest.employeeId,
      createdAt: new Date().toISOString()
    };

    const googleEventId = await this.createEvent(integration, event);
    return googleEventId;
  }

  async syncShift(integration: GoogleCalendarIntegration, shift: any) {
    if (!integration.syncSettings.syncShifts) return;

    const startDateTime = `${shift.date}T${shift.startTime}:00`;
    const endDateTime = `${shift.date}T${shift.endTime}:00`;

    const event: CalendarEvent = {
      id: `shift-${shift.id}`,
      tenantId: integration.tenantId,
      employeeId: integration.employeeId,
      title: `Work Shift: ${shift.title}`,
      description: `Department: ${shift.department}\nLocation: ${shift.location || 'Office'}`,
      startDate: startDateTime,
      endDate: endDateTime,
      type: 'shift',
      isAllDay: false,
      location: shift.location,
      status: 'confirmed',
      createdBy: shift.createdBy,
      createdAt: new Date().toISOString()
    };

    const googleEventId = await this.createEvent(integration, event);
    return googleEventId;
  }
}