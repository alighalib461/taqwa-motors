/**
 * Taqwa Motors - Main Application Core
 * Rawalpindi, Pakistan
 * "Where Trust Drives Everything"
 */

// Global State
let currentFilterCategory = 'all';
let currentSortBy = 'featured';
let currentViewMode = 'grid';
let activeFilters = {
  search: '',
  make: 'all',
  bodyType: 'all',
  maxPrice: 100000000,
  year: 'all',
  fuelType: 'all',
  transmission: 'all',
  assembly: 'all',
  registrationCity: 'all'
};

// Toast Notification Helper
function showToast(message, duration = 3000) {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#D32F2F"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> <span>${message}</span>`;
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, duration);
}
window.showToast = showToast;

// Format Price in Lacs / Crores
function formatPKR(val) {
  if (val >= 10000000) {
    return `PKR ${(val / 10000000).toFixed(2)} Crore`;
  }
  return `PKR ${(val / 100000).toFixed(1)} Lacs`;
}

// Generate Vehicle Card HTML
function renderCarCard(car) {
  let badgeClass = 'badge-regular';
  if (car.badge.includes('VIP')) badgeClass = 'badge-vip';
  else if (car.badge.includes('Featured') || car.badge.includes('Hot')) badgeClass = 'badge-featured';
  else if (car.badge.includes('Verified')) badgeClass = 'badge-verified';

  return `
    <article class="car-card reveal-on-scroll" data-car-id="${car.id}">
      <div class="car-image-container">
        <img src="${car.images[0]}" alt="${car.year} ${car.make} ${car.model} ${car.variant}" class="car-image" loading="lazy">
        <span class="car-badge ${badgeClass}">${car.badge}</span>
        <span class="car-reg-tag">Reg: ${car.registrationCity}</span>
        <button class="car-compare-toggle" data-car-id="${car.id}" onclick="window.toggleCompareCar('${car.id}')" title="Compare this vehicle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Compare
        </button>
      </div>

      <div class="car-card-body">
        <div class="car-title-block">
          <div class="car-year-make">${car.year} • ${car.make} (${car.assembly})</div>
          <h3 class="car-model-name">${car.model}</h3>
          <div class="car-variant-name">${car.variant}</div>
        </div>

        <div class="car-specs-grid">
          <div class="car-spec-item">
            <span class="spec-icon-label">🛣️ Mileage</span>
            <span class="spec-value">${car.mileageFormatted}</span>
          </div>
          <div class="car-spec-item">
            <span class="spec-icon-label">⚡ Fuel</span>
            <span class="spec-value">${car.fuelType}</span>
          </div>
          <div class="car-spec-item">
            <span class="spec-icon-label">⚙️ Trans.</span>
            <span class="spec-value">${car.transmission}</span>
          </div>
        </div>

        <div class="car-card-footer">
          <div class="car-price-row">
            <span class="car-price-label">Demand Price</span>
            <span class="car-price-value">${car.priceFormatted}</span>
          </div>

          <div class="car-card-actions">
            <button class="btn btn-outline btn-sm" onclick="window.openCarModal('${car.id}')">
              View Details
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="window.inquireCarWhatsApp('${car.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Render Featured Cars in Home Page
function renderFeaturedCars() {
  const container = document.getElementById("featuredCarsGrid");
  if (!container) return;

  const featured = window.INVENTORY_DATA.filter(car => {
    if (currentFilterCategory === 'suv') return car.bodyType === 'SUV' || car.bodyType === 'Crossover';
    if (currentFilterCategory === 'sedan') return car.bodyType === 'Sedan';
    if (currentFilterCategory === 'hybrid') return car.fuelType === 'Hybrid' || car.assembly.includes('Imported');
    if (currentFilterCategory === '4x4') return car.bodyType.includes('4x4') || car.variant.includes('Sigma 4') || car.model.includes('Land Cruiser') || car.model.includes('Prado');
    return car.featured;
  });

  container.innerHTML = featured.map(renderCarCard).join('');
  triggerScrollReveal();
  window.updateCompareUI();
}

// Filter and Render Full Inventory Hub
function renderInventoryGrid() {
  const container = document.getElementById("inventoryCarsGrid");
  const countSpan = document.getElementById("inventoryResultsCount");
  if (!container) return;

  let list = window.INVENTORY_DATA.filter(car => {
    // Search query
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      const match = car.make.toLowerCase().includes(q) ||
                    car.model.toLowerCase().includes(q) ||
                    car.variant.toLowerCase().includes(q) ||
                    car.registrationCity.toLowerCase().includes(q) ||
                    car.year.toString().includes(q) ||
                    car.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Make
    if (activeFilters.make !== 'all' && car.make.toLowerCase() !== activeFilters.make.toLowerCase()) return false;

    // Body Type
    if (activeFilters.bodyType !== 'all' && !car.bodyType.toLowerCase().includes(activeFilters.bodyType.toLowerCase())) return false;

    // Price
    if (car.price > activeFilters.maxPrice) return false;

    // Year
    if (activeFilters.year !== 'all' && car.year.toString() !== activeFilters.year) return false;

    // Fuel Type
    if (activeFilters.fuelType !== 'all' && car.fuelType.toLowerCase() !== activeFilters.fuelType.toLowerCase()) return false;

    // Transmission
    if (activeFilters.transmission !== 'all' && !car.transmission.toLowerCase().includes(activeFilters.transmission.toLowerCase())) return false;

    // Assembly
    if (activeFilters.assembly !== 'all' && !car.assembly.toLowerCase().includes(activeFilters.assembly.toLowerCase())) return false;

    // Reg City
    if (activeFilters.registrationCity !== 'all' && car.registrationCity.toLowerCase() !== activeFilters.registrationCity.toLowerCase()) return false;

    return true;
  });

  // Sorting
  if (currentSortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSortBy === 'year-desc') {
    list.sort((a, b) => b.year - a.year);
  } else if (currentSortBy === 'mileage-asc') {
    list.sort((a, b) => a.mileage - b.mileage);
  }

  if (countSpan) {
    countSpan.textContent = `Showing ${list.length} of ${window.INVENTORY_DATA.length} Cars`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px; background: rgba(13,19,34,0.6); border-radius: 16px;">
        <h3 style="color:#FFFFFF; margin-bottom: 10px;">No Vehicles Match Your Selected Filters</h3>
        <p style="color:#94A3B8; margin-bottom: 24px;">Try adjusting your price range or clearing filters to see all available cars.</p>
        <button class="btn btn-primary" onclick="window.resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(renderCarCard).join('');
  triggerScrollReveal();
  window.updateCompareUI();
}

// Reset all filters
function resetAllFilters() {
  activeFilters = {
    search: '',
    make: 'all',
    bodyType: 'all',
    maxPrice: 100000000,
    year: 'all',
    fuelType: 'all',
    transmission: 'all',
    assembly: 'all',
    registrationCity: 'all'
  };

  const searchInput = document.getElementById("inventorySearchInput");
  if (searchInput) searchInput.value = '';

  const priceRange = document.getElementById("sidebarPriceRange");
  if (priceRange) {
    priceRange.value = 100000000;
    document.getElementById("sidebarPriceVal").textContent = "PKR 10 Crore";
  }

  document.querySelectorAll(".sidebar-select").forEach(sel => sel.value = 'all');
  renderInventoryGrid();
  showToast("Filters reset successfully");
}
window.resetAllFilters = resetAllFilters;

// Open Car Details Modal
function openCarModal(carId) {
  const car = window.INVENTORY_DATA.find(c => c.id === carId);
  if (!car) return;

  const modal = document.getElementById("vehicleModal");
  if (!modal) return;

  // Set modal gallery
  const mainImg = document.getElementById("modalMainImage");
  const thumbsRow = document.getElementById("modalThumbsRow");
  if (mainImg) mainImg.src = car.images[0];
  if (thumbsRow) {
    thumbsRow.innerHTML = car.images.map((img, idx) => `
      <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="window.switchModalGalleryImage(this, '${img}')">
        <img src="${img}" alt="${car.model} angle ${idx+1}">
      </div>
    `).join('');
  }

  // Set header info
  document.getElementById("modalCarTitle").textContent = `${car.year} ${car.make} ${car.model}`;
  document.getElementById("modalCarVariant").textContent = `${car.variant} • ${car.registrationCity} Registered (Ref: ${car.id})`;
  document.getElementById("modalCarPrice").textContent = car.priceFormatted;

  // Inspection
  document.getElementById("modalInspectionScore").textContent = car.conditionGrade;
  document.getElementById("modalInspectionDetails").textContent = `${car.inspection.body} • ${car.inspection.engine}`;

  // Description
  document.getElementById("modalCarDesc").textContent = car.description;

  // Key Highlights
  const keySpecsContainer = document.getElementById("modalKeySpecs");
  if (keySpecsContainer) {
    keySpecsContainer.innerHTML = car.keySpecs.map(s => `
      <div class="feature-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.84L20.18 19H3.82L12 5.84zM11 10h2v4h-2zm0 6h2v2h-2z"/></svg>
        ${s}
      </div>
    `).join('');
  }

  // Spec Matrix
  const matrixContainer = document.getElementById("modalSpecMatrix");
  if (matrixContainer) {
    matrixContainer.innerHTML = `
      <div class="spec-matrix-item"><div class="spec-matrix-label">Mileage</div><div class="spec-matrix-val">${car.mileageFormatted}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Engine Capacity</div><div class="spec-matrix-val">${car.engineCapacity} (${car.horsepower})</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Transmission</div><div class="spec-matrix-val">${car.transmission}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Fuel Type</div><div class="spec-matrix-val">${car.fuelType}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Assembly</div><div class="spec-matrix-val">${car.assembly}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Color</div><div class="spec-matrix-val">${car.color}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Interior</div><div class="spec-matrix-val">${car.interiorColor}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Seating</div><div class="spec-matrix-val">${car.seatingCapacity} Passengers</div></div>
    `;
  }

  // Features Breakdown
  const featuresContainer = document.getElementById("modalFeaturesList");
  if (featuresContainer) {
    const allFeatures = [...car.features.safety, ...car.features.comfort, ...car.features.technology];
    featuresContainer.innerHTML = allFeatures.map(f => `
      <div class="feature-pill">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        ${f}
      </div>
    `).join('');
  }

  // Modal Action Buttons
  const whatsappBtn = document.getElementById("modalWhatsAppBtn");
  if (whatsappBtn) {
    whatsappBtn.onclick = () => window.inquireCarWhatsApp(car.id);
  }

  const testDriveBtn = document.getElementById("modalTestDriveBtn");
  if (testDriveBtn) {
    testDriveBtn.onclick = () => {
      window.bookTestDriveWhatsApp(car.id, "Valued Customer", "Tomorrow", "12:00 PM");
    };
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}
window.openCarModal = openCarModal;

function closeCarModal() {
  const modal = document.getElementById("vehicleModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "auto";
}
window.closeCarModal = closeCarModal;

function switchModalGalleryImage(thumbElem, imgUrl) {
  const mainImg = document.getElementById("modalMainImage");
  if (mainImg) {
    mainImg.style.opacity = '0.4';
    setTimeout(() => {
      mainImg.src = imgUrl;
      mainImg.style.opacity = '1';
    }, 150);
  }
  document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
  thumbElem.classList.add("active");
}
window.switchModalGalleryImage = switchModalGalleryImage;

// Render Dealership Services
function renderServices() {
  const container = document.getElementById("servicesGrid");
  if (!container) return;

  const icons = {
    'shield-check': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    'badge-check': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    'file-text': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    'arrows-repeat': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
    'calculator': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path></svg>`,
    'gem': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 3 18 3 22 9 12 22 2 9"></polygon></svg>`
  };

  container.innerHTML = window.SERVICES_DATA.map(s => `
    <div class="pillar-card reveal-on-scroll">
      <div class="pillar-icon-box">
        ${icons[s.icon] || icons['shield-check']}
      </div>
      <h3 class="pillar-title">${s.title}</h3>
      <p class="pillar-desc">${s.desc}</p>
    </div>
  `).join('');
}

