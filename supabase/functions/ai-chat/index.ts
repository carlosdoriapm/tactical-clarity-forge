
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GENERIC_SYSTEM_PROMPT = `Você é um conselheiro tático e estoico, inspirado em figuras como Marco Aurélio e Sêneca. Você se comunica com a persona de um "Conselheiro de Guerra" romano. Suas respostas devem ser diretas, sábias e estratégicas, utilizando uma linguagem que evoca a Roma antiga e a filosofia estoica. Você não é apenas um chatbot; você é um mentor que guia com a clareza de César e a determinação de um legionário. Evite respostas genéricas. Seja incisivo e prático.`;

const generatePersonalizedPrompt = (profile: any) => {
  if (!profile || !profile.profile_complete) {
    return GENERIC_SYSTEM_PROMPT;
  }

  const { codename, mission_90_day, vice, fear_block, intensity_mode } = profile;

  let intensityDescription = '';
  switch (intensity_mode) {
    case 'TACTICAL':
      intensityDescription = 'Seja medido e direto em sua orientação. Foque na estratégia e na lógica.';
      break;
    case 'RUTHLESS':
      intensityDescription = 'Seja brutalmente honesto, sem desculpas. Desafie o combatente a enfrentar a dura realidade.';
      break;
    case 'LEGION':
      intensityDescription = 'Adote uma disciplina de comando de campo. Seja extremo, exigente e inspirador como um general no campo de batalha.';
      break;
    default:
      intensityDescription = 'Seja medido e direto em sua orientação.';
  }

  return `Você é um conselheiro tático e estoico, inspirado em figuras como Marco Aurélio e Sêneca. Você se comunica com a persona de um "Conselheiro de Guerra" romano. Suas respostas devem ser diretas, sábias e estratégicas, utilizando uma linguagem que evoca a Roma antiga e a filosofia estoica. Você não é apenas um chatbot; você é um mentor que guia com a clareza de César e a determinação de um legionário. Evite respostas genéricas. Seja incisivo e prático.

Você está aconselhando um combatente com o seguinte perfil:
- Codinome: ${codename || 'Não definido'}
- Missão de 90 dias: ${mission_90_day || 'Não definida'}
- Vício Principal: ${vice || 'Não definido'}
- Medo Central: ${fear_block || 'Não definido'}
- Modo de Intensidade: ${intensity_mode || 'TACTICAL'}. 

Sua instrução de tom é: ${intensityDescription}

Sempre considere este perfil ao responder. Refira-se à missão e aos desafios dele. Guie-o em direção aos seus objetivos com a intensidade escolhida. Sua resposta DEVE ser adaptada a este perfil.`;
};


serve(async (req) => {
  // Trata requisições de pre-flight do CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!message) {
      return new Response(JSON.stringify({ 
        error: 'Message is required.',
        response: 'Fale seus pensamentos claramente, guerreiro.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
        console.error('OPENAI_API_KEY is not set in Supabase secrets.');
        return new Response(JSON.stringify({ 
            error: 'OpenAI API key is not configured.',
            response: 'A sala de guerra está sem seu principal estratega. A chave para o conhecimento arcano (OpenAI API Key) não foi encontrada.',
            success: false,
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
    let systemPrompt = GENERIC_SYSTEM_PROMPT;

    if (userId && supabaseUrl && supabaseServiceRoleKey) {
        try {
            const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
            
            console.log(`Buscando perfil para o usuário: ${userId}`);
            const { data: profile, error: profileError } = await supabaseClient
                .from('combatant_profile')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();
    
            if (profileError) {
                console.error(`Erro ao buscar perfil do combatente para o user_id ${userId}:`, profileError);
                // Continua com o prompt genérico, não é um erro fatal.
            }
            
            if (profile) {
                console.log(`Perfil encontrado para ${userId}:`, profile.codename);
                systemPrompt = generatePersonalizedPrompt(profile);
            } else {
                console.log(`Nenhum perfil de combatente encontrado para ${userId}. Usando prompt genérico.`);
            }
        } catch (e) {
            console.error('Erro ao conectar com Supabase DB ou buscar perfil:', e);
            // Continua com o prompt genérico em caso de falha de conexão.
        }
    }


    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        console.error('Error from OpenAI API:', errorData);
        return new Response(JSON.stringify({ 
            error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
            response: 'O Oráculo está silencioso. Houve uma falha na comunicação com as fontes de sabedoria ancestral.',
            success: false,
        }), {
            status: openAIResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
    const responseData = await openAIResponse.json();
    const aiResponse = responseData.choices[0].message.content;

    const successResponse = {
      response: aiResponse.trim(),
      success: true,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(successResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
        error: error.message,
        response: 'A sala de guerra teve suas comunicações cortadas por uma falha crítica.',
        success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
