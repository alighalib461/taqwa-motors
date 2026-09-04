/**
 * Taqwa Motors - Real Inventory Dataset
 * Rawalpindi, Pakistan
 * Phone / WhatsApp: 0333-5406173
 */

const INVENTORY_DATA = [
  {
    id: "TM-101",
    featured: true,
    badge: "Featured Arrival",
    make: "Toyota",
    model: "Fortuner",
    variant: "Legender 2.8 Sigma 4",
    year: 2023,
    price: 19800000,
    priceFormatted: "PKR 1.98 Crore",
    mileage: 18500,
    mileageFormatted: "18,500 km",
    fuelType: "Diesel",
    transmission: "Automatic",
    engineCapacity: "2755 cc",
    horsepower: "201 hp",
    bodyType: "SUV",
    assembly: "Local",
    registrationCity: "Islamabad",
    color: "Super White & Gloss Black Roof",
    interiorColor: "Black & Maroon Dual-Tone",
    seatingCapacity: 7,
    conditionGrade: "Certified 9.8/10",
    auctionSheet: "100% Genuine Paint Guaranteed",
    images: [
      "assets/cars/fortuner_legender.jpg",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Immaculate 2023 Toyota Fortuner Legender 2.8 Sigma 4 in Super White with exclusive factory Black package. Bumper-to-bumper 100% original genuine paint, single-hand driven in Islamabad, authorized Toyota dealership maintained with complete service history. Equipped with JBL Premium sound, 360-degree cameras, illuminated scuff plates, and sequential LED turn indicators.",
    keySpecs: [
      "2.8L 1GD-FTV Turbo Diesel",
      "Sigma 4 Part-Time 4WD with Diff Lock",
      "6-Speed Sequential Auto with Paddle Shifters",
      "JBL 11-Speaker Audio System",
      "Powered Tailgate with Kick Sensor",
      "Dual-Zone Auto Climate Control"
    ],
    features: {
      safety: ["7 SRS Airbags", "Vehicle Stability Control (VSC)", "Hill Assist & Downhill Control", "360 Panoramic View Camera", "Front & Rear Parking Sensors", "Anti-Lock Braking (ABS) with EBD"],
      comfort: ["Dual-Tone Ventilated Leather Seats", "8-Way Power Adjustable Driver & Passenger Seats", "Ambient Interior Illumination", "Rear AC Vents for 2nd & 3rd Row", "Smart Entry with Push Start"],
      technology: ["9-inch Infotainment with Apple CarPlay & Android Auto", "Wireless Smartphone Charger", "Optitron Meter with 4.2\" TFT Screen", "Drive Modes (Eco, Normal, Sport)"],
      exterior: ["Quad-LED Projector Headlamps", "Exclusive Legender Front & Rear Bumper", "18-inch Two-Tone Alloy Wheels", "Roof Rails & Rear Spoiler"]
    },
    inspection: {
      body: "100% Genuine (No Touchups)",
      engine: "100% Health & Diagnostics Clear",
      suspension: "98% Rating",
      interior: "Pristine Like New",
      tires: "85% Tread Remaining",
      score: "9.8 / 10"
    }
  },
  {
    id: "TM-102",
    featured: true,
    badge: "VIP Luxury",
    make: "Toyota",
    model: "Land Cruiser",
    variant: "LC300 ZX (Twin-Turbo)",
    year: 2024,
    price: 92000000,
    priceFormatted: "PKR 9.20 Crore",
    mileage: 4200,
    mileageFormatted: "4,200 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    engineCapacity: "3444 cc",
    horsepower: "409 hp",
    bodyType: "SUV",
    assembly: "Imported (JDM)",
    registrationCity: "Unregistered",
    color: "Pearl White (090)",
    interiorColor: "Beige & Hazelnut Premium Leather",
    seatingCapacity: 7,
    conditionGrade: "Auction Grade 5.0 (Brand New Condition)",
    auctionSheet: "Verified Japan Auction Sheet Available",
    images: [
      "assets/cars/lc300.jpg",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The Pinnacle of Luxury & Off-Road Dominance. 2024 Toyota Land Cruiser LC300 ZX V6 Twin-Turbo in immaculate Pearl White. Direct Japanese import with genuine Grade 5 auction sheet. Fully loaded with Rear Entertainment Screens, 14-Speaker JBL Synthesis, Head-Up Display (HUD), Fingerprint Engine Start, Cool Box, and Toyota Safety Sense 2.5.",
    keySpecs: [
      "3.5L V6 Twin-Turbo (V35A-FTS) 409 HP",
      "10-Speed Direct-Shift Automatic",
      "Adaptive Variable Suspension (AVS) + E-KDSS",
      "Rear Seat Dual 11.6\" Entertainment Screens",
      "Head-Up Display & Fingerprint Start",
      "Cooler Box & 360 3D Multi-Terrain Monitor"
    ],
    features: {
      safety: ["10 SRS Airbags", "Toyota Safety Sense (Pre-Collision, Lane Tracing, Dynamic Radar Cruise)", "Blind Spot Monitor with RCTA", "Multi-Terrain ABS", "Active Traction Control (A-TRC)"],
      comfort: ["Premium Smooth Leather with Heating & Ventilation (1st & 2nd Row)", "4-Zone Independent Climate Control", "Power Folding 3rd Row Seats", "Electric Sunroof with Tilt/Slide", "Soft-Close Powered Tailgate"],
      technology: ["12.3-inch Touch Display Navigation", "JBL 14-Speaker Premium Surround", "Wireless Apple CarPlay / Android Auto", "Qi Wireless Charging Pad", "Multi-Terrain Select Modes"],
      exterior: ["20-inch ZX Exclusive Chrome Alloys", "Triple-Eye LED Headlamps with Sequential Blinkers", "Chrome Accent Front Grille", "Illuminated Side Steps"]
    },
    inspection: {
      body: "Factory New Grade 5",
      engine: "100% Factory Seal",
      suspension: "100% Brand New",
      interior: "100% Factory Flawless",
      tires: "99% Tread Remaining",
      score: "10 / 10"
    }
  },
  {
    id: "TM-103",
    featured: true,
    badge: "Verified Hot Deal",
    make: "Honda",
    model: "Civic",
    variant: "RS Turbo 1.5 VTEC",
    year: 2023,
    price: 8950000,
    priceFormatted: "PKR 89.5 Lacs",
    mileage: 14000,
    mileageFormatted: "14,000 km",
    fuelType: "Petrol",
    transmission: "CVT",
    engineCapacity: "1498 cc",
    horsepower: "176 hp",
    bodyType: "Sedan",
    assembly: "Local",
    registrationCity: "Islamabad",
    color: "Meteoroid Gray Metallic",
    interiorColor: "Black Leather with Red Stitching",
    seatingCapacity: 5,
    conditionGrade: "Certified 9.9/10",
    auctionSheet: "First Owner Islamabad Registered",
    images: [
      "assets/cars/civic_rs.jpg",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Stunning 2023 Honda Civic RS Turbo in aggressive Meteoroid Gray. Powered by the potent 1.5L Turbocharged VTEC engine producing 176HP. Features Honda SENSING Suite (Adaptive Cruise, Collision Mitigation Braking, Road Departure Warning), Electric Sunroof, Dual Exhaust, and 17\" Gloss Black Alloys.",
    keySpecs: [
      "1.5L VTEC DOHC Turbocharged 176 HP",
      "Honda SENSING Advanced Driver Assistance",
      "CVT with 7-Speed Paddle Shifters",
      "Electric Sunroof with One-Touch",
      "Dual Exhaust Finishers",
      "First Owner, Bumper-to-Bumper Genuine"
    ],
    features: {
      safety: ["Honda SENSING Suite", "6 SRS Airbags", "Vehicle Stability Assist (VSA)", "Hill Start Assist", "Multi-Angle Rear Camera", "Auto Brake Hold (ABH)"],
      comfort: ["RS Sport Leather Seats with Red Accent Trim", "Dual-Zone Automatic Climate Control", "Rear AC Vents", "Push Button Start & Smart Entry", "Remote Engine Start"],
      technology: ["9-inch Touchscreen Audio", "Digital 7-inch TFT Meter Cluster", "Wireless Apple CarPlay", "Drive Modes (Sport, Normal, Econ)"],
      exterior: ["Full LED Headlights with DRL", "Gloss Black Honeycomb Grille & RS Badging", "17-inch Shark Gray Alloy Wheels", "Gloss Black Trunk Spoiler"]
    },
    inspection: {
      body: "100% Original Paint Guaranteed",
      engine: "100% Diagnostic Health",
      suspension: "99% Flawless",
      interior: "Non-smoker, Spotless",
      tires: "90% Tread Remaining",
      score: "9.9 / 10"
    }
  },
  {
    id: "TM-104",
    featured: true,
    badge: "Executive Sedan",
    make: "Toyota",
    model: "Corolla",
    variant: "Altis Grande 1.8 CVT-i",
    year: 2023,
    price: 7350000,
    priceFormatted: "PKR 73.5 Lacs",
    mileage: 21000,
    mileageFormatted: "21,000 km",
    fuelType: "Petrol",
    transmission: "CVT",
    engineCapacity: "1798 cc",
    horsepower: "138 hp",
    bodyType: "Sedan",
    assembly: "Local",
    registrationCity: "Rawalpindi",
    color: "Attitude Black",
    interiorColor: "Ivory Beige & Black Dual-Tone",
    seatingCapacity: 5,
    conditionGrade: "Certified 9.5/10",
    auctionSheet: "Toyota Dealership Maintained",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Highly sought after 2023 Toyota Corolla Altis Grande 1.8 Dual VVT-i with CVT-i 7-speed sequential shift. Finished in prestigious Attitude Black. Bumper-to-bumper original condition, Rawalpindi registered, genuine low mileage. Features Sunroof, Cruise Control, Leather interior, and Push Start.",
    keySpecs: [
      "1.8L 2ZR-FE Dual VVT-i Engine",
      "CVT-i with 7-Speed Sport Mode",
      "Sunroof with Anti-Jam Protection",
      "Paddle Shifters & Cruise Control",
      "9\" In-Dash Android Infotainment",
      "Complete Toyota Service Records"
    ],
    features: {
      safety: ["Dual SRS Airbags", "Vehicle Stability Control (VSC)", "Traction Control (TRC)", "Anti-Lock Braking (ABS) with Brake Assist", "Rearview Camera with Dynamic Guidelines"],
      comfort: ["Perforated Ivory Leather Seats", "Automatic Climate Control with Nanoe Ionizer", "Push Start with Smart Keyless Entry", "Tilt & Telescopic Steering Wheel", "Rear Armrest with Cupholders"],
      technology: ["9-inch Capacitive Touch Screen", "Optitron Meter with 4.2\" MID", "Steering Mounted Audio & Cruise Controls", "Bluetooth Handsfree"],
      exterior: ["Bi-Beam LED Headlights with LED Daytime Running Lights", "16-inch Machine Finish Alloy Wheels", "Chrome Door Handles & Window Trims", "Retractable Side Mirrors with Indicators"]
    },
    inspection: {
      body: "100% Genuine (Zero Touchups)",
      engine: "100% Health (Dealership Logged)",
      suspension: "97% Smooth & Sound",
      interior: "Very Clean / Pristine",
      tires: "85% Tread Remaining",
      score: "9.6 / 10"
    }
  },
  {
    id: "TM-105",
    featured: true,
    badge: "Luxury 4x4",
    make: "Toyota",
    model: "Prado",
    variant: "TX-L 2.7 Package",
    year: 2021,
    price: 38500000,
    priceFormatted: "PKR 3.85 Crore",
    mileage: 32000,
    mileageFormatted: "32,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    engineCapacity: "2693 cc",
    horsepower: "161 hp",
    bodyType: "SUV",
    assembly: "Imported (JDM)",
    registrationCity: "Islamabad",
    color: "Pearl White (070)",
    interiorColor: "Black Leather with Woodgrain Accents",
    seatingCapacity: 7,
    conditionGrade: "Auction Grade 4.5 Certified",
    auctionSheet: "Verified Japan Auction Certificate",
    images: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Prestigious 2021 Toyota Land Cruiser Prado TX-L 2.7 in Pearl White. Islamabad registered with custom VIP number. Original Grade 4.5 Japanese import with certified auction sheet. Equipped with 7-Seats, Electric Sunroof, Modellista Aerokit, 360-degree Cameras, and Cool Box.",
    keySpecs: [
      "2.7L 2TR-FE Dual VVT-i Petrol Engine",
      "6-Speed Super ECT Automatic 4WD",
      "Original Modellista Bodykit & Chrome Accents",
      "Sunroof & Cool Box",
      "7-Passenger Luxury Seating with Power Folding 3rd Row",
      "Custom Islamabad VIP Number Included"
    ],
    features: {
      safety: ["Toyota Safety Sense P", "8 SRS Airbags", "Vehicle Stability Control (VSC)", "Active Traction Control (A-TRC)", "360 Panoramic Surround Monitor", "Downhill Assist Control (DAC)"],
      comfort: ["Heated & Ventilated Power Front Seats", "Triple-Zone Climate Control", "Center Console Refrigerator (Cool Box)", "Electric Sunroof", "Illuminated Side Steps"],
      technology: ["Toyota Touch 2 with Go Navigation", "Multi-Information Display", "Blind Spot Monitor (BSM)", "Keyless Smart Entry with Push Start"],
      exterior: ["Modellista Aero Front & Rear Spoiler", "19-inch Premium Alloy Wheels", "LED Headlamps with Auto Leveling", "Chrome Roof Rails & Rear Garnish"]
    },
    inspection: {
      body: "99% Flawless Genuine",
      engine: "100% Top Performance",
      suspension: "98% Rating",
      interior: "Spotless Luxury Leather",
      tires: "85% Tread Remaining",
      score: "9.7 / 10"
    }
  },
  {
    id: "TM-106",
    featured: true,
    badge: "Smart Hybrid",
    make: "Haval",
    model: "H6",
    variant: "HEV (Hybrid Electric Vehicle)",
    year: 2024,
    price: 11800000,
    priceFormatted: "PKR 1.18 Crore",
    mileage: 8500,
    mileageFormatted: "8,500 km",
    fuelType: "Hybrid",
    transmission: "Automatic",
    engineCapacity: "1497 cc",
    horsepower: "240 hp (Combined)",
    bodyType: "Crossover",
    assembly: "Local",
    registrationCity: "Islamabad",
    color: "Crystal Black",
    interiorColor: "Black & Burgundy Nappa Leather",
    seatingCapacity: 5,
    conditionGrade: "Showroom Mint 9.9/10",
    auctionSheet: "Company Maintained Under Warranty",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "High-tech powerhouse! 2024 Haval H6 HEV Hybrid in sleek Crystal Black. Combines a 1.5L Turbo engine with electric motor generating 240 HP with astonishing fuel efficiency of 18-20 km/L. Packed with Level 2 Autonomous Driving, Full Panoramic Sunroof, Head-Up Display, and Automated Parking.",
    keySpecs: [
      "1.5L Turbo Hybrid (240 HP / 530 Nm Torque)",
      "2-Speed Dedicated Hybrid Transmission (DHT)",
      "Fuel Average: 18 - 22 km/L in City",
      "Level 2 Autonomous Driving & Auto Parking",
      "Full Panoramic Glass Sunroof",
      "Factory Warranty Valid Until 2028"
    ],
    features: {
      safety: ["Autonomous Emergency Braking (AEB)", "Adaptive Cruise Control with Stop & Go", "Lane Keep Assist & Blind Spot Monitoring", "360 Degree 3D Camera with Transparent Chassis", "6 Airbags", "Traffic Jam Assist (TJA)"],
      comfort: ["Panoramic Sunroof with Electric Shade", "Heated & Ventilated Power Front Seats with Memory", "Dual-Zone Automatic AC with Air Purifier (PM2.5)", "Wireless Mobile Charger", "Hands-Free Electric Tailgate"],
      technology: ["12.3-inch Full Color Touchscreen Infotainment", "10.25-inch Digital Instrument Cluster", "Full Color Head-Up Display (HUD)", "Apple CarPlay & Android Auto"],
      exterior: ["Matrix LED Headlights with Dynamic Indicators", "19-inch Gloss Black Alloy Wheels", "Full-width LED Taillight Bar", "Aero Rear Diffuser"]
    },
    inspection: {
      body: "100% Factory Original",
      engine: "100% Hybrid System Certified",
      suspension: "100% Like New",
      interior: "Brand New Smell",
      tires: "95% Tread Remaining",
      score: "9.9 / 10"
    }
  },
  {
    id: "TM-107",
    featured: false,
    badge: "Popular AWD",
    make: "KIA",
    model: "Sportage",
    variant: "AWD (All Wheel Drive)",
    year: 2023,
    price: 7650000,
    priceFormatted: "PKR 76.5 Lacs",
    mileage: 19500,
    mileageFormatted: "19,500 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    engineCapacity: "1999 cc",
    horsepower: "155 hp",
    bodyType: "Crossover",
    assembly: "Local",
    registrationCity: "Islamabad",
    color: "Clear White",
    interiorColor: "Terra Cotta & Black Leather",
    seatingCapacity: 5,
    conditionGrade: "Certified 9.6/10",
    auctionSheet: "Single Owner Dealership Maintained",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Top condition 2023 KIA Sportage AWD in Clear White with premium Terra Cotta interior. Islamabad registered, single owner, dealership maintained with complete service book. Equipped with Dynamax All-Wheel Drive with Lock Mode, Panoramic Sunroof, Power Tailgate, and 8-inch Infotainment.",
    keySpecs: [
      "2.0L Nu MPI Gasoline Engine",
      "6-Speed Automatic with Sportmatic",
      "Dynamax Intelligent AWD with Lock Mode",
      "Panoramic Sunroof with Power Shade",
      "Smart Power Tailgate",
      "Dealership Maintained"
    ],
    features: {
      safety: ["Dual Airbags", "Electronic Stability Control (ESC)", "Downhill Brake Control (DBC)", "Hill-start Assist Control (HAC)", "Rear View Camera with Parking Sensors"],
      comfort: ["8-Way Power Adjustable Driver Seat with Lumbar Support", "Dual-Zone Automatic Temperature Control with Cluster Ionizer", "Rear AC Vents", "Cruise Control & Smart Key with Push Start"],
      technology: ["8-inch Infotainment System with Apple CarPlay & Android Auto", "3.5-inch TFT LCD Instrument Cluster", "Wireless Phone Charger", "Drive Modes (Normal, Eco, Sport)"],
      exterior: ["Bi-Xenon Projection Headlamps with Ice-Cube LED Fog Lamps", "18-inch Machine Finish Alloys", "Rear Roof Spoiler & Shark Fin Antenna"]
    },
    inspection: {
      body: "100% Genuine Paint",
      engine: "100% Smooth & Tested",
      suspension: "97% Rating",
      interior: "Super Clean & Odor-free",
      tires: "85% Tread Remaining",
      score: "9.6 / 10"
    }
  },
  {
    id: "TM-108",
    featured: false,
    badge: "Premium Crossover",
    make: "Hyundai",
    model: "Tucson",
    variant: "AWD Ultimate",
    year: 2023,
    price: 7900000,
    priceFormatted: "PKR 79.0 Lacs",
    mileage: 24000,
    mileageFormatted: "24,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    engineCapacity: "1999 cc",
    horsepower: "155 hp",
    bodyType: "Crossover",
    assembly: "Local",
    registrationCity: "Rawalpindi",
    color: "Panthera Metal Gray",
    interiorColor: "Burgundy Leather",
    seatingCapacity: 5,
    conditionGrade: "Certified 9.5/10",
    auctionSheet: "Hyundai Rawalpindi Maintained",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Refined 2023 Hyundai Tucson AWD in attractive Panthera Metal Gray. Rawalpindi registered with single executive owner. Features HTRAC All-Wheel-Drive, Panoramic Sunroof, Wireless Charging, 8-way Power Driver Seat, and Automatic Smart Tailgate.",
    keySpecs: [
      "2.0L MPI Engine (155 HP / 196 Nm)",
      "6-Speed H-Matic Automatic",
      "HTRAC Electronic All-Wheel Drive",
      "Panoramic Glass Sunroof",
      "Smart Power Tailgate with Height Adjust",
      "Rawalpindi Registered"
    ],
    features: {
      safety: ["Dual Front SRS Airbags", "Vehicle Stability Management (VSM)", "Electronic Stability Control (ESC)", "Downhill Brake Control (DBC)", "Rear Parking Sensors with Camera"],
      comfort: ["Burgundy Leather Upholstery", "Dual-Zone Climate Control with Clean Air", "8-Way Power Driver Seat with Lumbar", "Smart Key with Push Start & Immobilizer"],
      technology: ["10.1-inch Floating Infotainment Display", "Wireless Smartphone Charger", "Auto Cruise Control", "Drive Modes (Comfort, Eco, Sport)"],
      exterior: ["Penta-LED Headlamps with LED DRLs", "18-inch Diamond Cut Alloy Wheels", "Silver Roof Rails & Twin Chrome Exhaust Tip"]
    },
    inspection: {
      body: "100% Original Genuine",
      engine: "100% Diagnostic Pass",
      suspension: "98% Rating",
      interior: "Very Clean & Well Maintained",
      tires: "85% Tread Remaining",
      score: "9.5 / 10"
    }
  },
  {
    id: "TM-109",
    featured: false,
    badge: "JDM Hybrid Import",
    make: "Honda",
    model: "Vezel",
    variant: "e:HEV Z Package",
    year: 2023,
    price: 8800000,
    priceFormatted: "PKR 88.0 Lacs",
    mileage: 16000,
    mileageFormatted: "16,000 km",
    fuelType: "Hybrid",
    transmission: "E-CVT",
    engineCapacity: "1498 cc",
    horsepower: "131 hp (Combined)",
    bodyType: "Crossover",
    assembly: "Imported (JDM)",
    registrationCity: "Unregistered",
    color: "Sand Khaki Dual Tone",
    interiorColor: "Black & Prime Smooth Leather",
    seatingCapacity: 5,
    conditionGrade: "Auction Grade 4.5 Certified",
    auctionSheet: "Verified Japan Auction Sheet Included",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sleek, futuristic, and ultra-economical Japanese import! 2023 Honda Vezel e:HEV Z in rare Sand Khaki Pearl with Black Roof. Direct Japanese auction import with verifiable Grade 4.5 sheet. Features Honda Sensing safety, Hands-free Kick Power Tailgate, Heated Steering & Seats, and exceptional fuel economy of 22-26 km/L.",
    keySpecs: [
      "1.5L i-VTEC e:HEV Dual-Motor Hybrid",
      "E-CVT Dual Motor Drive (EV, Hybrid, Engine Modes)",
      "Fuel Average: 22 - 26 km/L",
      "Hands-Free Kick-Activated Power Tailgate",
      "Heated Steering Wheel & Heated Front Seats",
      "Grade 4.5 Auction Sheet Guaranteed"
    ],
    features: {
      safety: ["Honda Sensing Suite (Radar Cruise, Lane Keep, Pre-Crash Safety)", "6 Airbags", "Multi-View Camera System", "Blind Spot Information (BSI)", "Auto High Beam"],
      comfort: ["Prime Smooth Leatherette & Fabric Combination", "Dual-Zone Automatic Climate with Air Diffusion Vents", "Heated Front Seats & Heated Steering", "Electrochromic Auto-Dimming Mirror"],
      technology: ["Honda CONNECT Display Navigation", "Wireless Apple CarPlay", "Wireless Qi Charger", "Regenerative Braking Deceleration Selectors (Paddle Controls)"],
      exterior: ["Integrated Body-Color Front Grille", "Full LED Headlamps with Sequential Turn Signals", "18-inch Two-Tone Z-Grade Alloys", "LED Horizontal Rear Light Bar"]
    },
    inspection: {
      body: "Grade 4.5 (No Repair/No Repaint)",
      engine: "100% Hybrid System Tested",
      suspension: "100% Japanese Flawless",
      interior: "Grade A Interior Rating",
      tires: "90% Tread Remaining",
      score: "9.8 / 10"
    }
  },
  {
    id: "TM-110",
    featured: false,
    badge: "Heavy Duty 4x4",
    make: "Toyota",
    model: "Hilux Revo",
    variant: "Rocco 2.8 4x4 Automatic",
    year: 2023,
    price: 14800000,
    priceFormatted: "PKR 1.48 Crore",
    mileage: 26000,
    mileageFormatted: "26,000 km",
    fuelType: "Diesel",
    transmission: "Automatic",
    engineCapacity: "2755 cc",
    horsepower: "201 hp",
    bodyType: "4x4 Pickup",
    assembly: "Local",
    registrationCity: "Islamabad",
    color: "Oxide Bronze Metallic",
    interiorColor: "Black Leather with Rocco Emblems",
    seatingCapacity: 5,
    conditionGrade: "Certified 9.7/10",
    auctionSheet: "Complete Toyota Warranty & Records",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The King of the Rough Terrains. 2023 Toyota Hilux Revo Rocco 2.8 4x4 in commanding Oxide Bronze Metallic. Islamabad registered, 100% original paint, never abused. Features aggressive Rocco styling, Overfenders, Sports Bar, 4x4 Shift-on-the-fly, and Rear Differential Lock.",
    keySpecs: [
      "2.8L 1GD-FTV Turbo Diesel (201 HP / 500 Nm)",
      "6-Speed Sequential Automatic Transmission",
      "4WD System with Shift-on-Fly & Rear Diff Lock",
      "Rocco Exclusive Aggressive Grille & Sports Bar",
      "Deck Bedliner with Tailgate Assist",
      "Toyota Dealership Maintained"
    ],
    features: {
      safety: ["7 SRS Airbags", "Vehicle Stability Control (VSC)", "Traction Control (TRC)", "Hill-start Assist & Downhill Assist Control", "Trailer Sway Control (TSC)", "Reverse Camera"],
      comfort: ["Rocco Black Leather Seats with 8-Way Power Driver Seat", "Auto Dual-Zone Climate Control", "Smart Key with Engine Push Start", "Cruise Control & Optitron Meters"],
      technology: ["9-inch Touchscreen Infotainment with Apple CarPlay", "Optitron Meter with 4.2\" MID", "Drive Modes (Eco, Power)"],
      exterior: ["Bi-Beam LED Headlamps with Rocco Smoke Finish", "18-inch Rocco Matte Black Alloy Wheels", "Rocco Sports Bar & Black Overfenders", "Illuminated Bed Side Steps"]
    },
    inspection: {
      body: "100% Genuine (No Scratches / Dents)",
      engine: "100% Powerful & Clean",
      suspension: "98% Heavy Duty Tested",
      interior: "Very Neat Condition",
      tires: "85% All-Terrain Tread",
      score: "9.7 / 10"
    }
  },
  {
    id: "TM-111",
    featured: false,
    badge: "City Hatchback",
    make: "Suzuki",
    model: "Swift",
    variant: "GLX CVT (Top-of-the-Line)",
    year: 2023,
    price: 4850000,
    priceFormatted: "PKR 48.5 Lacs",
    mileage: 12000,
    mileageFormatted: "12,000 km",
    fuelType: "Petrol",
    transmission: "CVT",
    engineCapacity: "1197 cc",
    horsepower: "82 hp",
    bodyType: "Hatchback",
    assembly: "Local",
    registrationCity: "Rawalpindi",
    color: "Phoenix Red & Black Dual-Tone",
    interiorColor: "Sport Black Fabric",
    seatingCapacity: 5,
    conditionGrade: "Certified 9.9/10",
    auctionSheet: "Suzuki Dealership Warranty Valid",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sporty, dynamic, and fuel efficient! 2023 Suzuki Swift GLX CVT in vibrant Phoenix Red. Top-of-the-line variant with 6 Airbags, Cruise Control, Projector LED Headlamps, 9-inch Android Auto Display, and D-Cut Sports Steering Wheel. Rawalpindi registered, bumper to bumper genuine.",
    keySpecs: [
      "1.2L K12M 4-Cylinder DOHC VVT Engine",
      "CVT Automatic Transmission with Sports Mode",
      "6 SRS Airbags for Maximum Safety",
      "Cruise Control & Tilt/Telescopic Steering",
      "9-inch Touch Screen Infotainment",
      "Under Company Warranty"
    ],
    features: {
      safety: ["6 SRS Airbags (Front, Side, Curtain)", "Electronic Stability Program (ESP)", "Anti-Lock Braking System (ABS) with EBD", "Hill Hold Control", "Reverse Camera & Rear Parking Sensors"],
      comfort: ["Automatic Climate Control AC", "Smart Keyless Entry with Engine Push Start", "D-Cut Multi-Function Steering Wheel", "Driver Seat Height Adjuster"],
      technology: ["9-inch Android Infotainment with Screen Mirroring", "4.2-inch Color TFT Multi-Information Display", "Cruise Control with Steering Switches"],
      exterior: ["LED Projector Headlamps with Integrated DRLs", "16-inch Diamond Cut Two-Tone Alloy Wheels", "Gloss Black Honeycomb Grille with Chrome Accent", "Rear Roof Spoiler"]
    },
    inspection: {
      body: "100% Genuine (Bumper-to-Bumper)",
      engine: "100% Smooth & Diagnostic Clean",
      suspension: "100% Perfect",
      interior: "Brand New Condition",
      tires: "92% Tread Remaining",
      score: "9.9 / 10"
    }
  },
  {
    id: "TM-112",
    featured: false,
    badge: "Budget Friendly",
    make: "Suzuki",
    model: "Alto",
    variant: "VXR (Fuel Saver)",
    year: 2022,
    price: 2650000,
    priceFormatted: "PKR 26.5 Lacs",
    mileage: 28000,
    mileageFormatted: "28,000 km",
    fuelType: "Petrol",
    transmission: "Manual",
    engineCapacity: "658 cc",
    horsepower: "39 hp",
    bodyType: "Hatchback",
    assembly: "Local",
    registrationCity: "Islamabad",
    color: "Solid White",
    interiorColor: "Grey Fabric",
    seatingCapacity: 4,
    conditionGrade: "Certified 9.2/10",
    auctionSheet: "First Owner Islamabad Registered",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Pakistan's most fuel-efficient commuter car. 2022 Suzuki Alto VXR in clean Solid White. Islamabad registered with single owner. Delivers an impressive 20-24 km/L fuel economy. Features Power Steering, Chilled Air Conditioning, Dual Airbags, and Keyless Entry.",
    keySpecs: [
      "658cc R06A 3-Cylinder Fuel Efficient Engine",
      "5-Speed Manual Transmission",
      "Fuel Average: 20 - 24 km/L in City",
      "Dual Airbags & ABS Brakes",
      "Chilled Air Conditioning & Power Steering",
      "First Owner Islamabad Registered"
    ],
    features: {
      safety: ["Dual SRS Front Airbags", "Anti-Lock Braking System (ABS)", "Front Seatbelts with Pretensioners", "Child Proof Rear Door Locks", "Immobilizer Anti-Theft"],
      comfort: ["High-Efficiency Air Conditioning", "Electronic Power Steering (EPS)", "Cup Holders & Bottle Storage", "Remote Keyless Entry"],
      technology: ["Digital Speedometer & Trip Computer", "Audio Unit with Bluetooth & AUX", "Door Ajar Warning"],
      exterior: ["Crystal Clear Headlamps", "Body Colored Bumpers", "13-inch Wheels with Full Wheel Covers"]
    },
    inspection: {
      body: "100% Genuine (Clean Bumper & Panels)",
      engine: "100% Sound & Economical",
      suspension: "95% Rating",
      interior: "Neat & Well-Preserved",
      tires: "80% Tread Remaining",
      score: "9.3 / 10"
    }
  }
];

// Testimonials Data
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
