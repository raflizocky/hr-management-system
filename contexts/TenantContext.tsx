'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant } from '@/types';
import { TenantService } from '@/lib/tenant';

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenantSettings: (settings: Partial<Tenant>) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tenantService = TenantService.getInstance();

  useEffect(() => {
    initializeTenant();
  }, []);

  const initializeTenant = async () => {
    try {
      // Get tenant from subdomain or domain
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const tenantData = await tenantService.getTenantByDomain(hostname);
      
      if (tenantData) {
        setTenant(tenantData);
        applyTenantStyling(tenantData);
      } else {
        // Default tenant for development
        const defaultTenant = await tenantService.getTenantByDomain('techcorp.com');
        setTenant(defaultTenant);
        if (defaultTenant) applyTenantStyling(defaultTenant);
      }
    } catch (error) {
      console.error('Failed to initialize tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTenantStyling = (tenantData: Tenant) => {
    if (typeof document === 'undefined') return;

    // Apply tenant-specific CSS variables
    const root = document.documentElement;
    root.style.setProperty('--tenant-primary', tenantData.primaryColor);
    root.style.setProperty('--tenant-secondary', tenantData.secondaryColor);

    // Update favicon and title
    document.title = `${tenantData.name} - HRMS`;
    
    // Apply custom CSS
    const existingStyle = document.getElementById('tenant-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'tenant-styles';
    style.textContent = tenantService.generateTenantCSS(tenantData);
    document.head.appendChild(style);
  };

  const switchTenant = async (tenantId: string) => {
    setIsLoading(true);
    try {
      const newTenant = await tenantService.getTenantById(tenantId);
      if (newTenant) {
        setTenant(newTenant);
        applyTenantStyling(newTenant);
      }
    } catch (error) {
      console.error('Failed to switch tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenantSettings = async (settings: Partial<Tenant>) => {
    if (!tenant) return;

    try {
      const updatedTenant = await tenantService.updateTenant(tenant.id, settings);
      if (updatedTenant) {
        setTenant(updatedTenant);
        applyTenantStyling(updatedTenant);
      }
    } catch (error) {
      console.error('Failed to update tenant settings:', error);
    }
  };

  return (
    <TenantContext.Provider value={{
      tenant,
      isLoading,
      switchTenant,
      updateTenantSettings
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}