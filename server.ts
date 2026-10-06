import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini on server side with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    kernelVersion: '1.0.0',
    authority: 'deterministic_kernel_sole_authority',
    aiProposalsReady: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Governed intelligence proposal endpoint
// Principle 1: The LLM proposes. The kernel authorizes. Never the other way around.
app.post('/api/propose', async (req, res) => {
  const { objective, roleId, surface, entityId, inputData } = req.body;

  try {
    if (!ai) {
      // Deterministic synthetic proposal when API key is unpopulated
      return res.json({
        proposalId: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        proposingEntityId: entityId || 'ent-planner-01',
        targetSurface: surface || '/v1/ops',
        roleId: roleId || 'role-triage-lead',
        intendedAction: `Execute scheduled workflow for ${objective || 'Default Operation'}`,
        parameters: inputData || { priority: 'normal', mode: 'balanced' },
        estimatedCostUsd: 0.04,
        estimatedLatencyMs: 340,
        claimedAccuracy: 0.98,
        confidence: 0.95,
        rationale: `Synthesized proposal based on objective contract for ${objective || 'Operations'}. Strict kernel authorization required before dispatch.`,
        suggestedRiskTier: 1,
        requiresHumanApproval: false,
        source: 'local_deterministic_synthesizer',
      });
    }

    const prompt = `You are an AI worker within AOS (The Agentic Operating System).
IMPORTANT ARCHITECTURAL RULE: You have ZERO authority to execute. You can ONLY propose an action.
The deterministic AOS Governance Kernel will independently validate schemas, score risk (0-5), check circuit breakers, and enforce oversight (HITL/HOTL/HOFL).

Context:
- Business Surface: ${surface || '/v1/ops'}
- Target Role: ${roleId || 'role-ops-lead'}
- Proposing Entity: ${entityId || 'ent-planner-01'}
- Business Objective: ${objective || 'Process pending item'}
- Input Data: ${JSON.stringify(inputData || {})}

Return a valid JSON object with:
{
  "intendedAction": "Short action descriptor",
  "parameters": { ...key-value parameters for the action... },
  "estimatedCostUsd": number (e.g. 0.02 - 1.50),
  "estimatedLatencyMs": number (e.g. 150 - 1200),
  "claimedAccuracy": number (0.0 to 1.0),
  "confidence": number (0.0 to 1.0),
  "rationale": "One concise paragraph explaining why this action achieves the objective without hallucinations.",
  "suggestedRiskTier": number (0 for read-only, 1 for internal, 2 for low financial, 3 for physical/irreversible, 4 for high financial/SLA, 5 for existential)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      proposalId: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      proposingEntityId: entityId || 'ent-planner-01',
      targetSurface: surface || '/v1/ops',
      roleId: roleId || 'role-triage-lead',
      intendedAction: parsed.intendedAction || 'Process incoming request',
      parameters: parsed.parameters || inputData || {},
      estimatedCostUsd: parsed.estimatedCostUsd ?? 0.05,
      estimatedLatencyMs: parsed.estimatedLatencyMs ?? 420,
      claimedAccuracy: parsed.claimedAccuracy ?? 0.96,
      confidence: parsed.confidence ?? 0.92,
      rationale: parsed.rationale || 'Action proposed by LLM agent runtime under strict kernel isolation.',
      suggestedRiskTier: parsed.suggestedRiskTier ?? 2,
      requiresHumanApproval: (parsed.suggestedRiskTier ?? 2) >= 3,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error generating AI proposal:', error);
    // Fail-safe structured response
    return res.json({
      proposalId: `prop_${Date.now()}_fallback`,
      proposingEntityId: entityId || 'ent-planner-01',
      targetSurface: surface || '/v1/ops',
      roleId: roleId || 'role-triage-lead',
      intendedAction: `Fallback action for: ${objective || 'Scheduled task'}`,
      parameters: inputData || {},
      estimatedCostUsd: 0.01,
      estimatedLatencyMs: 250,
      claimedAccuracy: 0.9,
      confidence: 0.85,
      rationale: 'Deterministic fallback proposal generated due to external runtime constraint.',
      suggestedRiskTier: 1,
      requiresHumanApproval: false,
      source: 'kernel_safe_fallback',
    });
  }
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`AOS Core Server listening on port ${port}`);
  });
}

startServer();
