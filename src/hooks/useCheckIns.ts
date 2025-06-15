
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import type { Json } from '@/integrations/supabase/types';

export type CheckIn = {
  id: string;
  user_id: string;
  mission_id: string;
  payload?: Json | null;
  created_at: string;
};

export type NewCheckIn = Omit<CheckIn, 'id' | 'created_at'>;

const fetchCheckIns = async (userId: string, missionId: string): Promise<CheckIn[]> => {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
};

const createCheckIn = async (newCheckIn: NewCheckIn): Promise<CheckIn> => {
  const { data, error } = await supabase
    .from('check_ins')
    .insert([newCheckIn])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useCheckIns = (missionId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: checkIns, isLoading, error } = useQuery({
    queryKey: ['check_ins', user?.id, missionId],
    queryFn: () => fetchCheckIns(user!.id, missionId),
    enabled: !!user && !!missionId,
  });

  const { mutate: addCheckIn, isPending: isCreating } = useMutation({
    mutationFn: createCheckIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check_ins', user?.id, missionId] });
      toast({
        title: "Check-in feito",
        description: "Seu progresso desta missão foi registrado.",
      });
    },
    onError: (err) => {
      toast({
        title: "Erro ao registrar check-in",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  return { checkIns, isLoading, error, addCheckIn, isCreating };
};
