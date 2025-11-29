'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { cn } from '@/lib/utils';

export function Step2Dates() {
  const { startDate, endDate, updateField } = useWizardStore();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select your travel dates. You can adjust these later if needed.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-14 w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {startDate ? format(startDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[100] w-auto bg-white p-0 shadow-xl dark:bg-gray-900" align="start">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => {
                  updateField('startDate', date || null);
                  setIsStartOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-14 w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {endDate ? format(endDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[100] w-auto bg-white p-0 shadow-xl dark:bg-gray-900" align="start">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => {
                  updateField('endDate', date || null);
                  setIsEndOpen(false);
                }}
                disabled={(date) => {
                  const minDate = startDate || new Date();
                  return date < minDate;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Trip Duration Display */}
      {startDate && endDate && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-foreground">
            Trip Duration:{' '}
            <span className="text-primary">
              {Math.ceil(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
