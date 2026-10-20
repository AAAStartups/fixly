export const BRANDS = [
  { id: 'apple', name: 'Apple', logo: '', modelsCount: 28 },
  { id: 'samsung', name: 'Samsung', logo: 'SAMSUNG', modelsCount: 42 },
  { id: 'xiaomi', name: 'Xiaomi', logo: 'mi', modelsCount: 36 },
  { id: 'oneplus', name: 'OnePlus', logo: '1+', modelsCount: 24 },
  { id: 'google', name: 'Google', logo: 'G', modelsCount: 16 },
  { id: 'vivo', name: 'Vivo', logo: 'vivo', modelsCount: 30 },
  { id: 'oppo', name: 'OPPO', logo: 'oppo', modelsCount: 28 },
  { id: 'realme', name: 'Realme', logo: 'realme', modelsCount: 26 },
  { id: 'motorola', name: 'Motorola', logo: 'M', modelsCount: 20 },
  { id: 'iqoo', name: 'iQOO', logo: 'iQOO', modelsCount: 18 }
];

export const MODELS_BY_BRAND = {
  apple: [
    { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', year: '2023', screenPrice: 12499, batteryPrice: 3499 },
    { id: 'iphone-15', name: 'iPhone 15', year: '2023', screenPrice: 8999, batteryPrice: 2999 },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro', year: '2022', screenPrice: 9499, batteryPrice: 2899 },
    { id: 'iphone-14', name: 'iPhone 14', year: '2022', screenPrice: 7499, batteryPrice: 2699 },
    { id: 'iphone-13', name: 'iPhone 13', year: '2021', screenPrice: 5999, batteryPrice: 2249 },
    { id: 'iphone-12', name: 'iPhone 12', year: '2020', screenPrice: 4999, batteryPrice: 1999 },
    { id: 'iphone-11', name: 'iPhone 11', year: '2019', screenPrice: 3799, batteryPrice: 1799 }
  ],
  samsung: [
    { id: 's24-ultra', name: 'Galaxy S24 Ultra', year: '2024', screenPrice: 11999, batteryPrice: 3199 },
    { id: 's23-plus', name: 'Galaxy S23 Plus', year: '2023', screenPrice: 8499, batteryPrice: 2799 },
    { id: 's22-ultra', name: 'Galaxy S22 Ultra', year: '2022', screenPrice: 7999, batteryPrice: 2599 },
    { id: 'galaxy-a54', name: 'Galaxy A54 5G', year: '2023', screenPrice: 3899, batteryPrice: 1699 },
    { id: 'galaxy-m34', name: 'Galaxy M34 5G', year: '2023', screenPrice: 2799, batteryPrice: 1499 }
  ],
  xiaomi: [
    { id: 'xiaomi-11t-pro', name: 'Xiaomi 11T Pro 5G', year: '2021', screenPrice: 4299, batteryPrice: 1999 },
    { id: 'xiaomi-11i', name: 'Xiaomi 11i 5G', year: '2022', screenPrice: 3899, batteryPrice: 1849 },
    { id: 'redmi-note-13-pro', name: 'Redmi Note 13 Pro+ 5G', year: '2024', screenPrice: 4499, batteryPrice: 1999 },
    { id: 'redmi-note-12-pro', name: 'Redmi Note 12 Pro 5G', year: '2023', screenPrice: 3499, batteryPrice: 1699 },
    { id: 'poco-x6-pro', name: 'POCO X6 Pro 5G', year: '2024', screenPrice: 3999, batteryPrice: 1799 }
  ],
  oneplus: [
    { id: 'oneplus-12', name: 'OnePlus 12 5G', year: '2024', screenPrice: 9999, batteryPrice: 2899 },
    { id: 'oneplus-11r', name: 'OnePlus 11R 5G', year: '2023', screenPrice: 5499, batteryPrice: 2199 },
    { id: 'oneplus-nord-ce3', name: 'OnePlus Nord CE 3', year: '2023', screenPrice: 3499, batteryPrice: 1699 }
  ],
  google: [
    { id: 'pixel-8-pro', name: 'Google Pixel 8 Pro', year: '2023', screenPrice: 9499, batteryPrice: 2799 },
    { id: 'pixel-7a', name: 'Google Pixel 7a', year: '2023', screenPrice: 5199, batteryPrice: 2099 }
  ],
  vivo: [
    { id: 'vivo-x100-pro', name: 'Vivo X100 Pro 5G', year: '2024', screenPrice: 8999, batteryPrice: 2699 },
    { id: 'vivo-v30-pro', name: 'Vivo V30 Pro 5G', year: '2024', screenPrice: 5499, batteryPrice: 2199 },
    { id: 'vivo-t2-pro', name: 'Vivo T2 Pro 5G', year: '2023', screenPrice: 3799, batteryPrice: 1799 }
  ],
  oppo: [
    { id: 'oppo-reno-11-pro', name: 'Oppo Reno 11 Pro 5G', year: '2024', screenPrice: 6499, batteryPrice: 2399 },
    { id: 'oppo-f25-pro', name: 'Oppo F25 Pro 5G', year: '2024', screenPrice: 4299, batteryPrice: 1899 }
  ],
  realme: [
    { id: 'realme-12-pro-plus', name: 'Realme 12 Pro+ 5G', year: '2024', screenPrice: 4999, batteryPrice: 1999 },
    { id: 'realme-gt-neo-3', name: 'Realme GT Neo 3', year: '2022', screenPrice: 4499, batteryPrice: 1899 },
    { id: 'realme-11-pro', name: 'Realme 11 Pro 5G', year: '2023', screenPrice: 3899, batteryPrice: 1799 }
  ],
  motorola: [
    { id: 'moto-edge-50-pro', name: 'Motorola Edge 50 Pro', year: '2024', screenPrice: 5999, batteryPrice: 2299 },
    { id: 'moto-g84', name: 'Motorola G84 5G', year: '2023', screenPrice: 3299, batteryPrice: 1699 }
  ],
  iqoo: [
    { id: 'iqoo-12', name: 'iQOO 12 5G', year: '2023', screenPrice: 8999, batteryPrice: 2799 },
    { id: 'iqoo-neo-9-pro', name: 'iQOO Neo 9 Pro', year: '2024', screenPrice: 5499, batteryPrice: 2199 },
    { id: 'iqoo-z9', name: 'iQOO Z9 5G', year: '2024', screenPrice: 3299, batteryPrice: 1699 }
  ]
};

export const SERVICES = [
  {
    id: 'display',
    title: 'Display & Screen Replacement',
    description: 'Cracked glass, black lines, touch unresponsive, flickering OLED or AMOLED panel.',
    startingPrice: '₹1,499',
    warranty: '6 Months',
    turnaround: '60 Mins',
    icon: 'Smartphone',
    features: ['Original OLED / AMOLED panels', 'True Tone & Touch ID retention', 'Oleophobic coating included']
  },
  {
    id: 'battery',
    title: 'Battery Replacement',
    description: 'Fast draining, random shutdowns, heating, or swollen battery. 100% health restoration.',
    startingPrice: '₹999',
    warranty: '6 Months',
    turnaround: '45 Mins',
    icon: 'BatteryCharging',
    features: ['Original cycle count (0 cycles)', 'High-density Li-ion polymer', 'Safe disposal of old cell']
  },
  {
    id: 'backglass',
    title: 'Back Glass & Frame Housing',
    description: 'Shattered rear glass, bent frame, or camera lens rim dent. Laser removal precision.',
    startingPrice: '₹1,299',
    warranty: '30 Days',
    turnaround: '90 Mins',
    icon: 'Layers',
    features: ['Cold laser adhesive removal', 'Factory dust seal restoration', 'Original color matching']
  },
  {
    id: 'charging',
    title: 'Charging Port & Mic IC',
    description: 'Loose cable connection, slow charging, moisture detected error, or mic issues.',
    startingPrice: '₹799',
    warranty: '30 Days',
    turnaround: '45 Mins',
    icon: 'Zap',
    features: ['Original Type-C / Lightning port', 'Micro-soldered sub-board', 'Super fast-charge verified']
  },
  {
    id: 'camera',
    title: 'Camera Module (Front / Rear)',
    description: 'Blurry lens, autofocus vibration jitter, cracked sapphire lens, or black screen.',
    startingPrice: '₹1,499',
    warranty: '30 Days',
    turnaround: '60 Mins',
    icon: 'Camera',
    features: ['OIS stabilization calibration', 'Original sensor modules', 'Laser cleaned chamber']
  },
  {
    id: 'water',
    title: 'Water Damage Diagnostics',
    description: 'Phone submerged or exposed to liquid. Ultrasonic cleaning & board-level recovery.',
    startingPrice: '₹1,999',
    warranty: '30 Days',
    turnaround: '120 Mins',
    icon: 'Droplets',
    features: ['Ultrasonic motherboard bath', 'Short circuit trace repair', 'Corrosion neutralization']
  }
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Book in 60 Seconds',
    subtitle: 'Flat ₹79 Doorstep Pickup',
    desc: 'Select your phone model and repair issue. Choose a convenient 1-hour time window. Our verified rider arrives at your doorstep.',
    icon: 'Truck'
  },
  {
    step: '02',
    title: 'Free Workshop Diagnosis',
    subtitle: 'Zero Cost Evaluation',
    desc: 'Device is inspected under microscope in our central precision lab. Certified technicians diagnose exact issues with photos.',
    icon: 'Search'
  },
  {
    step: '03',
    title: 'Transparent Estimate',
    subtitle: 'You Stay In Complete Control',
    desc: 'Receive an itemized digital quotation on WhatsApp and SMS. Approve or decline with zero pressure or cancellation charges.',
    icon: 'Receipt'
  },
  {
    step: '04',
    title: 'Delivered & Protected',
    subtitle: 'Pay After Repair + 30-Day Guarantee',
    desc: 'Passes 24-point hardware QC test. Delivered back safely. Pay via UPI/Card only when 100% satisfied with active 30-day warranty.',
    icon: 'ShieldCheck'
  }
];

