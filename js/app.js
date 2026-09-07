/**
 * Taqwa Motors - Main Application Core & Supabase Inventory Sync
 * Rawalpindi, Pakistan
 * "Where Trust Drives Everything"
 */

// Global State
let currentFilterCategory = 'all';
let currentSortBy = 'featured';
let currentViewMode = 'grid';
let isInventoryLoading = false;

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

// Fallback image when vehicle has no photos uploaded
const DEFAULT_CAR_FALLBACK_IMAGE = "assets/cars/fortuner_legender.jpg";

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
  const num = Number(val) || 0;
  if (num >= 10000000) {
    return `PKR ${(num / 10000000).toFixed(2)} Crore`;
  }
  if (num >= 100000) {
    return `PKR ${(num / 100000).toFixed(1)} Lacs`;
  }
  return `PKR ${num.toLocaleString()}`;
}
window.formatPKR = formatPKR;

// Transform raw Supabase public_inventory row into UI vehicle object
function transformDbVehicle(row, imagesMap) {
  const carImages = imagesMap[row.id] && imagesMap[row.id].length > 0
    ? imagesMap[row.id]
    : [DEFAULT_CAR_FALLBACK_IMAGE];

  const priceNum = Number(row.price) || 0;
  const priceFormatted = formatPKR(priceNum);
  const mileageNum = Number(row.mileage) || 0;
  const mileageFormatted = `${mileageNum.toLocaleString()} km`;

  const status = (row.status || 'available').toLowerCase();
  let badge = 'Verified Stock';
  if (status === 'sold') {
    badge = 'Sold';
  } else if (status === 'reserved') {
    badge = 'Reserved';
  } else if (row.featured) {
    badge = 'Featured Arrival';
  } else if (row.condition && row.condition.toLowerCase().includes('brand')) {
    badge = 'Brand New';
  }

  // Key Highlights
  const keySpecs = [];
  if (row.year) keySpecs.push(`${row.year} Model`);
  if (row.transmission) keySpecs.push(row.transmission);
  if (row.fuel_type) keySpecs.push(row.fuel_type);
  if (row.color) keySpecs.push(`Color: ${row.color}`);
  if (row.condition) keySpecs.push(`Grade: ${row.condition}`);

  return {
    id: row.id,
    stockNumber: row.stock_number || `TM-${row.id.substring(0, 6).toUpperCase()}`,
    featured: Boolean(row.featured),
    badge: badge,
    status: status,
    make: row.make || 'Toyota',
    model: row.model || 'Vehicle',
    variant: row.variant || 'Standard',
    year: row.year || new Date().getFullYear(),
    price: priceNum,
    priceFormatted: priceFormatted,
    mileage: mileageNum,
    mileageFormatted: mileageFormatted,
    fuelType: row.fuel_type || 'Petrol',
    transmission: row.transmission || 'Automatic',
    engineCapacity: 'Factory Standard',
    horsepower: 'Standard',
    bodyType: 'SUV / Sedan',
    assembly: 'Local / Imported',
    registrationCity: 'Islamabad / Rawalpindi',
    color: row.color || 'White',
    interiorColor: 'Standard Interior',
    seatingCapacity: 5,
    conditionGrade: row.condition || 'Certified 9.5/10',
    description: row.description || `${row.year} ${row.make} ${row.model} ${row.variant || ''} available for immediate inspection and delivery at Taqwa Motors showroom.`,
    images: carImages,
    keySpecs: keySpecs,
    features: {
      safety: ["ABS Brakes", "Airbags", "Vehicle Stability Control (VSC)", "Parking Sensors"],
      comfort: ["Climate Control AC", "Power Windows & Mirrors", "Keyless Entry / Push Start", "Power Steering"],
      technology: ["Multimedia Infotainment Screen", "Bluetooth Audio & Calling", "Steering Multimedia Switches"],
      exterior: ["Alloy Wheels", "LED Headlamps", "Fog Lamps", "Retractable Mirrors"]
    },
    inspection: {
      body: "Inspected & Verified",
      engine: "100% Health & Diagnostics Clear",
      suspension: "Passed 150-Point Technical Check",
      interior: "Clean Verified",
      tires: "Good Tread Life Remaining",
      score: row.condition || "9.5 / 10"
    }
  };
}

