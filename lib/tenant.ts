import { Tenant, TenantSettings, TenantSubscription } from '@/types';

export class TenantService {
  private static instance: TenantService;
  
  static getInstance(): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService();
    }
    return TenantService.instance;
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    // In production, this would query your database
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
        logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
        primaryColor: '#8B5CF6',
        secondaryColor: '#F59E0B',
        settings: {
          allowGoogleCalendar: true,
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

    return mockTenants.find(tenant => 
      tenant.domain === domain || 
      tenant.subdomain === domain.split('.')[0]
    ) || null;
  }

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    // Mock implementation - in production, query database
    const tenant = await this.getTenantByDomain('techcorp.com');
    return tenant?.id === tenantId ? tenant : null;
  }

  async createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> {
    const newTenant: Tenant = {
      ...tenantData,
      id: `tenant-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // In production, save to database
    return newTenant;
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    // In production, update database record
    const tenant = await this.getTenantById(tenantId);
    if (!tenant) return null;

    return { ...tenant, ...updates };
  }

  generateTenantCSS(tenant: Tenant): string {
    return `
      :root {
        --tenant-primary: ${tenant.primaryColor};
        --tenant-secondary: ${tenant.secondaryColor};
        --tenant-primary-rgb: ${this.hexToRgb(tenant.primaryColor)};
        --tenant-secondary-rgb: ${this.hexToRgb(tenant.secondaryColor)};
      }
      
      .tenant-primary { color: var(--tenant-primary); }
      .tenant-secondary { color: var(--tenant-secondary); }
      .tenant-bg-primary { background-color: var(--tenant-primary); }
      .tenant-bg-secondary { background-color: var(--tenant-secondary); }
      .tenant-border-primary { border-color: var(--tenant-primary); }
      
      .tenant-gradient {
        background: linear-gradient(135deg, var(--tenant-primary), var(--tenant-secondary));
      }
    `;
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 0, 0';
    
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ].join(', ');
  }

  async validateTenantAccess(tenantId: string, userId: string): Promise<boolean> {
    // In production, check if user belongs to tenant
    return true; // Mock implementation
  }

  async getTenantFeatures(tenantId: string): Promise<string[]> {
    const tenant = await this.getTenantById(tenantId);
    if (!tenant) return [];

    const baseFeatures = ['dashboard', 'employees', 'attendance', 'leave'];
    const subscriptionFeatures = tenant.subscription.features;
    const enabledFeatures = Object.entries(tenant.settings.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);

    return [...baseFeatures, ...subscriptionFeatures, ...enabledFeatures];
  }
}