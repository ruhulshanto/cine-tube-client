# 🎨 Cine-Tube Cinematic Design System

This document outlines the visual standards and component guidelines for the Cine-Tube platform. All future developments should strictly adhere to these rules to maintain a premium, world-class user experience.

---

## 🔴 Core Identity

### **The "Netflix" Palette**
- **Primary**: `#e50914` (Netflix Red). Used for primary CTAs, active states, and branding.
- **Surface**: `#0b0b0b` → `#141414` (Deep Night). We use radial gradients for backgrounds to create a "Theater" atmosphere.
- **Glass**: `bg-black/40` with `backdrop-blur-2xl`. Used for Navbars, Cards, and Sidebars.

### **Typography (Apple Editorial Style)**
- **Headlines**: `font-black`, `tracking-tighter`, `uppercase`.
- **Body**: `font-medium`, `text-zinc-400`.
- **Accents**: `font-black`, `text-[10px]`, `uppercase`, `tracking-widest`.

---

## 🧩 Component Standards

### **1. The Cinematic Card**
- **Border Radius**: `rounded-[2.5rem]`.
- **Material**: `glass-morphism` (Translucent dark background + thick blur).
- **Interactions**:
    - Default: `opacity-90`.
    - Hover: `scale-105`, `shadow-primary/20`, `border-primary/50`.
    - Content: Bottom-up info slides with `duration-500`.

### **2. Premium Inputs**
- **Style**: Floating labels are **mandatory** for major forms.
- **Focus**: Animated focus rings using `ring-[#e50914]`.
- **Material**: Deep dark translucency (`bg-white/5`).

### **3. Navigation**
- **Navbar**: Sticky at `top-0`, `z-[100]`. Must have `backdrop-blur-2xl` for the "Glass" effect over scrolling content.

---

## ⚡ Micro-Interactions

### **Standard Transitions**
- Use `animate-in fade-in duration-1000` for global page entry.
- Use `staggered delays` (75ms, 150ms) for entry of nested elements like cards and list items.

### **Glow Effects**
- Apply `.text-shadow-glow` to major titles.
- Apply `shadow-[0_0_20px_rgba(229,9,20,0.4)]` to active buttons and triggers.

---

> [!TIP]
> When building new components, always wrap them in a **`Card`** or use the **`glass-morphism`** utility class to ensure they belong to the Cine-Tube ecosystem.
