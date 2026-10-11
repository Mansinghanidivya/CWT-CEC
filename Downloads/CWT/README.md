# SafeVend — Plug-and-Play Security for Micro-Merchants

> **"Affordable e-commerce security, simplified for small businesses."**  
> *Academic CEC Cybersecurity Project Prototype*

---

## 📌 Project Overview

**SafeVend** is a lightweight, zero-configuration cybersecurity prototype designed specifically for micro-merchants, local artisans, and small online businesses operating on modest budgets and third-party templates. 

Enterprise security solutions (Cloudflare Enterprise, Akamai, enterprise WAFs) typically require dedicated security teams, complex reverse proxies, and costly annual licenses ($2,000–$15,000+). SafeVend explores a plug-and-play client-side verification and telemetry layer that defends checkout pipelines against:
- **Price manipulation** (e.g., modifying ₹999 to ₹0.01 via browser dev tools or POST payload intercepts)
- **Form and DOM tampering** (injecting unauthorized hidden fields or altering recipient IDs)
- **Malicious inputs and XSS probes** (`<script>` tags, SQL comment injections)
- **Automated bot velocity bursts** (rapid-fire automated checkout attempts)

---

## 🎯 Sustainable Development Goals (SDGs)

- **Primary:** **SDG 8 — Decent Work & Economic Growth**  
  Shielding micro-enterprises from fraud losses and checkout manipulation preserves local revenue, protects creator livelihoods, and fosters resilient local digital economies.
- **Secondary:** **SDG 12 — Responsible Consumption & Production**  
  Empowering sustainable, handcrafted, and zero-waste creators to sell online with verifiable transaction integrity.

---

## 🛡️ Academic CEC Prototype Notice

> [!NOTE]
> This is an **educational academic cybersecurity prototype**, NOT a real payment processor.
> - All attacks, detections, and security rules are **safely simulated inside browser memory**.
> - No real credit card information is collected, stored, or transmitted (all payment fields are labeled `DEMO`).
> - No malicious code is executed; all input rendering uses safe DOM properties (`textContent`) with zero `eval()`.
> - No external networks or third-party gateways are attacked or targeted.

---

## 📂 Project Architecture

```
/CWT
├── index.html          # SPA markup for all 11 views, modals, & presentation guide
├── css/
│   └── style.css       # Dark navy cybersecurity theme, responsive layouts, SVG charts
├── js/
│   ├── data.js         # Product catalog (CraftNest), research review (2021-2025), roadmap
│   ├── security.js     # SafeVend Security Engine, validators, price integrity, telemetry
│   └── app.js          # SPA hash routing, cart engine, attack simulator, presentation tour
└── README.md           # Project documentation & presentation guide
```

---

## 🚀 Running the Prototype

The prototype uses pure **HTML5, CSS3, and Vanilla JavaScript** with zero external runtime dependencies.

### Option 1: Direct File Open
Double-click `index.html` or open in any modern browser:
```text
file:///path/to/CWT/index.html
```

### Option 2: Local HTTP Server (Optional)
If you have Python or Node installed:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

---

## 🎓 7-Minute College Presentation Demo Script

Follow this step-by-step sequence during your presentation:

1. **Slide / View 1: Introduction (`#home`)**
   - Introduce the problem: Micro-merchants lack cybersecurity teams and cannot afford $10k/yr WAFs.
   - Point out the active SafeVend indicator: `● SafeVend Active` in the header.
2. **Slide / View 2: Local Artisan Storefront (`#store`)**
   - Show **CraftNest** — local creator storefront.
   - Point to the **Handmade Tote Bag** (Catalog Price: **₹999**).
   - Add it to the cart and proceed to checkout.
3. **Slide / View 3: Legitimate Checkout Flow (`#checkout`)**
   - Click **"Verify & Complete Transaction"**.
   - Show the **5-step animated security pipeline**:
     1. Validating inputs...
     2. Checking form integrity...
     3. Verifying product catalog price...
     4. Evaluating bot velocity...
     5. Signing transaction state...
   - Displays `✓ TRANSACTION VERIFIED` with an HMAC cryptographic signature.
4. **Slide / View 4: Attack Simulation — Price Tampering (`#checkout`)**
   - Under the Presenter Panel, click **"🚨 Simulate Price Tampering"**.
   - SafeVend catches the client-side attempt to rewrite **₹999.00 → ₹0.01**.
   - The pipeline immediately halts at Step 3 and triggers:
     `🚨 TRANSACTION BLOCKED: PRICE TAMPERING`
   - Show the visual diff: `₹999.00 → ₹0.01 → ✕ BLOCKED`.
5. **Slide / View 5: Merchant Security Dashboard (`#dashboard`)**
   - Click **"View Alert in Merchant Dashboard"**.
   - Point out that **Threats Blocked** immediately incremented to **8**.
   - Show the live SVG timeline chart and the newly created **Price Tampering** alert on the feed.
6. **Slide / View 6: Forensic Threat Details**
   - Click **"Inspect 🔍"** on the alert.
   - Walk through the forensic modal: Incident ID, High Risk, Target Component, Expected vs Received Payload Diff, and Automated Quarantining Action.
7. **Slide / View 7: Research Gap & Defense (`#research`)**
   - Conclude by highlighting the **2021–2025 Research Gap**: existing enterprise solutions are too heavy, leaving 68% of small sellers vulnerable. SafeVend solves this with zero-config client protection.

*(Pro Tip: You can also click the top-right button **"🎓 Presentation Demo"** to run this guided tour interactively with toast prompts!)*

---

## 🔬 Core Security Features

| Feature | Description | Attack Simulated |
| :--- | :--- | :--- |
| **Input Validation & Sanitization** | Regex pattern matching for XSS `<script>` tags, SQL syntax probes, and invalid formats. Safe DOM property injection. | Malicious XSS probe in shipping notes |
| **Price Integrity Verification** | Verifies cart total and line items against immutable product catalog prices prior to submission. | Price tampering (₹999 → ₹0.01) |
| **Form & DOM Integrity** | Validates DOM tree against expected schema hashes; detects injected inputs or hijacked action targets. | Rogue recipient wallet attribute injection |
| **Bot Velocity Monitoring** | Tracks client checkout velocity and behavioral telemetry anomalies to throttle automated bursts. | Rapid automated bot burst (6 calls / 1.4s) |
| **Merchant Telemetry** | Real-time security incident logging, plain-language alerts, risk score calculation, and SVG timeline charting. | Live dashboard reflection of all events |

---

## 📜 Academic Research Themes (2021–2025)

The prototype includes theoretical placeholders for 7 verified peer-reviewed publications across:
1. **SME Cybersecurity**
2. **E-Commerce Security & Payment Skimming (MageCart)**
3. **Transaction & Price Manipulation in Decoupled Checkouts**
4. **Web Application Security & XSS Form Pipelines**
5. **Automated & Bot Checkout Threat Modeling**
6. **Security Usability for Non-Technical Small Businesses**
7. **Cyber Risk Assessment & Economic Harm (SDG 8 & 12)**
