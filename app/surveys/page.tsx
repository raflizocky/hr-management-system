'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, BarChart3, Users, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Survey, SurveyQuestion } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SurveysPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { surveys = [], addSurvey, employees } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | undefined>();

  const canManageSurveys = user?.role === 'admin' || user?.role === 'hr';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endDate: '',
    isAnonymous: false,
    targetAudience: 'all' as 'all' | 'department' | 'role',
    targetValue: '',
    questions: [] as SurveyQuestion[]
  });

  const handleCreateSurvey = () => {
    setSelectedSurvey(undefined);
    setFormData({
      title: '',
      description: '',
      endDate: '',
      isAnonymous: false,
      targetAudience: 'all',
      targetValue: '',
      questions: []
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const survey = {
      ...formData,
      createdBy: user?.name || '',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'draft' as const,
      responses: []
    };

    addSurvey(survey);
    setIsFormOpen(false);
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type: 'text',
      question: '',
      required: false
    };
    setFormData(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
    }
  };

  const mockSurveys = [
    {
      id: '1',
      title: 'Employee Satisfaction Survey Q1 2024',
      description: 'Quarterly employee satisfaction and engagement survey',
      createdBy: 'HR Team',
      createdDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active' as const,
      isAnonymous: true,
      questions: [],
      responses: [],
      targetAudience: 'all' as const,
      responseRate: 78,
      avgRating: 4.2
    },
    {
      id: '2',
      title: 'Remote Work Feedback',
      description: 'Feedback on remote work policies and tools',
      createdBy: 'Management',
      createdDate: '2024-01-10',
      endDate: '2024-01-31',
      status: 'closed' as const,
      isAnonymous: false,
      questions: [],
      responses: [],
      targetAudience: 'all' as const,
      responseRate: 92,
      avgRating: 3.8
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('surveys')}</h1>
          <p className="text-gray-600">
            {user?.role === 'employee' 
              ? 'Participate in surveys and provide feedback' 
              : 'Create and manage employee surveys and feedback collection'
            }
          </p>
        </div>
        {canManageSurveys && (
          <Button onClick={handleCreateSurvey} className="bg-gradient-to-r from-purple-600 to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            {t('createSurvey')}
          </Button>
        )}
      </motion.div>

      {/* Survey Stats */}
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
                <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                <p className="text-3xl font-bold text-purple-600">3</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-green-600">85%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-3xl font-bold text-yellow-600">4.1</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-3xl font-bold text-blue-600">127</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="surveys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="surveys" className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mockSurveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                      </div>
                      {getStatusBadge(survey.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-medium">{survey.responseRate}%</span>
                      </div>
                      <Progress value={survey.responseRate} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Created by:</span>
                          <p className="font-medium">{survey.createdBy}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">End Date:</span>
                          <p className="font-medium">{survey.endDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium">{survey.avgRating}/5.0</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Results
                          </Button>
                          {user?.role === 'employee' && survey.status === 'active' && (
                            <Button size="sm">
                              Take Survey
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Survey Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p>Survey responses will be displayed here</p>
                <p className="text-sm">View and analyze employee feedback</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Survey Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Advanced analytics and insights will be displayed here</p>
                <p className="text-sm">Track engagement trends and satisfaction metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Survey Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">{t('surveyTitle')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter survey title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">{t('surveyDescription')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose of this survey"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isAnonymous}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked }))}
              />
              <Label>{t('anonymous')}</Label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Survey Questions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Question</Label>
                          <Input
                            value={question.question}
                            onChange={(e) => {
                              const newQuestions = [...formData.questions];
                              newQuestions[index].question = e.target.value;
                              setFormData(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            placeholder="Enter your question"
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select 
                            value={question.type} 
                            onValueChange={(value: any) => {
                              const newQuestions = [...formData.questions];
                              newQuestions[index].type = value;
                              setFormData(prev => ({ ...prev, questions: newQuestions }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="rating">Rating</SelectItem>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="yes-no">Yes/No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <Switch
                          checked={question.required}
                          onCheckedChange={(checked) => {
                            const newQuestions = [...formData.questions];
                            newQuestions[index].required = checked;
                            setFormData(prev => ({ ...prev, questions: newQuestions }));
                          }}
                        />
                        <Label>{t('required')}</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-700">
                Create Survey
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}