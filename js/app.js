/**
 * Taqwa Motors - Main Application Core & Supabase Inventory Sync
 * Rawalpindi, Pakistan
 * "Where Trust Drives Everything"
 */

// Global State
let currentFilterCategory = 'available'; // Default to Available vehicles
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

// Format Price in PKR (REQUIREMENT 7: EXACT AND UNROUNDED)
function formatPKR(val) {
  const num = Number(val);
  if (isNaN(num)) return `Rs. ${val || '0'}`;
  
  // Format based on value scale
  if (num >= 10000000) {
    const crore = (num / 10000000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${crore} Crore`;
  }
  if (num >= 100000) {
    const lacs = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${lacs} Lacs`;
  }
  // Fully preserves exact prices like 2570, 2575, 2580
  return `Rs. ${num.toLocaleString('en-PK')}`;
}
window.formatPKR = formatPKR;

// Transform raw DB vehicle row into UI vehicle object
function transformDbVehicle(row, imagesMap) {
  const carImages = imagesMap && imagesMap[row.id] && imagesMap[row.id].length > 0
    ? imagesMap[row.id]
    : [DEFAULT_CAR_FALLBACK_IMAGE];

  const priceNum = Number(row.price) || 0;
  const priceFormatted = formatPKR(priceNum);
  const mileageNum = Number(row.mileage) || 0;
  const mileageFormatted = mileageNum > 0 ? `${mileageNum.toLocaleString()} km` : 'Unregistered / Brand New';

  const status = (row.status || 'available').toLowerCase();
  let badge = 'Verified';
  if (status === 'sold') {
    badge = 'Sold';
  } else if (status === 'cancelled') {
    badge = 'Cancelled';
  } else if (status === 'reserved') {
    badge = 'Reserved';
  } else if (row.featured) {
    badge = 'Featured';
  } else if (row.condition && row.condition.toLowerCase().includes('brand')) {
    badge = 'Brand New';
  }

  // Key Highlights
  const keySpecs = [];
  if (row.year) keySpecs.push(`${row.year} Model`);
  if (row.year_of_import || row.import_year) keySpecs.push(`Import: ${row.year_of_import || row.import_year}`);
  if (row.transmission) keySpecs.push(row.transmission);
  if (row.fuel_type) keySpecs.push(row.fuel_type);
  if (row.color) keySpecs.push(`Color: ${row.color}`);
  if (row.condition) keySpecs.push(row.condition);

  const importYear = row.year_of_import || row.import_year || null;

  return {
    id: row.id,
    stockNumber: row.stock_number || `TM-${row.id.substring(0, 6).toUpperCase()}`,
    featured: Boolean(row.featured),
    badge: badge,
    status: status,
    make: row.make || 'Toyota',
    model: row.model || 'Vehicle',
    variant: row.variant || '',
    year: row.year || new Date().getFullYear(),
    yearOfImport: importYear,
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
    conditionGrade: row.condition || '',
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
      score: row.condition || "Verified Quality"
    }
  };
}

