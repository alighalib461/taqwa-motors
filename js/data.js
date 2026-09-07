/**
 * Taqwa Motors - Dataset & Configuration
 * Rawalpindi, Pakistan
 * Phone / WhatsApp: 0333-5406173
 * Showroom: Range Road Chowk, Shalley Valley, Rawalpindi
 * 
 * Note: Vehicle Inventory is synced dynamically from the Supabase public_inventory view.
 */

// Initial inventory state (dynamically populated from Supabase)
const INVENTORY_DATA = [];

// Customer Reviews & Testimonials Dataset
const TESTIMONIALS_DATA = [
  {
    name: "Chaudhry Nadeem Akhtar",
    location: "Bahria Town, Rawalpindi",
    carPurchased: "2023 Toyota Fortuner Legender",
    rating: 5,
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    comment: "Buying my Fortuner from Taqwa Motors was the smoothest car transaction I've experienced in 20 years. Their team at Range Road Chowk was 100% upfront about the vehicle's history, verified the dealership records in front of me, and handled the Islamabad biometric transfer within 24 hours. True to their name — pure trust and integrity!"
  },
  {
    name: "Dr. Hammad Rizvi",
    location: "Sector F-8, Islamabad",
    carPurchased: "2024 Haval H6 HEV Hybrid",
    rating: 5,
    date: "1 month ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    comment: "I was looking for a clean Haval H6 Hybrid and visited several showrooms along Rawalpindi and Islamabad. Taqwa Motors stood out immediately with their transparent inspection sheet and professional attitude. No hidden commission, zero drama. Highly recommend them to anyone who values genuine cars."
  },
  {
    name: "Malik Usman Tariq",
    location: "Westridge, Rawalpindi",
    carPurchased: "2023 Honda Civic RS Turbo",
    rating: 5,
    date: "2 months ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    comment: "Their WhatsApp response is lightning fast! I messaged them late evening regarding the Civic RS, got complete video walkthroughs, and visited their showroom the next morning. The car was even cleaner in person. Taqwa Motors is raising the standard for car dealerships in Rawalpindi."
  },
  {
    name: "Brig. (R) Asadullah Khan",
    location: "DHA Phase 2, Islamabad",
    carPurchased: "2021 Toyota Prado TX-L",
    rating: 5,
    date: "3 months ago",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    comment: "Genuine Japanese auction sheets are hard to trust in the local market, but Taqwa Motors verified the chassis number live on the Japan auction database right in their office. The Prado TX was delivered in pristine condition. Exceptional service by the entire Taqwa Motors management."
  }
];

// Dealership Services Data
const SERVICES_DATA = [
  {
    icon: "shield-check",
    title: "150-Point Quality Inspection",
    desc: "Every vehicle undergoes an exhaustive mechanical, electrical, computer diagnostic, and body paint scan before entering our showroom."
  },
  {
    icon: "badge-check",
    title: "Verified Auction Sheets",
    desc: "100% authentic, tamper-free Japanese auction certificates and local dealership service logs verified in front of you."
  },
  {
    icon: "file-text",
    title: "Biometric & Excise Transfer",
    desc: "Complete end-to-end documentation assistance for Islamabad, Rawalpindi, and Punjab excise transfer and biometric verification."
  },
  {
    icon: "arrows-repeat",
    title: "Car Trade-In & Exchange",
    desc: "Upgrade your existing car with our fair, instant market appraisal and hassle-free vehicle exchange program."
  },
  {
    icon: "calculator",
    title: "Bank Leasing & Financing",
    desc: "Personalized assistance with leading Islamic and commercial banks for fast car financing approval at competitive markup rates."
  },
  {
    icon: "gem",
    title: "VIP Showroom Consultation",
    desc: "Private viewing, personalized vehicle sourcing for rare JDM imports, and dedicated test drive appointments at Range Road Chowk."
  }
];

// FAQs Data
const FAQS_DATA = [
  {
    q: "How can I verify the auction sheet and genuine paint of your cars?",
    a: "Every Japanese imported car in our inventory comes with an authentic verifiable Japanese auction sheet. We verify the chassis number live on auction databases (USS, ARAI, TAA) in our showroom. For local vehicles, we provide computerized paint depth meter readings and official dealership service histories."
  },
  {
    q: "Where is Taqwa Motors located in Rawalpindi?",
    a: "Our prime showroom is located at Range Road Chowk, Shalley Valley, Rawalpindi (Google Plus Code: H2X7+VP4). We are easily accessible from Peshawar Road, Saddar, Westridge, and Islamabad via I.J.P Road."
  },
  {
    q: "What are your showroom business hours?",
    a: "We are open 7 days a week from 8:00 AM to 10:00 PM. You can visit anytime or schedule a dedicated VIP test drive and inspection through WhatsApp (0333-5406173)."
  },
  {
    q: "Do you offer car trade-ins / vehicle exchange?",
    a: "Yes! Bring your current vehicle to our showroom for a comprehensive 15-minute evaluation. We offer guaranteed fair market value that can be deducted directly toward your next car purchase."
  },
  {
    q: "Do you assist buyers from other cities (Lahore, Peshawar, Faisalabad)?",
    a: "Absolutely. Over 30% of our buyers come from outside Rawalpindi/Islamabad. We provide comprehensive HD video walkthroughs, third-party inspection facilitation, and nationwide insured enclosed car carrier delivery to your doorstep."
  }
];

// Export to window
window.INVENTORY_DATA = INVENTORY_DATA;
window.TESTIMONIALS_DATA = TESTIMONIALS_DATA;
window.SERVICES_DATA = SERVICES_DATA;
window.FAQS_DATA = FAQS_DATA;
