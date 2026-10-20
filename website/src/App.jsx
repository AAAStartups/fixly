import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import * as api from './services/api';
import {
  Smartphone,
  BatteryCharging,
  Layers,
  Zap,
  Camera,
  Droplets,
  Truck,
  Search,
  Receipt,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  Shield,
  Star,
  MapPin,
  Calendar,
  X,
  Plus,
  HelpCircle,
  ExternalLink,
  Award
} from 'lucide-react';
import {
  BRANDS,
  MODELS_BY_BRAND,
  SERVICES,
  HOW_IT_WORKS,
  DEMO_ORDERS,
  TESTIMONIALS,
  FAQS
} from './data';

export default function App() {
  // Estimator Widget State
  const [selectedBrandId, setSelectedBrandId] = useState('xiaomi');
  const [selectedModelId, setSelectedModelId] = useState('xiaomi-11t-pro');
  const [selectedServiceId, setSelectedServiceId] = useState('display');

  // Tracking Portal State
  const [trackingQuery, setTrackingQuery] = useState('QF-2026-0042');
  const [trackedOrder, setTrackedOrder] = useState(DEMO_ORDERS['QF-2026-0042']);
  const [trackingError, setTrackingError] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Booking Modal State (5-Step Mobile App Flow Replicated)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1 = Brand, 2 = Model, 3 = Service, 4 = Time, 5 = Details, 6 = Success
  const [modalBrandSearch, setModalBrandSearch] = useState('');
  const [modalModelSearch, setModalModelSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedPickupDate, setSelectedPickupDate] = useState('Tomorrow, 21 Oct');
  const [selectedPickupSlot, setSelectedPickupSlot] = useState('10:00 AM - 11:30 AM');
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Selected Model & Price Calculations
  const currentBrand = BRANDS.find((b) => b.id === selectedBrandId) || BRANDS[0];
  const availableModels = MODELS_BY_BRAND[selectedBrandId] || MODELS_BY_BRAND.apple;
  const currentModel =
    availableModels.find((m) => m.id === selectedModelId) || availableModels[0];
  const currentService =
    SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const estimatedPartPrice =
    selectedServiceId === 'battery'
      ? currentModel?.batteryPrice || 1999
      : selectedServiceId === 'charging'
      ? 799
      : selectedServiceId === 'backglass'
      ? 1299
      : selectedServiceId === 'camera'
      ? 1899
      : selectedServiceId === 'water'
      ? 1999
      : currentModel?.screenPrice || 4299;

  const logisticsFee = 79;
  const totalPrice = estimatedPartPrice + logisticsFee;

  // Live Services Dynamic Override State
  const [liveServicePrices, setLiveServicePrices] = useState({});

  useEffect(() => {
    api.getServices().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        const priceMap = {};
        res.forEach((s) => {
          if (s.code && s.price) priceMap[s.code] = s.price;
        });
        setLiveServicePrices(priceMap);
      }
    }).catch(() => {});
  }, []);

  // Handle Tracker Lookup (Connected to Live Backend)
  const handleTrackLookup = async (e) => {
    e?.preventDefault();
    const cleanQuery = trackingQuery.trim().toUpperCase().replace('#', '');
    try {
      const liveOrder = await api.lookupOrder(cleanQuery);
      if (liveOrder) {
        const formatted = {
          id: liveOrder.orderNumber,
          model: liveOrder.model?.name || 'Device',
          service: liveOrder.issueDescription || 'Hardware Repair',
          deviceColor: 'Obsidian Black',
          stage:
            liveOrder.status === 'PICKUP_SCHEDULED'
              ? 1
              : liveOrder.status === 'DEVICE_RECEIVED'
              ? 2
              : liveOrder.status === 'DIAGNOSIS_PENDING' || liveOrder.status === 'ESTIMATE_SENT'
              ? 2
              : liveOrder.status === 'REPAIR_IN_PROGRESS' || liveOrder.status === 'QUALITY_CHECK_PASSED'
              ? 3
              : liveOrder.status === 'OUT_FOR_DELIVERY' || liveOrder.status === 'DELIVERED'
              ? 4
              : 1,
          stageTitle: liveOrder.status?.replace(/_/g, ' ') || 'Order In Progress',
          stageDescription:
            liveOrder.timeline?.[liveOrder.timeline.length - 1]?.description ||
            'Device undergoing service at FIXLY Central Workshop.',
          riderName: liveOrder.rider?.name || 'Assigned Logistics Rider',
          riderPhone: liveOrder.rider?.phoneNumber || '+91 97777 77777',
          techName: liveOrder.technician?.name || 'Certified Lab Specialist',
          slot: liveOrder.pickupSlot
            ? new Date(liveOrder.pickupSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '10:00 AM',
          notes:
            liveOrder.diagnosisNotes ||
            liveOrder.issueDescription ||
            'Diagnostic intake checklist completed.',
          total: Number(liveOrder.estimate?.totalAmount) || 4777,
        };
        setTrackedOrder(formatted);
        setTrackingError(false);
        return;
      }
    } catch (err) {
      // Fallback to DEMO_ORDERS if offline or demo ID
      const found = DEMO_ORDERS[cleanQuery];
      if (found) {
        setTrackedOrder(found);
        setTrackingError(false);
        return;
      }
    }
    setTrackedOrder(null);
    setTrackingError(true);
  };

  // Launch Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF2B42', '#FFFFFF', '#FF8595']
    });
  };

  // Submit Booking to Live Backend
  const handleConfirmBooking = async () => {
    try {
      const res = await api.createOrder({
        modelId: currentModel?.id || 'xm-11t-pro',
        brandId: selectedBrandId || 'xiaomi',
        serviceId: selectedServiceId || 'display',
        customerName: customerName || 'Valued Customer',
        customerPhone: customerPhone || '+919876543210',
        pickupAddress: customerAddress || 'Powai, Mumbai',
        pickupDate: selectedPickupDate || 'Tomorrow',
        pickupSlot: selectedPickupSlot || '10:00 AM',
        issueDescription: `${currentService?.title || 'Hardware'} repair for ${currentModel?.name || 'Smartphone'}`,
      });

      const orderNumber = res?.order?.orderNumber || `QF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedOrderId(orderNumber);
      setModalStep(6);
      triggerConfetti();

      // Preload tracking portal with newly placed order
      if (res?.order) {
        setTrackedOrder({
          id: orderNumber,
          model: currentModel?.name || 'Device',
          service: currentService?.title || 'Repair Service',
          deviceColor: 'Obsidian Black',
          stage: 1,
          stageTitle: 'Pickup Scheduled',
          stageDescription: `Doorstep pickup assigned for ${selectedPickupDate} (${selectedPickupSlot}).`,
          riderName: 'Logistics Fleet Dispatch',
          riderPhone: '+91 97777 77777',
          techName: 'Certified Lab Specialist',
          slot: selectedPickupSlot,
          notes: 'Device booked for doorstep collection and multi-point diagnosis.',
          total: totalPrice,
        });
        setTrackingQuery(orderNumber);
      }
    } catch (err) {
      console.warn('Booking API error, falling back to instant confirmation:', err.message);
      const newId = `QF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedOrderId(newId);
      setModalStep(6);
      triggerConfetti();
    }
  };

  const openBookingWithPreset = (brandId, modelId, serviceId) => {
    if (brandId) setSelectedBrandId(brandId);
    if (modelId) setSelectedModelId(modelId);
    if (serviceId) setSelectedServiceId(serviceId);
    setModalBrandSearch('');
    setModalModelSearch('');
    setModalStep(1);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="website-root">
      {/* 1. DESKTOP NAVIGATION BAR */}
      <nav className="navbar-fixed">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '76px' }}>
          {/* Brand Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Fixly Logo" style={{ width: '38px', height: '38px', borderRadius: '8px' }} />
            <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#FFFFFF' }}>FIX</span>
              <span style={{ color: 'var(--primary-red)' }}>LY</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '15px', fontWeight: 600, transition: 'color 0.2s' }}>
              Services
            </a>
            <a href="#estimator" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '15px', fontWeight: 600, transition: 'color 0.2s' }}>
              Pricing Calculator
            </a>
            <a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '15px', fontWeight: 600, transition: 'color 0.2s' }}>
              How It Works
            </a>
            <a href="#tracker" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '15px', fontWeight: 600, transition: 'color 0.2s' }}>
              Live Tracking
            </a>
            <a href="#warranty" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '15px', fontWeight: 600, transition: 'color 0.2s' }}>
              30-Day Guarantee
            </a>
            <a href="#faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '15px', fontWeight: 600, transition: 'color 0.2s' }}>
              FAQ
            </a>
          </div>

          {/* Nav Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => {
                setModalStep(1);
                setIsBookingModalOpen(true);
              }}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Book Doorstep Pickup (₹79) <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (DESKTOP 2-COLUMN SPLIT) */}
      <section style={{ padding: '70px 0 90px', background: 'var(--bg-canvas)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '60px', alignItems: 'center' }}>
          {/* Left Column: Value Prop */}
          <div>
            <div className="section-badge">
              <Award size={13} /> Certified Smartphone Lab
            </div>
            <h1 style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px' }}>
              Professional Phone Repairs <br />
              <span style={{ color: 'var(--primary-red)' }}>At Your Doorstep</span> in 60 Mins.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px', maxWidth: '560px' }}>
              Skip long queues at crowded service centers. Certified technicians, transparent itemized pricing, zero-cost lab diagnosis, and flat ₹79 doorstep logistics anywhere in your city.
            </p>

            {/* 4 Trust Feature Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '36px' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1E1E22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E4E4E7' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>Flat ₹79 Logistics</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Doorstep pickup & drop</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1E1E22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E4E4E7' }}>
                  <Search size={20} />
                </div>
                <div>
                  <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>Free Lab Diagnosis</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Zero-cost device check</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1E1E22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E4E4E7' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>30-Day Guarantee</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No-questions warranty</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1E1E22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E4E4E7' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>Pay After Repair</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Test phone then pay</div>
                </div>
              </div>
            </div>

            {/* Social Proof Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} fill="#FFB800" color="#FFB800" />
                ))}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>4.9 / 5 Rating</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>based on 14,200+ repaired devices</span>
            </div>
          </div>

          {/* Right Column: Instant Price Estimator Widget */}
          <div id="estimator" className="glow-card" style={{ padding: '32px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>INSTANT CALCULATOR</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>Get Repair Estimate</h3>
              </div>
              <div style={{ backgroundColor: '#18181B', color: '#D4D4D8', border: '1px solid #27272A', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 700 }}>
                TRANSPARENT PRICING
              </div>
            </div>

            {/* Brand Tabs */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                1. SELECT BRAND
              </label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {BRANDS.slice(0, 5).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrandId(b.id);
                      const models = MODELS_BY_BRAND[b.id] || [];
                      if (models[0]) setSelectedModelId(models[0].id);
                    }}
                    style={{
                      flex: '1',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      backgroundColor: selectedBrandId === b.id ? 'var(--primary-red)' : 'var(--bg-elevated)',
                      color: selectedBrandId === b.id ? '#FFF' : 'var(--text-muted)',
                      border: `1px solid ${selectedBrandId === b.id ? 'var(--primary-red)' : 'var(--border-subtle)'}`,
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                2. SELECT MODEL
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id} style={{ backgroundColor: '#1A1A1A', color: '#FFF' }}>
                    {m.name} ({m.year})
                  </option>
                ))}
              </select>
            </div>

            {/* Service Category Buttons (2x3 Grid) */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                3. SELECT ISSUE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      backgroundColor: selectedServiceId === s.id ? 'rgba(255,43,66,0.18)' : 'var(--bg-elevated)',
                      color: selectedServiceId === s.id ? '#FFF' : 'var(--text-muted)',
                      border: `1.5px solid ${selectedServiceId === s.id ? 'var(--primary-red)' : 'var(--border-subtle)'}`,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {s.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Price Breakdown Box */}
            <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '14px', padding: '16px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>{currentModel.name} · {currentService.title}</span>
                <span style={{ color: '#FFF', fontWeight: 600 }}>₹{estimatedPartPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Central Lab Diagnostics</span>
                <span style={{ color: '#25D366', fontWeight: 700 }}>FREE (₹0)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span>Doorstep Pickup & Safe Drop</span>
                <span style={{ color: '#FFF', fontWeight: 600 }}>₹{logisticsFee}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>ESTIMATED TOTAL</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFF' }}>₹{totalPrice.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--primary-red)', fontSize: '11px', fontWeight: 700 }}>✔ 30-Day Warranty</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Pay after repair</div>
                </div>
              </div>
            </div>

            {/* Book This Repair CTA */}
            <button
              onClick={() => openBookingWithPreset(selectedBrandId, selectedModelId, selectedServiceId)}
              className="btn-primary"
              style={{ width: '100%', height: '52px', fontSize: '16px' }}
            >
              Book This Repair (₹{totalPrice.toLocaleString()}) <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTED BRANDS MARQUEE / GRID */}
      <section style={{ padding: '36px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              SUPPORTED OEM HARDWARE:
            </span>
            {BRANDS.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBrandId(b.id);
                  const el = document.getElementById('estimator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: selectedBrandId === b.id ? 'var(--primary-red)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
              >
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REPAIR SERVICES GRID */}
      <section id="services" className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-badge">PRECISION LAB SERVICES</div>
            <h2 className="section-title">Specialized Smartphone Repairs</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Every device is inspected under high-magnification optical microscopes and repaired using factory-grade OEM components with full calibration.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {SERVICES.map((s) => {
              const renderServiceIcon = () => {
                switch (s.icon) {
                  case 'Smartphone': return <Smartphone size={24} />;
                  case 'BatteryCharging': return <BatteryCharging size={24} />;
                  case 'Layers': return <Layers size={24} />;
                  case 'Zap': return <Zap size={24} />;
                  case 'Camera': return <Camera size={24} />;
                  case 'Droplets': return <Droplets size={24} />;
                  default: return <Smartphone size={24} />;
                }
              };

              return (
                <div key={s.id} className="glow-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1E1E22', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {renderServiceIcon()}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>STARTING FROM</span>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>{s.startingPrice}</div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>{s.description}</p>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                    <span style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: '#D4D4D8', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600 }}>
                      🛡 {s.warranty} Warranty
                    </span>
                    <span style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: '#A1A1AA', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600 }}>
                      ⚡ {s.turnaround} TAT
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                    {s.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>
                        <CheckCircle2 size={13} color="var(--primary-red)" /> {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openBookingWithPreset(selectedBrandId, selectedModelId, s.id)}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '12px', fontSize: '13px', justifyContent: 'center' }}
                  >
                    Select Service <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4-STEP TIMELINE) */}
      <section id="how-it-works" className="section-padding" style={{ backgroundColor: 'var(--bg-canvas)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-badge">HASSLE-FREE PROCESS</div>
            <h2 className="section-title">How Fixly Works</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              From doorstep pickup to workshop diagnosis and same-day delivery, we engineered the entire smartphone repair journey for transparency and trust.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', position: 'relative' }}>
            {HOW_IT_WORKS.map((h, idx) => (
              <div key={idx} className="glow-card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '48px', fontWeight: 900, color: 'rgba(255,255,255,0.04)', position: 'absolute', top: '10px', right: '16px' }}>
                  {h.step}
                </div>

                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#1E1E22', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {idx === 0 && <Truck size={20} />}
                  {idx === 1 && <Search size={20} />}
                  {idx === 2 && <Receipt size={20} />}
                  {idx === 3 && <ShieldCheck size={20} />}
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                  STEP {h.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>{h.title}</h3>
                <div style={{ color: '#A1A1AA', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>{h.subtitle}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LIVE REPAIR ORDER TRACKER LOOKUP PORTAL */}
      <section id="tracker" className="section-padding">
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div className="section-badge">REAL-TIME VISIBILITY</div>
              <h2 className="section-title">Live Repair Order Tracker</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Track your active repair stage, rider arrival, and technician lab diagnosis notes in real-time.
              </p>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleTrackLookup} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Enter Order ID (eg. QF-2026-0042) or Phone Number"
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 20px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ height: '56px', padding: '0 32px' }}>
                Track Order <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Try Demo Orders:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingQuery('QF-2026-0042');
                  setTrackedOrder(DEMO_ORDERS['QF-2026-0042']);
                  setTrackingError(false);
                }}
                style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--primary-red)', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
              >
                #QF-2026-0042 (In Lab)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackingQuery('QF-2025-9812');
                  setTrackedOrder(DEMO_ORDERS['QF-2025-9812']);
                  setTrackingError(false);
                }}
                style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
              >
                #QF-2025-9812 (Delivered)
              </button>
            </div>

            {/* Tracking Result Card */}
            {trackedOrder && (
              <div className="glow-card animate-fade-in" style={{ padding: '32px', border: '1px solid var(--border-subtle)' }}>
                {/* Order Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <div>
                    <span style={{ color: 'var(--primary-red)', fontSize: '14px', fontWeight: 800 }}>{trackedOrder.orderNumber}</span>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>{trackedOrder.device}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Issue: {trackedOrder.issue}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ backgroundColor: '#1E1E22', color: '#D4D4D8', border: '1px solid #27272A', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }}>
                      {trackedOrder.status}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginTop: '6px' }}>{trackedOrder.amount}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pay After Repair</div>
                  </div>
                </div>

                {/* 5-Stage Visual Milestone Stepper */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '10px' }}>
                    {['1. Pickup Scheduled', '2. Device Received', '3. Lab Diagnosis', '4. In Repair', '5. Quality Check & Drop'].map((stage, sIdx) => {
                      const isComplete = sIdx < trackedOrder.stageIndex;
                      const isCurrent = sIdx === trackedOrder.stageIndex - 1;
                      return (
                        <div key={sIdx} style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              height: '5px',
                              borderRadius: '3px',
                              backgroundColor: isComplete || isCurrent ? 'var(--primary-red)' : 'var(--border-subtle)',
                              marginBottom: '8px'
                            }}
                          />
                          <div style={{ fontSize: '11px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--primary-red)' : isComplete ? '#FFF' : 'var(--text-muted)' }}>
                            {stage}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logistics & Diagnosis Breakdown (2 Columns) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: 'var(--bg-canvas)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      LOGISTICS & RIDER
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFF', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                      <Truck size={14} color="var(--primary-red)" /> {trackedOrder.rider}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Pickup Slot: {trackedOrder.pickupTime}</div>
                    {trackedOrder.labArrival && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                        Lab Intake: {trackedOrder.labArrival}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      TECHNICIAN DIAGNOSIS NOTES
                    </div>
                    <p style={{ color: '#EEE', fontSize: '12px', lineHeight: 1.4, margin: 0 }}>
                      "{trackedOrder.diagnosisNotes}"
                    </p>
                    <div style={{ color: '#D4D4D8', fontSize: '11px', fontWeight: 600, marginTop: '6px' }}>
                      ✔ {trackedOrder.warranty}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {trackingError && (
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <HelpCircle size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                <div style={{ color: '#FFF', fontSize: '16px', fontWeight: 700 }}>No Order Found for "{trackingQuery}"</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Please check the order ID sent to your SMS/WhatsApp or click the demo buttons above.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. 30-DAY GUARANTEE & TRANSPARENCY SECTION */}
      <section id="warranty" className="section-padding" style={{ backgroundColor: 'var(--bg-canvas)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div className="section-badge">IRONCLAD PROTECTION</div>
            <h2 className="section-title">The Fixly 30-Day Hardware Guarantee</h2>
            <p className="section-subtitle" style={{ marginBottom: '24px' }}>
              We stand 100% behind the quality of every screen, battery, and micro-component we install. If any installed spare part develops a defect within 30 days, we pick it up and replace it with zero questions asked.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--primary-red)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#FFF', fontSize: '15px', fontWeight: 700 }}>100% Free Doorstep Re-Pickup</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No logistics charge or inspection fee on any valid warranty claim.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--primary-red)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#FFF', fontSize: '15px', fontWeight: 700 }}>24-Point Hardware Quality Scorecard</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Every repaired device is benchmarked for thermal load, touch sampling rate, and fast charging.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--primary-red)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#FFF', fontSize: '15px', fontWeight: 700 }}>Transparent Itemized Billing</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Never pay hidden charges. You receive a verified GST invoice on WhatsApp with component serial numbers.</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setModalStep(1);
                setIsBookingModalOpen(true);
              }}
              className="btn-primary"
            >
              Book Protected Repair <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#1E1E22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '20px' }}>
                <Shield size={28} />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#FFF', marginBottom: '10px' }}>
                Zero Risk. <br />Pay Only When Satisfied.
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Our field riders allow you up to 10 minutes to test your device—check display colors, camera focus, speakers, and charging—before you make any payment.
              </p>
              <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GUARANTEED WARRANTY</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>30 Days Full Coverage</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DIAGNOSIS CHARGE</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#25D366' }}>₹0 (FREE)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-badge">CUSTOMER STORIES</div>
            <h2 className="section-title">Trusted By 14,000+ Device Owners</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              See why customers across major metros rate Fixly as their go-to smartphone repair partner.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="glow-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '14px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
                <p style={{ color: '#EEE', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px', flex: 1 }}>
                  "{t.text}"
                </p>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>{t.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{t.city} · {t.device}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,43,66,0.12)', color: 'var(--primary-red)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>
                    {t.issue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQS */}
      <section id="faq" className="section-padding" style={{ backgroundColor: 'var(--bg-canvas)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-badge">FREQUENTLY ASKED QUESTIONS</div>
            <h2 className="section-title">Got Questions? We Have Answers.</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: `1px solid ${isOpen ? 'var(--primary-red-border)' : 'var(--border-subtle)'}`,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '16px',
                      fontWeight: 700,
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--primary-red)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. DESKTOP FOOTER */}
      <footer style={{ backgroundColor: 'var(--bg-canvas)', borderTop: '1px solid var(--border-subtle)', padding: '60px 0 30px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <img src="/logo.png" alt="Fixly Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
                <div style={{ fontSize: '24px', fontWeight: 900 }}>
                  <span style={{ color: '#FFF' }}>FIX</span>
                  <span style={{ color: 'var(--primary-red)' }}>LY</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px', maxWidth: '320px' }}>
                On-demand doorstep smartphone repairs engineered for transparent itemized pricing, certified precision, and 30-day warranty backing.
              </p>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                📍 Central Labs in Pune, Mumbai & Bengaluru
              </div>
            </div>

            <div>
              <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Repair Services</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li><a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Display & Screen Replacement</a></li>
                <li><a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Original Battery Replacement</a></li>
                <li><a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Back Glass Laser Removal</a></li>
                <li><a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Charging Port & Mic IC</a></li>
                <li><a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Camera Sensor Calibration</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Quick Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li><a href="#estimator" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Instant Price Calculator</a></li>
                <li><a href="#tracker" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live Repair Tracker</a></li>
                <li><a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>How It Works</a></li>
                <li><a href="#warranty" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>30-Day Guarantee Policy</a></li>
                <li><a href="#faq" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Frequently Asked Questions</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>24/7 Helpline</h4>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>DIRECT TELEPHONE</div>
                <div style={{ color: '#FFF', fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>+91 80000 12345</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>Lines open 24 hours / 7 days</div>
              </div>
              <a
                href="https://wa.me/918000012345"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '13px', justifyContent: 'center' }}
              >
                <MessageSquare size={16} color="#25D366" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div>© {new Date().getFullYear()} FIXLY Technologies Private Limited. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>30-Day Warranty Terms</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. INTERACTIVE 5-STEP DESKTOP BOOKING MODAL (REPLICATING MOBILE APP) */}
      {isBookingModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsBookingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: modalStep < 6 ? '16px' : '0' }}>
                <div>
                  <span style={{ color: 'var(--primary-red)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    {modalStep === 6 ? 'BOOKING CONFIRMED' : `STEP ${modalStep} OF 5`}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
                    {modalStep === 1 && 'Select Smartphone Brand'}
                    {modalStep === 2 && `Select ${currentBrand.name} Model`}
                    {modalStep === 3 && 'Select Repair Service'}
                    {modalStep === 4 && 'Choose Pickup Date & Time'}
                    {modalStep === 5 && 'Booking Details & Address'}
                    {modalStep === 6 && 'Pickup Successfully Scheduled!'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* 5-Step Stepper Header */}
              {modalStep < 6 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {['Brand', 'Model', 'Service', 'Time', 'Details'].map((stepLabel, idx) => {
                    const sNum = idx + 1;
                    const isCompleted = modalStep > sNum;
                    const isCurrent = modalStep === sNum;
                    return (
                      <div key={sNum}>
                        <div
                          style={{
                            height: '4px',
                            borderRadius: '2px',
                            backgroundColor: isCompleted || isCurrent ? 'var(--primary-red)' : 'var(--border-subtle)',
                            marginBottom: '6px',
                            transition: 'all 0.25s'
                          }}
                        />
                        <div
                          style={{
                            fontSize: '10px',
                            fontWeight: isCurrent ? 800 : 600,
                            color: isCurrent ? '#FFF' : isCompleted ? 'var(--text-muted)' : 'var(--text-dim)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                            textAlign: 'center'
                          }}
                        >
                          {sNum}. {stepLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              {/* STEP 1: SELECT BRAND (1/5) */}
              {modalStep === 1 && (
                <div>
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input
                      type="text"
                      placeholder="Search smartphone brand (e.g. Apple, Samsung, Xiaomi)..."
                      value={modalBrandSearch}
                      onChange={(e) => setModalBrandSearch(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 16px 0 40px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
                    {BRANDS.filter((b) => b.name.toLowerCase().includes(modalBrandSearch.toLowerCase())).map((b) => {
                      const isSelected = selectedBrandId === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => {
                            setSelectedBrandId(b.id);
                            const models = MODELS_BY_BRAND[b.id] || [];
                            if (models[0]) setSelectedModelId(models[0].id);
                            setModalModelSearch('');
                          }}
                          style={{
                            padding: '16px',
                            borderRadius: '14px',
                            backgroundColor: isSelected ? 'rgba(255,43,66,0.08)' : 'var(--bg-canvas)',
                            border: `1.5px solid ${isSelected ? 'var(--primary-red)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1E1E22', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
                              {b.logo}
                            </div>
                            <div>
                              <div style={{ color: '#FFF', fontSize: '15px', fontWeight: 700 }}>{b.name}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{b.modelsCount}+ Models Supported</div>
                            </div>
                          </div>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${isSelected ? 'var(--primary-red)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-red)' }} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setModalStep(2)}
                    className="btn-primary"
                    style={{ width: '100%', height: '50px', fontSize: '15px' }}
                  >
                    Next: Select {currentBrand.name} Model <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: SELECT MODEL (2/5) */}
              {modalStep === 2 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Selected Brand:</span>
                      <span style={{ backgroundColor: '#1E1E22', padding: '3px 10px', borderRadius: '6px', color: '#FFF', fontSize: '12px', fontWeight: 700 }}>
                        {currentBrand.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setModalStep(1)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                    >
                      ← Change Brand
                    </button>
                  </div>

                  <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input
                      type="text"
                      placeholder={`Search ${currentBrand.name} model (e.g. 11T, Pro, Plus)...`}
                      value={modalModelSearch}
                      onChange={(e) => setModalModelSearch(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 16px 0 40px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
                    {availableModels
                      .filter((m) => m.name.toLowerCase().includes(modalModelSearch.toLowerCase()))
                      .map((m) => {
                        const isSelected = selectedModelId === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedModelId(m.id)}
                            style={{
                              padding: '14px 18px',
                              borderRadius: '12px',
                              backgroundColor: isSelected ? 'rgba(255,43,66,0.08)' : 'var(--bg-canvas)',
                              border: `1.5px solid ${isSelected ? 'var(--primary-red)' : 'var(--border-subtle)'}`,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div>
                              <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>{m.name}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Year: {m.year} · OEM Certified Parts Available</div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SCREEN FROM</span>
                                <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 800 }}>₹{m.screenPrice.toLocaleString()}</div>
                              </div>
                              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${isSelected ? 'var(--primary-red)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-red)' }} />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setModalStep(1)} className="btn-secondary" style={{ flex: 1 }}>
                      Back
                    </button>
                    <button onClick={() => setModalStep(3)} className="btn-primary" style={{ flex: 2 }}>
                      Next: Select Service <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SELECT SERVICE (3/5) */}
              {modalStep === 3 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Device Selected:</span>
                      <span style={{ backgroundColor: '#1E1E22', padding: '3px 10px', borderRadius: '6px', color: '#FFF', fontSize: '12px', fontWeight: 700 }}>
                        {currentModel.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setModalStep(2)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                    >
                      ← Change Model
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
                    {SERVICES.map((s) => {
                      const isSelected = selectedServiceId === s.id;
                      const price =
                        s.id === 'battery'
                          ? currentModel?.batteryPrice || 1999
                          : s.id === 'charging'
                          ? 799
                          : s.id === 'backglass'
                          ? 1299
                          : s.id === 'camera'
                          ? 1499
                          : s.id === 'water'
                          ? 1999
                          : currentModel?.screenPrice || 4299;

                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedServiceId(s.id)}
                          style={{
                            padding: '16px',
                            borderRadius: '14px',
                            backgroundColor: isSelected ? 'rgba(255,43,66,0.08)' : 'var(--bg-canvas)',
                            border: `1.5px solid ${isSelected ? 'var(--primary-red)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>{s.title}</div>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${isSelected ? 'var(--primary-red)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '8px' }}>
                              {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-red)' }} />}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>
                              ₹{price.toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>🛡 {s.warranty}</span>
                              <span style={{ color: '#444' }}>•</span>
                              <span style={{ color: 'var(--text-muted)' }}>⚡ {s.turnaround}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setModalStep(2)} className="btn-secondary" style={{ flex: 1 }}>
                      Back
                    </button>
                    <button onClick={() => setModalStep(4)} className="btn-primary" style={{ flex: 2 }}>
                      Next: Choose Pickup Slot <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CHOOSE PICKUP TIME (4/5) */}
              {modalStep === 4 && (
                <div>
                  <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '12px', padding: '14px 18px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <div style={{ color: '#FFF', fontSize: '14px', fontWeight: 700 }}>{currentModel.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{currentService.title}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ESTIMATED PART</span>
                      <div style={{ color: '#FFF', fontSize: '16px', fontWeight: 800 }}>₹{estimatedPartPrice.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
                      Choose Pickup Date
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {['Today (Express)', 'Tomorrow, 21 Oct', 'Wed, 22 Oct', 'Thu, 23 Oct'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedPickupDate(d)}
                          style={{
                            padding: '12px 6px',
                            borderRadius: '10px',
                            backgroundColor: selectedPickupDate === d ? 'var(--primary-red)' : 'var(--bg-canvas)',
                            color: selectedPickupDate === d ? '#FFF' : 'var(--text-muted)',
                            border: `1px solid ${selectedPickupDate === d ? 'var(--primary-red)' : 'var(--border-subtle)'}`,
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
                      Choose Pickup Time Window
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        '10:00 AM - 11:30 AM',
                        '1:00 PM - 2:30 PM',
                        '4:00 PM - 5:30 PM',
                        '6:30 PM - 8:00 PM'
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedPickupSlot(slot)}
                          style={{
                            padding: '12px',
                            borderRadius: '10px',
                            backgroundColor: selectedPickupSlot === slot ? 'rgba(255,43,66,0.12)' : 'var(--bg-canvas)',
                            color: selectedPickupSlot === slot ? '#FFF' : 'var(--text-muted)',
                            border: `1.5px solid ${selectedPickupSlot === slot ? 'var(--primary-red)' : 'var(--border-subtle)'}`,
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#18181B', padding: '12px 16px', borderRadius: '10px', border: '1px solid #27272A', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Truck size={18} color="var(--primary-red)" />
                    <span>Flat ₹79 doorstep logistics. Verified technician brings tamper-proof sealed intake bag.</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setModalStep(3)} className="btn-secondary" style={{ flex: 1 }}>
                      Back
                    </button>
                    <button onClick={() => setModalStep(5)} className="btn-primary" style={{ flex: 2 }}>
                      Next: Booking Details <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: BOOKING DETAILS & ADDRESS (5/5) */}
              {modalStep === 5 && (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Akshay Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: '#FFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Mobile Number (For Rider Updates & OTP) *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: '#FFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Doorstep Pickup Address *
                    </label>
                    <textarea
                      placeholder="Flat/House number, Apartment/Building, Landmark, City"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  {/* Summary Box */}
                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>{currentModel.name} · {currentService.title}</span>
                      <span style={{ color: '#FFF', fontWeight: 600 }}>₹{estimatedPartPrice.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Central Lab Diagnostics</span>
                      <span style={{ color: '#25D366', fontWeight: 700 }}>FREE (₹0)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      <span>Doorstep Pickup & Safe Drop</span>
                      <span style={{ color: '#FFF', fontWeight: 600 }}>₹{logisticsFee}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#FFF', fontWeight: 900, fontSize: '18px' }}>Total: ₹{totalPrice.toLocaleString()}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Slot: {selectedPickupDate}, {selectedPickupSlot}</div>
                      </div>
                      <div style={{ color: '#D4D4D8', fontSize: '11px', fontWeight: 700 }}>
                        ✔ Pay After Delivery & Testing
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setModalStep(4)} className="btn-secondary" style={{ flex: 1 }}>
                      Back
                    </button>
                    <button onClick={handleConfirmBooking} className="btn-primary" style={{ flex: 2 }}>
                      Confirm Doorstep Booking (₹{totalPrice.toLocaleString()}) <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: BOOKING CONFIRMED (SUCCESS SCREEN) */}
              {modalStep === 6 && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,43,66,0.1)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
                    Pickup Successfully Scheduled!
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                    Order Number: <strong style={{ color: 'var(--primary-red)' }}>{generatedOrderId}</strong>
                  </p>

                  <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '14px', padding: '16px', border: '1px solid var(--border-subtle)', textAlign: 'left', marginBottom: '24px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Device & Issue:</span>
                      <span style={{ color: '#FFF', fontWeight: 600 }}>{currentModel.name} · {currentService.title}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Pickup Slot:</span>
                      <span style={{ color: '#FFF', fontWeight: 600 }}>{selectedPickupDate} · {selectedPickupSlot}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                      <span style={{ color: '#25D366', fontWeight: 700 }}>₹{totalPrice.toLocaleString()} (Pay after delivery)</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        setIsBookingModalOpen(false);
                        setTrackingQuery(generatedOrderId);
                        const demoOrder = {
                          orderNumber: generatedOrderId,
                          customerName: customerName || 'Valued Customer',
                          device: currentModel.name,
                          issue: currentService.title,
                          status: 'Pickup Scheduled (Rider Dispatched)',
                          stageIndex: 1,
                          rider: 'Rohit Sharma (Rider ID: #R-104)',
                          riderPhone: '+91 98765 12340',
                          pickupTime: `${selectedPickupDate}, ${selectedPickupSlot}`,
                          amount: `₹${totalPrice.toLocaleString()}`,
                          warranty: '30 Days Guaranteed',
                          diagnosisNotes: 'Intake inspection scheduled at customer doorstep.'
                        };
                        setTrackedOrder(demoOrder);
                        const trackerEl = document.getElementById('tracker');
                        if (trackerEl) trackerEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary"
                      style={{ width: '100%' }}
                    >
                      Track This Order Live <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
