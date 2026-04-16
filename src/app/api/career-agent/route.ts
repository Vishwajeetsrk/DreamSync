/**
 * /api/career-agent
 * AI Career Agent — Expert Persona
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { validateCareerInput } from '@/lib/aiGuard';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema),
  context: z.string().optional(),
});

const SYSTEM_PROMPT = `You are "AI Career Agent" — a direct-to-action career guide for DreamSync. 

🎯 TARGET AUDIENCE:
Most users are 12th pass students or early undergraduates. Keep language simple, extremely professional, and zero-fluff.

🚀 MISSION:
Provide DIRECT answers. No long explanations. If asked for a roadmap or job portals, give ONLY the essential data with 1-2 line utility descriptions.

🚨 CORE DIRECTIVES:
1. NO LONG INTROS: Start immediately with the data requested.
2. JOB PORTALS: When suggested, include ONLY relevant portals (LinkedIn, Glassdoor, Naukri, Wellfound). 
3. PORTAL DESCRIPTION: Keep it to 1-2 lines (e.g., "LinkedIn: Professional networking. Needed: Clean profile and 1-week-old job filters.")
4. FRESHNESS: Always emphasize searching for jobs posted within the last 1 week for maximum success.
5. RESUME PROTOCOL: Always end your response by asking: "If you provide your resume, I can guide you specifically on where you would be a top-tier fit."

OUTPUT FORMAT (The "reply" field MUST follow this strict structure):
### PRIMARY ROLE RECOMMENDATION
- Target Role: [Simple Title for 12th Pass/Grads]
- Market Relevance: [1-2 lines on why it's a good start]

### JOB PORTAL REQUISITES
- LinkedIn: [What is it | What you need] (Filter: Past 1 week)
- Naukri: [What is it | What you need] (Filter: Past 1 week)
- Glassdoor: [What is it | What you need]
- Wellfound: [What is it | What you need]

### 90-DAY ACTION PLAN
- [Concise steps for a 12th pass student]

### FINAL GUIDANCE
- [One direct efficiency tip]
- Send me your resume for a custom fit analysis.

STRICT JSON FORMAT: Return ONLY this structure:
{
  "reply": "Markdown following the strict Direct Answer protocol...",
  "roles": [{ "title": "Role", "salary": "Range", "demand": "High", "skills": ["Skill1"] }],
  "roadmapNodes": [],
  "jobLinks": [{ "platform": "LinkedIn", "url": "https://linkedin.com", "label": "Search Jobs" }],
  "quickTips": ["Tip 1"]
}`;

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const lastUserMsg = parsed.data.messages.filter(m => m.role === 'user').pop();
    if (lastUserMsg) {
      const safety = validateCareerInput(lastUserMsg.content);
      if (!safety.allowed) return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });
    }

    const { messages, context = '' } = parsed.data;
    const { content, provider } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      ...(context ? [{ role: 'user' as const, content: `Context: ${context}` }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ], { jsonMode: true });

    return NextResponse.json({ ...parseJSON(content), _provider: provider });
  } catch (error: any) {
    console.error('[career-agent] Error:', error);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting. Try again in a moment!",
      roles: [], roadmapNodes: [], jobLinks: [], quickTips: []
    });
  }
}
