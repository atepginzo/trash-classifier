# TrashSmart Design System

## 🎨 Design Philosophy

TrashSmart menggunakan design system modern dengan fokus pada:
- **Clean & Professional**: Tampilan bersih tanpa "vibes coding"
- **Eco-Tech Aesthetic**: Kombinasi teknologi dan sustainability
- **Consistent Typography**: Sistem tipografi yang konsisten di semua halaman
- **Modern UI**: Glassmorphism, smooth animations, dan hover effects

## 📐 Typography Scale

### Font Family
- **Primary**: Inter (modern, clean, professional)
- **Fallback**: system-ui, sans-serif

### Size Scale
```css
--font-display: clamp(2rem, 4vw, 3rem);      /* Hero headlines */
--font-h1: clamp(1.5rem, 3vw, 2.25rem);      /* Page titles */
--font-h2: clamp(1.25rem, 2.5vw, 1.75rem);   /* Section headings */
--font-h3: 1.125rem;                          /* Card titles */
--font-body: 1rem;                            /* Body text */
--font-small: 0.875rem;                       /* Labels, captions */
--font-xs: 0.75rem;                           /* Badges, meta */
```

### Line Heights
```css
--leading-tight: 1.2;      /* Headlines */
--leading-normal: 1.6;     /* Headings */
--leading-relaxed: 1.75;   /* Body text */
```

### Usage Guidelines

#### Hero Section
```jsx
<h1 className="hero-headline">
  Kelola Sampah Lebih Cerdas dengan AI
</h1>
```
- Font size: `var(--font-display)`
- Font weight: 800
- Line height: `var(--leading-tight)`
- Letter spacing: -0.02em
- Font variation: `'wdth' 95` (slightly condensed)

#### Page Titles
```jsx
<h1>Hasil Pemindaian</h1>
```
- Font size: `var(--font-h1)`
- Font weight: 700
- Responsive: scales from 1.5rem to 2.25rem

#### Section Headings
```jsx
<h2>Manfaat untuk Organisasi</h2>
```
- Font size: `var(--font-h2)`
- Font weight: 700
- Responsive: scales from 1.25rem to 1.75rem

#### Card Titles
```jsx
<h3>AI Insight — Analisis Sampah</h3>
```
- Font size: `var(--font-h3)` (1.125rem)
- Font weight: 600

#### Body Text
```jsx
<p className="body-text">
  Unggah foto sampah dan dapatkan klasifikasi instan...
</p>
```
- Font size: `var(--font-body)` (1rem)
- Line height: `var(--leading-relaxed)` (1.75)
- Color: `var(--text-secondary)`

#### Badges & Labels
```jsx
<span className="badge">
  Tips Praktis
</span>
```
- Font size: `var(--font-xs)` (0.75rem)
- Font weight: 600
- Letter spacing: 0.06em
- Text transform: uppercase

## 🎨 Color Palette

### Primary Colors
```css
--accent-primary: #059669;    /* Emerald 600 - Primary actions */
--accent-secondary: #047857;  /* Emerald 700 - Hover states */
--accent-tertiary: #F59E0B;   /* Amber 500 - Accents */
```

### Background Colors
```css
--bg-primary: #F8FAFC;        /* Slate 50 - Main background */
--bg-secondary: #F0FDF4;      /* Emerald 50 - Sections */
--bg-tertiary: #FFFFFF;       /* White - Cards */
```

### Text Colors
```css
--text-primary: #0F172A;      /* Slate 900 - Headlines */
--text-secondary: #334155;    /* Slate 700 - Body text */
--text-tertiary: #64748B;     /* Slate 500 - Muted text */
```

### Border Colors
```css
--border-primary: #E2E8F0;    /* Slate 200 - Default borders */
--border-secondary: #CBD5E1;  /* Slate 300 - Hover borders */
```

## 🎭 UI Components

### Glassmorphism
```jsx
<div className="glass">
  <!-- Content with frosted glass effect -->
</div>
```
- Background: `rgba(255, 255, 255, 0.7)`
- Backdrop filter: `blur(12px) saturate(180%)`
- Border: `1px solid rgba(255, 255, 255, 0.3)`

