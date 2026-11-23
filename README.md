# 📚 PageTurn — AI-Curated Online E-Bookstore Platform

> **AI Specialist Capstone Project**  
> Built with **IBM BOB Agentic IDE** transforming UI designs and user stories into a production-grade responsive frontend solution.

---

## 🌟 Overview & Key Features

This application implements all 12 customer journey steps and architecture guidelines detailed in the Capstone requirements:

### 1. User Authentication & Profile
- Dynamic Login and Registration modal (`AuthModal.jsx`).
- Real-time display of accumulated **Gift Points (450 pts)**.
- User profile & address management.

### 2. E-Store Home & Catalogue
- **Category Filtering**: Explore by *Technology & AI*, *Fiction & Literature*, *Business & Leadership*, *Sci-Fi & Fantasy*, *Biography & Memoir*, and *Self-Improvement*.
- **Brand / Publisher Selector**: Browse titles by *Penguin Random House*, *O'Reilly Media*, *HarperCollins*, *MIT Press*, *Simon & Schuster*, *Bloomsbury*, etc.
- **Dynamic Search & Price/Rating Sorting**: Live search by title, author, description, or publisher.
- **Tentative Delivery Dates**: Every book card and detail view is tagged with dynamic calculated delivery dates (e.g. *Delivery by Wednesday, Nov 12*).

### 3. Recommendations Engine
- **Order History & Cart-Aware Recommendations**: Intelligently surfaces books matching customer genre preferences and past purchases.

### 4. Interactive Book Details & Related Products
- High-resolution cover, full description, ISBN, stock level, language, and page counts.
- **"Frequently Bought Together & Related Titles"** for direct cross-selection.

### 5. Shopping Basket & Checkout Flow
- Real-time cart drawer with quantity management and free shipping tracker ($35 threshold).
- **Delivery Address Selection**: Select existing address (Home / Work) or add new verified shipping addresses.
- **Multiple Payment Methods**:
  - Credit / Debit Cards (with 256-bit encryption preview)
  - UPI / QR Payments
  - Digital Wallets (Apple Pay, Google Pay)
  - Cash on Delivery (Doorstep)
- **Gift Points Redemption**: Interactive redemption slider allowing users to apply loyalty points for instant cash discounts (100 pts = $10 discount).

### 6. Order Confirmation & Post-Purchase Journey
- **Purchase Confirmation**: Instant order receipt with order number, tentative delivery date, points awarded, and item summary.
- **Order History & "Buy In Again"**: 1-click re-order of previously purchased books directly into the basket.
- **48-Hour Free Order Cancellation**: Active countdown timer for processing orders with instant cancellation and points restoration.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Animations
- **Icons**: Lucide React
- **State & Persistence**: React Context API with LocalStorage synchronization
- **Engineered with**: IBM BOB Agentic IDE

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

### 3. Build for Production
```bash
npm run build
```

---

## 📋 Capstone Requirements Checklist

| Slide / Req # | Feature / Customer Journey | Implementation Status |
|---|---|:---:|
| Slide 5 (1 & 2) | Login Page & User Authentication | ✅ Implemented |
| Slide 5 (3) | Product Catalogue per Category | ✅ Implemented |
| Slide 5 (4) | Order History with "Buy In Again" | ✅ Implemented |
| Slide 5 (5) | Select Product Category | ✅ Implemented |
| Slide 5 (6) | Browse Publisher Brands | ✅ Implemented |
| Slide 5 (7) | Tentative Delivery Dates & Related Products | ✅ Implemented |
| Slide 5 (8) | Add Product(s) to Basket | ✅ Implemented |
| Slide 5 (9) | Delivery Address Selection & Creation | ✅ Implemented |
| Slide 5 (10) | Payment Options & Gift Points Redemption | ✅ Implemented |
| Slide 5 (11) | Payment Confirmation | ✅ Implemented |
| Slide 5 (12) | Purchase Confirmation & 48-hr Cancel | ✅ Implemented |
| Slide 11 | Cart Recommendations based on History | ✅ Implemented |

---

*Made for the AI Specialist Capstone Project.*
