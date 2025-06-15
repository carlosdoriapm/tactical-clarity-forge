
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log('[tactical-analysis] Function starting up.');

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
  console.log(`[tactical-analysis] Received request: ${req.method}`);

  if (req.method === 'OPTIONS') {
    console.log('[tactical-analysis] Handling OPTIONS request.');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[tactical-analysis] Getting environment variables.');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log(`[tactical-analysis] Supabase URL is set: ${!!supabaseUrl}`);

    if (!supabaseUrl || !supabaseServiceRoleKey || !openAIApiKey) {
      console.error('[tactical-analysis] ERROR: Missing environment variables.');
      return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId } = await req.json();
    console.log(`[tactical-analysis] Processing request for userId: ${userId}`);

    if (!userId) {
      console.error('[tactical-analysis] ERROR: userId is required.');
      return new Response(JSON.stringify({ error: 'userId is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[tactical-analysis] Creating Supabase service role client.');
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    console.log('[tactical-analysis] Fetching profile and failed logs from database.');
    const [profileRes, logsRes] = await Promise.all([
      supabaseClient.from('combatant_profile').select('*').eq('user_id', userId).maybeSingle(),
      supabaseClient.from('war_logs').select('dilemma,decision_path,result').eq('user_id', userId).eq('result', 'Fail')
    ]);

    const { data: profile, error: profileError } = profileRes;
    const { data: failedLogs, error: logsError } = logsRes;

    if (profileError || logsError) {
      const dbError = profileError || logsError;
      console.error('[tactical-analysis] ERROR: Failed to fetch data from Supabase.', dbError);
      return new Response(JSON.stringify({ error: 'Failed to fetch combatant data.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[tactical-analysis] Fetched profile: ${!!profile}, Failed logs: ${failedLogs?.length || 0}`);

    if (!profile || !profile.profile_complete) {
      console.log('[tactical-analysis] Profile not found or incomplete. Returning noProfile.');
      return new Response(JSON.stringify({ analysis: { noProfile: true } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!failedLogs || failedLogs.length < 2) {
      console.log(`[tactical-analysis] Insufficient failed logs (${failedLogs?.length || 0}). Returning insufficientData.`);
      return new Response(JSON.stringify({ analysis: { insufficientData: true } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const prompt = generateAnalysisPrompt(profile, failedLogs);
    console.log('[tactical-analysis] Generated prompt for OpenAI.');

    console.log('[tactical-analysis] Calling OpenAI API.');
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

    console.log(`[tactical-analysis] OpenAI response status: ${openAIResponse.status}`);
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('[tactical-analysis] ERROR: OpenAI API request failed.', errorData);
      throw new Error(`OpenAI API request failed: ${openAIResponse.statusText}`);
    }

    const responseData = await openAIResponse.json();
    const analysis = JSON.parse(responseData.choices[0].message.content);
    console.log('[tactical-analysis] Successfully parsed OpenAI analysis.');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[tactical-analysis] FATAL ERROR in function handler:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
