'use client';

import { useState } from 'react';
import { Plus, UserPlus, CheckCircle, Clock, AlertCircle, Eye, Edit } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OnboardingWorkflow, OffboardingWorkflow, OnboardingTask } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingPage() {
  const { user } = useAuth();
  const { 
    onboardingWorkflows, 
    offboardingWorkflows, 
    employees, 
    addOnboardingWorkflow, 
    updateOnboardingWorkflow,
    addOffboardingWorkflow,
    updateOffboardingWorkflow
  } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<OnboardingWorkflow | undefined>();
  const [workflowType, setWorkflowType] = useState<'onboarding' | 'offboarding'>('onboarding');

  const canManageWorkflows = user?.role === 'admin' || user?.role === 'hr';

  if (!canManageWorkflows) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }

  const defaultOnboardingTasks: Omit<OnboardingTask, 'id'>[] = [
    {
      title: 'Complete I-9 Form',
      description: 'Verify employment eligibility',
      category: 'documentation',
      assignedTo: 'HR',
      dueDate: '',
      status: 'pending'
    },
    {
      title: 'Setup Workstation',
      description: 'Prepare desk, computer, and equipment',
      category: 'equipment',
      assignedTo: 'IT',
      dueDate: '',
      status: 'pending'
    },
    {
      title: 'Security Training',
      description: 'Complete mandatory security awareness training',
      category: 'training',
      assignedTo: 'Security',
      dueDate: '',
      status: 'pending'
    },
    {
      title: 'System Access Setup',
      description: 'Create accounts and assign permissions',
      category: 'access',
      assignedTo: 'IT',
      dueDate: '',
      status: 'pending'
    }
  ];

  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    expectedCompletionDate: '',
    tasks: defaultOnboardingTasks.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })) as OnboardingTask[]
  });

  const handleCreateWorkflow = (type: 'onboarding' | 'offboarding') => {
    setWorkflowType(type);
    setSelectedWorkflow(undefined);
    setFormData({
      employeeId: '',
      startDate: '',
      expectedCompletionDate: '',
      tasks: defaultOnboardingTasks.map(task => ({
        ...task,
        id: Date.now().toString() + Math.random(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })) as OnboardingTask[]
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = employees.find(emp => emp.employeeId === formData.employeeId);
    if (!employee) return;

    const workflow = {
      ...formData,
      employeeName: employee.name,
      status: 'not-started' as const,
      progress: 0,
      assignedHR: user?.name || ''
    };

    if (workflowType === 'onboarding') {
      addOnboardingWorkflow(workflow);
    } else {
      addOffboardingWorkflow({
        ...workflow,
        lastWorkingDay: formData.expectedCompletionDate,
        reason: 'resignation' as const,
        exitInterviewCompleted: false
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
      case 'delayed':
        return <Badge className="bg-red-100 text-red-800">Delayed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>;
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const addTask = () => {
    const newTask: OnboardingTask = {
      id: Date.now().toString(),
      title: '',
      description: '',
      category: 'other',
      assignedTo: '',
      dueDate: '',
      status: 'pending'
    };
    setFormData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Lifecycle</h1>
          <p className="text-gray-600">Manage onboarding and offboarding workflows</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleCreateWorkflow('onboarding')}
            className="bg-gradient-to-r from-green-600 to-green-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            New Onboarding
          </Button>
          <Button 
            onClick={() => handleCreateWorkflow('offboarding')}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Offboarding
          </Button>
        </div>
      </div>

      <Tabs defaultValue="onboarding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="offboarding">Offboarding</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Onboarding</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {onboardingWorkflows.filter(w => w.status === 'in-progress').length}
                    </p>
                  </div>
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                      {onboardingWorkflows.filter(w => w.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Delayed</p>
                    <p className="text-3xl font-bold text-red-600">
                      {onboardingWorkflows.filter(w => w.status === 'delayed').length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned HR</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {onboardingWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <div className="font-medium">{workflow.employeeName}</div>
                        </TableCell>
                        <TableCell>{workflow.startDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={workflow.progress} className="w-20" />
                            <span className="text-sm">{workflow.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                        <TableCell>{workflow.assignedHR}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="offboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offboarding Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Last Working Day</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Exit Interview</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offboardingWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <div className="font-medium">{workflow.employeeName}</div>
                        </TableCell>
                        <TableCell>{workflow.lastWorkingDay}</TableCell>
                        <TableCell className="capitalize">{workflow.reason}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={workflow.progress} className="w-20" />
                            <span className="text-sm">{workflow.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                        <TableCell>
                          {workflow.exitInterviewCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="h-12 w-12 mx-auto mb-4" />
                <p>Workflow templates will be displayed here</p>
                <p className="text-sm">Create reusable templates for common onboarding/offboarding scenarios</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workflow Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Create {workflowType === 'onboarding' ? 'Onboarding' : 'Offboarding'} Workflow
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="startDate">
                  {workflowType === 'onboarding' ? 'Start Date' : 'Last Working Day'}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expectedCompletionDate">Expected Completion</Label>
                <Input
                  id="expectedCompletionDate"
                  type="date"
                  value={formData.expectedCompletionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedCompletionDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Tasks Checklist</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <div className="space-y-4">
                {formData.tasks.map((task, index) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Task Title</Label>
                          <Input
                            value={task.title}
                            onChange={(e) => {
                              const newTasks = [...formData.tasks];
                              newTasks[index].title = e.target.value;
                              setFormData(prev => ({ ...prev, tasks: newTasks }));
                            }}
                            placeholder="Enter task title"
                          />
                        </div>
                        <div>
                          <Label>Assigned To</Label>
                          <Input
                            value={task.assignedTo}
                            onChange={(e) => {
                              const newTasks = [...formData.tasks];
                              newTasks[index].assignedTo = e.target.value;
                              setFormData(prev => ({ ...prev, tasks: newTasks }));
                            }}
                            placeholder="Department or person"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select 
                            value={task.category} 
                            onValueChange={(value: any) => {
                              const newTasks = [...formData.tasks];
                              newTasks[index].category = value;
                              setFormData(prev => ({ ...prev, tasks: newTasks }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="documentation">Documentation</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="training">Training</SelectItem>
                              <SelectItem value="access">Access</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) => {
                              const newTasks = [...formData.tasks];
                              newTasks[index].dueDate = e.target.value;
                              setFormData(prev => ({ ...prev, tasks: newTasks }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Description</Label>
                        <Textarea
                          value={task.description}
                          onChange={(e) => {
                            const newTasks = [...formData.tasks];
                            newTasks[index].description = e.target.value;
                            setFormData(prev => ({ ...prev, tasks: newTasks }));
                          }}
                          placeholder="Describe the task"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700">
                Create Workflow
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}