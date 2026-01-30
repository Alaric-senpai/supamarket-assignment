'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Check } from 'lucide-react';
import type { Branch } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart-store';

interface BranchSelectorProps {
  branches: Branch[];
}

export function BranchSelector({ branches }: BranchSelectorProps) {
  const router = useRouter();
  const { branchId: selectedBranchId, setBranch } = useCartStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelectBranch = (branch: Branch) => {
    setBranch(branch.$id, branch.name);
    router.push('/dashboard/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Select Your Branch</h1>
        <p className="text-muted-foreground">
          Choose a branch to start shopping
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {branches.map((branch) => {
          const isSelected = selectedBranchId === branch.$id;
          const isHovered = hoveredId === branch.$id;

          return (
            <Card
              key={branch.$id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-primary shadow-lg'
                  : isHovered
                  ? 'shadow-md'
                  : ''
              }`}
              onClick={() => handleSelectBranch(branch)}
              onMouseEnter={() => setHoveredId(branch.$id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{branch.name}</CardTitle>
                  {isSelected && (
                    <Badge variant="default" className="ml-2">
                      <Check className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                  {branch.isHeadquarter && !isSelected && (
                    <Badge variant="secondary">HQ</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {branch.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {branch.location}
                  </div>
                )}
                {branch.phoneNumber && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    {branch.phoneNumber}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
