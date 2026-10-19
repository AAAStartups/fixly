export const BRANDS = [
  { id: 'apple', name: 'Apple', logo: '' },
  { id: 'samsung', name: 'Samsung', logo: 'SAMSUNG' },
  { id: 'oneplus', name: 'OnePlus', logo: '1+' },
  { id: 'google', name: 'Google', logo: 'G' },
  { id: 'xiaomi', name: 'Xiaomi', logo: 'mi', color: '#FF6900' },
  { id: 'vivo', name: 'Vivo', logo: 'vivo' },
  { id: 'motorola', name: 'Motorola', logo: 'M' },
  { id: 'realme', name: 'Realme', logo: 'realme' },
  { id: 'oppo', name: 'OPPO', logo: 'oppo' },
  { id: 'poco', name: 'POCO', logo: 'POCO' },
  { id: 'iqoo', name: 'iQOO', logo: 'iQOO' },
  { id: 'huawei', name: 'Huawei', logo: 'HUAWEI' }
];

export const MODELS = [
  {
    id: 'xm-11i',
    brandId: 'xiaomi',
    name: 'Xiaomi 11i 5G',
    year: '2022',
    network: '5G'
  },
  {
    id: 'xm-11i-hc',
    brandId: 'xiaomi',
    name: 'Xiaomi 11i HyperCharge',
    year: '2022',
    network: '5G'
  },
  {
    id: 'xm-11-lite',
    brandId: 'xiaomi',
    name: 'Xiaomi 11 Lite NE 5G',
    year: '2021',
    network: '5G'
  },
  {
    id: 'xm-11t-pro',
    brandId: 'xiaomi',
    name: 'Xiaomi 11T Pro 5G',
    year: '2021',
    network: '5G'
  },
  {
    id: 'xm-12-pro',
    brandId: 'xiaomi',
    name: 'Xiaomi 12 Series 12 Pro 5G',
    year: '2022',
    network: '5G'
  },
  {
    id: 'xm-7a',
    brandId: 'xiaomi',
    name: 'Xiaomi 7A',
    year: '2019',
    network: '4G'
  },
  {
    id: 'xm-8',
    brandId: 'xiaomi',
    name: 'Xiaomi 8',
    year: '2018',
    network: '4G'
  }
];

export const SERVICES = [
  {
    id: 'display',
    title: 'Display',
    subtitle: 'Screen replacement (OEM)',
    price: 4299,
    warranty: '6 months warranty',
    live: true,
    icon: 'smartphone'
  },
  {
    id: 'battery',
    title: 'Battery',
    subtitle: 'Battery replacement (OEM)',
    price: 2249,
    warranty: '6 months warranty',
    live: true,
    icon: 'battery-charging'
  },
  {
    id: 'charging-port',
    title: 'Charging Port',
    subtitle: 'Charging issue / port replacement',
    price: 1299,
    warranty: '6 months warranty',
    live: true,
    icon: 'zap'
  },
  {
    id: 'camera',
    title: 'Camera',
    subtitle: 'Front / Back camera replacement',
    price: 2999,
    warranty: '6 months warranty',
    live: true,
    icon: 'camera'
  },
  {
    id: 'speaker',
    title: 'Speaker',
    subtitle: 'Sound issue / speaker replacement',
    price: 1499,
    warranty: '6 months warranty',
    live: true,
    icon: 'volume-2'
  },
  {
    id: 'water-damage',
    title: 'Water Damage',
    subtitle: 'Diagnosis & repair',
    price: 1999,
    warranty: '6 months warranty',
    live: true,
    icon: 'droplets'
  }
];

export const PICKUP_DATES = [
  { day: 'Mon', date: '19', month: 'Oct' },
  { day: 'Tue', date: '20', month: 'Oct' },
  { day: 'Wed', date: '21', month: 'Oct' },
  { day: 'Thu', date: '22', month: 'Oct' },
  { day: 'Fri', date: '23', month: 'Oct' },
  { day: 'Sat', date: '24', month: 'Oct' },
  { day: 'Sun', date: '25', month: 'Oct' }
];

export const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '2:30 PM',
  '4:00 PM',
  '5:30 PM',
  '6:30 PM'
];

export const ISSUE_CATEGORIES = [
  { id: 'display', title: 'Display\nIssues', icon: 'smartphone' },
  { id: 'battery', title: 'Battery\nIssues', icon: 'battery' },
  { id: 'back-glass', title: 'Back Glass\nBroken', icon: 'shield-alert' },
  { id: 'audio', title: 'Audio\nIssues', icon: 'volume-x' },
  { id: 'charging', title: 'Charging\nIssues', icon: 'zap' },
  { id: 'dead', title: 'Dead\nPhone', icon: 'skull' },
  { id: 'network', title: 'Network\nIssues', icon: 'radio' },
  { id: 'water', title: 'Water\nDamage', icon: 'droplet' }
];

export const POPULAR_REPAIRS = [
  { title: 'Screen\nReplacement', price: 'From ₹1,499', icon: 'smartphone' },
  { title: 'Battery\nReplacement', price: 'From ₹999', icon: 'battery-charging' },
  { title: 'Back Glass\nRepair', price: 'From ₹1,299', icon: 'shield-alert' },
  { title: 'Charging Port\nRepair', price: 'From ₹799', icon: 'zap' }
];
