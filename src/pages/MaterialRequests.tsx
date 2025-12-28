import { useState } from 'react';
import { MaterialRequest, MaterialRequestStatus, STATUSES } from '@/types/material-request';
import { useMaterialRequests } from '@/hooks/useMaterialRequests';
import { MaterialRequestTable } from '@/components/MaterialRequestTable';
import { MaterialRequestForm } from '@/components/MaterialRequestForm';
import { ExportButton } from '@/components/ExportButton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, HardHat, Filter } from 'lucide-react';

export default function MaterialRequests() {
  const [statusFilter, setStatusFilter] = useState<MaterialRequestStatus | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editRequest, setEditRequest] = useState<MaterialRequest | undefined>();

  const { data: requests = [], isLoading } = useMaterialRequests(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const handleEdit = (request: MaterialRequest) => {
    setEditRequest(request);
    setFormOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditRequest(undefined);
  };

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    urgent: requests.filter(r => r.priority === 'urgent').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-construction">
              <HardHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Material Tracker</h1>
              <p className="text-xs text-muted-foreground">BuildRight Construction</p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-status-pending animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Urgent Items
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-priority-urgent animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-priority-urgent">{stats.urgent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as MaterialRequestStatus | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ExportButton requests={requests} />
        </div>

        {/* Table */}
        <MaterialRequestTable
          requests={requests}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </main>

      {/* Form Dialog */}
      <MaterialRequestForm
        open={formOpen}
        onOpenChange={handleOpenChange}
        editRequest={editRequest}
      />
    </div>
  );
}
