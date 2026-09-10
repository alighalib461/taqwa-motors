/**
 * Taqwa Motors - Admin Inventory Controller
 * Handles live inventory queries, search, multi-filters, quick status changes & deletion.
 */

let allVehicles = [];
let currentFilters = {
  search: '',
  make: '',
  model: '',
  year: '',
  status: '',
  fuel_type: '',
  transmission: '',
  min_price: '',
  max_price: ''
};

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await window.checkAdminAuth();
  if (auth) {
    initFilters();
    loadInventory();
  }
});

function initFilters() {
  const searchInput = document.getElementById('inventorySearchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentFilters.search = e.target.value.trim();
        loadInventory();
      }, 350);
    });
  }

  // Filter selects & inputs
  const filterIds = ['filterMake', 'filterModel', 'filterYear', 'filterStatus', 'filterFuel', 'filterTransmission', 'filterMinPrice', 'filterMaxPrice'];
  filterIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        applyFiltersFromUI();
        loadInventory();
      });
      el.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          applyFiltersFromUI();
          loadInventory();
        }
      });
    }
  });

  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllFilters();
    });
  }
}

function applyFiltersFromUI() {
  currentFilters.make = document.getElementById('filterMake')?.value || '';
  currentFilters.model = document.getElementById('filterModel')?.value || '';
  currentFilters.year = document.getElementById('filterYear')?.value || '';
  currentFilters.status = document.getElementById('filterStatus')?.value || '';
  currentFilters.fuel_type = document.getElementById('filterFuel')?.value || '';
  currentFilters.transmission = document.getElementById('filterTransmission')?.value || '';
  currentFilters.min_price = document.getElementById('filterMinPrice')?.value || '';
  currentFilters.max_price = document.getElementById('filterMaxPrice')?.value || '';
}

function resetAllFilters() {
  currentFilters = {
    search: '',
    make: '',
    model: '',
    year: '',
    status: '',
    fuel_type: '',
    transmission: '',
    min_price: '',
    max_price: ''
  };

  const form = document.getElementById('inventoryFilterForm');
  if (form) form.reset();
  const searchInput = document.getElementById('inventorySearchInput');
  if (searchInput) searchInput.value = '';

  loadInventory();
}

async function loadInventory() {
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  const tableBody = document.getElementById('inventoryTableBody');
  const emptyState = document.getElementById('inventoryEmptyState');
  const countBadge = document.getElementById('inventoryCountBadge');

  if (tableBody) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 3rem;">Loading inventory records...</td></tr>`;
  }

  try {
    let query = supabase
      .from('vehicles')
      .select(`
        id,
        stock_number,
        make,
        model,
        variant,
        year,
        mileage,
        fuel_type,
        transmission,
        color,
        condition,
        description,
        price,
        status,
        featured,
        registration_number,
        chassis_number,
        created_at,
        vehicle_images (
          id,
          image_url,
          is_primary
        )
      `)
      .order('created_at', { ascending: false });

    // Apply Search (Make, Model, Registration, Chassis)
    if (currentFilters.search) {
      const q = currentFilters.search;
      query = query.or(`make.ilike.%${q}%,model.ilike.%${q}%,registration_number.ilike.%${q}%,chassis_number.ilike.%${q}%`);
    }

    // Apply specific filters
    if (currentFilters.make) {
      query = query.ilike('make', `%${currentFilters.make}%`);
    }
    if (currentFilters.model) {
      query = query.ilike('model', `%${currentFilters.model}%`);
    }
    if (currentFilters.year) {
      query = query.eq('year', parseInt(currentFilters.year, 10));
    }
    if (currentFilters.status) {
      query = query.eq('status', currentFilters.status);
    }
    if (currentFilters.fuel_type) {
      query = query.eq('fuel_type', currentFilters.fuel_type);
    }
    if (currentFilters.transmission) {
      query = query.eq('transmission', currentFilters.transmission);
    }
    if (currentFilters.min_price) {
      query = query.gte('price', parseFloat(currentFilters.min_price));
    }
    if (currentFilters.max_price) {
      query = query.lte('price', parseFloat(currentFilters.max_price));
    }

    const { data: vehicles, error } = await query;

    if (error) {
      console.error('Inventory fetch error:', error);
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #DC2626; padding: 2rem;">Error: ${error.message}</td></tr>`;
      }
      return;
    }

    allVehicles = vehicles || [];
    if (countBadge) countBadge.textContent = `${allVehicles.length} Vehicles`;

    if (allVehicles.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    renderInventoryTable(allVehicles);

  } catch (err) {
    console.error('Unexpected inventory error:', err);
  }
}

