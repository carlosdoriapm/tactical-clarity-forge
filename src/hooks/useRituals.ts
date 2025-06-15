
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Ritual = Tables<'rituals'>;
export type NewRitual = TablesInsert<'rituals'>;

const fetchRituals = async (userId: string): Promise<Ritual[]> => {
  const { data, error } = await supabase
    .from('rituals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(error.message);
  return data || [];
};

const createRitual = async (newRitual: NewRitual) => {
  const { data, error } = await supabase
    .from('rituals')
    .insert(newRitual)
    .select()
    .single();
  
  if (error) {
    // Check if RLS is being violated
    if (error.code === '42501') {
      throw new Error("Erro de permissão. Verifique as políticas de segurança (RLS) da tabela 'rituals'.");
    }
    throw new Error(error.message);
  }
  return data;
};

export const useRituals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: rituals, isLoading: isLoadingRituals, error: ritualsError } = useQuery({
    queryKey: ['rituals', user?.id],
    queryFn: () => fetchRituals(user!.id),
    enabled: !!user,
  });

  const { mutate: addRitual, isPending: isCreatingRitual } = useMutation({
    mutationFn: createRitual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rituals', user?.id] });
      toast({
        title: "Ritual Criado",
        description: "Seu novo ritual foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar ritual",
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    rituals,
    isLoadingRituals,
    ritualsError,
    addRitual,
    isCreatingRitual,
  };
};
