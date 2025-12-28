import { useState } from 'react';
import { MaterialRequest, MaterialRequestStatus, STATUSES } from '@/types/material-request';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { StatusUpdateDialog } from '@/components/StatusUpdateDialog';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Edit, Trash2, ArrowRightCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteMaterialRequest } from '@/hooks/useMaterialRequests';

interface MaterialRequestTableProps {
  requests: MaterialRequest[];
  isLoading: boolean;
  onEdit: (request: MaterialRequest) => void;
}

export function MaterialRequestTable({ requests, isLoading, onEdit }: MaterialRequestTableProps) {
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    requestId: string;
    currentStatus: MaterialRequestStatus;
    newStatus: MaterialRequestStatus;
    materialName: string;
  } | null>(null);

  const deleteMutation = useDeleteMaterialRequest();

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return '—';
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    return project?.name || '—';
  };

  const handleStatusChange = (request: MaterialRequest, newStatus: MaterialRequestStatus) => {
    if (newStatus === request.status) return;
    setStatusDialog({
      open: true,
      requestId: request.id,
      currentStatus: request.status,
      newStatus,
      materialName: request.material_name,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ArrowRightCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No requests found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new material request to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Material</TableHead>
              <TableHead className="font-semibold">Quantity</TableHead>
              <TableHead className="font-semibold">Project</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Requested By</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="group hover:bg-muted/30">
                <TableCell>
                  <div>
                    <p className="font-medium">{request.material_name}</p>
                    {request.notes && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                        {request.notes}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {request.quantity.toLocaleString()} {request.unit}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {getProjectName(request.project_id)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none">
                        <StatusBadge status={request.status} className="cursor-pointer" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {STATUSES.map((status) => (
                        <DropdownMenuItem
                          key={status.value}
                          onClick={() => handleStatusChange(request, status.value)}
                          disabled={status.value === request.status}
                          className="flex items-center gap-2"
                        >
                          <StatusBadge status={status.value} />
                          {status.value === request.status && (
                            <span className="text-xs text-muted-foreground">(current)</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={request.priority} />
                </TableCell>
                <TableCell className="text-sm">{request.requested_by_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(request.requested_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(request)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(request.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {statusDialog && (
        <StatusUpdateDialog
          open={statusDialog.open}
          onOpenChange={(open) => setStatusDialog(open ? statusDialog : null)}
          requestId={statusDialog.requestId}
          currentStatus={statusDialog.currentStatus}
          newStatus={statusDialog.newStatus}
          materialName={statusDialog.materialName}
        />
      )}
    </>
  );
}
