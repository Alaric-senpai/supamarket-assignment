'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { Branch } from '@/lib/types';
import { createBranch, updateBranch } from '@/actions/branches.actions';

const branchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  location: z.string().min(1, 'Location is required'),
  phoneNumber: z.string().optional(),
  isHeadquarter: z.boolean(),
});

export type BranchFormData = z.infer<typeof branchSchema>;

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: Branch | null;
  onSuccess: (branch: Branch) => void;
}

export function BranchDialog({ open, onOpenChange, branch, onSuccess }: BranchDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!branch;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: branch?.name || '',
      location: branch?.location || '',
      phoneNumber: branch?.phoneNumber || '',
      isHeadquarter: branch?.isHeadquarter || false,
    },
  });

  const onSubmit = async (data: BranchFormData) => {
    setIsLoading(true);
    try {
      let result: Branch;
      if (isEdit && branch) {
        result = await updateBranch(branch.$id, {
          name: data.name,
          location: data.location,
          phoneNumber: data.phoneNumber,
          isHeadquarter: data.isHeadquarter,
        });
      } else {
        result = await createBranch({
          name: data.name,
          location: data.location,
          phoneNumber: data.phoneNumber,
          isHeadquarter: data.isHeadquarter,
        });
      }

      toast.success(`Branch ${isEdit ? 'updated' : 'created'} successfully`);

      onSuccess(result);
      reset();
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} branch`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Branch' : 'Create New Branch'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update branch information'
              : 'Add a new branch location to the system'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name</Label>
              <Input
                id="name"
                placeholder="Downtown Branch"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="123 Main St, City"
                {...register('location')}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                placeholder="+254 700 000 000"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHeadquarter"
                checked={watch('isHeadquarter')}
                onCheckedChange={(checked) => setValue('isHeadquarter', !!checked)}
              />
              <Label htmlFor="isHeadquarter" className="text-sm font-normal">
                This is the headquarters
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
