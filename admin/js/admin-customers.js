/**
 * Taqwa Motors - Customers Management Controller
 * Handles customer search, registration, profile view & purchased vehicles history.
 */

let allCustomers = [];
let editingCustomerId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await window.checkAdminAuth();
  if (!auth) return;

  const isDetailPage = window.location.pathname.includes('customer-detail');

  if (isDetailPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');
    if (customerId) {
      loadCustomerDetail(customerId);
    } else {
      window.location.href = 'customers.html';
    }
  } else {
    initCustomerSearch();
    loadCustomers();
  }
});

function initCustomerSearch() {
  const searchInput = document.getElementById('customerSearchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadCustomers(e.target.value.trim());
      }, 350);
    });
  }
}

async function loadCustomers(searchTerm = '') {
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  const tableBody = document.getElementById('customersTableBody');
  const emptyState = document.getElementById('customersEmptyState');
  const countBadge = document.getElementById('customerCountBadge');

  if (tableBody) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted); padding: 3rem;">Loading customers...</td></tr>`;
  }

  try {
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,cnic.ilike.%${searchTerm}%`);
    }

    const { data: customers, error } = await query;

    if (error) {
      console.error('Error fetching customers:', error);
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #F87171; padding: 2rem;">Error: ${error.message}</td></tr>`;
      }
      return;
    }

    allCustomers = customers || [];
    if (countBadge) countBadge.textContent = `${allCustomers.length} Customers`;

    if (allCustomers.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (tableBody) {
      tableBody.innerHTML = allCustomers.map(c => `
        <tr>
          <td>
            <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">${c.name}</div>
            <div style="font-size: 0.78rem; color: var(--admin-text-muted);">${c.email || 'No email provided'}</div>
          </td>
          <td>
            <span style="color: #60A5FA; font-weight: 600;">${c.phone || 'N/A'}</span>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; background: rgba(255,255,255,0.04); padding: 2px 6px; border-radius: 4px;">
              ${c.cnic || 'Unrecorded'}
            </span>
          </td>
          <td>
            <div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.82rem;">
              ${c.address || 'N/A'}
            </div>
          </td>
          <td>
            <span style="font-size: 0.8rem; color: var(--admin-text-muted);">
              ${new Date(c.created_at).toLocaleDateString()}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <a href="customer-detail.html?id=${c.id}" class="action-btn-icon" title="View Customer Profile & Sales History">
                <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
              </a>
              <button type="button" class="action-btn-icon" title="Edit Customer" onclick="openEditCustomerModal('${c.id}')">
                <i data-lucide="edit-3" style="width: 16px; height: 16px;"></i>
              </button>
              <button type="button" class="action-btn-icon delete" title="Delete Customer" onclick="deleteCustomer('${c.id}', '${c.name}')">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      lucide.createIcons();
    }

  } catch (err) {
    console.error('Customer load error:', err);
  }
}

function openAddCustomerModal() {
  editingCustomerId = null;
  document.getElementById('customerModalTitle').textContent = 'Add New Customer';
  document.getElementById('customerForm').reset();
  document.getElementById('customerModal').classList.add('open');
}

function openEditCustomerModal(id) {
  const c = allCustomers.find(item => item.id === id);
  if (!c) return;

  editingCustomerId = id;
  document.getElementById('customerModalTitle').textContent = 'Edit Customer Details';
  document.getElementById('customerName').value = c.name || '';
  document.getElementById('customerPhone').value = c.phone || '';
  document.getElementById('customerEmail').value = c.email || '';
  document.getElementById('customerCnic').value = c.cnic || '';
  document.getElementById('customerAddress').value = c.address || '';
  document.getElementById('customerNotes').value = c.notes || '';

  document.getElementById('customerModal').classList.add('open');
}

function closeCustomerModal() {
  document.getElementById('customerModal').classList.remove('open');
  document.getElementById('customerForm').reset();
  editingCustomerId = null;
}

async function handleCustomerFormSubmit(e) {
  e.preventDefault();
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const cnic = document.getElementById('customerCnic').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const notes = document.getElementById('customerNotes').value.trim();

  if (!name) {
    alert('Customer full name is required.');
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    alert('Session expired.');
    return;
  }

  try {
    if (!editingCustomerId) {
      // Insert
      const { error } = await supabase
        .from('customers')
        .insert({
          owner_id: session.user.id,
          name,
          phone,
          email,
          cnic,
          address,
          notes
        });

      if (error) {
        alert('Error adding customer: ' + error.message);
        return;
      }
    } else {
      // Update
      const { error } = await supabase
        .from('customers')
        .update({
          name,
          phone,
          email,
          cnic,
          address,
          notes
        })
        .eq('id', editingCustomerId);

      if (error) {
        alert('Error updating customer: ' + error.message);
        return;
      }
    }

    closeCustomerModal();
    loadCustomers();

  } catch (err) {
    console.error('Error saving customer:', err);
  }
}

async function deleteCustomer(id, name) {
  if (!confirm(`Are you sure you want to delete customer "${name}"?\nNote: If this customer has existing vehicle sale records, deletion will be blocked.`)) {
    return;
  }

  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Cannot delete customer: ' + error.message);
    } else {
      loadCustomers();
    }
  } catch (err) {
    console.error('Error deleting customer:', err);
  }
}

async function loadCustomerDetail(customerId) {
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  try {
    // 1. Fetch Customer info
    const { data: c, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error || !c) {
      alert('Customer not found: ' + (error ? error.message : ''));
      window.location.href = 'customers.html';
      return;
    }

    document.getElementById('custDetailName').textContent = c.name;
    document.getElementById('custDetailPhone').textContent = c.phone || 'N/A';
    document.getElementById('custDetailEmail').textContent = c.email || 'N/A';
    document.getElementById('custDetailCnic').textContent = c.cnic || 'N/A';
    document.getElementById('custDetailAddress').textContent = c.address || 'N/A';
    document.getElementById('custDetailNotes').textContent = c.notes || 'No confidential notes recorded.';
    document.getElementById('custDetailJoined').textContent = new Date(c.created_at).toLocaleDateString();

    // 2. Fetch Purchased Vehicles (Sales History)
    const { data: sales, error: salesErr } = await supabase
      .from('sales')
      .select(`
        id,
        sale_date,
        sale_price,
        amount_received,
        remaining_amount,
        payment_method,
        notes,
        vehicles (
          id,
          stock_number,
          make,
          model,
          variant,
          year,
          vehicle_images (
            image_url,
            is_primary
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('sale_date', { ascending: false });

    const salesListEl = document.getElementById('custPurchasedVehiclesList');
    const salesEmptyEl = document.getElementById('custNoPurchasesState');

    if (salesErr || !sales || sales.length === 0) {
      if (salesEmptyEl) salesEmptyEl.style.display = 'block';
      if (salesListEl) salesListEl.innerHTML = '';
      return;
    }

    if (salesEmptyEl) salesEmptyEl.style.display = 'none';

    salesListEl.innerHTML = sales.map(s => {
      const v = s.vehicles;
      const primaryImg = v?.vehicle_images?.find(img => img.is_primary) || v?.vehicle_images?.[0];
      const imgUrl = primaryImg ? primaryImg.image_url : '../assets/cars/fortuner_legender.jpg';

      return `
        <tr>
          <td>
            <div class="car-thumb-cell">
              <img src="${imgUrl}" alt="${v?.make || ''}" class="car-thumb-img" onerror="this.src='../assets/cars/fortuner_legender.jpg'">
              <div>
                <div class="car-title-primary">${v?.year || ''} ${v?.make || ''} ${v?.model || ''}</div>
                <div class="car-variant-sub">${v?.variant || 'Standard'} • <span class="stock-tag">${v?.stock_number || ''}</span></div>
              </div>
            </div>
          </td>
          <td>${new Date(s.sale_date).toLocaleDateString()}</td>
          <td><span class="price-text">PKR ${Number(s.sale_price).toLocaleString('en-PK')}</span></td>
          <td><span style="color: #34D399; font-weight: 600;">PKR ${Number(s.amount_received).toLocaleString('en-PK')}</span></td>
          <td>
            ${s.remaining_amount > 0 ? `<span style="color: #F87171; font-weight: 700;">PKR ${Number(s.remaining_amount).toLocaleString('en-PK')}</span>` : '<span style="color: #34D399; font-weight: 600;">Paid in Full</span>'}
          </td>
          <td>
            <a href="inventory-detail.html?id=${v?.id}" class="btn-secondary btn-sm" title="View Vehicle History">
              <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
              <span>View Car</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    lucide.createIcons();

  } catch (err) {
    console.error('Error loading customer detail:', err);
  }
}

window.openAddCustomerModal = openAddCustomerModal;
window.openEditCustomerModal = openEditCustomerModal;
window.closeCustomerModal = closeCustomerModal;
window.handleCustomerFormSubmit = handleCustomerFormSubmit;
window.deleteCustomer = deleteCustomer;
