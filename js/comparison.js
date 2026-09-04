/**
 * Taqwa Motors - Side-by-Side Car Comparison Engine
 */

let comparedCarIds = [];

function toggleCompareCar(carId) {
  const index = comparedCarIds.indexOf(carId);
  if (index > -1) {
    comparedCarIds.splice(index, 1);
    window.showToast("Removed vehicle from comparison");
  } else {
    if (comparedCarIds.length >= 3) {
      window.showToast("You can compare up to 3 vehicles at a time");
      return;
    }
    comparedCarIds.push(carId);
    window.showToast("Added vehicle to comparison");
  }
  updateCompareUI();
}

function updateCompareUI() {
  const bar = document.getElementById("compareFloatingBar");
  const countSpan = document.getElementById("compareCountSpan");
  const previewContainer = document.getElementById("compareThumbnailsRow");

  // Update card buttons
  document.querySelectorAll(".car-compare-toggle").forEach(btn => {
    const cid = btn.getAttribute("data-car-id");
    if (comparedCarIds.includes(cid)) {
      btn.classList.add("active");
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Compared`;
    } else {
      btn.classList.remove("active");
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Compare`;
    }
  });

  if (!bar) return;

  if (comparedCarIds.length > 0) {
    bar.classList.add("active");
    if (countSpan) countSpan.textContent = `${comparedCarIds.length} Vehicle${comparedCarIds.length > 1 ? 's' : ''}`;

    if (previewContainer) {
      const cars = comparedCarIds.map(id => window.INVENTORY_DATA.find(c => c.id === id)).filter(Boolean);
      previewContainer.innerHTML = cars.map(c => `
        <img src="${c.images[0]}" alt="${c.model}" class="compare-thumb-pill" title="${c.year} ${c.make} ${c.model}">
      `).join('');
    }
  } else {
    bar.classList.remove("active");
  }
}

function openComparisonModal() {
  if (comparedCarIds.length === 0) {
    window.showToast("Please select at least 1 vehicle to compare.");
    return;
  }

  const cars = comparedCarIds.map(id => window.INVENTORY_DATA.find(c => c.id === id)).filter(Boolean);
  const modal = document.getElementById("comparisonModal");
  const tableContainer = document.getElementById("comparisonTableContent");

  if (!modal || !tableContainer) return;

  const rows = [
    { label: "Price", render: c => `<strong style="color:#FF6B6B; font-size:1.15rem;">${c.priceFormatted}</strong>` },
    { label: "Year & Variant", render: c => `<strong>${c.year}</strong> - ${c.variant}` },
    { label: "Engine & Power", render: c => `${c.engineCapacity} (${c.horsepower})` },
    { label: "Transmission", render: c => c.transmission },
    { label: "Fuel Type", render: c => c.fuelType },
    { label: "Mileage", render: c => c.mileageFormatted },
    { label: "Body & Assembly", render: c => `${c.bodyType} / ${c.assembly}` },
    { label: "Registration City", render: c => c.registrationCity },
    { label: "Condition Score", render: c => `<span style="color:#34D399; font-weight:700;">${c.conditionGrade}</span>` },
    { label: "Key Highlights", render: c => `<ul style="font-size:0.82rem; text-align:left; padding-left:14px;">${c.keySpecs.slice(0, 3).map(s => `<li>${s}</li>`).join('')}</ul>` },
    { label: "Action", render: c => `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn btn-whatsapp btn-sm" onclick="window.inquireCarWhatsApp('${c.id}')">WhatsApp</button>
        <button class="btn btn-outline btn-sm" onclick="window.openCarModal('${c.id}')">View Details</button>
      </div>`
    }
  ];

  let html = `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; text-align:center;">
        <thead>
          <tr style="border-bottom:2px solid rgba(211,47,47,0.4);">
            <th style="padding:16px; text-align:left; color:#94A3B8; font-size:0.85rem; text-transform:uppercase;">Specification</th>
            ${cars.map(c => `
              <th style="padding:16px; min-width:200px;">
                <img src="${c.images[0]}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;">
                <h4 style="font-size:1.05rem; color:#FFFFFF;">${c.year} ${c.make} ${c.model}</h4>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
              <td style="padding:14px; text-align:left; color:#94A3B8; font-weight:700; font-size:0.85rem; text-transform:uppercase;">${r.label}</td>
              ${cars.map(c => `<td style="padding:14px; color:#E2E8F0; font-size:0.9rem;">${r.render(c)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  tableContainer.innerHTML = html;
  modal.classList.add("active");
}

function clearAllComparison() {
  comparedCarIds = [];
  updateCompareUI();
  const modal = document.getElementById("comparisonModal");
  if (modal) modal.classList.remove("active");
  window.showToast("Cleared comparison list");
}

window.toggleCompareCar = toggleCompareCar;
window.openComparisonModal = openComparisonModal;
window.clearAllComparison = clearAllComparison;
window.updateCompareUI = updateCompareUI;
