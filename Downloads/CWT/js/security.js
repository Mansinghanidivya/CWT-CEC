/**
 * SafeVend — Plug-and-Play Security for Micro-Merchants
 * security.js: Core Security Engine & Threat Simulation Layer
 * 
 * IMPORTANT ACADEMIC CEC PROJECT DISCLAIMER:
 * This is an educational cybersecurity prototype developed for academic demonstration.
 * All attacks, detections, and security mitigations are safely simulated in-memory within
 * the browser. No actual payment data is collected, no malicious code is executed,
 * and no external networks are targeted.
 */

class SafeVendSecurityEngine {
  constructor() {
    // Current security runtime metrics initialized from baseline data
    this.metrics = {
      totalTransactions: 1248,
      protectedTransactions: 1241,
      blockedTransactions: 7,
      riskStatus: "LOW", // 'LOW' | 'ELEVATED' | 'HIGH'
      threatCounts: {
        priceTampering: 3,
        automatedRequests: 2,
        suspiciousInput: 2,
        formTampering: 1
      }
    };

    // Live alert store initialized with mock history
    this.alerts = [...SafeVendData.initialAlerts];

    // Listeners for reactive dashboard updates
    this.subscribers = [];

    // Rate-limiting / bot tracking simulation state
    this.recentRequestTimestamps = [];
    this.formIntegrityHash = "SV-DOM-INTEGRITY-9A7F";
  }

  /**
   * Subscribe to live security state changes (used by Dashboard & Nav badges)
   */
  subscribe(callback) {
    if (typeof callback === "function") {
      this.subscribers.push(callback);
    }
  }

  notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.getState()));
  }

  getState() {
    return {
      metrics: { ...this.metrics },
      alerts: [...this.alerts],
      threatCounts: { ...this.metrics.threatCounts }
    };
  }

  /**
   * Safely sanitize a user string to prevent DOM XSS.
   * Strips harmful script tags and escapes HTML entities safely.
   */
  sanitizeString(input) {
    if (typeof input !== "string") return "";
    const div = document.createElement("div");
    div.textContent = input; // Uses browser DOM textContent to safely encode entities
    return div.innerHTML;
  }

  /**
   * SECURITY FEATURE #1: Input Validation & Malicious Pattern Detector
   * Inspects customer form inputs for XSS, SQLi, and format violations.
   */
  validateCustomerInput(formData) {
    const results = {
      isValid: true,
      hasMaliciousPattern: false,
      errors: {},
      threatDetails: null
    };

    const maliciousPatterns = [
      { regex: /<script[\s\S]*?>[\s\S]*?<\/script>/gi, name: "Cross-Site Scripting (XSS) Tag" },
      { regex: /javascript\s*:/gi, name: "JavaScript URI Scheme" },
      { regex: /onerror\s*=/gi, name: "Event Handler Injection (onerror)" },
      { regex: /onload\s*=/gi, name: "Event Handler Injection (onload)" },
      { regex: /('|")\s*(OR|AND)\s*('|"|\d)=\s*('|"|\d)/gi, name: "SQL Injection Probe Pattern" },
      { regex: /--|\bUNION\b\s+\bSELECT\b/gi, name: "SQL Comment / Union Operator" },
      { regex: /document\s*\.\s*cookie/gi, name: "DOM Cookie Access Vector" },
      { regex: /<img[\s\S]*?src=[\s\S]*?>/gi, name: "HTML Image Injection" }
    ];

    // Check all fields for dangerous injection patterns
    for (const [field, value] of Object.entries(formData)) {
      if (typeof value === "string") {
        for (const pattern of maliciousPatterns) {
          if (pattern.regex.test(value)) {
            results.isValid = false;
            results.hasMaliciousPattern = true;
            results.errors[field] = `Potentially unsafe pattern detected: ${pattern.name}`;
            results.threatDetails = {
              field: field,
              patternName: pattern.name,
              unsafeSample: value.length > 50 ? value.substring(0, 50) + "..." : value
            };
            break;
          }
        }
      }
    }

    // If a malicious pattern was detected, return early
    if (results.hasMaliciousPattern) {
      return results;
    }

    // Standard business rule validations
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      results.isValid = false;
      results.errors.fullName = "Please enter a valid full name (minimum 3 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      results.isValid = false;
      results.errors.email = "Please enter a valid email address (e.g., name@domain.com).";
    }

    const phoneDigits = (formData.phone || "").replace(/\D/g, "");
    if (!formData.phone || phoneDigits.length < 10) {
      results.isValid = false;
      results.errors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.address || formData.address.trim().length < 6) {
      results.isValid = false;
      results.errors.address = "Please enter a complete delivery street address.";
    }

    if (!formData.city || formData.city.trim().length < 2) {
      results.isValid = false;
      results.errors.city = "Please specify a city.";
    }

    const pinDigits = (formData.pinCode || "").replace(/\D/g, "");
    if (!formData.pinCode || pinDigits.length !== 6) {
      results.isValid = false;
      results.errors.pinCode = "Please enter a valid 6-digit postal PIN code.";
    }

    return results;
  }

  /**
   * SECURITY FEATURE #2: Price Integrity Verification
   * Compares the client-submitted price/cart total with verified server/catalog pricing rules.
   */
  verifyPriceIntegrity(cartItems, submittedTotal) {
    let expectedTotal = 0;
    const discrepancies = [];

    cartItems.forEach((item) => {
      // Find authoritative product in catalog
      const catalogProduct = SafeVendData.products.find((p) => p.id === item.id);
      const expectedUnitPrice = catalogProduct ? catalogProduct.price : item.price;
      const expectedItemTotal = expectedUnitPrice * item.quantity;
      expectedTotal += expectedItemTotal;

      // Check if item's submitted unit price was tampered with
      if (item.submittedUnitPrice !== undefined && item.submittedUnitPrice !== expectedUnitPrice) {
        discrepancies.push({
          itemId: item.id,
          itemName: item.name,
          expectedPrice: expectedUnitPrice,
          submittedPrice: item.submittedUnitPrice,
          difference: expectedUnitPrice - item.submittedUnitPrice
        });
      }
    });

    const isMatch = Math.abs(expectedTotal - submittedTotal) < 0.01 && discrepancies.length === 0;

    return {
      isVerified: isMatch,
      expectedTotal: expectedTotal,
      submittedTotal: submittedTotal,
      discrepancies: discrepancies,
      checksum: this.generateVerificationChecksum(expectedTotal, cartItems)
    };
  }

  /**
   * Generate a mock cryptographic HMAC-SHA256 signature for verified transactions.
   */
  generateVerificationChecksum(amount, cart) {
    const timestamp = Date.now();
    const itemIds = cart.map((i) => i.id).sort().join(":");
    // Simulated hash string
    const raw = `${amount}|${itemIds}|${timestamp}|SV_SECRET_KEY`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `SV-HMAC-256-${hex.toUpperCase()}-${timestamp.toString(16).slice(-4).toUpperCase()}`;
  }

  /**
   * SECURITY FEATURE #3: Suspicious Bot / Automated Request Detection
   * Evaluates request burst frequencies and behavioral anomalies.
   */
  detectAutomatedActivity(actionType = "checkout_attempt") {
    const now = Date.now();
    this.recentRequestTimestamps.push(now);

    // Keep only requests within the last 10 seconds
    this.recentRequestTimestamps = this.recentRequestTimestamps.filter((t) => now - t <= 10000);

    const burstThreshold = 4; // > 4 requests in 10s is suspicious for a human checkout
    const isBurst = this.recentRequestTimestamps.length > burstThreshold;

    return {
      isSuspicious: isBurst,
      requestCount: this.recentRequestTimestamps.length,
      timeframeSeconds: 10,
      confidence: isBurst ? 94 : 12,
      riskLevel: isBurst ? "MEDIUM" : "LOW",
      reason: isBurst
        ? `High-frequency checkout attempts: ${this.recentRequestTimestamps.length} calls within 10 seconds.`
        : "Velocity within expected human thresholds."
    };
  }

  /**
   * SECURITY FEATURE #4: Form & DOM Integrity Verification
   * Detects client-side attribute tampering or injected rogue form elements.
   */
  verifyFormIntegrity(checkoutFormElement) {
    if (!checkoutFormElement) return { isIntact: true };

    // Inspect if protected fields or unauthorized attributes were inserted
    const rogueField = checkoutFormElement.querySelector("[data-injected='true']");
    const tamperedAction = checkoutFormElement.getAttribute("action");

    const isTampered = Boolean(rogueField || (tamperedAction && tamperedAction.includes("malicious")));

    return {
      isIntact: !isTampered,
      tamperedField: rogueField ? rogueField.name || "unnamed_injected_input" : null,
      expectedHash: this.formIntegrityHash,
      reason: isTampered
        ? "Unauthorized input element or DOM attribute detected in checkout container."
        : "Form schema structure verified and untampered."
    };
  }

  /**
   * Record a security event and update live dashboard state.
   */
  recordSecurityIncident(threatData) {
    const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const newAlert = {
      id: alertId,
      threatType: threatData.threatType,
      riskLevel: threatData.riskLevel,
      severityColor: threatData.riskLevel === "HIGH" ? "red" : threatData.riskLevel === "MEDIUM" ? "orange" : "yellow",
      productName: threatData.productName || "Handmade Tote Bag",
      expectedValue: threatData.expectedValue || "Verified Catalog Baseline",
      receivedValue: threatData.receivedValue || "Manipulated Input / Payload",
      affectedComponent: threatData.affectedComponent || "Transaction Pipeline",
      detectionReason: threatData.detectionReason || "Anomaly detected by SafeVend rule engine.",
      actionTaken: threatData.actionTaken || "Transaction Terminated & Merchant Notified",
      timestamp: timeString,
      ipAddress: threatData.ipAddress || "127.0.0.1 (Local Client Simulation)",
      status: threatData.status || "BLOCKED",
      categoryKey: threatData.categoryKey || "priceTampering"
    };

    // Update metrics
    this.metrics.totalTransactions += 1;
    this.metrics.blockedTransactions += 1;
    this.metrics.riskStatus = "ELEVATED";

    if (this.metrics.threatCounts[threatData.categoryKey] !== undefined) {
      this.metrics.threatCounts[threatData.categoryKey] += 1;
    }

    // Prepend new alert to alerts list
    this.alerts.unshift(newAlert);

    // Notify all active dashboard views
    this.notifySubscribers();

    return newAlert;
  }

  /**
   * Record a verified legitimate transaction.
   */
  recordLegitimateTransaction() {
    this.metrics.totalTransactions += 1;
    this.metrics.protectedTransactions += 1;
    this.notifySubscribers();
  }

  /**
   * Reset simulation state to default baseline
   */
  resetToDefaults() {
    this.metrics = {
      totalTransactions: 1248,
      protectedTransactions: 1241,
      blockedTransactions: 7,
      riskStatus: "LOW",
      threatCounts: {
        priceTampering: 3,
        automatedRequests: 2,
        suspiciousInput: 2,
        formTampering: 1
      }
    };
    this.alerts = [...SafeVendData.initialAlerts];
    this.recentRequestTimestamps = [];
    this.notifySubscribers();
  }
}

// Instantiate and expose globally
if (typeof window !== "undefined") {
  window.safeVendEngine = new SafeVendSecurityEngine();
}
