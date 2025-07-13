import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const activities = [
  {
    id: 1,
    user: 'Sarah Wilson',
    action: 'submitted a leave request',
    time: '2 hours ago',
    type: 'leave',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: 2,
    user: 'Mike Johnson',
    action: 'checked in',
    time: '3 hours ago',
    type: 'attendance',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: 3,
    user: 'David Chen',
    action: 'updated profile',
    time: '5 hours ago',
    type: 'profile',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: 4,
    user: 'Admin',
    action: 'approved leave request',
    time: '1 day ago',
    type: 'approval',
    avatar: null
  }
];

const typeColors = {
  leave: 'bg-blue-100 text-blue-800',
  attendance: 'bg-green-100 text-green-800',
  profile: 'bg-purple-100 text-purple-800',
  approval: 'bg-orange-100 text-orange-800'
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || undefined} />
                <AvatarFallback>
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge variant="secondary" className={typeColors[activity.type as keyof typeof typeColors]}>
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}