### Card Hover Effect
```jsx
<div className="card-hover">
  <!-- Card with lift effect on hover -->
</div>
```
- Transform: `translateY(-4px)` on hover
- Shadow: Enhanced on hover
- Transition: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Mulai Scan Sampah
</button>
```
- Gradient background: `#059669` to `#10B981`
- Shadow: `0 4px 6px -1px rgb(5 150 105 / 0.3)`
- Hover: Lift effect + enhanced shadow

#### Secondary Button
```jsx
<button className="btn-secondary">
  Cara Kerja
</button>
```
- White background
- Border: `2px solid var(--border-primary)`
- Hover: Background change + lift effect

### Text Gradient
```jsx
<span className="text-gradient">
  Sampah Cerdas
</span>
```
- Gradient: `#059669` → `#10B981` → `#34D399`
- Background clip: text
- Creates vibrant accent text

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

### Touch Targets
- Minimum height: 44px
- Minimum width: 44px
- Adequate spacing between interactive elements

## ✨ Animations

### Smooth Transitions
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects
- Lift: `translateY(-2px)` to `translateY(-4px)`
- Shadow enhancement
- Color transitions

### Loading States
- Pulse animation: `1.5s ease-in-out infinite`
- Spinner: Smooth rotation
- Skeleton loaders: Subtle shimmer

## 🖼️ Image Guidelines

### Hero Images
- High quality, professional photography
- Aspect ratio: 16:9 or 4:3
- Overlay: Gradient for text readability
- Source: Unsplash (eco-friendly, nature, technology themes)

### Card Images
- Consistent aspect ratio across cards
- Border radius: `var(--radius-md)` (12px)
- Hover overlay: Subtle darkening effect

### Icons
- Lucide React icons (consistent style)
- Size: 16px (small), 20px (medium), 24px (large)
- Color: Matches text or accent colors

## 📋 Best Practices

### Do's ✅
- Use consistent spacing (4px, 8px, 12px, 16px, 24px, 32px)
- Apply hover effects to interactive elements
- Use semantic HTML (h1, h2, h3, p, etc.)
- Maintain color contrast for accessibility (WCAG AA)
- Use loading states for async operations
- Add smooth transitions to state changes

### Don'ts ❌
- Don't mix different font families
- Don't use arbitrary font sizes (use scale)
- Don't skip hover states on buttons/links
- Don't use low-quality images
- Don't forget mobile responsiveness
- Don't use too many colors (stick to palette)

## 🎯 Page-Specific Guidelines

### Landing Page
- Hero: Large display font with gradient accents
- Sections: Clear hierarchy with h2 headings
- CTAs: Primary button for main action
- Images: High-quality hero image with overlay

### Upload Page
- Clean, focused interface
- Large upload area with clear instructions
- Live scan: Futuristic laser animation
- Results: Card-based layout with icons

### Result Page
- Grid layout: Image left, insights right
- Bounding box: Label above box, not overlapping
- AI insights: 2x2 grid with equal height cards
- Actions: Pinned to bottom, always visible

### Dashboard/TPS Page
- Map integration: Full-width, interactive
- Filters: Sidebar or top bar
- Cards: Consistent styling with hover effects
- Data visualization: Clean charts and graphs

## 🔧 Implementation Checklist

- [x] Typography system implemented
- [x] Color palette defined
- [x] Component styles created
- [x] Responsive breakpoints set
- [x] Animations added
- [x] Accessibility features
- [x] Loading states
- [x] Hover effects
- [x] Image optimization
- [x] Consistent spacing

## 📚 Resources

- **Font**: [Inter on Google Fonts](https://fonts.google.com/specimen/Inter)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/) (eco, nature, technology)
- **Colors**: [Tailwind CSS Palette](https://tailwindcss.com/docs/customizing-colors)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

**Version**: 1.0.0  
**Last Updated**: May 26, 2026  
**Maintained by**: TrashSmart Team
