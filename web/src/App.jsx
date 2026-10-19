import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Search,
  Bell,
  ChevronRight,
  Shield,
  Clock,
  Radio,
  MapPin,
  Calendar,
  CheckCircle,
  Truck,
  Video,
  LayoutGrid,
  Check,
  Smartphone,
  Battery,
  BatteryCharging,
  Zap,
  Volume2,
  VolumeX,
  Droplet,
  Droplets,
  Camera,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import {
  BRANDS,
  MODELS,
  SERVICES,
  PICKUP_DATES,
  TIME_SLOTS,
  ISSUE_CATEGORIES,
  POPULAR_REPAIRS
} from './data';

export default function App() {
  // Wizard step: 0 = Home, 1 = Brand, 2 = Model, 3 = Service, 4 = Time, 5 = Booking Details, 6 = Tracking
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Booking state
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[4]); // default Xiaomi
  const [selectedModel, setSelectedModel] = useState(MODELS[3]); // default Xiaomi 11T Pro 5G
  const [selectedService, setSelectedService] = useState(SERVICES[0]); // default Display
  const [selectedDate, setSelectedDate] = useState('19 Oct');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [searchBrandQuery, setSearchBrandQuery] = useState('');
  const [searchModelQuery, setSearchModelQuery] = useState('');

  const totalAmount = (selectedService?.price || 4299) + 79;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2B42', '#FFFFFF', '#FF8595']
    });
  };

  const handleConfirmOrder = () => {
    triggerConfetti();
    setStep(6);
  };

  return (
    <div className="app-container">
      <div className="mobile-app-shell">
        {/* Native Mobile Status Bar */}
        <div className="native-status-bar">
          <span>8:47</span>
          <div className="status-bar-icons">
            <Radio size={14} />
            <span>73%</span>
          </div>
        </div>

        {/* Screen Content Body */}
        <div className="screen-content">
          {step === 0 && (
            <HomeScreen
              onStartBooking={() => setStep(1)}
              onSelectIssueCategory={(cat) => {
                const found = SERVICES.find((s) => s.id === cat) || SERVICES[0];
                setSelectedService(found);
                setStep(1);
              }}
            />
          )}

          {step === 1 && (
            <SelectBrandScreen
              brands={BRANDS}
              selectedBrand={selectedBrand}
              searchQuery={searchBrandQuery}
              onSearchChange={setSearchBrandQuery}
              onSelectBrand={(brand) => setSelectedBrand(brand)}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <SelectModelScreen
              selectedBrand={selectedBrand}
              models={MODELS}
              selectedModel={selectedModel}
              searchQuery={searchModelQuery}
              onSearchChange={setSearchModelQuery}
              onSelectModel={(model) => setSelectedModel(model)}
              onChangeBrand={() => setStep(1)}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <SelectServiceScreen
              selectedModel={selectedModel}
              services={SERVICES}
              selectedService={selectedService}
              onSelectService={(serv) => setSelectedService(serv)}
              onChangeModel={() => setStep(2)}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <ChoosePickupTimeScreen
              dates={PICKUP_DATES}
              timeSlots={TIME_SLOTS}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDate={setSelectedDate}
              onSelectTime={setSelectedTime}
              onBack={() => setStep(3)}
              onNext={() => setStep(5)}
            />
          )}

          {step === 5 && (
            <BookingDetailsScreen
              selectedBrand={selectedBrand}
              selectedModel={selectedModel}
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              totalAmount={totalAmount}
              onJumpToStep={(s) => setStep(s)}
              onBack={() => setStep(4)}
              onConfirm={handleConfirmOrder}
            />
          )}

          {step === 6 && (
            <LiveTrackingScreen
              selectedModel={selectedModel}
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onBackHome={() => {
                setStep(0);
                setActiveTab(0);
              }}
            />
          )}
        </div>

        {/* Global Bottom Navigation (Shown on Home or selectable) */}
        {step === 0 && (
          <BottomNav
            activeTab={activeTab}
            onChangeTab={(idx) => {
              setActiveTab(idx);
              if (idx === 1) setStep(1);
            }}
          />
        )}

        {/* Native Home Indicator Bar */}
        <div className="home-indicator-bar">
          <div className="home-indicator-pill"></div>
        </div>
      </div>

      {/* Discreet floating screen switcher */}
      <div className="floating-step-pill">
        {[
          { label: 'S1', s: 0, title: 'Home' },
          { label: 'S2', s: 1, title: 'Brand' },
          { label: 'S3', s: 2, title: 'Model' },
          { label: 'S4', s: 3, title: 'Service' },
          { label: 'S5', s: 4, title: 'Pickup' },
          { label: 'S6', s: 5, title: 'Review' },
          { label: 'S7', s: 6, title: 'Live' }
        ].map((item) => (
          <button
            key={item.s}
            title={item.title}
            onClick={() => setStep(item.s)}
            className={`step-chip ${step === item.s ? 'active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. SCREEN 1: HOME SCREEN
// ----------------------------------------------------
function HomeScreen({ onStartBooking, onSelectIssueCategory }) {
  return (
    <div className="animate-fade-in" style={{ padding: '0 0 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
        <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
          <span>FIX</span>
          <span style={{ color: 'var(--primary-red)' }}>LY</span>
        </div>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#181818',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            border: '1px solid #262626'
          }}
        >
          <Bell size={20} color="#FFFFFF" />
          <div
            style={{
              position: 'absolute',
              top: '9px',
              right: '11px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--primary-red)',
              borderRadius: '50%'
            }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          margin: '8px 16px 20px',
          padding: '24px 20px',
          borderRadius: '24px',
          background: 'linear-gradient(180deg, #1A1A1A 0%, #111111 100%)',
          border: '1px solid #262626',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            color: 'var(--text-gray)',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}
        >
          Professional Repair Service
        </div>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.5px',
            marginBottom: '8px'
          }}
        >
          Expert Care <br />
          for Your <span style={{ color: 'var(--primary-red)' }}>Device</span>
        </h1>
        <p style={{ color: 'var(--text-gray)', fontSize: '13px', fontWeight: 500 }}>
          Fast. Reliable. Transparent.
        </p>
      </div>

      {/* 2x4 Issue Categories Grid (Mint Tint Card Spec from Screen 1) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          padding: '0 16px',
          marginBottom: '20px'
        }}
      >
        {ISSUE_CATEGORIES.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectIssueCategory(item.id)}
            style={{
              backgroundColor: 'var(--issue-card-bg)',
              borderRadius: '16px',
              padding: '10px 8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '100px',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span
                style={{
                  color: '#081717',
                  fontSize: '10px',
                  fontWeight: 800,
                  lineHeight: '1.15',
                  whiteSpace: 'pre-line'
                }}
              >
                {item.title}
              </span>
              <span style={{ color: 'var(--issue-card-teal)', fontSize: '12px', fontWeight: 900 }}>↗</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', color: 'var(--issue-card-teal)' }}>
              {renderIcon(item.icon, 28)}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Red CTA Button */}
      <div style={{ padding: '0 16px', marginBottom: '28px' }}>
        <button
          onClick={onStartBooking}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: 'var(--primary-red)',
            borderRadius: '32px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px var(--primary-red-glow)'
          }}
        >
          <div style={{ flex: 1, textAlign: 'center', color: '#FFFFFF', fontSize: '16px', fontWeight: 700 }}>
            Select Phone Model
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <ArrowRight size={18} />
          </div>
        </button>
      </div>

      {/* Popular Repairs Carousel */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Popular Repairs</h2>
          <span
            onClick={onStartBooking}
            style={{ color: 'var(--text-gray)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            View All <ChevronRight size={14} />
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {POPULAR_REPAIRS.map((rep, idx) => (
            <div
              key={idx}
              onClick={onStartBooking}
              style={{
                flex: '0 0 120px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: '#FFFFFF', marginBottom: '10px' }}>
                {renderIcon(rep.icon, 28)}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px', whiteSpace: 'pre-line' }}>
                {rep.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 500 }}>
                {rep.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. SCREEN 2: 1/5 SELECT BRAND (Strict Zero-Green Redesign)
// ----------------------------------------------------
function SelectBrandScreen({
  brands,
  selectedBrand,
  searchQuery,
  onSearchChange,
  onSelectBrand,
  onBack,
  onNext
}) {
  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Stepper Header */}
      <StepperHeader stepText="1/5" title="Select Brand" currentStep={1} onBack={onBack} />

      {/* Search Input */}
      <div style={{ padding: '0 16px 12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '12px 14px',
            gap: '10px'
          }}
        >
          <Search size={18} color="var(--text-gray)" />
          <input
            type="text"
            placeholder="Search for model (eg. iPhone 14)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '14px',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* 3x4 Brand Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          padding: '0 16px 20px',
          flex: 1
        }}
      >
        {filtered.map((b) => {
          const isSelected = selectedBrand?.id === b.id;
          return (
            <div
              key={b.id}
              onClick={() => onSelectBrand(b)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: isSelected
                  ? '2px solid var(--primary-red)'
                  : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 16px var(--primary-red-glow)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderBrandLogo(b)}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '8px' }}>
                {b.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Cart (Crimson Red Theme) */}
      <StickyCart
        line1={`+ ${selectedBrand?.name || 'Xiaomi'} selected`}
        line2="+ Free Workshop Diagnosis"
        buttonLabel="Select Model"
        onAction={onNext}
      />
    </div>
  );
}

// ----------------------------------------------------
// 3. SCREEN 3: 2/5 SELECT MODEL (Strict Zero-Green Redesign)
// ----------------------------------------------------
function SelectModelScreen({
  selectedBrand,
  models,
  selectedModel,
  searchQuery,
  onSearchChange,
  onSelectModel,
  onChangeBrand,
  onBack,
  onNext
}) {
  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepperHeader stepText="2/5" title="Select Model" currentStep={2} onBack={onBack} />

      {/* Search Input */}
      <div style={{ padding: '0 16px 10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '12px 14px',
            gap: '10px'
          }}
        >
          <Search size={18} color="var(--text-gray)" />
          <input
            type="text"
            placeholder="Search for model (eg. Xiaomi 11)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '14px',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Brand Indicator Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 16px 12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#FF6900',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          >
            mi
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800 }}>{selectedBrand?.name || 'Xiaomi'}</span>
        </div>
        <span
          onClick={onChangeBrand}
          style={{
            color: 'var(--text-gray)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Change Brand <ChevronRight size={14} />
        </span>
      </div>

      {/* Model Cards List */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {filtered.map((m) => {
          const isSelected = selectedModel?.id === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectModel(m)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                border: isSelected
                  ? '2px solid var(--primary-red)'
                  : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 16px var(--primary-red-glow)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111111'
                }}
              >
                <Smartphone size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '2px' }}>
                  {m.year} | {m.network}
                </div>
              </div>
              <ChevronRight
                size={20}
                color={isSelected ? 'var(--primary-red)' : 'var(--text-gray)'}
              />
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Cart (Crimson Red Theme) */}
      <StickyCart
        line1={`+ ${selectedModel?.name || 'Xiaomi 11T Pro 5G'}`}
        line2="+ Free Workshop Diagnosis"
        buttonLabel="Select Service"
        onAction={onNext}
      />
    </div>
  );
}

// ----------------------------------------------------
// 4. SCREEN 4: 3/5 SELECT SERVICE (Strict Zero-Green Redesign)
// ----------------------------------------------------
function SelectServiceScreen({
  selectedModel,
  services,
  selectedService,
  onSelectService,
  onChangeModel,
  onBack,
  onNext
}) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepperHeader stepText="3/5" title="Select Service" currentStep={3} onBack={onBack} />

      <div style={{ padding: '0 16px', flex: 1 }}>
        {/* Selected Phone Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111'
            }}
          >
            <Smartphone size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>{selectedModel?.name || 'Xiaomi 11T Pro 5G'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>
              {selectedModel?.year || '2021'} | {selectedModel?.network || '5G'}
            </div>
          </div>
          <span
            onClick={onChangeModel}
            style={{ color: 'var(--text-gray)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            Change <ChevronRight size={14} />
          </span>
        </div>

        {/* Section Heading & Trust Badges */}
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '2px' }}>Repair Services</h2>
        <p style={{ color: 'var(--text-gray)', fontSize: '13px', marginBottom: '12px' }}>
          Choose the issue you want to get repaired
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <Clock size={13} color="var(--text-gray)" /> 60 min repair
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <div style={{ width: '7px', height: '7px', backgroundColor: 'var(--primary-red)', borderRadius: '50%' }} />
            Live stream
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <Shield size={13} color="var(--text-gray)" /> 6-month warranty
          </div>
        </div>

        {/* Services List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map((serv) => {
            const isSelected = selectedService?.id === serv.id;
            return (
              <div
                key={serv.id}
                onClick={() => onSelectService(serv)}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: isSelected
                    ? '2px solid var(--primary-red)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 16px var(--primary-red-glow)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  {renderIcon(serv.icon, 20)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <div
                      style={{
                        backgroundColor: 'var(--primary-red)',
                        borderRadius: '4px',
                        padding: '2px 5px',
                        fontSize: '9px',
                        fontWeight: 900,
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <div style={{ width: '4px', height: '4px', backgroundColor: '#FFF', borderRadius: '50%' }} />
                      LIVE
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>{serv.title}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{serv.subtitle}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} color="var(--primary-red)" /> {serv.warranty}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>₹{serv.price}</div>
                  <button
                    style={{
                      marginTop: '6px',
                      backgroundColor: isSelected ? 'var(--primary-red)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'var(--text-gray)',
                      border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Cart (Crimson Red Theme) */}
      <StickyCart
        line1={`+ ${selectedModel?.name || 'Xiaomi 11T Pro 5G'}`}
        line2={`+ ${selectedService?.title || 'Display'} (₹${selectedService?.price || 4299})`}
        buttonLabel="Select Pickup"
        onAction={onNext}
      />
    </div>
  );
}

// ----------------------------------------------------
// 5. SCREEN 5: 4/5 CHOOSE PICKUP TIME (Strict Zero-Green Redesign)
// ----------------------------------------------------
function ChoosePickupTimeScreen({
  dates,
  timeSlots,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onBack,
  onNext
}) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepperHeader stepText="4/5" title="Choose Pickup Time" currentStep={4} onBack={onBack} />

      <div style={{ padding: '0 16px', flex: 1 }}>
        {/* Logistics Hero Banner Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 900, lineHeight: 1.2 }}>
              We'll <span style={{ color: 'var(--primary-red)' }}>pickup</span> <br />
              your device
            </h2>
            <div style={{ fontSize: '11px', color: 'var(--text-gray)', margin: '4px 0 10px' }}>
              Safe | Verified | Tracked
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#DDD' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={12} color="var(--primary-red)" /> Verified pickup partner
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={12} color="var(--primary-red)" /> Live tracking on app
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={12} color="var(--primary-red)" /> Secure & insured handling
              </div>
            </div>
          </div>

          <div
            style={{
              width: '100px',
              height: '90px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Truck size={42} color="#FFF" />
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                color: 'var(--primary-red)'
              }}
            >
              <MapPin size={18} />
            </div>
          </div>
        </div>

        {/* Date Picker Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800 }}>
            <Calendar size={16} /> Select pickup date
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '11px',
              color: 'var(--text-gray)'
            }}
          >
            This Week ⌵
          </div>
        </div>

        {/* 7-day horizontal chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '18px' }}>
          {dates.map((d, idx) => {
            const key = `${d.date} ${d.month}`;
            const isSelected = selectedDate === key;
            return (
              <div
                key={idx}
                onClick={() => onSelectDate(key)}
                style={{
                  flex: '0 0 54px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '14px',
                  padding: '10px 4px',
                  textAlign: 'center',
                  border: isSelected
                    ? '2px solid var(--primary-red)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 12px var(--primary-red-glow)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '11px', color: isSelected ? 'var(--primary-red)' : 'var(--text-gray)', fontWeight: 600 }}>
                  {d.day}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: isSelected ? 'var(--primary-red)' : '#FFF', margin: '2px 0' }}>
                  {d.date}
                </div>
                <div style={{ fontSize: '10px', color: isSelected ? 'var(--primary-red)' : 'var(--text-gray)' }}>
                  {d.month}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Slot Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800 }}>
            <Clock size={16} /> Select pickup time
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>
            ⓘ Repair in 60 mins
          </div>
        </div>

        {/* 3x3 Time Slots Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
          {timeSlots.map((slot, idx) => {
            const isSelected = selectedTime === slot;
            return (
              <div
                key={idx}
                onClick={() => onSelectTime(slot)}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '12px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? 'var(--primary-red)' : '#FFFFFF',
                  border: isSelected
                    ? '2px solid var(--primary-red)'
                    : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                {slot}
              </div>
            );
          })}
        </div>

        {/* Address Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-red)'
            }}
          >
            <MapPin size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Pickup Address</div>
            <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>We'll pickup from your location</div>
            <div style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Exact address confirmed after booking</div>
          </div>
          <span style={{ color: 'var(--text-gray)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            Change <ChevronRight size={14} />
          </span>
        </div>

        {/* Continue Button */}
        <button
          onClick={onNext}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: 'var(--primary-red)',
            borderRadius: '32px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px var(--primary-red-glow)',
            marginBottom: '16px'
          }}
        >
          <div style={{ flex: 1, textAlign: 'center', color: '#FFFFFF', fontSize: '16px', fontWeight: 800 }}>
            Continue
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <ArrowRight size={18} />
          </div>
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. SCREEN 6: 5/5 BOOKING DETAILS (Strict Zero-Green Redesign)
// ----------------------------------------------------
function BookingDetailsScreen({
  selectedBrand,
  selectedModel,
  selectedService,
  selectedDate,
  selectedTime,
  totalAmount,
  onJumpToStep,
  onBack,
  onConfirm
}) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepperHeader stepText="5/5" title="Booking Details" currentStep={5} onBack={onBack} />

      <div style={{ padding: '0 16px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {/* Brand */}
          <SummaryRow
            icon={
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#FF6900',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontWeight: 900,
                  fontSize: '13px'
                }}
              >
                mi
              </div>
            }
            label="Brand"
            value={selectedBrand?.name || 'Xiaomi'}
            onChange={() => onJumpToStep(1)}
          />

          {/* Model */}
          <SummaryRow
            icon={
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#FFF',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111'
                }}
              >
                <Smartphone size={20} />
              </div>
            }
            label="Model"
            value={selectedModel?.name || 'Xiaomi 11T Pro 5G'}
            onChange={() => onJumpToStep(2)}
          />

          {/* Issue */}
          <SummaryRow
            icon={<Smartphone size={20} color="#FFF" />}
            label="Issue"
            value={selectedService?.title || 'Display Service'}
            hasLive
            onChange={() => onJumpToStep(3)}
          />

          {/* Warranty */}
          <SummaryRow
            icon={<Shield size={20} color="#FFF" />}
            label="Warranty"
            value={selectedService?.warranty || '6 months'}
          />

          {/* Pickup Time */}
          <SummaryRow
            icon={<Clock size={20} color="#FFF" />}
            label="Pickup Time"
            value={`${selectedTime}, ${selectedDate}`}
            onChange={() => onJumpToStep(4)}
          />

          {/* Pickup Location */}
          <SummaryRow
            icon={<MapPin size={20} color="var(--primary-red)" />}
            label="Pickup Location"
            value="Home"
            onChange={() => onJumpToStep(4)}
          />

          {/* Total Amount Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>Total Amount</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '2px 0' }}>
                ₹{totalAmount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>
                Pay after the repair is done
              </div>
            </div>

            <button
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                borderRadius: '10px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View Details ›
            </button>
          </div>
        </div>

        {/* Trust Banner */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}
        >
          <Shield size={22} color="var(--primary-red)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>Safe & Secure Service</div>
            <div style={{ fontSize: '10px', color: 'var(--text-gray)' }}>
              Verified pickup partner · Live tracking · Original parts
            </div>
          </div>
        </div>

        {/* Confirm Booking CTA */}
        <button
          onClick={onConfirm}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: 'var(--primary-red)',
            borderRadius: '32px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px var(--primary-red-glow)',
            marginBottom: '16px'
          }}
        >
          <div style={{ flex: 1, textAlign: 'center', color: '#FFFFFF', fontSize: '16px', fontWeight: 800 }}>
            Confirm Booking
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <ArrowRight size={18} />
          </div>
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value, hasLive, onChange }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>{value}</span>
          {hasLive && (
            <span
              style={{
                backgroundColor: 'var(--primary-red)',
                borderRadius: '4px',
                padding: '1px 5px',
                fontSize: '8px',
                fontWeight: 900,
                color: '#FFF'
              }}
            >
              ● LIVE
            </span>
          )}
        </div>
      </div>
      {onChange && (
        <span
          onClick={onChange}
          style={{
            color: 'var(--text-gray)',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Change <ChevronRight size={14} />
        </span>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 7. SCREEN 7: LIVE REPAIR TRACKING
// ----------------------------------------------------
function LiveTrackingScreen({ selectedModel, selectedService, selectedDate, selectedTime, onBackHome }) {
  return (
    <div className="animate-fade-in" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 16px' }}>
        <div
          onClick={onBackHome}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 800 }}>Order #QF-2026-89421</div>
        <div
          style={{
            backgroundColor: 'rgba(255, 43, 66, 0.15)',
            border: '1px solid rgba(255, 43, 66, 0.4)',
            color: 'var(--primary-red)',
            borderRadius: '12px',
            padding: '4px 10px',
            fontSize: '10px',
            fontWeight: 800
          }}
        >
          ACTIVE
        </div>
      </div>

      {/* Live Status Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            backgroundColor: 'var(--primary-red)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}
        >
          <Truck size={24} />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800 }}>Pickup Scheduled</div>
          <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '2px' }}>
            Rider will arrive on {selectedTime}, {selectedDate}
          </div>
        </div>
      </div>

      {/* 5-Stage Stepper Timeline */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>Repair Journey Timeline</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {[
            {
              step: '1',
              title: 'Pickup Scheduled',
              time: `${selectedTime}, ${selectedDate}`,
              desc: 'Assigned rider: Rajesh K. (Verified Partner)',
              done: true,
              active: true
            },
            {
              step: '2',
              title: 'Device Received at Workshop',
              time: 'Expected ~11:30 AM',
              desc: 'Intake inspection & initial hardware test',
              done: false
            },
            {
              step: '3',
              title: 'Free Workshop Diagnosis Completed',
              time: 'Expected ~12:15 PM',
              desc: 'Quotation sent to app for your signoff',
              done: false
            },
            {
              step: '4',
              title: 'Repair in Progress',
              time: 'Expected ~1:00 PM',
              desc: 'Watch the live workbench feed on Live tab',
              done: false
            },
            {
              step: '5',
              title: 'Quality Check & Safe Delivery',
              time: 'Expected ~2:30 PM',
              desc: '30-day warranty card & digital invoice issued',
              done: false,
              last: true
            }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: item.done || item.active ? 'var(--primary-red)' : 'var(--bg-elevated)',
                    border: '2px solid',
                    borderColor: item.active ? 'var(--primary-red)' : 'var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#FFF'
                  }}
                >
                  {item.done ? <Check size={14} /> : item.step}
                </div>
                {!item.last && (
                  <div
                    style={{
                      width: '2px',
                      height: '46px',
                      backgroundColor: item.done ? 'var(--primary-red)' : 'var(--border-subtle)'
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--primary-red)', fontWeight: 600 }}>{item.time}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-gray)', marginTop: '2px' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onBackHome}
        style={{
          width: '100%',
          height: '52px',
          backgroundColor: 'var(--primary-red)',
          borderRadius: '26px',
          border: 'none',
          color: '#FFFFFF',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

// ----------------------------------------------------
// COMMON REUSABLE COMPONENTS
// ----------------------------------------------------
function StepperHeader({ stepText, title, currentStep, onBack }) {
  return (
    <div style={{ padding: '8px 16px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div
          onClick={onBack}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600, letterSpacing: '0.5px' }}>
            New Order
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800 }}>
            <span style={{ color: '#FFFFFF' }}>{stepText} </span>
            <span>{title}</span>
          </div>
        </div>

        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <ShoppingCart size={18} />
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--primary-red)',
              borderRadius: '50%'
            }}
          />
        </div>
      </div>

      {/* 5-Step Crimson Progress Bar */}
      <div style={{ height: '3px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${(currentStep / 5) * 100}%`,
            backgroundColor: 'var(--primary-red)',
            boxShadow: '0 0 8px var(--primary-red)',
            transition: 'width 0.25s ease'
          }}
        />
      </div>
    </div>
  );
}

function StickyCart({ line1, line2, buttonLabel, onAction }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto'
      }}
    >
      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>Current cart</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>{line1}</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>{line2}</div>
      </div>

      <button
        onClick={onAction}
        style={{
          backgroundColor: 'var(--primary-red)',
          color: '#FFF',
          border: 'none',
          borderRadius: '24px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px var(--primary-red-glow)'
        }}
      >
        {buttonLabel} <ChevronRight size={16} />
      </button>
    </div>
  );
}

