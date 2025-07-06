
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Milk, Stethoscope, Utensils, Heart, Plus, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductionRecords } from '@/hooks/useProductionRecords';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useFeedingRecords } from '@/hooks/useFeedingRecords';
import { useBreedingRecords } from '@/hooks/useBreedingRecords';
import { format } from 'date-fns';

interface GeneralDairyRecordsProps {
  animalId?: string;
}

const GeneralDairyRecords = ({ animalId }: GeneralDairyRecordsProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Fetch all records - pass animalId to hooks
  const { data: productionRecords = [] } = useProductionRecords(animalId);
  const { data: healthRecords = [] } = useHealthRecords(animalId);
  const { data: feedingRecords = [] } = useFeedingRecords(animalId);
  const { data: breedingRecords = [] } = useBreedingRecords(animalId);

  // Filter records by animal if animalId is provided
  const filteredProductionRecords = animalId 
    ? productionRecords.filter(record => record.animal_id === animalId)
    : productionRecords;
  
  const filteredHealthRecords = animalId 
    ? healthRecords.filter(record => record.animal_id === animalId)
    : healthRecords;
  
  const filteredFeedingRecords = animalId 
    ? feedingRecords.filter(record => record.animal_id === animalId)
    : feedingRecords;
  
  const filteredBreedingRecords = animalId 
    ? breedingRecords.filter(record => record.animal_id === animalId)
    : breedingRecords;

  // Combine all records with type information and enhanced details
  const allRecords = [
    ...filteredProductionRecords.map(record => ({
      ...record,
      type: 'production' as const,
      icon: Milk,
      color: 'bg-blue-50 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800',
      title: `Milk Production`,
      subtitle: `Total: ${record.total_yield || 0}L`,
      details: [
        record.am_yield && `AM: ${record.am_yield}L`,
        record.noon_yield && `Noon: ${record.noon_yield}L`, 
        record.pm_yield && `PM: ${record.pm_yield}L`,
        record.price_per_litre && `Price: KSh ${record.price_per_litre}/L`,
        record.use_type && `Use: ${record.use_type}`
      ].filter(Boolean),
      priority: 1
    })),
    ...filteredHealthRecords.map(record => ({
      ...record,
      type: 'health' as const,
      icon: Stethoscope,
      color: 'bg-red-50 border-red-200',
      badgeColor: 'bg-red-100 text-red-800',
      title: record.health_issue || 'Health Record',
      subtitle: record.treatment_given || record.vaccine_dewormer || 'Health checkup',
      details: [
        record.vet_name && `Vet: ${record.vet_name}`,
        record.recovery_status && `Status: ${record.recovery_status}`,
        record.next_appointment && `Next: ${format(new Date(record.next_appointment), 'MMM dd, yyyy')}`,
        record.cost && `Cost: KSh ${Number(record.cost).toLocaleString()}`
      ].filter(Boolean),
      priority: 3
    })),
    ...filteredFeedingRecords.map(record => ({
      ...record,
      type: 'feeding' as const,
      icon: Utensils,
      color: 'bg-green-50 border-green-200',
      badgeColor: 'bg-green-100 text-green-800',
      title: `Feeding - ${record.feed_type}`,
      subtitle: record.quantity ? `${record.quantity}kg` : 'Feed record',
      details: [
        record.source_of_feed && `Source: ${record.source_of_feed}`,
        record.cost && `Cost: KSh ${Number(record.cost).toLocaleString()}`
      ].filter(Boolean),
      priority: 2
    })),
    ...filteredBreedingRecords.map(record => ({
      ...record,
      type: 'breeding' as const,
      icon: Heart,
      color: 'bg-pink-50 border-pink-200',
      badgeColor: 'bg-pink-100 text-pink-800',
      title: 'Breeding Record',
      subtitle: record.conception_status || record.mating_method || 'Breeding activity',
      details: [
        record.bull_ai_source && `Source: ${record.bull_ai_source}`,
        record.conception_status && `Conception: ${record.conception_status}`,
        record.expected_calving_date && `Expected Calving: ${format(new Date(record.expected_calving_date), 'MMM dd, yyyy')}`,
        record.actual_calving_date && `Actual Calving: ${format(new Date(record.actual_calving_date), 'MMM dd, yyyy')}`
      ].filter(Boolean),
      date: record.date_of_heat || record.pregnancy_confirmation_date || record.expected_calving_date || record.actual_calving_date,
      priority: 4
    }))
  ];

  // Sort by date (most recent first), then by priority for same dates
  const sortedRecords = allRecords.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const dateDiff = dateB.getTime() - dateA.getTime();
    
    // If same date, sort by priority (production first, then feeding, health, breeding)
    if (dateDiff === 0) {
      return a.priority - b.priority;
    }
    
    return dateDiff;
  });

  // Apply filters
  const filteredRecords = sortedRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || record.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Group records by date for better timeline view
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const dateKey = format(new Date(record.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);
    return acc;
  }, {} as Record<string, typeof filteredRecords>);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="production">🥛 Production</SelectItem>
                <SelectItem value="health">🩺 Health</SelectItem>
                <SelectItem value="feeding">🌾 Feeding</SelectItem>
                <SelectItem value="breeding">💕 Breeding</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters} size="sm">
              <Filter className="h-4 w-4 mr-1 md:mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      {Object.keys(groupedRecords).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedRecords)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([dateKey, dayRecords]) => (
            <div key={dateKey} className="relative">
              {/* Date Header */}
              <div className="sticky top-0 z-10 bg-gray-50 py-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900">
                    {format(new Date(dateKey), 'EEEE, MMMM dd, yyyy')}
                  </h3>
                  <Badge variant="secondary" className="ml-2">
                    {dayRecords.length} record{dayRecords.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              {/* Records for this date */}
              <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                {dayRecords.map((record, index) => {
                  const Icon = record.icon;
                  return (
                    <Card key={`${record.type}-${record.id}-${index}`} className={record.color}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {record.title}
                              </h4>
                              <Badge className={record.badgeColor}>
                                {record.type}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {record.subtitle}
                            </p>
                            
                            {/* Additional Details */}
                            {record.details && record.details.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {record.details.map((detail, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 bg-white rounded text-xs text-gray-600">
                                    {detail}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Notes */}
                            {'notes' in record && record.notes && (
                              <p className="text-xs text-gray-500 bg-white p-2 rounded border-l-2 border-gray-300">
                                💭 {record.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 md:p-12 text-center">
            <Calendar className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              {allRecords.length === 0 ? 'No records yet' : 'No records found'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {allRecords.length === 0 
                ? 'Start adding production, health, feeding, or breeding records to see them here.'
                : 'Try adjusting your search terms or filters to find the records you\'re looking for.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneralDairyRecords;
