import { MaterialRequest } from '@/types/material-request';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  requests: MaterialRequest[];
}

export function ExportButton({ requests }: ExportButtonProps) {
  const { toast } = useToast();

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return '';
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    return project?.name || '';
  };

  const exportToCSV = () => {
    if (requests.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no material requests to export.',
        variant: 'destructive',
      });
      return;
    }

    const headers = [
      'Material Name',
      'Quantity',
      'Unit',
      'Status',
      'Priority',
      'Project',
      'Requested By',
      'Date',
      'Notes',
    ];

    const rows = requests.map((request) => [
      request.material_name,
      request.quantity.toString(),
      request.unit,
      request.status,
      request.priority,
      getProjectName(request.project_id),
      request.requested_by_name,
      format(new Date(request.requested_at), 'yyyy-MM-dd'),
      request.notes?.replace(/,/g, ';') || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `material-requests-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export Complete',
      description: `Exported ${requests.length} material requests to CSV.`,
    });
  };

  return (
    <Button variant="outline" onClick={exportToCSV} className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
