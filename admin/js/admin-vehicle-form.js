/**
 * Taqwa Motors - Vehicle Add/Edit Form Controller
 * Handles form validation, Supabase DB insert/update, and vehicle-images Storage uploads.
 */

let isEditMode = false;
let editingVehicleId = null;
let stagedFiles = []; // { file, previewUrl, isPrimary, sortOrder }
let existingImages = []; // { id, image_url, is_primary, sort_order }

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await window.checkAdminAuth();
  if (!auth) return;

  const urlParams = new URLSearchParams(window.location.search);
  editingVehicleId = urlParams.get('id');
  isEditMode = !!editingVehicleId;

  initDropzone();

  if (isEditMode) {
    document.getElementById('pageTitleText').textContent = 'Edit Vehicle';
    document.getElementById('pageSubtitleText').textContent = 'Update dealership vehicle specifications and media';
    document.getElementById('submitBtnText').textContent = 'Update Vehicle';
    loadVehicleForEdit(editingVehicleId);
  } else {
    // Generate an automatic Stock Number suggestion if desired
    const stockInput = document.getElementById('vehicleStockNumber');
    if (stockInput && !stockInput.value) {
      stockInput.placeholder = 'e.g. TM-' + Math.floor(100 + Math.random() * 900);
    }
  }
});

function initDropzone() {
  const dropzone = document.getElementById('imageDropzone');
  const fileInput = document.getElementById('imageFileInput');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
      fileInput.value = ''; // reset so same files can be re-selected if needed
    }
  });
}

