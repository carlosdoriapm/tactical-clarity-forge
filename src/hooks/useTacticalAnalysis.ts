import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TacticalAnalysis {
  positivePattern?: string;
  recurringFailurePattern?: string;
  coreVulnerability?: string;
  strategicDirective?: string;
  insufficientData?: boolean;
  noProfile?: boolean;
}

const fetchTacticalAnalysis = async (userId: string): Promise<TacticalAnalysis> => {
  const { data, error } = await supabase.functions.invoke('tactical-analysis', {
    body: { userId },
  });

  if (error) {
    throw new Error(`Failed to invoke tactical-analysis function: ${error.message}`);
  }

  return data.analysis || {};
};

export const useTacticalAnalysis = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tacticalAnalysis', user?.id],
    queryFn: () => fetchTacticalAnalysis(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    retry: false,
  });
};
