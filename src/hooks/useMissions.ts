
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export type Mission = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
};

export type NewMission = Omit<Mission, 'id'>;

const fetchMissions = async (userId: string): Promise<Mission[]> => {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

const createMission = async (newMission: NewMission): Promise<Mission> => {
  const { data, error } = await supabase
    .from('missions')
    .insert([newMission])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useMissions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: missions, isLoading, error } = useQuery({
    queryKey: ['missions', user?.id],
    queryFn: () => fetchMissions(user!.id),
    enabled: !!user,
  });

  const { mutate: addMission, isPending: isCreating } = useMutation({
    mutationFn: createMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions', user?.id] });
      toast({
        title: "Missão Criada",
        description: "Uma nova missão foi adicionada.",
      });
    },
    onError: (err) => {
      toast({
        title: "Erro ao criar missão",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  return { missions, isLoading, error, addMission, isCreating };
};
