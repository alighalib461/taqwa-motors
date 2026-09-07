/**
 * Taqwa Motors - WhatsApp Integration & Conversion Suite
 * Dealership Phone / WhatsApp: 0333-5406173 (Pakistan: +92 333 5406173)
 * Showroom: Range Road Chowk, Shalley Valley, Rawalpindi
 */

const TAQWA_WHATSAPP_NUMBER = "923335406173";

// Generate WhatsApp direct URL with formatted message
function createWhatsAppUrl(message) {
  const encodedMsg = encodeURIComponent(message.trim());
  return `https://wa.me/${TAQWA_WHATSAPP_NUMBER}?text=${encodedMsg}`;
}

// Open WhatsApp in new tab
function openWhatsApp(message) {
  const url = createWhatsAppUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
}

// Inquire about specific vehicle
function inquireCarWhatsApp(carId) {
  const car = window.INVENTORY_DATA.find(c => c.id === carId);
  if (!car) {
    openWhatsApp("Hi Taqwa Motors, I would like to inquire about your available cars.");
    return;
  }

  const message = `Assalam-o-Alaikum Taqwa Motors,

I am interested in this vehicle listed on your website:
🚗 *${car.year} ${car.make} ${car.model} ${car.variant}*
📋 Stock Ref: *${car.stockNumber || car.id}*
💰 Listed Price: *${car.priceFormatted}*
📍 Registration: *${car.registrationCity}*
🛣️ Mileage: *${car.mileageFormatted}*

Is this car currently available for inspection at your Range Road Chowk showroom? Please share more details and auction sheet verification. Thank you!`;

  openWhatsApp(message);
}

// Book Test Drive or Inspection
function bookTestDriveWhatsApp(carId, customerName, date, time) {
  const car = window.INVENTORY_DATA.find(c => c.id === carId);
  const carName = car ? `${car.year} ${car.make} ${car.model} (${car.id})` : "your showroom vehicle";

  const message = `Assalam-o-Alaikum Taqwa Motors,

I would like to schedule a VIP Showroom Inspection & Test Drive:
👤 *Name:* ${customerName || 'Car Enthusiast'}
🚗 *Vehicle:* ${carName}
📅 *Preferred Date:* ${date || 'Soon'}
⏰ *Preferred Time:* ${time || 'Showroom Hours (8 AM - 10 PM)'}

Showroom: Range Road Chowk, Shalley Valley, Rawalpindi.
Please confirm the appointment.`;

  openWhatsApp(message);
}

// Export Calculated EMI Financing to WhatsApp
function sendEmiToWhatsApp(carName, vehiclePrice, downPayment, monthlyEmi, tenureYears) {
  const message = `Assalam-o-Alaikum Taqwa Motors,

I calculated a Car Financing / EMI Plan on your website:
🚗 *Vehicle:* ${carName || 'Custom Vehicle'}
💵 *Total Car Price:* PKR ${vehiclePrice.toLocaleString()}
💳 *Down Payment:* PKR ${downPayment.toLocaleString()}
📅 *Tenure:* ${tenureYears} Years (${tenureYears * 12} Months)
⚡ *Estimated Monthly Installment:* PKR ${monthlyEmi.toLocaleString()} / Month

Please connect me with your bank financing desk for Islamic/Commercial leasing details. Thank you!`;

  openWhatsApp(message);
}

// Initialize WhatsApp Floating Desk Drawer
function initWhatsAppDesk() {
  const trigger = document.getElementById("whatsappTrigger");
  const chatBox = document.getElementById("whatsappChatBox");
  const closeBtn = document.getElementById("closeChatBox");

  if (trigger && chatBox) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      chatBox.classList.toggle("active");
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        chatBox.classList.remove("active");
      });
    }

    document.addEventListener("click", (e) => {
      if (chatBox.classList.contains("active") && !chatBox.contains(e.target) && e.target !== trigger) {
        chatBox.classList.remove("active");
      }
    });
  }
}

// Export to window
window.createWhatsAppUrl = createWhatsAppUrl;
window.openWhatsApp = openWhatsApp;
window.inquireCarWhatsApp = inquireCarWhatsApp;
window.bookTestDriveWhatsApp = bookTestDriveWhatsApp;
window.sendEmiToWhatsApp = sendEmiToWhatsApp;
window.initWhatsAppDesk = initWhatsAppDesk;
