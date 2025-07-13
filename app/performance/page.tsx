'use client';

import { useState } from 'react';
import { Plus, Star, Target, Calendar, TrendingUp, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
import { PerformanceReview, Goal, Competency } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function PerformancePage() {
  const { user } = useAuth();
  const { performanceReviews, employees, addPerformanceReview, updatePerformanceReview } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | undefined>();
  const [activeTab, setActiveTab] = useState('reviews');

  const canManageReviews = user?.role === 'admin' || user?.role === 'hr';

  const [formData, setFormData] = useState({
    employeeId: '',
    reviewPeriod: '',
    dueDate: '',
    goals: [] as Goal[],
    competencies: [] as Competency[],
    feedback: ''
  });

  const filteredReviews = user?.role === 'employee' 
    ? performanceReviews.filter(review => review.employeeId === user.employeeId)
    : performanceReviews;

  const handleCreateReview = () => {
    setSelectedReview(undefined);
    setFormData({
      employeeId: '',
      reviewPeriod: '',
      dueDate: '',
      goals: [],
      competencies: [],
      feedback: ''
    });
    setIsFormOpen(true);
  };

  const handleEditReview = (review: PerformanceReview) => {
    setSelectedReview(review);
    setFormData({
      employeeId: review.employeeId,
      reviewPeriod: review.reviewPeriod,
      dueDate: review.dueDate,
      goals: review.goals,
      competencies: review.competencies,
      feedback: review.feedback
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = employees.find(emp => emp.employeeId === formData.employeeId);
    if (!employee) return;

    if (selectedReview) {
      updatePerformanceReview(selectedReview.id, formData);
    } else {
      addPerformanceReview({
        ...formData,
        employeeName: employee.name,
        reviewerId: user?.id || '',
        reviewerName: user?.name || '',
        status: 'draft',
        overallRating: 0,
        createdDate: new Date().toISOString().split('T')[0]
      });
    }
    
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    }
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: '',
      description: '',
      targetDate: '',
      status: 'not-started',
      progress: 0
    };
    setFormData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };

  const addCompetency = () => {
    const newCompetency: Competency = {
      id: Date.now().toString(),
      name: '',
      description: '',
      rating: 0
    };
    setFormData(prev => ({ ...prev, competencies: [...prev.competencies, newCompetency] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600">
            {user?.role === 'employee' 
              ? 'View your performance reviews and goals' 
              : 'Manage employee performance reviews and goal tracking'
            }
          </p>
        </div>
        {canManageReviews && (
          <Button onClick={handleCreateReview} className="bg-gradient-to-r from-purple-600 to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {canManageReviews && <TableHead>Employee</TableHead>}
                      <TableHead>Review Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Overall Rating</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        {canManageReviews && (
                          <TableCell>
                            <div className="font-medium">{review.employeeName}</div>
                          </TableCell>
                        )}
                        <TableCell>{review.reviewPeriod}</TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {review.overallRating}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{review.dueDate}</TableCell>
                        <TableCell>{review.reviewerName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageReviews && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditReview(review)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.flatMap(review => review.goals).map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    {goal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">{goal.targetDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                    <p className="text-3xl font-bold text-gray-900">4.2</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Goals Completed</p>
                    <p className="text-3xl font-bold text-green-600">85%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reviews Due</p>
                    <p className="text-3xl font-bold text-orange-600">3</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedReview ? 'Edit Performance Review' : 'Create Performance Review'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee</Label>
                <Select value={formData.employeeId} onValueChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.employeeId}>
                        {employee.name} ({employee.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reviewPeriod">Review Period</Label>
                <Input
                  id="reviewPeriod"
                  value={formData.reviewPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewPeriod: e.target.value }))}
                  placeholder="e.g., Q1 2024"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Goals & Objectives</Label>
                <Button type="button" variant="outline" size="sm" onClick={addGoal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
              <div className="space-y-4">
                {formData.goals.map((goal, index) => (
                  <Card key={goal.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Goal Title</Label>
                          <Input
                            value={goal.title}
                            onChange={(e) => {
                              const newGoals = [...formData.goals];
                              newGoals[index].title = e.target.value;
                              setFormData(prev => ({ ...prev, goals: newGoals }));
                            }}
                            placeholder="Enter goal title"
                          />
                        </div>
                        <div>
                          <Label>Target Date</Label>
                          <Input
                            type="date"
                            value={goal.targetDate}
                            onChange={(e) => {
                              const newGoals = [...formData.goals];
                              newGoals[index].targetDate = e.target.value;
                              setFormData(prev => ({ ...prev, goals: newGoals }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Description</Label>
                        <Textarea
                          value={goal.description}
                          onChange={(e) => {
                            const newGoals = [...formData.goals];
                            newGoals[index].description = e.target.value;
                            setFormData(prev => ({ ...prev, goals: newGoals }));
                          }}
                          placeholder="Describe the goal"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="feedback">Overall Feedback</Label>
              <Textarea
                id="feedback"
                value={formData.feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Provide overall feedback for the employee"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-700">
                {selectedReview ? 'Update Review' : 'Create Review'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}