function BottomNav({ activeTab, onChangeTab }) {
  const tabs = [
    { label: 'Home', icon: LayoutGrid },
    { label: 'Booking', icon: Truck },
    { label: 'Live', icon: Video, liveDot: true },
    { label: 'Dashboard', icon: LayoutGrid }
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '8px 16px 14px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}
    >
      {tabs.map((t, idx) => {
        const isSelected = activeTab === idx;
        const color = isSelected ? 'var(--primary-red)' : 'var(--text-gray)';
        const Icon = t.icon;

        return (
          <div
            key={idx}
            onClick={() => onChangeTab(idx)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={22} color={color} />
              {t.liveDot && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'var(--primary-red)',
                    borderRadius: '50%'
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: '11px', fontWeight: isSelected ? 800 : 500, color }}>
              {t.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function renderBrandLogo(brand) {
  if (brand.id === 'xiaomi') {
    return (
      <div
        style={{
          width: '36px',
          height: '36px',
          backgroundColor: '#FF6900',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          fontWeight: 900,
          fontSize: '15px'
        }}
      >
        mi
      </div>
    );
  }
  if (brand.id === 'oneplus') {
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '2px solid #FF2B42',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FF2B42',
          fontWeight: 900,
          fontSize: '14px'
        }}
      >
        1+
      </div>
    );
  }
  if (brand.id === 'apple') {
    return <span style={{ fontSize: '30px', color: '#FFF' }}></span>;
  }
  if (brand.id === 'google') {
    return <span style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>G</span>;
  }
  return <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>{brand.logo}</span>;
}

function renderIcon(iconName, size = 20) {
  switch (iconName) {
    case 'smartphone':
      return <Smartphone size={size} />;
    case 'battery':
      return <Battery size={size} />;
    case 'battery-charging':
      return <BatteryCharging size={size} />;
    case 'zap':
      return <Zap size={size} />;
    case 'volume-2':
      return <Volume2 size={size} />;
    case 'volume-x':
      return <VolumeX size={size} />;
    case 'droplet':
      return <Droplet size={size} />;
    case 'droplets':
      return <Droplets size={size} />;
    case 'camera':
      return <Camera size={size} />;
    default:
      return <Smartphone size={size} />;
  }
}
