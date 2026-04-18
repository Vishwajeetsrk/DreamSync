# DreamSync Design Systems Handbook (UI/UX)

## 1. The Design DNA: Neobrutalism
The platform uses **Neobrutalism**, a modern evolution of the brutalist style. It prioritizes clarity, raw utility, and high-contrast visuals to ensure accessibility for students on budget devices.

- **Psychological Goal**: Trust through transparency, boldness through thick lines, and clarity through hierarchy.

## 2. Core Color Palette
| Color | Hex | Usage |
| :--- | :--- | :--- |
| **Primary Black** | `#000000` | Borders, Main Text, Container Backgrounds |
| **Pure White** | `#FFFFFF` | Main Background, Card Backgrounds |
| **Trust Blue** | `#2563EB` | Call-to-Action Buttons, Active States, Success |
| **Warning Yellow** | `#FACC15` | Section Accents, Tool Highlights, Workshops |
| **Fresh Teal** | `#14B8A6` | Positive Highlights, Career Agent Accents |
| **Slate Gray** | `#F1F5F9` | Modern Shadows (Layer 2) |

## 3. Typography Architecture
DreamSync uses a dual-font system to balance "Tech Edge" with "Professionalism."

- **Heading Font**: `Space Grotesk` (or System Black/Bold)
    - *Style*: Black (900), Italic, Uppercase.
    - *Usage*: Page titles, card headers, high-impact slogans.
- **Body Font**: `Inter`
    - *Style*: Medium (500), SemiBold (600).
    - *Usage*: Descriptions, labels, user data.

## 4. Component Blueprints

### The "Signature" Card
- **Border**: `8px solid black`
- **Shadow**: `12px 12px 0px 0px rgba(0,0,0,1)` (Hard Offset)
- **Hover State**: `shadow-[12px_12px_0px_0px_#2563EB]` + `translate-y-[-2px]`
- **Padding**: Large (min 32px) for readability.

### Buttons (The "Power" Button)
- **Container**: `px-12 py-6 bg-black text-white border-4 border-black`
- **Shadow**: `6px 6px 0px 0px #2563EB`
- **Active State**: `translate-x-[2px] translate-y-[2px] shadow-none`

## 5. Mobile-First Optimization
- **Touch Targets**: Min 48px height.
- **Contrast ratio**: Always above 7:1 for text-on-background.
- **Animation**: Subtle Framer Motion `y: 0` to `y: -8` transitions to provide tactile feedback without slowing down performance.

---
*Created by DreamSync UX Team*
