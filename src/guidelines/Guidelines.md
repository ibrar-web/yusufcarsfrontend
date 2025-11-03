# PartsQuote - UK Car Parts Marketplace Design System

## Overview
PartsQuote is a minimal, high-trust car parts quote marketplace for UK drivers. The design emphasizes cleanliness, whitespace, and trust signals.

## Color Palette

### Primary Colors
- **Background**: `#FFFFFF` (white)
- **Ink**: `#0F172A` (slate-900) - primary text
- **Subtle Ink**: `#475569` (slate-600) - secondary text
- **Muted Background**: `#F1F5F9` (slate-100)

### Brand Colors
- **Primary**: `#F02801` (bright orange-red) - links, CTAs, brand elements
- **Primary Hover**: `#D22301` (darker orange-red) - hover state for interactive elements
- **Primary Ink**: `#7F1D1D` (red-900) - darker primary for text on primary bg
- **Success**: `#22C55E` (green)
- **Warning**: `#F59E0B` (amber)
- **Danger**: `#F02801` (bright orange-red)

## Typography
- **Font Family**: 
  - **Headings**: Inter, semibold/bold (H1, H2, H3, H4)
  - **Body Text**: Roboto, regular (paragraphs, labels, buttons, inputs)
- **Display/H1**: 48px, bold (Inter)
- **H2**: 32px, bold (Inter)
- **H3**: 24px, medium (Inter)
- **Body**: 16px, regular (Roboto)
- **Small**: 14px (Roboto)
- **Line Height**: 1.3 for headings, 1.5 for body text

## Layout
- **Max Content Width**: 1200px (desktop)
- **Grid**: 12-column (desktop), 4-column (mobile)
- **Gutter**: 24px
- **Breakpoints**:
  - Desktop: 1440px
  - Tablet: 1024px
  - Mobile: 390px

## Spacing & Styling
- **Border Radius**: 12–16px for cards and containers
- **Shadows**: Very subtle (blur 24px, opacity 8–10%)
- **Iconography**: Simple line icons, 2px stroke, rounded caps

## Components Created
All components use Shadcn/UI as the base with custom styling:

### Custom Components
- **NumberPlateInput**: UK-style number plate input with formatting
- **QuoteCard**: Display supplier quotes in list or grid view
- **SupplierCard**: Show supplier information with ratings
- **Stepper**: Progress indicator for multi-step forms
- **ChatBubble**: Message display with attachments and read receipts

### Pages
1. **Home**: Landing page with number plate lookup
2. **Request Flow**: 3-step wizard to request parts
3. **Quotes**: Browse and compare supplier quotes
4. **Chat**: Message suppliers after accepting quotes
5. **Supplier Profile**: View supplier details, reviews, and policies
6. **Supplier Onboarding**: Multi-step wizard for new suppliers
7. **Supplier Dashboard**: Manage requests, quotes, and settings
8. **Admin Dashboard**: Platform management and analytics
9. **Auth**: Sign in / Sign up with role selection

## Content Guidelines
- Use **British English** throughout
- Currency in **GBP (£)**
- Example registration: **AB12 CDE**
- Sample categories: Engine, Brakes, Suspension, Electrical, Bodywork, Interior

## Accessibility
- **WCAG AA** compliance
- Minimum color contrast ratios met
- Focus states visible (2px primary ring)
- Keyboard navigation supported
- Descriptive labels on all inputs

## Trust & Safety
Emphasize trust signals:
- Verified supplier badges
- GDPR compliance notices
- Secure payment indicators
- Customer reviews and ratings
- Response time metrics

## Design Principles
1. **Minimalism**: More whitespace, simpler layouts
2. **Clarity**: Clear visual hierarchy and scannability
3. **Trust**: Prominent trust signals and verification
4. **Speed**: Fast perceived performance with loading states
5. **Responsiveness**: Mobile-first with tablet/desktop enhancements