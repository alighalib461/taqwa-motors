/**
 * Taqwa Motors - Admin Dashboard Logic
 * Loads real metrics and recent vehicles from Supabase.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await window.checkAdminAuth();
  if (auth) {
    loadDashboardMetrics();
    loadRecentVehicles();
  }
});

async function loadDashboardMetrics() {
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  try {
    // 1. Total vehicles
    const { count: totalCount } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });

    // 2. Available vehicles
    const { count: availableCount } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    // 3. Sold vehicles
    const { count: soldCount } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sold');

    // 4. Cancelled vehicles
    const { count: cancelledCount } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'cancelled');

    if (document.getElementById('kpiTotal')) document.getElementById('kpiTotal').textContent = totalCount !== null ? totalCount : '0';
    if (document.getElementById('kpiAvailable')) document.getElementById('kpiAvailable').textContent = availableCount !== null ? availableCount : '0';
    if (document.getElementById('kpiSold')) document.getElementById('kpiSold').textContent = soldCount !== null ? soldCount : '0';
    if (document.getElementById('kpiCancelled')) document.getElementById('kpiCancelled').textContent = cancelledCount !== null ? cancelledCount : '0';

  } catch (err) {
    console.error('Error fetching KPI metrics:', err);
  }
}

async function loadRecentVehicles() {
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  const tableBody = document.getElementById('recentVehiclesTableBody');
  const emptyState = document.getElementById('recentVehiclesEmpty');

  try {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select(`
        id,
        stock_number,
        make,
        model,
        variant,
        year,
        mileage,
        condition,
        description,
        price,
        status,
        created_at,
        vehicle_images (
          image_url,
          is_primary
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent vehicles:', error);
      if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #DC2626; padding: 2rem;">Failed to load recent inventory: ${error.message}</td></tr>`;
      return;
    }

    if (!vehicles || vehicles.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = vehicles.map(v => {
      const primaryImgObj = v.vehicle_images?.find(img => img.is_primary) || v.vehicle_images?.[0];
      const imgUrl = primaryImgObj ? primaryImgObj.image_url : '../assets/cars/fortuner_legender.jpg';
      const formattedPrice = Number.isInteger(Number(v.price)) ? Number(v.price).toLocaleString('en-PK') : Number(v.price).toFixed(2);
      
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
                <div class="car-title-primary">${v.year} ${v.make} ${v.model}</div>
                <div class="car-variant-sub">${v.variant || 'Standard'}</div>
              </div>
            </div>
          </td>
          <td>
            ${conditionDisplay}
            ${importYearBadge}
          </td>
          <td>${v.mileage ? v.mileage.toLocaleString() + ' km' : 'N/A'}</td>
          <td><span class="price-text">PKR ${formattedPrice}</span></td>
          <td>
            <span class="status-badge ${v.status}">
              <span class="status-dot"></span>
              ${v.status}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <a href="inventory-detail.html?id=${v.id}" class="action-btn-icon" title="View Details">
                <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
              </a>
              <a href="inventory-edit.html?id=${v.id}" class="action-btn-icon" title="Edit Vehicle">
                <i data-lucide="edit-3" style="width: 16px; height: 16px;"></i>
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    lucide.createIcons();

  } catch (err) {
    console.error('Error rendering recent vehicles:', err);
  }
}
