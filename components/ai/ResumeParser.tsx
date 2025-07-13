'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Upload, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResumeData } from '@/types';

interface ResumeParserProps {
  onDataExtracted: (data: ResumeData) => void;
}

export function ResumeParser({ onDataExtracted }: ResumeParserProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate AI processing with progress updates
    const progressSteps = [
      { step: 20, message: 'Reading document...' },
      { step: 40, message: 'Extracting text...' },
      { step: 60, message: 'Analyzing content...' },
      { step: 80, message: 'Structuring data...' },
      { step: 100, message: 'Complete!' }
    ];

    for (const { step, message } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step);
    }

    // Mock extracted data
    const mockData: ResumeData = {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      experience: [
        'Senior Software Engineer at TechCorp (2020-2024)',
        'Full Stack Developer at StartupXYZ (2018-2020)',
        'Junior Developer at WebSolutions (2016-2018)'
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
      education: [
        'Bachelor of Computer Science - University of Technology (2016)',
        'AWS Certified Solutions Architect (2022)'
      ],
      summary: 'Experienced software engineer with 8+ years in full-stack development, specializing in React and Node.js applications.'
    };

    setExtractedData(mockData);
    setIsProcessing(false);
    onDataExtracted(mockData);
  };

  const resetParser = () => {
    setExtractedData(null);
    setProgress(0);
    setIsProcessing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          {t('aiPowered')} {t('resumeParsing')}
        </CardTitle>
        <p className="text-sm text-gray-600">{t('autoExtraction')}</p>
      </CardHeader>
      <CardContent>
        {!extractedData ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Label htmlFor="resume-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-900">Upload Resume</span>
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX files supported</p>
              </Label>
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
                  <span className="text-sm font-medium">AI Processing Resume...</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500">This may take a few moments</p>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-700">Data Extracted Successfully</span>
              </div>
              <Button variant="outline" size="sm" onClick={resetParser}>
                Upload Another
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Personal Information</Label>
                <div className="mt-2 space-y-2">
                  <p><strong>Name:</strong> {extractedData.name}</p>
                  <p><strong>Email:</strong> {extractedData.email}</p>
                  <p><strong>Phone:</strong> {extractedData.phone}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Skills</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {extractedData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Experience</Label>
                <div className="mt-2 space-y-1">
                  {extractedData.experience.map((exp, index) => (
                    <p key={index} className="text-sm text-gray-600">• {exp}</p>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Education</Label>
                <div className="mt-2 space-y-1">
                  {extractedData.education.map((edu, index) => (
                    <p key={index} className="text-sm text-gray-600">• {edu}</p>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Summary</Label>
                <p className="mt-2 text-sm text-gray-600">{extractedData.summary}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Edit Data</Button>
              <Button>Create Employee Profile</Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}