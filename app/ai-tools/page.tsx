'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Brain, FileText, Users, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeParser } from '@/components/ai/ResumeParser';
import { SmartSuggestions } from '@/components/smart-suggestions/SmartSuggestions';
import { useAuth } from '@/contexts/AuthContext';
import { ResumeData, SmartSuggestion } from '@/types';

export default function AIToolsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const canAccessAITools = user?.role === 'admin' || user?.role === 'hr';

  if (!canAccessAITools) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access AI tools.</p>
      </div>
    );
  }

  const handleResumeDataExtracted = (data: ResumeData) => {
    console.log('Extracted resume data:', data);
    // Handle the extracted data (e.g., pre-fill employee form)
  };

  const handleApplySuggestion = (suggestion: SmartSuggestion) => {
    console.log('Applying suggestion:', suggestion);
    // Handle applying the suggestion
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="h-7 w-7 mr-3 text-purple-600" />
            AI-Powered Tools
          </h1>
          <p className="text-gray-600">Leverage artificial intelligence to streamline HR processes</p>
        </div>
      </motion.div>

      {/* AI Tools Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resumes Processed</p>
                <p className="text-3xl font-bold text-purple-600">47</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suggestions Generated</p>
                <p className="text-3xl font-bold text-blue-600">156</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                <p className="text-3xl font-bold text-green-600">94%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                <p className="text-3xl font-bold text-orange-600">23h</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="resume-parser" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resume-parser">Resume Parser</TabsTrigger>
          <TabsTrigger value="smart-suggestions">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="resume-parser" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ResumeParser onDataExtracted={handleResumeDataExtracted} />
          </motion.div>
        </TabsContent>

        <TabsContent value="smart-suggestions" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SmartSuggestions 
              suggestions={[]} 
              onApplySuggestion={handleApplySuggestion} 
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>AI Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4" />
                  <p>AI-powered analytics and insights will be displayed here</p>
                  <p className="text-sm">Track AI tool performance and ROI</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}