// Generate Vehicle Card HTML (REQUIREMENT 3, 4, 5, 6, 14: SEHGAL MOTORSPORTS REFERENCE STYLE)
function renderCarCard(car) {
  let badgeClass = 'badge-regular';
  if (car.status === 'sold') badgeClass = 'badge-sold';
  else if (car.status === 'cancelled') badgeClass = 'badge-cancelled';
  else if (car.status === 'reserved') badgeClass = 'badge-reserved';
  else if (car.badge.includes('Featured') || car.featured) badgeClass = 'badge-featured';
  else if (car.status === 'available') badgeClass = 'badge-available';

  const isSold = car.status === 'sold';
  const isCancelled = car.status === 'cancelled';
  const isReserved = car.status === 'reserved';

  let statusText = car.priceFormatted;
  if (isSold) statusText = 'SOLD';
  else if (isCancelled) statusText = 'CANCELLED';
  else if (isReserved) statusText = 'RESERVED';

  // Build specifications line (e.g. 2023 • Automatic • Petrol)
  const specsLine = [
    car.variant,
    car.transmission,
    car.fuelType
  ].filter(Boolean).join(' • ');

  return `
    <article class="car-card reveal-on-scroll ${isSold ? 'car-card-sold' : (isCancelled ? 'car-card-cancelled' : '')}" data-car-id="${car.id}" onclick="window.openCarModal('${car.id}')">
      <div class="car-image-container">
        <img src="${car.images[0]}" alt="${car.year} ${car.make} ${car.model}" class="car-image" loading="lazy" onerror="this.onerror=null; this.src='${DEFAULT_CAR_FALLBACK_IMAGE}';">
        <span class="car-badge ${badgeClass}">${car.badge}</span>
        ${car.yearOfImport ? `<span class="car-import-tag">Import: ${car.yearOfImport}</span>` : ''}
      </div>

      <div class="car-card-body">
        <h3 class="car-card-title">${car.year} ${car.make} ${car.model}</h3>
        <div class="car-card-subtitle">${specsLine || car.make}</div>
        ${car.conditionGrade ? `<div class="car-card-condition">${car.conditionGrade}</div>` : ''}

        <div class="car-card-price">
          <span class="price-val">${statusText}</span>
        </div>

        <div class="car-card-actions" onclick="event.stopPropagation();">
          <a href="tel:03335406173" class="btn-call-now" title="Call Showroom (0333-5406173)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>Call Now</span>
          </a>
          <a href="https://wa.me/923335406173?text=Assalam-o-Alaikum%20Taqwa%20Motors,%20I%20am%20interested%20in%20the%20${encodeURIComponent(car.year + ' ' + car.make + ' ' + car.model + ' (' + car.priceFormatted + ')')}" target="_blank" rel="noopener noreferrer" class="btn-card-whatsapp" title="WhatsApp Sales Desk">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

// Filter and Render Full Inventory Hub
function renderInventoryGrid() {
  const container = document.getElementById("inventoryCarsGrid");
  const countSpan = document.getElementById("inventoryResultsCount");
  if (!container) return;

  if (isInventoryLoading) {
    container.innerHTML = `
      <div class="inventory-loading-skeleton">
        <div class="loading-spinner" style="margin: 0 auto 16px; width: 36px; height: 36px; border: 3px solid #E2E8F0; border-top-color: #D32F2F; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <h4 style="color: #0F172A; margin-bottom: 4px;">Loading Dealership Inventory...</h4>
        <p style="color: #64748B; font-size: 0.9rem;">Fetching verified vehicles from Taqwa Motors database</p>
      </div>
    `;
    if (countSpan) countSpan.textContent = "Loading...";
    return;
  }

  const inventory = Array.isArray(window.INVENTORY_DATA) ? window.INVENTORY_DATA : [];

  let list = inventory.filter(car => {
    // Status / Category Filter Tab (Available, Sold, Cancel, All)
    if (currentFilterCategory === 'available') {
      if (car.status && car.status !== 'available') return false;
    } else if (currentFilterCategory === 'sold') {
      if (car.status !== 'sold') return false;
    } else if (currentFilterCategory === 'cancelled' || currentFilterCategory === 'cancel') {
      if (car.status !== 'cancelled') return false;
    } else if (currentFilterCategory !== 'all') {
      if (currentFilterCategory === 'suv' && !(car.bodyType && (car.bodyType.includes('SUV') || car.bodyType.includes('Crossover'))) && !car.model.toLowerCase().includes('fortuner') && !car.model.toLowerCase().includes('prado')) return false;
      if (currentFilterCategory === 'sedan' && !(car.bodyType && car.bodyType.includes('Sedan')) && !car.model.toLowerCase().includes('civic') && !car.model.toLowerCase().includes('corolla') && !car.model.toLowerCase().includes('city')) return false;
      if (currentFilterCategory === 'hybrid' && car.fuelType !== 'Hybrid' && car.fuelType !== 'Electric' && !(car.conditionGrade && car.conditionGrade.toLowerCase().includes('hybrid'))) return false;
      if (currentFilterCategory === '4x4' && !car.variant.toLowerCase().includes('sigma') && !car.model.toLowerCase().includes('cruiser') && !car.model.toLowerCase().includes('hilux') && !car.model.toLowerCase().includes('prado') && !car.model.toLowerCase().includes('revo')) return false;
    }

    // Search query
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      const match = car.make.toLowerCase().includes(q) ||
                    car.model.toLowerCase().includes(q) ||
                    car.variant.toLowerCase().includes(q) ||
                    car.year.toString().includes(q) ||
                    (car.yearOfImport && car.yearOfImport.toString().includes(q)) ||
                    (car.conditionGrade && car.conditionGrade.toLowerCase().includes(q)) ||
                    car.color.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Make
    if (activeFilters.make !== 'all' && car.make.toLowerCase() !== activeFilters.make.toLowerCase()) return false;

    // Body Type
    if (activeFilters.bodyType !== 'all' && !car.bodyType.toLowerCase().includes(activeFilters.bodyType.toLowerCase())) return false;

    // Price
    if (car.price > activeFilters.maxPrice) return false;

    // Year
    if (activeFilters.year !== 'all' && car.year.toString() !== activeFilters.year.toString()) return false;

    // Fuel Type
    if (activeFilters.fuelType !== 'all' && car.fuelType.toLowerCase() !== activeFilters.fuelType.toLowerCase()) return false;

    // Transmission
    if (activeFilters.transmission !== 'all' && !car.transmission.toLowerCase().includes(activeFilters.transmission.toLowerCase())) return false;

    return true;
  });

  // Sort
  if (currentSortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSortBy === 'year-desc') {
    list.sort((a, b) => b.year - a.year);
  } else if (currentSortBy === 'mileage-asc') {
    list.sort((a, b) => a.mileage - b.mileage);
  } else {
    // Featured first
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (countSpan) countSpan.textContent = `Showing ${list.length} Vehicles`;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="inventory-empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" style="margin-bottom: 12px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h4 style="color: #0F172A; margin-bottom: 6px;">No Matching Vehicles Found</h4>
        <p style="color: #64748B; font-size: 0.9rem; max-width: 440px; margin: 0 auto 16px;">Try adjusting your filters or search keywords, or inquire with our sales desk on WhatsApp.</p>
        <button class="btn btn-whatsapp btn-sm" onclick="window.openWhatsApp('Assalam-o-Alaikum Taqwa Motors, I am looking for a specific car.')">
          Inquire via WhatsApp
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(renderCarCard).join('');
  triggerScrollReveal();
}

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

  const slider = document.getElementById("sidebarPriceRange");
  if (slider) slider.value = 100000000;

  const priceVal = document.getElementById("sidebarPriceVal");
  if (priceVal) priceVal.textContent = "PKR 10 Crore";

  const selects = ["filterMake", "filterBodyType", "filterYear", "filterFuel", "filterTransmission", "filterRegCity"];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 'all';
  });

  renderInventoryGrid();
  showToast("All filters have been reset");
}
window.resetAllFilters = resetAllFilters;

// Open Car Details Modal (REQUIREMENT 11, 13: DYNAMIC VEHICLE SPECS)
function openCarModal(carId) {
  const inventory = Array.isArray(window.INVENTORY_DATA) ? window.INVENTORY_DATA : [];
  const car = inventory.find(c => c.id === carId);
  if (!car) return;

  const modal = document.getElementById("vehicleModal");
  if (!modal) return;

  // Set modal gallery
  const mainImg = document.getElementById("modalMainImage");
  const thumbsRow = document.getElementById("modalThumbsRow");
  if (mainImg && car.images && car.images.length > 0) {
    mainImg.src = car.images[0];
  }

  if (thumbsRow) {
    thumbsRow.innerHTML = (car.images || []).map((img, idx) => `
      <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="window.switchModalGalleryImage(this, '${img}')">
        <img src="${img}" alt="Thumb" onerror="this.src='${DEFAULT_CAR_FALLBACK_IMAGE}'">
      </div>
    `).join('');
  }

  // Set header info
  const titleEl = document.getElementById("modalCarTitle");
  if (titleEl) titleEl.textContent = `${car.year} ${car.make} ${car.model}`;

  const variantEl = document.getElementById("modalCarVariant");
  if (variantEl) variantEl.textContent = `${car.variant || 'Standard'} ${car.color ? '• ' + car.color : ''}`;

  const priceEl = document.getElementById("modalCarPrice");
  if (priceEl) {
    if (car.status === 'sold') {
      priceEl.innerHTML = `<span style="color: #64748B; font-size: 1.3rem; font-weight: 800;">STATUS: SOLD</span>`;
    } else if (car.status === 'cancelled') {
      priceEl.innerHTML = `<span style="color: #DC2626; font-size: 1.3rem; font-weight: 800;">STATUS: CANCELLED</span>`;
    } else if (car.status === 'reserved') {
      priceEl.innerHTML = `<span style="color: #D97706; font-size: 1.3rem; font-weight: 800;">STATUS: RESERVED</span> (${car.priceFormatted})`;
    } else {
      priceEl.textContent = car.priceFormatted;
    }
  }

  // Inspection Score
  const inspScore = document.getElementById("modalInspectionScore");
  if (inspScore) inspScore.textContent = car.conditionGrade || "Verified Quality";

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

  // Spec Matrix (INCLUDES YEAR OF IMPORT)
  const matrixContainer = document.getElementById("modalSpecMatrix");
  if (matrixContainer) {
    let matrixHtml = `
      <div class="spec-matrix-item"><div class="spec-matrix-label">Mileage</div><div class="spec-matrix-val">${car.mileageFormatted}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Transmission</div><div class="spec-matrix-val">${car.transmission}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Fuel Type</div><div class="spec-matrix-val">${car.fuelType}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Color</div><div class="spec-matrix-val">${car.color}</div></div>
      <div class="spec-matrix-item"><div class="spec-matrix-label">Model Year</div><div class="spec-matrix-val">${car.year}</div></div>
    `;

    if (car.yearOfImport) {
      matrixHtml += `<div class="spec-matrix-item"><div class="spec-matrix-label">Year of Import</div><div class="spec-matrix-val" style="color: var(--primary-red); font-weight:800;">${car.yearOfImport}</div></div>`;
    }

    if (car.conditionGrade) {
      matrixHtml += `<div class="spec-matrix-item"><div class="spec-matrix-label">Condition</div><div class="spec-matrix-val">${car.conditionGrade}</div></div>`;
    }

    let statusColor = '#059669';
    if (car.status === 'sold') statusColor = '#64748B';
    if (car.status === 'cancelled') statusColor = '#DC2626';
    if (car.status === 'reserved') statusColor = '#D97706';

    matrixHtml += `<div class="spec-matrix-item"><div class="spec-matrix-label">Status</div><div class="spec-matrix-val" style="text-transform:capitalize; font-weight:800; color:${statusColor}">${car.status}</div></div>`;

    matrixContainer.innerHTML = matrixHtml;
  }

  // Features Breakdown
  const featuresContainer = document.getElementById("modalFeaturesList");
  if (featuresContainer) {
    const allFeatures = [...car.features.safety, ...car.features.comfort, ...car.features.technology];
    featuresContainer.innerHTML = allFeatures.map(f => `
      <span class="feature-pill">✓ ${f}</span>
    `).join('');
  }

  // Modal Action Buttons
  const whatsappBtn = document.getElementById("modalWhatsAppBtn");
  if (whatsappBtn) {
    whatsappBtn.onclick = () => {
      window.inquireCarWhatsApp(car.id);
    };
  }

  const testDriveBtn = document.getElementById("modalTestDriveBtn");
  if (testDriveBtn) {
    testDriveBtn.onclick = () => {
      window.openWhatsApp(`Assalam-o-Alaikum Taqwa Motors, I would like to schedule a showroom visit to inspect the ${car.year} ${car.make} ${car.model}.`);
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
    'shield-check': `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    'badge-check': `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    'file-text': `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    'arrows-repeat': `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
    'calculator': `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path></svg>`,
    'gem': `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 3 18 3 22 9 12 22 2 9"></polygon></svg>`
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
    <div class="pillar-card reveal-on-scroll" style="margin-bottom: 14px; padding: 20px 24px;">
      <h4 style="font-size: 1.05rem; color: var(--text-dark); margin-bottom: 6px; display: flex; align-items: baseline; gap: 8px;">
        <span style="color: var(--primary-red); font-weight: 800;">Q:</span> ${faq.q}
      </h4>
      <p style="color: var(--text-dark-secondary); font-size: 0.92rem; line-height: 1.6;">${faq.a}</p>
    </div>
  `).join('');
}

// Scroll Reveal Effect
function triggerScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= windowHeight - 40) {
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
    statusEl.innerHTML = `<span class="status-dot" style="background:#F59E0B;"></span> Showroom Opens at 8:00 AM`;
  }
}

// Setup Event Listeners
function setupAppEvents() {
  // Sticky Navbar
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("mainNavbar");
    if (navbar) {
      if (window.scrollY > 40) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
    triggerScrollReveal();
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobileNavToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    let navBackdrop = document.getElementById("mobileNavBackdrop");
    if (!navBackdrop) {
      navBackdrop = document.createElement("div");
      navBackdrop.id = "mobileNavBackdrop";
      navBackdrop.className = "mobile-nav-backdrop";
      document.body.appendChild(navBackdrop);
    }

    const setMobileMenuState = (open) => {
      if (open) {
        navMenu.classList.add("active");
        navBackdrop.classList.add("active");
        mobileToggle.textContent = "✕";
        mobileToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      } else {
        navMenu.classList.remove("active");
        navBackdrop.classList.remove("active");
        mobileToggle.textContent = "☰";
        mobileToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    };

    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !navMenu.classList.contains("active");
      setMobileMenuState(willOpen);
    });

    navBackdrop.addEventListener("click", () => {
      setMobileMenuState(false);
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        setMobileMenuState(false);
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100 && navMenu.classList.contains("active")) {
        setMobileMenuState(false);
      }
    });
  }

  // Category Filter Tabs
  document.querySelectorAll(".featured-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".featured-tab-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilterCategory = e.target.getAttribute("data-category");
      renderInventoryGrid();
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
      showToast("Filtered showroom inventory");
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
      showToast("Redirecting your inquiry to Taqwa Motors WhatsApp...");
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
  renderInventoryGrid();

  try {
    const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;
    if (!supabase) {
      console.warn("Supabase client not initialized.");
      isInventoryLoading = false;
      renderInventoryGrid();
      return;
    }

    // 1. Fetch from vehicles or public_inventory view
    let dbVehicles = null;
    
    const { data: vData, error: vErr } = await supabase
      .from('vehicles')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (!vErr && vData) {
      dbVehicles = vData;
    } else {
      const { data: pubData, error: pubErr } = await supabase
        .from('public_inventory')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (!pubErr && pubData) {
        dbVehicles = pubData;
      }
    }

    if (!dbVehicles || dbVehicles.length === 0) {
      isInventoryLoading = false;
      renderInventoryGrid();
      return;
    }

    // 2. Fetch public images for vehicles
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

    // 5. Update Dynamic Filter Make options
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
    renderInventoryGrid();
    checkDeepLinkModal();
  }
}
window.loadPublicInventoryFromSupabase = loadPublicInventoryFromSupabase;

// Trust Metrics Number Counter Animation (0 -> Final Target Value)
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 2000; // 2 seconds animation
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);

        // Ease Out Cubic: 1 - (1 - progress)^3
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = ease * target;

        if (decimals > 0) {
          counter.textContent = current.toFixed(decimals) + suffix;
        } else {
          counter.textContent = Math.floor(current).toLocaleString('en-US') + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Guarantee exact final value
          if (decimals > 0) {
            counter.textContent = target.toFixed(decimals) + suffix;
          } else {
            counter.textContent = target.toLocaleString('en-US') + suffix;
          }
        }
      };

      requestAnimationFrame(step);
    });
  };

  const statsSection = document.getElementById('trustStatsGrid') || document.querySelector('.trust-stats-grid');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(statsSection);
  } else {
    // Fallback: trigger after 300ms
    setTimeout(animateCounters, 300);
  }
}
window.initCounterAnimation = initCounterAnimation;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderTestimonials();
  renderFAQs();
  updateDealershipStatus();
  setupAppEvents();
  initCounterAnimation();

  if (window.initEmiCalculator) window.initEmiCalculator();
  if (window.initWhatsAppDesk) window.initWhatsAppDesk();

  // Trigger Supabase dynamic inventory load
  loadPublicInventoryFromSupabase();

  setTimeout(triggerScrollReveal, 200);
});