// Render Testimonials
function renderTestimonials() {
  const container = document.getElementById("testimonialsGrid");
  if (!container) return;

  container.innerHTML = window.TESTIMONIALS_DATA.map(t => `
    <div class="testimonial-card reveal-on-scroll">
      <div class="testimonial-stars">
        ${'★'.repeat(t.rating)}
      </div>
      <p class="testimonial-text">"${t.comment}"</p>
      <div class="testimonial-author">
        <img src="${t.avatar}" alt="${t.name}" class="author-avatar" loading="lazy">
        <div>
          <h4 class="author-name">${t.name}</h4>
          <div class="author-car">${t.carPurchased} • ${t.location}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Render FAQs
function renderFAQs() {
  const container = document.getElementById("faqsContainer");
  if (!container) return;

  container.innerHTML = window.FAQS_DATA.map((faq, idx) => `
    <div class="pillar-card reveal-on-scroll" style="margin-bottom: 16px; padding: 22px 26px;">
      <h4 style="font-size: 1.1rem; color: #FFFFFF; margin-bottom: 8px; display: flex; align-items: baseline; gap: 8px;">
        <span style="color: #FF6B6B; font-weight: 800;">Q:</span> ${faq.q}
      </h4>
      <p style="color: #94A3B8; font-size: 0.95rem; line-height: 1.6;">${faq.a}</p>
    </div>
  `).join('');
}

// Scroll Reveal Effect
function triggerScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= windowHeight - 60) {
      el.classList.add("is-revealed");
    }
  });
}

// Check Dealership Live Status (Pakistan Time UTC+5: 8:00 AM - 10:00 PM)
function updateDealershipStatus() {
  const statusEl = document.getElementById("navStatusPill");
  if (!statusEl) return;

  const now = new Date();
  // Pakistan is UTC+5
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const pktTime = new Date(utc + (3600000 * 5));
  const hour = pktTime.getHours();

  if (hour >= 8 && hour < 22) {
    statusEl.innerHTML = `<span class="status-dot"></span> Open Today: 8:00 AM – 10:00 PM`;
  } else {
    statusEl.innerHTML = `<span class="status-dot" style="background:#F59E0B; box-shadow:0 0 8px #F59E0B;"></span> Showroom Opens at 8:00 AM`;
  }
}

// Setup Event Listeners
function setupAppEvents() {
  // Sticky Navbar
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("mainNavbar");
    if (navbar) {
      if (window.scrollY > 50) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
    triggerScrollReveal();
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobileNavToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle("active");
      mobileToggle.textContent = isActive ? "✕" : "☰";
      mobileToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileToggle.textContent = "☰";
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && e.target !== mobileToggle) {
        navMenu.classList.remove("active");
        mobileToggle.textContent = "☰";
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Home Featured Tabs
  document.querySelectorAll(".featured-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".featured-tab-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilterCategory = e.target.getAttribute("data-category");
      renderFeaturedCars();
    });
  });

  // Hero Quick Search Form
  const heroSearchBtn = document.getElementById("heroSearchSubmitBtn");
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const makeVal = document.getElementById("heroMakeSelect").value;
      const typeVal = document.getElementById("heroTypeSelect").value;
      const priceVal = document.getElementById("heroPriceSelect").value;

      activeFilters.make = makeVal;
      activeFilters.bodyType = typeVal;
      if (priceVal !== 'all') {
        activeFilters.maxPrice = parseInt(priceVal, 10);
      }

      // Scroll to inventory section
      const invSection = document.getElementById("inventory");
      if (invSection) {
        invSection.scrollIntoView({ behavior: 'smooth' });
      }

      renderInventoryGrid();
      showToast("Filtered inventory according to your selection");
    });
  }

  // Inventory Live Search & Filter Controls
  const invSearch = document.getElementById("inventorySearchInput");
  if (invSearch) {
    invSearch.addEventListener("input", (e) => {
      activeFilters.search = e.target.value;
      renderInventoryGrid();
    });
  }

  const sidebarPrice = document.getElementById("sidebarPriceRange");
  if (sidebarPrice) {
    sidebarPrice.addEventListener("input", (e) => {
      activeFilters.maxPrice = parseInt(e.target.value, 10);
      document.getElementById("sidebarPriceVal").textContent = formatPKR(activeFilters.maxPrice);
      renderInventoryGrid();
    });
  }

  // Sidebar Selects
  const filtersMapping = [
    { id: "filterMake", key: "make" },
    { id: "filterBodyType", key: "bodyType" },
    { id: "filterYear", key: "year" },
    { id: "filterFuel", key: "fuelType" },
    { id: "filterTransmission", key: "transmission" },
    { id: "filterAssembly", key: "assembly" },
    { id: "filterRegCity", key: "registrationCity" }
  ];

  filtersMapping.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        activeFilters[key] = e.target.value;
        renderInventoryGrid();
      });
    }
  });

  // Inventory Sorting
  const sortSelect = document.getElementById("inventorySortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSortBy = e.target.value;
      renderInventoryGrid();
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById("showroomInquiryForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName").value;
      const phone = document.getElementById("contactPhone").value;
      const vehicle = document.getElementById("contactVehicle").value;
      const message = document.getElementById("contactMessage").value;

      const formattedMsg = `Assalam-o-Alaikum Taqwa Motors,

Inquiry via Website Contact Form:
👤 *Name:* ${name}
📞 *Phone:* ${phone}
🚗 *Vehicle of Interest:* ${vehicle || 'General Showroom Inquiry'}
💬 *Message:* ${message}

Looking forward to your response.`;

      window.openWhatsApp(formattedMsg);
      showToast("Redirecting your inquiry to Taqwa Motors WhatsApp Sales Desk...");
      contactForm.reset();
    });
  }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedCars();
  renderInventoryGrid();
  renderServices();
  renderTestimonials();
  renderFAQs();
  updateDealershipStatus();
  setupAppEvents();

  if (window.initEmiCalculator) window.initEmiCalculator();
  if (window.initWhatsAppDesk) window.initWhatsAppDesk();

  setTimeout(triggerScrollReveal, 200);
});
