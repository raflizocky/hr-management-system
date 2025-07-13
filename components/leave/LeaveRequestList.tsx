'use client';

import { Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LeaveRequest } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export function LeaveRequestList() {
  const { leaveRequests, updateLeaveRequest } = useData();
  const { user } = useAuth();

  const filteredRequests = user?.role === 'employee' 
    ? leaveRequests.filter(req => req.employeeId === user.employeeId)
    : leaveRequests;

  const handleApprove = (id: string) => {
    updateLeaveRequest(id, {
      status: 'approved',
      approvedBy: user?.name,
      approvedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleReject = (id: string) => {
    updateLeaveRequest(id, {
      status: 'rejected',
      approvedBy: user?.name,
      approvedDate: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      vacation: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-purple-100 text-purple-800',
      maternity: 'bg-pink-100 text-pink-800',
      paternity: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              {(user?.role === 'admin' || user?.role === 'hr') && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{request.employeeName}</div>
                    <div className="text-sm text-gray-500">{request.reason}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getTypeColor(request.type)}>
                    {request.type}
                  </Badge>
                </TableCell>
                <TableCell>{request.startDate}</TableCell>
                <TableCell>{request.endDate}</TableCell>
                <TableCell>{request.days}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>{request.appliedDate}</TableCell>
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <TableCell className="text-right">
                    {request.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}