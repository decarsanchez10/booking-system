import re
import sys

filepath = r'c:\Users\Christopher\Booking System\frontend\src\index.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Replace :root
root_new = """
:root {
  /* Colors - Premium Aurora Glassmorphism */
  --bg: #09090e;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-card-hover: rgba(255, 255, 255, 0.06);
  --bg-elevated: rgba(255, 255, 255, 0.04);
  --accent: #8b5cf6;
  --accent-secondary: #06b6d4;
  --accent-glow: rgba(139, 92, 246, 0.45);
  --accent-soft: rgba(139, 92, 246, 0.15);
  --accent-border: rgba(139, 92, 246, 0.35);
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.45);
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);

  /* Theme-aware overlays */
  --overlay-subtle: rgba(255, 255, 255, 0.02);
  --overlay-light: rgba(255, 255, 255, 0.03);
  --overlay-soft: rgba(255, 255, 255, 0.05);
  --overlay-medium: rgba(255, 255, 255, 0.1);
  --grid-line: rgba(255, 255, 255, 0.03);
  --glow-opacity: 0.15;

  /* Typography */
  --font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --section-gap: 120px;
  --container-max: 1200px;
  --radius: 24px;
  --radius-sm: 16px;
  --radius-xs: 10px;

  /* Transitions */
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --duration: 0.4s;
}
"""
css = re.sub(r':root\s*\{[^}]+\}', root_new.strip(), css, count=1, flags=re.DOTALL)

# 2. Replace [data-theme="light"]
light_new = """
[data-theme="light"] {
  --bg: #f8fafc;
  --bg-card: rgba(255, 255, 255, 0.6);
  --bg-card-hover: rgba(255, 255, 255, 0.8);
  --bg-elevated: rgba(255, 255, 255, 0.7);
  --accent: #6d28d9;
  --accent-secondary: #0284c7;
  --accent-glow: rgba(109, 40, 217, 0.2);
  --accent-soft: rgba(109, 40, 217, 0.08);
  --accent-border: rgba(109, 40, 217, 0.2);
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --border: rgba(255, 255, 255, 0.4);
  --border-hover: rgba(255, 255, 255, 0.6);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);

  /* Theme-aware overlays */
  --overlay-subtle: rgba(0, 0, 0, 0.02);
  --overlay-light: rgba(0, 0, 0, 0.03);
  --overlay-soft: rgba(0, 0, 0, 0.04);
  --overlay-medium: rgba(0, 0, 0, 0.06);
  --grid-line: rgba(0, 0, 0, 0.04);
  --glow-opacity: 0.1;
}
"""
css = re.sub(r'\[data-theme="light"\]\s*\{[^}]+\}', light_new.strip(), css, count=1, flags=re.DOTALL)

# 3. Replace body background styling
body_bg_new = """
/* Subtle grid background */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: -2;
}

/* Radial glow 1 */
body::after {
  content: '';
  position: fixed;
  top: -20%;
  left: 10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 60%);
  pointer-events: none;
  z-index: -1;
  filter: blur(120px);
  animation: float 15s ease-in-out infinite alternate;
}

/* Radial glow 2 */
#root::before {
  content: '';
  position: fixed;
  bottom: -20%;
  right: 10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 60%);
  pointer-events: none;
  z-index: -1;
  filter: blur(120px);
  animation: floatReverse 20s ease-in-out infinite alternate;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(5%, 5%) scale(1.1); }
}
@keyframes floatReverse {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-5%, -5%) scale(1.2); }
}
"""

css = re.sub(r'/\* Subtle grid background \*/.*?#root\s*\{', body_bg_new.strip() + '\n\n#root {', css, flags=re.DOTALL)

# 4. Add backdrop filter to card classes
card_classes = ['.feature-card', '.step-card', '.booking-panel', '.specialty-card', '.why-stat', '.testimonial-card', '.card', '.agent-card']
for cls in card_classes:
    css = re.sub(
        r'('+re.escape(cls)+r'\s*\{[^}]*background:\s*var\(--bg-card\);)', 
        r'\1\n  backdrop-filter: blur(24px) saturate(150%);\n  -webkit-backdrop-filter: blur(24px) saturate(150%);\n  box-shadow: var(--glass-shadow);', 
        css
    )

# Navbar backdrop filter is already there, but we can enhance it
css = re.sub(
    r'(\.navbar\.scrolled\s*\{[^}]*backdrop-filter:\s*)blur\([^)]+\)',
    r'\1blur(30px)',
    css
)

css = css.replace('background: #22c55e;', 'background: #10b981;')

# Fix inputs
css = re.sub(
    r'(\.booking-field select,\s*\.booking-field input\s*\{[^}]*background:\s*var\(--bg\);)',
    r'\1\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);',
    css
)
css = css.replace('background: var(--bg);', 'background: rgba(255, 255, 255, 0.02);')
# Restore the actual bg class if we overwrote it mistakenly. Wait, let's only replace in booking-field, or just leave var(--bg) and redefine var(--bg) 

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print('CSS Updated Successfully')
