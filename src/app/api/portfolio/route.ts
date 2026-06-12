import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { Redis } from '@upstash/redis';
import { validateCareerInput } from '@/lib/aiGuard';
import { callAI } from '@/lib/ai';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Helper: accept string, null, or undefined for optional text fields
const optionalStr = z.string().optional().nullable();

const portfolioSchema = z.object({
  theme: z.enum(['minimal-dev', 'neo-brutalism', 'glass-dark', 'data-pro', 'soft-warm', 'glass-light', 'emerald-pro']).default('minimal-dev'),
  data: z.object({
    fullName: optionalStr,
    email: optionalStr,
    phone: optionalStr,
    linkedin: optionalStr,
    github: optionalStr,
    targetRole: optionalStr,
    skills: optionalStr,
    education: optionalStr,
    languages: optionalStr,
    experience: optionalStr,
    projects: optionalStr,
    courses: optionalStr,
    achievements: optionalStr,
    hobbies: optionalStr,
    summary: optionalStr,
    profileImage: optionalStr,
    resumeUrl: optionalStr,
  }).optional(),
});

function buildThemePrompt(theme: string): string {
  if (theme === 'soft-warm') return `
THEME: Soft Warm. Use these EXACT styles:
- Background: #FFFBF5 (warm cream) to #FFF1F2 (soft rose) gradient.
- Typography: 'Outfit' or 'Playfair Display' for headings, 'Inter' for body.
- Palette: Primary #f43f5e (rose), Secondary #fb7185, Accent #e11d48.
- Cards: warm soft rose border, white background with very light rose shadow.
- Buttons: Warm rose bg with white text, pill shape, soft glow.
- Styling details: empathetic, elegant, gentle curves, friendly and inviting UI.
`;
  if (theme === 'glass-light') return `
THEME: Modern Glass UI (Light). Use these EXACT styles:
- Background: semi-transparent glassy gradient #F1F5F9 to #E2E8F0.
- Typography: 'Plus Jakarta Sans' for headings and body.
- Palette: Primary #8B5CF6 (violet), Secondary #EC4899 (pink).
- Cards: backdrop-filter: blur(20px), background: rgba(255, 255, 255, 0.4), border: 1px solid rgba(255, 255, 255, 0.6).
- Buttons: gradient bg from violet to pink, no border, rounded-full.
- Styling details: modern glassmorphism, floating cards, subtle purple/pink glows.
`;
  if (theme === 'emerald-pro') return `
THEME: Emerald Success (Professional). Use these EXACT styles:
- Background: #F0FDF4 (mint white) to #F9FBF9 gradient.
- Typography: 'Plus Jakarta Sans' or 'Inter'.
- Palette: Primary #10B981 (emerald), Secondary #059669, Accent #34D399.
- Cards: pure white with emerald border accents.
- Buttons: Emerald green with white text, modern shadow, sharp but professional look.
`;
  if (theme === 'neo-brutalism') return `
THEME: Neo-Brutalism. Use these EXACT styles:
- Background: #FFFBF5 (cream white)
- Primary accent: #FFE500 (yellow)
- Secondary accent: #FF4081 (pink)
- All interactive elements: border: 4px solid black, box-shadow: 4px 4px 0px black
- Headings: font-family: 'Space Grotesk', bold, black
- Cards: white bg, thick black borders, hard offset shadows
- Buttons: yellow bg, black border, "hover:translate-y-[-2px]" effect
- Section dividers: bold black lines
- Profile Photo: Square frame with 4px black border and hard yellow shadow
- Stats Section: Grid with bold numbers, primary yellow bg, black borders
- Icons: Use solid FontAwesome icons only
`;
  if (theme === 'glass-dark') return `
THEME: Modern Glass UI (Dark). Use these EXACT styles:
- Background: deep dark gradient from #0a0a1a to #1a0a2e (dark navy/purple)
- Cards: backdrop-filter: blur(20px), background: rgba(255,255,255,0.05), border: 1px solid rgba(255,255,255,0.1)
- Accent colors: #8B5CF6 (violet), #06B6D4 (cyan), gradient-to-r from-violet-600 to-cyan-400
- Text: white and light gray
- Buttons: gradient bg from violet to cyan, no border, rounded-full
- Skill badges: colored gradient pills with glow effect
- Animations: smooth fade-ins, floating elements
- Icons: use colored/gradient FontAwesome icons
- Profile Photo: Blurred glass circle with glowing cyan/violet ring
- Stats Section: Transparent glass cards with glowing borders
- Give everything a premium, Apple-level dark mode feel
`;
  if (theme === 'data-pro') return `
THEME: Data-Driven Innovator / Creative Technologist (Vishwa Pro). Use these EXACT styles:
- Background: Linear gradient (135deg, #667eea 0%, #764ba2 100%) for hero.
- Typography: 'Poppins' for headings, 'Inter' for body.
- Palette: Primary #1e40af, Secondary #10b981, Accent #f59e0b.
- Layout Features:
  1. Particle.js background on Hero.
  2. Multi-category skills grid with categorized icons.
  3. Timeline with 'dots' and vertical connection lines.
  4. Project cards with overlay hover links (External/GitHub icons).
  5. Statistics cards (e.g. "1000+ Records", "2+ Years").
  6. Dark/Light mode compatible (default to professional light/dark balance).
- Buttons: Rounded (0.5rem), high-contrast gradients, FontAwesome icons.
- Modern elements: Floating badges, interactive skill bars, and smooth AOS-style animations (fade-up).
- FontAwesome 6.4.0 integration for all icons.
`;
  // minimal-dev
  return `
THEME: Minimal Dev Portfolio. Use these EXACT styles:
- Background: pure white (#FFFFFF) and light gray (#F9FAFB) alternating sections
- Typography: 'Inter' font, ultra-clean, generous whitespace
- Accent: black (#000), with subtle gray borders (border-gray-200)
- Cards: white bg, light gray border, subtle box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- Profile Photo: Floating circular frame with subtle drop shadow
- Stats Section: minimalist grid with "Count | Label" pairing
- Buttons: Black bg white text, pill shape (rounded-full), clean hover
- Section layout: centered, max-width: 900px, well-padded
- Skill chips: gray-100 bg, rounded-full, small text
- Clean, editorial typography: large bold headings, regular body copy
- Icons: Use regular/solid FontAwesome (e.g., fa-briefcase, fa-graduation-cap)
`;
}

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const parsed = portfolioSchema.safeParse(body);
    if (!parsed.success) {
      console.error('[Portfolio API] Validation failed:', JSON.stringify(parsed.error.issues, null, 2));
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
    }

    const { theme, data } = parsed.data;

    // Fallback template generator in case AI fails
    const generateFallbackHTML = (userData: any, reqTheme: string) => {
      const name = userData?.fullName || 'Professional';
      const role = userData?.targetRole || 'Developer';
      const skills = userData?.skills || 'HTML, CSS, JavaScript';
      
      const formatUrl = (url: string, domain: string) => {
        if (!url || url === '#') return '#';
        if (url.startsWith('http')) return url;
        if (url.includes(domain)) return `https://${url}`;
        return `https://${domain}${url}`;
      };
      
      const linkedin = formatUrl(userData?.linkedin, 'linkedin.com/in/');
      const github = formatUrl(userData?.github, 'github.com/');
      const resumeUrl = userData?.resumeUrl || '';
      const profileImage = userData?.profileImage || '';
      
      let themeStyles = '';
      switch (reqTheme) {
        case 'neo-brutalism':
          themeStyles = `
            body { background-color: #FFFBF5; color: #000; font-family: 'Space Grotesk', sans-serif; }
            .hero { background: #FFE500; border-bottom: 4px solid black; padding: 5rem 2rem; text-align: center; color: black; box-shadow: 0 8px 0px black; margin-bottom: 3rem; }
            .hero h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: -1px; }
            .hero p { font-size: 1.5rem; font-weight: bold; }
            .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
            .card { background: white; border: 4px solid black; padding: 2.5rem; box-shadow: 6px 6px 0px black; margin-bottom: 3rem; }
            .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: #FF4081; color: white; border: 4px solid black; box-shadow: 4px 4px 0px black; font-weight: bold; text-decoration: none; margin-top: 2rem; transition: transform 0.2s; text-transform: uppercase; }
            .btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px black; }
            .skill-chip { background: #FFE500; border: 2px solid black; padding: 0.5rem 1rem; font-weight: bold; font-size: 1rem; box-shadow: 2px 2px 0px black; display: inline-block; }
            .social-links a { color: black; font-size: 2.5rem; transition: transform 0.2s; }
            .social-links a:hover { transform: scale(1.1) rotate(5deg); }
            .profile-img { width: 180px; height: 180px; border-radius: 0; object-fit: cover; margin: 0 auto 2rem auto; border: 4px solid black; box-shadow: 6px 6px 0px black; background: white; }
          `;
          break;
        case 'glass-dark':
          themeStyles = `
            body { background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%); color: #e2e8f0; font-family: 'Inter', sans-serif; min-height: 100vh; }
            .hero { padding: 6rem 2rem; text-align: center; }
            .hero h1 { font-size: 3.5rem; font-weight: 800; background: linear-gradient(to right, #8B5CF6, #06B6D4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
            .hero p { font-size: 1.25rem; opacity: 0.9; }
            .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
            .card { backdrop-filter: blur(20px); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; padding: 2.5rem; margin-bottom: 2.5rem; color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
            .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; background: linear-gradient(to right, #8B5CF6, #06B6D4); color: white; border-radius: 9999px; font-weight: 600; text-decoration: none; margin-top: 2rem; transition: opacity 0.2s, transform 0.2s; }
            .btn:hover { opacity: 0.9; transform: translateY(-2px); }
            .skill-chip { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); color: #c4b5fd; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.9rem; display: inline-block; }
            .social-links a { color: #06B6D4; font-size: 1.75rem; transition: color 0.2s; }
            .social-links a:hover { color: #8B5CF6; }
            .profile-img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin: 0 auto 2rem auto; border: 2px solid rgba(6, 182, 212, 0.5); padding: 4px; box-shadow: 0 0 30px rgba(139, 92, 246, 0.3); }
          `;
          break;
        case 'glass-light':
          themeStyles = `
            body { background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%); color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; }
            .hero { padding: 6rem 2rem; text-align: center; }
            .hero h1 { font-size: 3.5rem; font-weight: 800; color: #8B5CF6; margin-bottom: 1rem; }
            .hero p { font-size: 1.25rem; color: #64748b; }
            .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
            .card { backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 1.5rem; padding: 2.5rem; margin-bottom: 2.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; border-radius: 9999px; font-weight: 600; text-decoration: none; margin-top: 2rem; transition: transform 0.2s, box-shadow 0.2s; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2); }
            .skill-chip { background: rgba(236, 72, 153, 0.1); color: #db2777; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600; font-size: 0.9rem; display: inline-block; }
            .social-links a { color: #8B5CF6; font-size: 1.75rem; transition: color 0.2s; }
            .social-links a:hover { color: #EC4899; }
            .profile-img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin: 0 auto 2rem auto; border: 4px solid white; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2); }
          `;
          break;
        case 'emerald-pro':
          themeStyles = `
            body { background: linear-gradient(135deg, #F0FDF4 0%, #F9FBF9 100%); color: #064e3b; font-family: 'Inter', sans-serif; }
            .hero { padding: 5rem 2rem; text-align: center; background: #10B981; color: white; border-radius: 0 0 3rem 3rem; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.1); }
            .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; }
            .hero p { font-size: 1.25rem; opacity: 0.9; }
            .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
            .card { background: white; border-left: 6px solid #10B981; border-radius: 0.75rem; padding: 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 2.5rem; }
            .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; background: white; color: #10B981; border-radius: 0.5rem; font-weight: 600; text-decoration: none; margin-top: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
            .skill-chip { background: #d1fae5; color: #047857; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.9rem; display: inline-block; }
            .social-links a { color: white; font-size: 1.75rem; transition: opacity 0.2s; }
            .social-links a:hover { opacity: 0.8; }
            .profile-img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin: 0 auto 2rem auto; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
          `;
          break;
        case 'soft-warm':
          themeStyles = `
            body { background: linear-gradient(135deg, #FFFBF5 0%, #FFF1F2 100%); color: #4c0519; font-family: 'Outfit', sans-serif; }
            .hero { padding: 6rem 2rem; text-align: center; }
            .hero h1 { font-size: 3.5rem; font-weight: 700; color: #e11d48; margin-bottom: 1rem; }
            .hero p { font-size: 1.25rem; color: #881337; opacity: 0.8; }
            .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
            .card { background: white; border: 1px solid #ffe4e6; border-radius: 2rem; padding: 2.5rem; box-shadow: 0 10px 40px rgba(225, 29, 72, 0.05); margin-bottom: 2.5rem; }
            .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; background: #f43f5e; color: white; border-radius: 9999px; font-weight: 600; text-decoration: none; margin-top: 2rem; box-shadow: 0 4px 14px rgba(244, 63, 94, 0.3); transition: transform 0.2s; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(244, 63, 94, 0.4); }
            .skill-chip { background: #ffe4e6; color: #e11d48; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 500; font-size: 0.9rem; display: inline-block; }
            .social-links a { color: #f43f5e; font-size: 1.75rem; transition: transform 0.2s; }
            .social-links a:hover { transform: scale(1.1); }
            .profile-img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin: 0 auto 2rem auto; border: 6px solid white; box-shadow: 0 10px 25px rgba(225, 29, 72, 0.15); }
          `;
          break;
        case 'data-pro':
          themeStyles = `
            body { background-color: #f8fafc; color: #0f172a; font-family: 'Poppins', sans-serif; }
            .hero { background: linear-gradient(135deg, #1e40af 0%, #4338ca 100%); color: white; padding: 6rem 2rem; text-align: center; position: relative; }
            .hero h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; }
            .hero p { font-size: 1.25rem; opacity: 0.9; }
            .container { max-width: 900px; margin: -4rem auto 0; padding: 2rem; position: relative; z-index: 10; }
            .card { background: white; border-radius: 0.75rem; padding: 2.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin-bottom: 2.5rem; border-top: 5px solid #1e40af; }
            .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; background: #f59e0b; color: white; border-radius: 0.5rem; font-weight: 600; text-decoration: none; margin-top: 2rem; transition: background 0.2s; }
            .btn:hover { background: #d97706; }
            .skill-chip { background: #f1f5f9; color: #334155; padding: 0.5rem 1rem; border-radius: 0.25rem; font-weight: 500; font-size: 0.9rem; border-left: 3px solid #10b981; display: inline-block; }
            .social-links a { color: white; font-size: 1.75rem; transition: color 0.2s; }
            .social-links a:hover { color: #f59e0b; }
            .profile-img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin: 0 auto 2rem auto; border: 4px solid #f59e0b; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
          `;
          break;
        case 'minimal-dev':
        default:
          themeStyles = `
            body { background-color: #F9FAFB; color: #111827; font-family: 'Inter', sans-serif; }
            .hero { background: white; color: black; padding: 6rem 2rem; text-align: center; border-bottom: 1px solid #e5e7eb; }
            .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -1px; }
            .hero p { font-size: 1.25rem; color: #4b5563; }
            .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
            .card { background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 2.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 2.5rem; }
            .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; background: black; color: white; border-radius: 9999px; font-weight: 600; text-decoration: none; margin-top: 2rem; transition: opacity 0.2s; }
            .btn:hover { opacity: 0.8; }
            .skill-chip { background: #f3f4f6; color: #374151; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.9rem; font-weight: 500; display: inline-block; }
            .social-links a { color: black; font-size: 1.75rem; transition: opacity 0.2s; }
            .social-links a:hover { opacity: 0.6; }
            .profile-img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin: 0 auto 2rem auto; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          `;
          break;
      }
      
      let expHtml = '<div class="content-block opacity-90">Detailed experience not provided.</div>';
      if (userData?.experience) {
        expHtml = userData.experience.split('\n').filter(Boolean).map((exp: string) => {
           // Basic formatting for experience block
           return `<div style="margin-bottom: 1.5rem; padding: 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05);">
             <p class="content-block opacity-90">${exp.replace(/:/g, ':<br><strong>').replace(/\] /g, '] </strong>')}</p>
           </div>`;
        }).join('');
      }

      let projHtml = '<div class="content-block opacity-90">Detailed projects not provided.</div>';
      if (userData?.projects) {
        projHtml = userData.projects.split('\n').filter(Boolean).map((proj: string) => {
           const linkMatch = proj.match(/\|\s*Link:\s*(.*?)(?=\s*\||$)/);
           const imgMatch = proj.match(/\|\s*Image:\s*(.*?)(?=\s*\||$)/);
           let link = linkMatch ? linkMatch[1].trim() : '';
           let image = imgMatch ? imgMatch[1].trim() : '';
           
           let titleAndDesc = proj;
           if (linkMatch) titleAndDesc = titleAndDesc.replace(linkMatch[0], '');
           if (imgMatch) titleAndDesc = titleAndDesc.replace(imgMatch[0], '');
           titleAndDesc = titleAndDesc.replace(/\|\s*$/, '').trim();
           
           const colonIndex = titleAndDesc.indexOf(':');
           let title = titleAndDesc;
           let desc = '';
           if (colonIndex > -1) {
             title = titleAndDesc.substring(0, colonIndex).trim();
             desc = titleAndDesc.substring(colonIndex + 1).trim();
           }

           return `
            <div style="margin-bottom: 2rem; padding: 1.5rem; border-radius: 0.75rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); overflow: hidden;">
              ${image && image !== '#' ? `<img src="${image}" alt="${title}" style="width: 100%; height: auto; max-height: 250px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">` : ''}
              <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${title}</h4>
              <p class="content-block opacity-90" style="margin-bottom: 1rem;">${desc}</p>
              ${link && link !== '#' ? `<a href="${link}" target="_blank" style="display: inline-block; padding: 0.5rem 1rem; background: #000; color: #fff; text-decoration: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem;"><i class="fa-brands fa-github"></i> View Project</a>` : ''}
            </div>
           `;
        }).join('');
      }

      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;800&family=Outfit:wght@400;600&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    ${themeStyles}
    .social-links { display: flex; gap: 1.5rem; justify-content: center; margin-top: 2rem; }
    .skills { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
    .content-block { line-height: 1.7; color: inherit; }
  </style>
</head>
<body>
  <div class="hero">
    ${profileImage ? `<img src="${profileImage}" alt="${name}" class="profile-img">` : ''}
    <h1>${name}</h1>
    <p>${role}</p>
    ${resumeUrl && resumeUrl !== '#' ? `<a href="${resumeUrl}" class="btn" target="_blank"><i class="fa-solid fa-download"></i> Download Resume</a>` : ''}
    <div class="social-links">
      ${linkedin && linkedin !== '#' ? `<a href="${linkedin}" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>` : ''}
      ${github && github !== '#' ? `<a href="${github}" target="_blank" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
    </div>
  </div>
  
  <div class="container">
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">About Me</h2>
      <div class="content-block opacity-90">${userData?.summary?.replace(/\n/g, '<br>') || 'I am a passionate professional looking to make an impact in my field.'}</div>
    </div>
    
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">Skills & Expertise</h2>
      <div class="skills">
        ${skills.split(',').filter((s: string) => s.trim()).map((s: string) => `<span class="skill-chip">${s.trim()}</span>`).join('')}
      </div>
    </div>
    
    <div class="card">
      <h2 class="text-2xl font-bold mb-6">Experience & Projects</h2>
      <div class="mb-8">
        <h3 class="text-xl font-bold mb-4 border-b pb-2 opacity-80">Experience</h3>
        ${expHtml}
      </div>
      <div>
        <h3 class="text-xl font-bold mb-4 border-b pb-2 opacity-80">Projects</h3>
        ${projHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
    };

    // 4. Safety Guard
    const combinedInput = `${data?.targetRole || ''} ${data?.summary || ''}`;
    const safety = validateCareerInput(combinedInput);
    if (!safety.allowed) {
      return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });
    }

    const themeStyles = buildThemePrompt(theme);

     const sysPrompt = `
      You are an elite full-stack web designer specializing in high-performance career portfolios.
      TASK: Generate a COMPLETE, SINGLE-FILE HTML portfolio based on the user's career data and the specified theme.
      
      RULES:
      1. RETURN JSON ONLY: { "html": "..." }
      2. The HTML MUST be a complete document (<!DOCTYPE html> through </html>).
      3. Use Tailwind CSS via CDN.
      4. Use FontAwesome 6.4.0 via CDN for icons.
      5. Include smooth AOS animations.
      6. Ensure the design is MOBILE-RESPONSIVE and PREMIUM.
      7. ${themeStyles}
      8. RESUME/CV: If a 'resumeUrl' is provided in the user data, you MUST include a prominent, beautifully styled 'Download CV' or 'View Resume' button/link in the Hero section and optionally in the Header. Design it to perfectly match the theme.
      9. PROJECT IMAGES: For each project in the list: if an 'Image' link is present, render a styled <img> element to display the project screenshot/gif. If no image link is present, display a matching theme-based icon or abstract SVG mockup card.
    `;

    const userPrompt = `
      User Data: ${JSON.stringify(data)}
      Theme requested: ${theme}
      
      Instructions:
      - Create a stunning hero section with their name: ${data?.fullName || 'Professional'}.
      - List their skills: ${data?.skills || 'Expertise'}.
      - Present their experience and projects in a professional timeline/grid.
      - Ensure contact links (LinkedIn: ${data?.linkedin || '#'}, GitHub: ${data?.github || '#'}) are active.
      - If 'resumeUrl' is present: ${data?.resumeUrl ? `Include a button linking to ${data.resumeUrl} to download/view the CV.` : 'Do not add a resume button.'}
    `;

    // 5. Call AI with multi-provider fallback
    try {
      const { content, provider } = await callAI([
        { role: 'system', content: sysPrompt },
        { role: 'user', content: userPrompt }
      ], { 
        jsonMode: true, 
        maxTokens: 4000, 
        temperature: 0.7 
      });

      const rawContent = content.trim();

      // Try clean JSON parse first
      let result: any = null;
      try {
        result = JSON.parse(rawContent);
      } catch {
        // Fallback: extract HTML between the first { "html": "..." } pattern
        const match = rawContent.match(/"html"\s*:\s*"([\s\S]+)"\s*\}/);
        if (match) {
          result = { html: match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\') };
        } else {
          // Second fallback: if it's raw HTML, wrap it
          if (rawContent.trim().startsWith('<!DOCTYPE') || rawContent.trim().startsWith('<html')) {
            result = { html: rawContent };
          } else {
            // THIRD FALLBACK: Global HTML extraction (The "Nuclear" Option)
            const htmlMatch = rawContent.match(/<html[\s\S]*<\/html>/i);
            if (htmlMatch) {
               result = { html: htmlMatch[0] };
            } else {
               console.error('Cannot parse AI response:', rawContent.substring(0, 500));
               return NextResponse.json({ error: 'AI returned malformed content. Please try again.' }, { status: 500 });
            }
          }
        }
      }

      if (!result?.html) {
        return NextResponse.json({ error: 'AI did not return portfolio HTML. Please try again.' }, { status: 500 });
      }

      return NextResponse.json({ ...result, _provider: provider });

    } catch (error: any) {
      console.error('Portfolio AI Exhaustion Details:', error.message || error);
      
      const errMsg = error.message || String(error);
      const isMissingKeys = errMsg.includes('not configured') || errMsg.includes('API key');
      
      // If AI fails (missing keys or rate limited), return a fallback template
      console.warn('[Portfolio API] Returning fallback template due to AI failure.');
      const fallbackHtml = generateFallbackHTML(data, theme);
      
      return NextResponse.json({ 
        html: fallbackHtml,
        _provider: 'fallback',
        warning: isMissingKeys 
          ? 'API Keys are missing. Used fallback template.' 
          : 'AI is overloaded. Used fallback template.'
      });
    }

  } catch (error: any) {
    console.error('Portfolio gen error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
