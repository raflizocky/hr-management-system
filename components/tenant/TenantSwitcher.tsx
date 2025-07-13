'use client';

import { useState } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { Tenant } from '@/types';

const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'TechCorp Solutions',
    domain: 'techcorp.com',
    subdomain: 'techcorp',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    settings: {
      allowGoogleCalendar: true,
      defaultTimezone: 'America/New_York',
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5],
      leaveApprovalWorkflow: 'manager',
      features: {
        surveys: true,
        performance: true,
        onboarding: true,
        shifts: true,
        aiTools: true
      }
    },
    subscription: {
      plan: 'enterprise',
      maxEmployees: 1000,
      features: ['all'],
      expiresAt: '2025-12-31'
    },
    createdAt: '2024-01-01',
    isActive: true
  },
  {
    id: 'tenant-2',
    name: 'StartupXYZ',
    domain: 'startupxyz.com',
    subdomain: 'startupxyz',
    primaryColor: '#8B5CF6',
    secondaryColor: '#F59E0B',
    settings: {
      allowGoogleCalendar: false,
      defaultTimezone: 'America/Los_Angeles',
      workingHours: { start: '10:00', end: '18:00' },
      workingDays: [1, 2, 3, 4, 5],
      leaveApprovalWorkflow: 'hr',
      features: {
        surveys: true,
        performance: false,
        onboarding: true,
        shifts: false,
        aiTools: false
      }
    },
    subscription: {
      plan: 'professional',
      maxEmployees: 100,
      features: ['basic', 'surveys', 'onboarding'],
      expiresAt: '2025-06-30'
    },
    createdAt: '2024-03-15',
    isActive: true
  }
];

export function TenantSwitcher() {
  const { tenant, switchTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  const handleTenantSwitch = async (tenantId: string) => {
    await switchTenant(tenantId);
    setIsOpen(false);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'starter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!tenant) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between p-3 h-auto"
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-6 h-6 rounded" />
            ) : (
              <Building2 className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">{tenant.name}</p>
            <p className="text-xs text-gray-500 capitalize">{tenant.subscription.plan}</p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <Card className="shadow-lg">
            <CardContent className="p-2">
              <div className="space-y-1">
                {mockTenants.map((t) => (
                  <Button
                    key={t.id}
                    variant="ghost"
                    onClick={() => handleTenantSwitch(t.id)}
                    className="w-full justify-start p-3 h-auto"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: t.primaryColor }}
                      >
                        {t.logo ? (
                          <img src={t.logo} alt={t.name} className="w-6 h-6 rounded" />
                        ) : (
                          <Building2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{t.name}</p>
                          {t.id === tenant.id && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getPlanBadgeColor(t.subscription.plan)}`}
                          >
                            {t.subscription.plan}
                          </Badge>
                          <span className="text-xs text-gray-500">{t.domain}</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}