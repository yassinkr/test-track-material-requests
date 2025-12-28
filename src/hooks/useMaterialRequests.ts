import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MaterialRequest, 
  CreateMaterialRequestInput, 
  MaterialRequestStatus 
} from '@/types/material-request';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const QUERY_KEY = ['material-requests'];

export function useMaterialRequests(filters?: { status?: MaterialRequestStatus }) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: async () => {
      let query = supabase
        .from('material_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MaterialRequest[];
    },
  });
}

export function useMaterialRequest(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_requests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as MaterialRequest;
    },
    enabled: !!id,
  });
}

export function useCreateMaterialRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateMaterialRequestInput) => {
      const { data, error } = await supabase
        .from('material_requests')
        .insert({
          ...input,
          status: 'pending',
          requested_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as MaterialRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: 'Request Created',
        description: 'Your material request has been submitted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateMaterialRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MaterialRequest> }) => {
      const { data: updated, error } = await supabase
        .from('material_requests')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updated as MaterialRequest;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: 'Request Updated',
        description: `Status changed to ${data.status}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteMaterialRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('material_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: 'Request Deleted',
        description: 'The material request has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}