function handleFilesSelected(files) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  files.forEach(file => {
    if (!validTypes.includes(file.type)) {
      alert(`File "${file.name}" is not a supported format. Please upload JPG, PNG, or WebP.`);
      return;
    }
    if (file.size > maxSizeBytes) {
      alert(`File "${file.name}" exceeds the 10MB file size limit.`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const isFirst = stagedFiles.length === 0 && existingImages.length === 0;

    stagedFiles.push({
      file,
      previewUrl,
      isPrimary: isFirst,
      sortOrder: stagedFiles.length + existingImages.length
    });
  });

  renderImagePreviews();
}

function renderImagePreviews() {
  const container = document.getElementById('imagePreviewGrid');
  if (!container) return;

  let html = '';

  // Render existing images from DB (in edit mode)
  existingImages.forEach((img, idx) => {
    html += `
      <div class="preview-card" data-existing-id="${img.id}">
        <img src="${img.image_url}" alt="Vehicle Photo">
        <button type="button" class="btn-remove-img" title="Remove image" onclick="removeExistingImage('${img.id}')">✕</button>
        ${img.is_primary ? '<span class="primary-tag">Primary</span>' : `<button type="button" class="btn-set-primary" onclick="setExistingAsPrimary('${img.id}')">Make Primary</button>`}
      </div>
    `;
  });

  // Render new staged files
  stagedFiles.forEach((item, idx) => {
    html += `
      <div class="preview-card">
        <img src="${item.previewUrl}" alt="Staged photo">
        <button type="button" class="btn-remove-img" title="Remove file" onclick="removeStagedFile(${idx})">✕</button>
        ${item.isPrimary ? '<span class="primary-tag">Primary</span>' : `<button type="button" class="btn-set-primary" onclick="setStagedAsPrimary(${idx})">Make Primary</button>`}
      </div>
    `;
  });

  container.innerHTML = html;
}

function removeStagedFile(index) {
  stagedFiles.splice(index, 1);
  // If no primary remains, set first item as primary
  if (stagedFiles.length > 0 && !stagedFiles.some(f => f.isPrimary) && !existingImages.some(i => i.is_primary)) {
    stagedFiles[0].isPrimary = true;
  }
  renderImagePreviews();
}

function setStagedAsPrimary(index) {
  existingImages.forEach(img => img.is_primary = false);
  stagedFiles.forEach((f, i) => f.isPrimary = (i === index));
  renderImagePreviews();
}

async function removeExistingImage(imageId) {
  if (!confirm('Remove this photo from vehicle gallery?')) return;
  const supabase = window.getSupabaseClient();
  if (supabase) {
    await supabase.from('vehicle_images').delete().eq('id', imageId);
  }
  existingImages = existingImages.filter(img => img.id !== imageId);
  renderImagePreviews();
}

function setExistingAsPrimary(imageId) {
  existingImages.forEach(img => img.is_primary = (img.id === imageId));
  stagedFiles.forEach(f => f.isPrimary = false);
  renderImagePreviews();
}

async function loadVehicleForEdit(vehicleId) {
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  try {
    const { data: v, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (
          id,
          image_url,
          is_primary,
          sort_order
        )
      `)
      .eq('id', vehicleId)
      .single();

    if (error || !v) {
      alert('Failed to load vehicle: ' + (error ? error.message : 'Not found'));
      window.location.href = 'inventory.html';
      return;
    }

    // Populate form inputs
    document.getElementById('vehicleStockNumber').value = v.stock_number || '';
    document.getElementById('vehicleMake').value = v.make || '';
    document.getElementById('vehicleModel').value = v.model || '';
    document.getElementById('vehicleVariant').value = v.variant || '';
    document.getElementById('vehicleYear').value = v.year || '';
    document.getElementById('vehicleRegNumber').value = v.registration_number || '';
    document.getElementById('vehicleChassisNumber').value = v.chassis_number || '';
    document.getElementById('vehicleMileage').value = v.mileage || '';
    document.getElementById('vehicleFuelType').value = v.fuel_type || 'Petrol';
    document.getElementById('vehicleTransmission').value = v.transmission || 'Automatic';
    document.getElementById('vehicleColor').value = v.color || '';
    document.getElementById('vehicleCondition').value = v.condition || '';
    document.getElementById('vehiclePrice').value = v.price || '';
    document.getElementById('vehicleStatus').value = v.status || 'available';
    document.getElementById('vehicleFeatured').checked = !!v.featured;
    document.getElementById('vehicleDescription').value = v.description || '';

    // Populate images
    existingImages = v.vehicle_images || [];
    renderImagePreviews();

  } catch (err) {
    console.error('Error loading vehicle for edit:', err);
  }
}

async function handleVehicleFormSubmit(e) {
  e.preventDefault();
  const supabase = window.getSupabaseClient();
  if (!supabase) return;

  const btn = document.getElementById('saveVehicleBtn');
  const alertEl = document.getElementById('formAlert');

  // Gather values
  const stock_number = document.getElementById('vehicleStockNumber').value.trim();
  const make = document.getElementById('vehicleMake').value.trim();
  const model = document.getElementById('vehicleModel').value.trim();
  const variant = document.getElementById('vehicleVariant').value.trim();
  const year = parseInt(document.getElementById('vehicleYear').value, 10);
  const registration_number = document.getElementById('vehicleRegNumber').value.trim() || null;
  const chassis_number = document.getElementById('vehicleChassisNumber').value.trim() || null;
  const mileage = document.getElementById('vehicleMileage').value ? parseInt(document.getElementById('vehicleMileage').value, 10) : null;
  const fuel_type = document.getElementById('vehicleFuelType').value;
  const transmission = document.getElementById('vehicleTransmission').value;
  const color = document.getElementById('vehicleColor').value.trim();
  const condition = document.getElementById('vehicleCondition').value.trim();
  const price = parseFloat(document.getElementById('vehiclePrice').value);
  const status = document.getElementById('vehicleStatus').value;
  const featured = document.getElementById('vehicleFeatured').checked;
  const description = document.getElementById('vehicleDescription').value.trim();

  // Validations
  if (!stock_number || !make || !model || !year || isNaN(price)) {
    showFormAlert('Please fill in all required fields (Stock #, Make, Model, Year, Asking Price).', 'danger');
    return;
  }

  if (price < 0) {
    showFormAlert('Price cannot be negative.', 'danger');
    return;
  }
  if (mileage !== null && mileage < 0) {
    showFormAlert('Mileage cannot be negative.', 'danger');
    return;
  }
  if (year < 1900 || year > 2100) {
    showFormAlert('Please enter a valid model year (1900 - 2100).', 'danger');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span>Saving vehicle & uploading images...</span>`;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Session expired. Please log in again.');
      window.location.href = 'login.html';
      return;
    }

    let targetVehicleId = editingVehicleId;

    if (!isEditMode) {
      // 1. Insert new vehicle
      const { data: newVehicle, error: insertErr } = await supabase
        .from('vehicles')
        .insert({
          owner_id: session.user.id,
          stock_number,
          make,
          model,
          variant,
          year,
          registration_number,
          chassis_number,
          mileage,
          fuel_type,
          transmission,
          color,
          condition,
          price,
          status,
          featured,
          description
        })
        .select('id')
        .single();

      if (insertErr) {
        showFormAlert('Error creating vehicle: ' + insertErr.message, 'danger');
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="check" style="width:18px;height:18px;"></i> <span>Save Vehicle</span>`;
        lucide.createIcons();
        return;
      }

      targetVehicleId = newVehicle.id;

    } else {
      // 2. Update existing vehicle
      const { error: updateErr } = await supabase
        .from('vehicles')
        .update({
          stock_number,
          make,
          model,
          variant,
          year,
          registration_number,
          chassis_number,
          mileage,
          fuel_type,
          transmission,
          color,
          condition,
          price,
          status,
          featured,
          description
        })
        .eq('id', targetVehicleId);

      if (updateErr) {
        showFormAlert('Error updating vehicle: ' + updateErr.message, 'danger');
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="check" style="width:18px;height:18px;"></i> <span>Update Vehicle</span>`;
        lucide.createIcons();
        return;
      }
    }

    // 3. Update existing images primary flags in DB if changed
    if (isEditMode && existingImages.length > 0) {
      for (const img of existingImages) {
        await supabase
          .from('vehicle_images')
          .update({ is_primary: img.is_primary })
          .eq('id', img.id);
      }
    }

    // 4. Upload any staged image files to Supabase Storage: vehicle-images/{vehicle_id}/{filename}
    if (stagedFiles.length > 0) {
      for (let i = 0; i < stagedFiles.length; i++) {
        const item = stagedFiles[i];
        const cleanName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${targetVehicleId}/${Date.now()}_${cleanName}`;

        const { data: uploadData, error: uploadErr } = await supabase
          .storage
          .from('vehicle-images')
          .upload(storagePath, item.file, {
            contentType: item.file.type,
            upsert: false
          });

        if (uploadErr) {
          console.error(`Error uploading image ${item.file.name}:`, uploadErr);
          continue;
        }

        // Get public URL
        const { data: publicData } = supabase
          .storage
          .from('vehicle-images')
          .getPublicUrl(storagePath);

        // Record in vehicle_images table
        await supabase
          .from('vehicle_images')
          .insert({
            vehicle_id: targetVehicleId,
            image_url: publicData.publicUrl,
            is_primary: item.isPrimary,
            sort_order: item.sortOrder
          });
      }
    }

    showFormAlert(`Vehicle [${stock_number}] successfully ${isEditMode ? 'updated' : 'added'}! Redirecting...`, 'success');

    setTimeout(() => {
      window.location.href = `inventory-detail.html?id=${targetVehicleId}`;
    }, 800);

  } catch (err) {
    console.error('Error saving vehicle:', err);
    showFormAlert('An unexpected error occurred while saving.', 'danger');
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="check" style="width:18px;height:18px;"></i> <span>Save Vehicle</span>`;
    lucide.createIcons();
  }
}

function showFormAlert(message, type = 'danger') {
  const alertEl = document.getElementById('formAlert');
  if (!alertEl) return;
  alertEl.className = `alert-banner alert-${type}`;
  alertEl.innerHTML = `<i data-lucide="${type === 'danger' ? 'alert-circle' : 'check-circle'}" style="width:18px;height:18px;"></i> <span>${message}</span>`;
  alertEl.style.display = 'flex';
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  lucide.createIcons();
}

window.removeStagedFile = removeStagedFile;
window.setStagedAsPrimary = setStagedAsPrimary;
window.removeExistingImage = removeExistingImage;
window.setExistingAsPrimary = setExistingAsPrimary;
window.handleVehicleFormSubmit = handleVehicleFormSubmit;