function renderInventoryTable(vehicles) {
  const tableBody = document.getElementById('inventoryTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = vehicles.map(v => {
    const primaryImgObj = v.vehicle_images?.find(img => img.is_primary) || v.vehicle_images?.[0];
    const imgUrl = primaryImgObj ? primaryImgObj.image_url : '../assets/cars/fortuner_legender.jpg';
    
    // Exact manual price formatting without rounding
    const formattedPrice = Number.isInteger(Number(v.price)) ? Number(v.price).toLocaleString('en-PK') : Number(v.price).toFixed(2);
    const regDisplay = v.registration_number || '<span style="color: var(--admin-text-muted); font-size: 0.75rem;">Unregistered</span>';

    // Parse Year of Import from metadata tag if present
    let importYearBadge = '';
    const importMatch = (v.description || '').match(/\[Import:\s*(\d{4})\]/i);
    if (importMatch) {
      importYearBadge = `<span style="display:inline-block; font-size:0.7rem; background:#FEE2E2; color:#DC2626; font-weight:600; padding:1px 6px; border-radius:4px; margin-top:2px;">Import: ${importMatch[1]}</span>`;
    }

    const conditionDisplay = v.condition ? `<div style="font-size:0.78rem; color:var(--admin-text-secondary);">${v.condition}</div>` : '<div style="font-size:0.75rem; color:var(--admin-text-muted);">Standard</div>';

    return `
      <tr>
        <td>
          <div class="car-thumb-cell">
            <img src="${imgUrl}" alt="${v.make} ${v.model}" class="car-thumb-img" onerror="this.src='../assets/cars/fortuner_legender.jpg'">
            <div>
              <div class="car-title-primary">
                ${v.year} ${v.make} ${v.model}
                ${v.featured ? '<span style="font-size: 0.65rem; background: #FEE2E2; color:#DC2626; padding:1px 5px; border-radius:4px; margin-left:4px; font-weight:700;">★ Featured</span>' : ''}
              </div>
              <div class="car-variant-sub">${v.variant || 'Standard'} • ${v.fuel_type || 'Petrol'}</div>
            </div>
          </div>
        </td>
        <td>
          ${conditionDisplay}
          ${importYearBadge}
        </td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--admin-text-main);">${regDisplay}</div>
          <div style="font-size: 0.72rem; color: var(--admin-text-muted); font-family: var(--font-mono);">${v.chassis_number || 'No Chassis'}</div>
        </td>
        <td>${v.mileage ? v.mileage.toLocaleString() + ' km' : 'N/A'}</td>
        <td><span class="price-text">PKR ${formattedPrice}</span></td>
        <td>
          <select class="admin-select" style="padding: 0.25rem 0.5rem; font-size: 0.78rem; width: auto; font-weight:600;" onchange="handleStatusChange('${v.id}', this.value)">
            <option value="available" ${v.status === 'available' ? 'selected' : ''}>Available</option>
            <option value="sold" ${v.status === 'sold' ? 'selected' : ''}>Sold</option>
            <option value="cancelled" ${v.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <a href="inventory-detail.html?id=${v.id}" class="action-btn-icon" title="View Full Specs & Identifiers">
              <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
            </a>
            <a href="inventory-edit.html?id=${v.id}" class="action-btn-icon" title="Edit Vehicle">
              <i data-lucide="edit-3" style="width: 16px; height: 16px;"></i>
            </a>
            <button type="button" class="action-btn-icon delete" title="Cancel / Archive" onclick="confirmCancelVehicle('${v.id}', '${v.make} ${v.model}')">
              <i data-lucide="slash" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

async function handleStatusChange(vehicleId, newStatus) {
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('vehicles')
      .update({ status: newStatus })
      .eq('id', vehicleId);

    if (error) {
      alert('Failed to update status: ' + error.message);
      loadInventory();
    } else {
      console.log(`Vehicle ${vehicleId} status updated to ${newStatus}`);
      loadInventory();
    }
  } catch (err) {
    console.error('Error changing vehicle status:', err);
  }
}

async function confirmCancelVehicle(vehicleId, title) {
  const shouldCancel = confirm(`Mark vehicle "${title}" as Cancelled?\n\nThis updates the status without deleting historical records.`);
  if (!shouldCancel) return;

  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('vehicles')
      .update({ status: 'cancelled' })
      .eq('id', vehicleId);

    if (error) {
      alert('Failed to update status: ' + error.message);
    } else {
      loadInventory();
    }
  } catch (err) {
    console.error('Error setting vehicle status to cancelled:', err);
  }
}

window.handleStatusChange = handleStatusChange;
window.confirmCancelVehicle = confirmCancelVehicle;
