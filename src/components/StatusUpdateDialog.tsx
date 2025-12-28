import { MaterialRequestStatus } from '@/types/material-request';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUpdateMaterialRequest } from '@/hooks/useMaterialRequests';
import { CheckCircle, XCircle, Package, AlertTriangle } from 'lucide-react';

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  currentStatus: MaterialRequestStatus;
  newStatus: MaterialRequestStatus;
  materialName: string;
}

const statusInfo: Record<MaterialRequestStatus, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <AlertTriangle className="h-5 w-5" />, color: 'text-warning' },
  approved: { icon: <CheckCircle className="h-5 w-5" />, color: 'text-success' },
  rejected: { icon: <XCircle className="h-5 w-5" />, color: 'text-destructive' },
  fulfilled: { icon: <Package className="h-5 w-5" />, color: 'text-accent' },
};

export function StatusUpdateDialog({
  open,
  onOpenChange,
  requestId,
  currentStatus,
  newStatus,
  materialName,
}: StatusUpdateDialogProps) {
  const updateMutation = useUpdateMaterialRequest();

  const handleConfirm = async () => {
    await updateMutation.mutateAsync({ id: requestId, data: { status: newStatus } });
    onOpenChange(false);
  };

  const info = statusInfo[newStatus];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${info.color}`}>
              {info.icon}
            </div>
            <AlertDialogTitle>Update Status</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Are you sure you want to change the status of <strong>"{materialName}"</strong> from{' '}
            <span className="font-medium capitalize">{currentStatus}</span> to{' '}
            <span className="font-medium capitalize">{newStatus}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Updating...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
