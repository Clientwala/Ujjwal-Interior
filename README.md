# Ujjwal Interior — Web Portal

A premium, high-fidelity single-page website for **Ujjwal Interior**, an interior design and architecture studio based in Saraidhela, Dhanbad, Jharkhand. Established in 2014, Ujjwal Interior delivers high-end residential, commercial, 3D design, and building construction solutions.

This project is built using pure vanilla technologies to ensure optimal performance, seamless animations, and instant loading speeds.

---

## ✦ Key Premium Features

1. **Sticky Glassmorphic Navbar**: Smooth transitions from transparent to solid dark theme on scroll with sliding hover effects and real-time active section tracking via `IntersectionObserver`.
2. **Dynamic 100vh Hero**: Gradient-masked luxury interior background featuring an animated bouncing caret scroll indicator and a bottom stat strip.
3. **Interactive Metric Counter**: Smooth ease-out count-up animation for studio metrics when scrolled into view.
4. **Interactive Portfolio**: Filterable masonry grid of completed project images, wall paintings, blueprints, and 3D architectural mockups with an immersive custom vanilla lightbox (prev/next pageswipe & keyboard navigation).
5. **Video Showcase**: Dual media card layout highlighting architectural walk-through projects with responsive CSS scale animations.
6. **Dynamic Catalogue Accordion**: Smooth-expanding category filter managing a complete listing of 37 detailed services (with tabs for mobile view).
7. **Autoplay Testimonials Carousel**: A touch-swipe responsive client review slider featuring automatic scroll transitions (4s interval), pause-on-hover, and manual arrow navigations.
8. **Enquiry Form Validation**: Intercepts incorrect input formats, displays inline warnings, and generates a pre-formatted WhatsApp message redirecting user selections directly to the design team (`+91-9972815385`).
9. **Fully Responsive Layouts**: Fluid breakpoints tailored perfectly for standard mobile widths (320px+), tablets, and 4K desktop screens.

---

## 📁 Repository Structure

```text
Ujjwal-Interior/
│
├── FRONTEND/                             # Main website application
│   ├── ASSET/                            # High-quality visual assets
│   │   ├── 3D design work/               # Floor plans and 3D visualizations
│   │   ├── catalogue/                    # Wall painting catalogue images
│   │   ├── Customer reviews profile/     # Customer review photos
│   │   └── Previous interior work/       # Completed site photos and portraits
│   │
│   ├── index.html                        # Website structure and content
│   ├── styles.css                        # Premium layout styling rules
│   └── script.js                         # Event handlers and UI scripts
│
├── BACKEND/                              # Placeholder folder for future developments
│   └── .gitkeep                          # Git tracking anchor
│
└── README.md                             # Documentation guide
```

---

## ⚡ How to Run Locally

Since the frontend is built entirely on serverless static technologies, you can open `FRONTEND/index.html` directly in any web browser, or launch a local web server for high-fidelity testing:

### Option A: Node.js (Recommended)
Run the following command in the root directory to spin up a local server:
```bash
npx http-server FRONTEND -p 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

### Option B: Python
Alternatively, start the server using Python:
```bash
python -m http.server -d FRONTEND 8080
```

---

## 🚀 Deploying to Vercel (Step-by-Step)

This project is optimized for direct hosting on **Vercel** via GitHub integration:

1. Push this repository to your GitHub account (accomplished in the steps below).
2. Go to your **[Vercel Dashboard](https://vercel.com/)** and click **"Add New"** > **"Project"**.
3. Import the `Ujjwal-Interior` repository.
4. **CRITICAL STEP**: Under **Project Settings**, change the **Root Directory** to `FRONTEND`.
5. Keep the build settings (Build Command & Output Directory) as default (Vercel automatically detects static HTML/CSS/JS).
6. Click **"Deploy"**. Your site will be online in seconds with free SSL and serverless speed!

---

## 📞 Studio Info & Support

- **Business Name**: Ujjwal Interior
- **Location**: Shop No. 301, Equinox Plaza, Opp. Royal Enfield Showroom, Govindpur Road, Saraidhela, Dhanbad – 828127, Jharkhand
- **WhatsApp/Phone**: +91-9972815385
- **Verified Rating**: 4.9★ (JustDial)
