'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaveRequestList } from '@/components/leave/LeaveRequestList';
import { LeaveRequestForm } from '@/components/leave/LeaveRequestForm';
import { SmartSuggestions } from '@/components/smart-suggestions/SmartSuggestions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { SmartSuggestion } from '@/types';

export default function LeaveRequestsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = () => {
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const handleApplySuggestion = (suggestion: SmartSuggestion) => {
    // Handle applying smart suggestion for leave dates
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-gray-600">
            {user?.role === 'employee' ? 'View and manage your leave requests' : 'Manage employee leave requests'}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {user?.role === 'employee' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SmartSuggestions 
            suggestions={[]} 
            onApplySuggestion={handleApplySuggestion} 
          />
        </motion.div>
      )}

      <LeaveRequestList />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <LeaveRequestForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}