// Generate Vehicle Card HTML
function renderCarCard(car) {
  let badgeClass = 'badge-regular';
  if (car.status === 'sold') badgeClass = 'badge-sold';
  else if (car.status === 'reserved') badgeClass = 'badge-reserved';
  else if (car.badge.includes('VIP')) badgeClass = 'badge-vip';
  else if (car.badge.includes('Featured') || car.badge.includes('Hot')) badgeClass = 'badge-featured';
  else if (car.badge.includes('Verified') || car.status === 'available') badgeClass = 'badge-verified';

  const isSold = car.status === 'sold';
  const isReserved = car.status === 'reserved';

  return `
    <article class="car-card reveal-on-scroll ${isSold ? 'car-card-sold' : ''}" data-car-id="${car.id}">
      <div class="car-image-container">
        <img src="${car.images[0]}" alt="${car.year} ${car.make} ${car.model} ${car.variant}" class="car-image" loading="lazy" onerror="this.onerror=null; this.src='${DEFAULT_CAR_FALLBACK_IMAGE}';">
        <span class="car-badge ${badgeClass}">${car.badge}</span>
        <span class="car-reg-tag">${car.stockNumber}</span>
        <button class="car-compare-toggle" data-car-id="${car.id}" onclick="window.toggleCompareCar('${car.id}')" title="Compare this vehicle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Compare
        </button>
      </div>

      <div class="car-card-body">
        <div class="car-title-block">
          <div class="car-year-make">${car.year} • ${car.make}</div>
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
            <span class="car-price-label">${isSold ? 'Status' : (isReserved ? 'Status' : 'Demand Price')}</span>
            <span class="car-price-value" style="${isSold ? 'color: #94A3B8;' : (isReserved ? 'color: #F59E0B;' : '')}">
              ${isSold ? 'SOLD' : (isReserved ? 'RESERVED' : car.priceFormatted)}
            </span>
          </div>

          <div class="car-card-actions">
            <button class="btn btn-outline btn-sm" onclick="window.openCarModal('${car.id}')">
              View Details
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="window.inquireCarWhatsApp('${car.id}')" title="WhatsApp Sales Desk">
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

  if (isInventoryLoading) {
    container.innerHTML = `
      <div class="inventory-loading-skeleton">
        <div class="loading-spinner" style="margin: 0 auto 16px; width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #D32F2F; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="color: #94A3B8; font-size: 0.95rem;">Loading featured showroom vehicles...</p>
      </div>
    `;
    return;
  }

  const inventory = Array.isArray(window.INVENTORY_DATA) ? window.INVENTORY_DATA : [];

  if (inventory.length === 0) {
    container.innerHTML = `
      <div class="inventory-empty-state">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" style="margin-bottom: 12px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h4 style="color: #FFFFFF; margin-bottom: 6px;">New Stock Arriving Soon</h4>
        <p style="color: #94A3B8; font-size: 0.9rem; max-width: 480px; margin: 0 auto 16px;">Our showroom inventory is currently being updated. Inquire on WhatsApp for newly arrived vehicles.</p>
        <button class="btn btn-whatsapp btn-sm glow-hover" onclick="window.openWhatsApp('Assalam-o-Alaikum Taqwa Motors, I want to inquire about newly arrived cars.')">
          Inquire via WhatsApp
        </button>
      </div>
    `;
    return;
  }

  const featured = inventory.filter(car => {
    if (currentFilterCategory === 'suv') return (car.bodyType && (car.bodyType.includes('SUV') || car.bodyType.includes('Crossover'))) || car.model.toLowerCase().includes('fortuner') || car.model.toLowerCase().includes('prado');
    if (currentFilterCategory === 'sedan') return (car.bodyType && car.bodyType.includes('Sedan')) || car.model.toLowerCase().includes('civic') || car.model.toLowerCase().includes('corolla') || car.model.toLowerCase().includes('city');
    if (currentFilterCategory === 'hybrid') return car.fuelType === 'Hybrid' || car.fuelType === 'Electric';
    if (currentFilterCategory === '4x4') return car.variant.toLowerCase().includes('sigma') || car.model.toLowerCase().includes('cruiser') || car.model.toLowerCase().includes('hilux') || car.model.toLowerCase().includes('prado');
    return car.featured || true;
  });

  if (featured.length === 0) {
    container.innerHTML = `
      <div class="inventory-empty-state">
        <p style="color: #94A3B8;">No vehicles found in this category. Showing all available stock.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = featured.slice(0, 6).map(renderCarCard).join('');
  triggerScrollReveal();
  window.updateCompareUI();
}

