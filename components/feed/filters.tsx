'use client';

import { useState } from 'react';
import type { Alias, Driver, DriverKeyword, Profile, ProfileKeyword, Spokesperson } from '@prisma/client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

type ProfileWithKeywords = Profile & { keywords: ProfileKeyword[] };
type DriverWithKeywords = Driver & { keywords: DriverKeyword[] };
type SpokespersonWithAlias = Spokesperson & { aliases: Alias[] };

type FilterProps = {
  profiles: ProfileWithKeywords[];
  drivers: DriverWithKeywords[];
  spokespeople: SpokespersonWithAlias[];
};

export function FeedFilters({ profiles, drivers, spokespeople }: FilterProps) {
  const [sentimentRange, setSentimentRange] = useState([-1, 1]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl">Filter</CardTitle>
          <CardDescription>Interaktiv filterlogikk kommer i senere iterasjon.</CardDescription>
        </div>
        <span className="text-xs font-medium uppercase text-muted-foreground">Forhåndsvisning</span>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="period">Tidsrom</Label>
            <Select defaultValue="7d" disabled>
              <SelectTrigger id="period">
                <SelectValue placeholder="Velg tidsrom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Siste uke</SelectItem>
                <SelectItem value="30d">Siste måned</SelectItem>
                <SelectItem value="365d">Siste år</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile">Profiler</Label>
            <Select defaultValue="" disabled>
              <SelectTrigger id="profile">
                <SelectValue placeholder="Alle profiler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Alle profiler</SelectItem>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Medium</Label>
            <Input id="source" placeholder="Alle kilder" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spokesperson">Talsperson</Label>
            <Select defaultValue="" disabled>
              <SelectTrigger id="spokesperson">
                <SelectValue placeholder="Alle talspersoner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Alle</SelectItem>
                {spokespeople.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="driver">Driver</Label>
            <Select defaultValue="" disabled>
              <SelectTrigger id="driver">
                <SelectValue placeholder="Alle drivere" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Alle</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sentiment</Label>
            <div className="space-y-3 rounded-lg border border-dashed border-muted p-4">
              <Slider min={-1} max={1} step={0.1} value={sentimentRange} disabled onValueChange={setSentimentRange} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>−1</span>
                <span>0</span>
                <span>+1</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {sentimentRange[0].toFixed(1)} – {sentimentRange[1].toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