export const DEMO_ORDERS = {
  'QF-2026-0042': {
    orderNumber: '#QF-2026-0042',
    customerName: 'Akshay Kumar',
    device: 'Xiaomi 11T Pro 5G',
    issue: 'Display Replacement (OEM)',
    status: 'In Progress (Stage 2 of 5: Device Received)',
    stageIndex: 2,
    rider: 'Rohit Sharma (Rider ID: #R-104)',
    riderPhone: '+91 98765 12340',
    pickupTime: '10:00 AM, 19 Oct',
    labArrival: '11:15 AM, 19 Oct',
    estimatedDelivery: 'Same Day by 5:30 PM',
    amount: '₹4,378',
    warranty: '30 Days Guaranteed',
    diagnosisNotes: 'Original AMOLED panel cracked. Digitizer unresponsive on top right. Motherboard and battery healthy.'
  },
  'QF-2025-9812': {
    orderNumber: '#QF-2025-9812',
    customerName: 'Priya Sharma',
    device: 'iPhone 13 128GB',
    issue: 'Battery Replacement (OEM)',
    status: 'Completed & Delivered',
    stageIndex: 5,
    rider: 'Manoj Verma (Rider ID: #R-88)',
    pickupTime: 'Completed 12 Sep 2026',
    amount: '₹2,328',
    warranty: '14 Days Remaining',
    diagnosisNotes: 'Original battery health was 71%. New OEM cell installed with 100% battery capacity.'
  }
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rahul Deshmukh',
    city: 'Pune',
    device: 'iPhone 14 Pro',
    issue: 'Screen Replacement',
    rating: 5,
    date: '2 days ago',
    text: 'Authorized center quoted ₹28,000 and 7 days waiting. Fixly picked it up from my office, repaired it with original OLED, and delivered back in 3 hours for less than half the price. Exceptional service!'
  },
  {
    id: 2,
    name: 'Sneha Patel',
    city: 'Bengaluru',
    device: 'OnePlus 11R',
    issue: 'Battery & Back Glass',
    rating: 5,
    date: '1 week ago',
    text: 'The best part is paying AFTER the repair is done. The rider brought the phone, let me test all gestures and camera, and only then I paid through UPI. 30-day warranty gives real peace of mind.'
  },
  {
    id: 3,
    name: 'Vikram Joshi',
    city: 'Mumbai',
    device: 'Xiaomi 11T Pro',
    issue: 'Charging Port IC',
    rating: 5,
    date: '2 weeks ago',
    text: 'Super transparent pricing. They sent a diagnosis photo of the corroded sub-board before touching anything. Flat ₹79 pickup fee is totally worth it!'
  }
];

export const FAQS = [
  {
    q: 'Is the diagnosis really 100% free?',
    a: 'Yes, completely zero cost. If our technician inspects your device and you decide not to proceed with the repair quotation, you only pay the flat ₹79 doorstep logistics charge.'
  },
  {
    q: 'What is the 30-Day Fixly Warranty policy?',
    a: 'Every repair comes with our 30-day hardware guarantee covering both parts and workmanship. If the replaced component develops any glitch or defect within 30 days, we pick it up and replace it with zero questions asked.'
  },
  {
    q: 'When do I have to pay?',
    a: 'Never upfront. You only pay after the repair is completed, your phone has passed all quality checks, and it is safely returned to your hands. We accept UPI, GPay, PhonePe, Cards, and Netbanking.'
  },
  {
    q: 'Are your spare parts genuine?',
    a: 'We use premium OEM-grade and original specification components tested across 24 hardware parameters (touch response, TrueTone, color gamut, fast-charge wattage, and thermal stability).'
  },
  {
    q: 'How fast is the turnaround time?',
    a: 'Most standard repairs like screen and battery replacements are completed within 60 to 90 minutes of arriving at our lab. Over 85% of phones are delivered back the very same day.'
  }
];