// Filter and Render Full Inventory Hub
function renderInventoryGrid() {
  const container = document.getElementById("inventoryCarsGrid");
  const countSpan = document.getElementById("inventoryResultsCount");
  if (!container) return;

  if (isInventoryLoading) {
    container.innerHTML = `
      <div class="inventory-loading-skeleton">
        <div class="loading-spinner" style="margin: 0 auto 16px; width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #D32F2F; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <h4 style="color: #FFFFFF; margin-bottom: 6px;">Connecting to Live Dealership Inventory...</h4>
        <p style="color: #94A3B8; font-size: 0.92rem;">Fetching verified vehicles from Taqwa Motors database</p>
      </div>
    `;
    if (countSpan) countSpan.textContent = "Loading...";
    return;
  }

  const inventory = Array.isArray(window.INVENTORY_DATA) ? window.INVENTORY_DATA : [];

  let list = inventory.filter(car => {
    // Search query
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      const match = car.make.toLowerCase().includes(q) ||
                    car.model.toLowerCase().includes(q) ||
                    car.variant.toLowerCase().includes(q) ||
                    car.year.toString().includes(q) ||
                    car.stockNumber.toLowerCase().includes(q) ||
                    car.color.toLowerCase().includes(q) ||
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

    // Reg City
    if (activeFilters.registrationCity !== 'all' && !car.registrationCity.toLowerCase().includes(activeFilters.registrationCity.toLowerCase())) return false;

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
    countSpan.textContent = `Showing ${list.length} of ${inventory.length} Cars`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="inventory-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" style="margin-bottom: 16px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3 style="color:#FFFFFF; margin-bottom: 8px;">No Vehicles Match Your Criteria</h3>
        <p style="color:#94A3B8; margin-bottom: 20px; max-width: 450px; margin-left: auto; margin-right: auto;">
          Try adjusting your price range or clearing filters to see all available showroom stock.
        </p>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-outline" onclick="window.resetAllFilters()">Reset All Filters</button>
          <button class="btn btn-whatsapp" onclick="window.openWhatsApp('Assalam-o-Alaikum Taqwa Motors, I am looking for a specific car that was not found in filters.')">
            Ask Sales Desk
          </button>
        </div>
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
    const priceValSpan = document.getElementById("sidebarPriceVal");
    if (priceValSpan) priceValSpan.textContent = "PKR 10 Crore";
  }

  document.querySelectorAll(".sidebar-select").forEach(sel => sel.value = 'all');
  renderInventoryGrid();
  showToast("Filters reset successfully");
}
window.resetAllFilters = resetAllFilters;

// Open Car Details Modal
function openCarModal(carId) {
  const inventory = Array.isArray(window.INVENTORY_DATA) ? window.INVENTORY_DATA : [];
  const car = inventory.find(c => c.id === carId || c.stockNumber === carId);
  if (!car) {
    showToast("Vehicle details could not be found.");
    return;
  }

  const modal = document.getElementById("vehicleModal");
  if (!modal) return;

  // Set modal gallery
  const mainImg = document.getElementById("modalMainImage");
  const thumbsRow = document.getElementById("modalThumbsRow");
  if (mainImg) {
    mainImg.src = car.images[0];
    mainImg.onerror = () => { mainImg.src = DEFAULT_CAR_FALLBACK_IMAGE; };
  }

  if (thumbsRow) {
    thumbsRow.innerHTML = car.images.map((img, idx) => `
      <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="window.switchModalGalleryImage(this, '${img}')">
        <img src="${img}" alt="${car.model} angle ${idx+1}" onerror="this.onerror=null; this.src='${DEFAULT_CAR_FALLBACK_IMAGE}';">
      </div>
    `).join('');
  }

  // Set header info
  const titleEl = document.getElementById("modalCarTitle");
  if (titleEl) titleEl.textContent = `${car.year} ${car.make} ${car.model}`;

  const variantEl = document.getElementById("modalCarVariant");
  if (variantEl) variantEl.textContent = `${car.variant} • ${car.color} (Stock Ref: ${car.stockNumber})`;

  const priceEl = document.getElementById("modalCarPrice");
  if (priceEl) {
    if (car.status === 'sold') {
      priceEl.innerHTML = `<span style="color: #94A3B8; font-size: 1.2rem; font-weight: 800;">STATUS: SOLD</span>`;
    } else if (car.status === 'reserved') {
      priceEl.innerHTML = `<span style="color: #F59E0B; font-size: 1.2rem; font-weight: 800;">STATUS: RESERVED</span> (${car.priceFormatted})`;
    } else {
      priceEl.textContent = car.priceFormatted;
    }
  }

  // Inspection Rating
  const inspScore = document.getElementById("modalInspectionScore");
  if (inspScore) inspScore.textContent = car.conditionGrade;

  const inspDetails = document.getElementById("modalInspectionDetails");
  if (inspDetails) inspDetails.textContent = `${car.inspection.body} • ${car.inspection.engine}`;

  // Description
  const descEl = document.getElementById("modalCarDesc");
  if (descEl) descEl.textContent = car.description;

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
      <div class="spec-matrix-item"><div class="spec-matrix-label">Transmission</div><div class="spec-matrix-val">${car.transmission}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Fuel Type</div><div class="spec-matrix-val">${car.fuelType}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Body Color</div><div class="spec-matrix-val">${car.color}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Model Year</div><div class="spec-matrix-val">${car.year}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Stock Ref</div><div class="spec-matrix-val">${car.stockNumber}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Condition</div><div class="spec-matrix-val">${car.conditionGrade}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Status</div><div class="spec-matrix-val" style="text-transform:capitalize; font-weight:700; color:${car.status === 'sold' ? '#94A3B8' : (car.status === 'reserved' ? '#F59E0B' : '#34D399')}">${car.status}</div></div>
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

  if (window.SERVICES_DATA) {
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
}

// Render Testimonials
function renderTestimonials() {
  const container = document.getElementById("testimonialsGrid");
  if (!container || !window.TESTIMONIALS_DATA) return;

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
  if (!container || !window.FAQS_DATA) return;

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

      const invSection = document.getElementById("inventory");
      if (invSection) {
        invSection.scrollIntoView({ behavior: 'smooth' });
      }

      renderInventoryGrid();
      showToast("Filtered showroom stock according to your selection");
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
      const priceValSpan = document.getElementById("sidebarPriceVal");
      if (priceValSpan) priceValSpan.textContent = formatPKR(activeFilters.maxPrice);
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

// Check Deep Link to Vehicle Modal via Hash (#car=ID)
function checkDeepLinkModal() {
  const hash = window.location.hash;
  if (hash && hash.startsWith("#car=")) {
    const carId = hash.replace("#car=", "").trim();
    if (carId) {
      setTimeout(() => {
        openCarModal(carId);
      }, 300);
    }
  }
}

// Load Public Inventory from Supabase
async function loadPublicInventoryFromSupabase() {
  isInventoryLoading = true;
  renderFeaturedCars();
  renderInventoryGrid();

  try {
    const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;
    if (!supabase) {
      console.warn("Supabase client not initialized; fallback data will be preserved if available.");
      isInventoryLoading = false;
      renderFeaturedCars();
      renderInventoryGrid();
      return;
    }

    // 1. Fetch from controlled public_inventory view
    const { data: dbVehicles, error: vError } = await supabase
      .from('public_inventory')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (vError) {
      console.error("Error fetching public_inventory:", vError);
      isInventoryLoading = false;
      renderInventoryGrid();
      return;
    }

    // 2. Fetch public images for non-hidden vehicles
    const { data: dbImages, error: imgError } = await supabase
      .from('vehicle_images')
      .select('vehicle_id, image_url, is_primary, sort_order')
      .order('sort_order', { ascending: true });

    if (imgError) {
      console.warn("Could not fetch vehicle_images:", imgError);
    }

    // 3. Map images by vehicle_id
    const imagesMap = {};
    if (dbImages && dbImages.length > 0) {
      dbImages.forEach(img => {
        if (!imagesMap[img.vehicle_id]) imagesMap[img.vehicle_id] = [];
        let url = img.image_url;
        if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('assets/') && !url.startsWith('data:')) {
          const { data: pubData } = supabase.storage.from('vehicle-images').getPublicUrl(url);
          url = pubData?.publicUrl || url;
        }
        if (img.is_primary) {
          imagesMap[img.vehicle_id].unshift(url);
        } else {
          imagesMap[img.vehicle_id].push(url);
        }
      });
    }

    // 4. Transform rows into UI vehicle schema
    const transformed = (dbVehicles || []).map(row => transformDbVehicle(row, imagesMap));
    window.INVENTORY_DATA = transformed;

    // 5. Update Dynamic Filter Make options if vehicles exist
    if (transformed.length > 0) {
      const makes = Array.from(new Set(transformed.map(v => v.make).filter(Boolean)));
      const makeSelect = document.getElementById("filterMake");
      if (makeSelect && makes.length > 0) {
        const currentVal = makeSelect.value;
        let opts = `<option value="all">All Brands (${transformed.length})</option>`;
        makes.forEach(m => {
          const cnt = transformed.filter(v => v.make.toLowerCase() === m.toLowerCase()).length;
          opts += `<option value="${m}" ${currentVal.toLowerCase() === m.toLowerCase() ? 'selected' : ''}>${m} (${cnt})</option>`;
        });
        makeSelect.innerHTML = opts;
      }
    }

  } catch (err) {
    console.error("Failed to load inventory from Supabase:", err);
  } finally {
    isInventoryLoading = false;
    renderFeaturedCars();
    renderInventoryGrid();
    checkDeepLinkModal();
  }
}
window.loadPublicInventoryFromSupabase = loadPublicInventoryFromSupabase;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderTestimonials();
  renderFAQs();
  updateDealershipStatus();
  setupAppEvents();

  if (window.initEmiCalculator) window.initEmiCalculator();
  if (window.initWhatsAppDesk) window.initWhatsAppDesk();

  // Trigger Supabase dynamic inventory load
  loadPublicInventoryFromSupabase();

  setTimeout(triggerScrollReveal, 200);
});
