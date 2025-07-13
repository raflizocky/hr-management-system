'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Calendar, TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartSuggestion } from '@/types';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onApplySuggestion: (suggestion: SmartSuggestion) => void;
}

export function SmartSuggestions({ suggestions, onApplySuggestion }: SmartSuggestionsProps) {
  const { t } = useTranslation();

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return Calendar;
      case 'training':
        return TrendingUp;
      case 'performance':
        return Users;
      case 'schedule':
        return Clock;
      default:
        return Lightbulb;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'leave':
        return 'from-blue-500 to-blue-600';
      case 'training':
        return 'from-green-500 to-green-600';
      case 'performance':
        return 'from-purple-500 to-purple-600';
      case 'schedule':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const mockSuggestions: SmartSuggestion[] = [
    {
      id: '1',
      type: 'leave',
      title: 'Optimal Leave Dates',
      description: 'Based on your workload and team availability, consider taking leave on March 15-19',
      confidence: 92,
      data: {
        suggestedDates: ['2024-03-15', '2024-03-16', '2024-03-17', '2024-03-18', '2024-03-19'],
        reason: 'Low project activity and good team coverage'
      }
    },
    {
      id: '2',
      type: 'training',
      title: 'Skill Development Opportunity',
      description: 'Consider enrolling in React Advanced Patterns course to enhance your frontend skills',
      confidence: 87,
      data: {
        course: 'React Advanced Patterns',
        provider: 'Tech Academy',
        duration: '4 weeks'
      }
    },
    {
      id: '3',
      type: 'performance',
      title: 'Goal Achievement Insight',
      description: 'You\'re 85% towards your Q1 goals. Focus on project completion to reach 100%',
      confidence: 95,
      data: {
        currentProgress: 85,
        remainingTasks: 3,
        deadline: '2024-03-31'
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          {t('smartSuggestions')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSuggestions.map((suggestion, index) => {
            const Icon = getIcon(suggestion.type);
            const colorClass = getColor(suggestion.type);
            
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.confidence}% confidence
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {suggestion.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="ml-4"
                  >
                    Apply
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}