
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

const generateAnalysisPrompt = (profile: any, failedLogs: any[]) => {
  const logSummaries = failedLogs.map(log => 
    `- Dilema: ${log.dilemma}\n  Decisão: ${log.decision_path}\n  Resultado: ${log.result}`
  ).join('\n\n');

  return `
Você é um Conselheiro de Guerra estoico e analista de inteligência. Sua missão é analisar relatórios de combate (War Logs) de um guerreiro para identificar suas vulnerabilidades centrais. Seja brutalmente honesto, mas estratégico.

**PERFIL DO COMBATENTE:**
- Codinome: ${profile.codename || 'N/A'}
- Missão de 90 dias: ${profile.mission_90_day || 'N/A'}
- Vício Principal: ${profile.vice || 'N/A'}
- Medo Central: ${profile.fear_block || 'N/A'}

**RELATÓRIOS DE FALHA:**
${logSummaries}

**SUA ANÁLISE DE INTELIGÊNCIA:**
Baseado nos relatórios de falha e no perfil do combatente, forneça uma análise tática concisa.
1.  **Padrão de Falha Recorrente:** Identifique o padrão de comportamento ou situacional que mais se repete nas falhas.
2.  **Vulnerabilidade Central Exposta:** Qual é a fraqueza fundamental que esses fracassos revelam? Conecte com o vício ou medo dele, se aplicável.
3.  **Diretiva Estratégica Imediata:** Forneça UMA ação clara e imediata que o combatente deve tomar para mitigar esta vulnerabilidade.

Sua resposta DEVE ser um objeto JSON com as chaves "recurringPattern", "coreVulnerability", e "strategicDirective". Não inclua nenhum outro texto ou formatação.
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!supabaseUrl || !supabaseServiceRoleKey || !openAIApiKey) {
      console.error('Environment variables not set.');
      return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const [profileRes, logsRes] = await Promise.all([
      supabaseClient.from('combatant_profile').select('*').eq('user_id', userId).maybeSingle(),
      supabaseClient.from('war_logs').select('dilemma,decision_path,result').eq('user_id', userId).eq('result', 'Fail')
    ]);

    const { data: profile, error: profileError } = profileRes;
    const { data: failedLogs, error: logsError } = logsRes;

    if (profileError || logsError) {
      console.error('Error fetching data:', profileError || logsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch combatant data.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profile || !profile.profile_complete) {
      return new Response(JSON.stringify({ analysis: { noProfile: true } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!failedLogs || failedLogs.length < 2) {
      return new Response(JSON.stringify({ analysis: { insufficientData: true } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const prompt = generateAnalysisPrompt(profile, failedLogs);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('Error from OpenAI API:', errorData);
      throw new Error(`OpenAI API request failed: ${openAIResponse.statusText}`);
    }

    const responseData = await openAIResponse.json();
    const analysis = JSON.parse(responseData.choices[0].message.content);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in tactical-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
