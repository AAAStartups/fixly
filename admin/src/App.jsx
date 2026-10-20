import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Tag,
  Boxes,
  Users,
  UserCheck,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  Truck,
  Wrench,
  AlertTriangle,
  ChevronRight,
  X,
  Plus,
  Trash2,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Check,
  Save,
  ArrowUpRight,
  Filter,
  Sparkles,
  Smartphone,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'pricing' | 'inventory' | 'customers' | 'staff'
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Data States
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeRepairs: 0,
    pendingApprovals: 0,
    todayDeliveries: 0,
    grossRevenue: 0,
    averageTatHours: 4.2,
    warrantyClaimRate: '1.4%',
  });
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Filter & Search States
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Slide-over Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Edit Forms inside Drawer
  const [editCustomerForm, setEditCustomerForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    addressLine: '',
    landmark: '',
    city: '',
    pincode: '',
  });

  const [editOrderForm, setEditOrderForm] = useState({
    status: '',
    issueDescription: '',
    diagnosisNotes: '',
    pickupFee: 79,
  });

  // Estimate Builder State
  const [estimateItems, setEstimateItems] = useState([]);
  const [estimateLabor, setEstimateLabor] = useState(399);
  const [estimateDiscount, setEstimateDiscount] = useState(0);

  // Add Part Modal State
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [newPartForm, setNewPartForm] = useState({
    modelId: 'xm-11t-pro',
    partName: '',
    partCode: '',
    costPrice: 1500,
    sellingPrice: 2499,
    stockQuantity: 10,
    minThreshold: 3,
  });

  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Data Fetch
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, servicesRes, inventoryRes, staffRes, customersRes] =
        await Promise.all([
          api.getDashboardStats().catch(() => null),
          api.getOrders().catch(() => ({ orders: [] })),
          api.getPricingServices().catch(() => []),
          api.getPartsInventory().catch(() => []),
          api.getStaff().catch(() => []),
          api.getCustomers().catch(() => []),
        ]);

      if (statsRes) setStats(statsRes);
      if (ordersRes && ordersRes.orders) setOrders(ordersRes.orders);
      if (servicesRes) setServices(servicesRes);
      if (inventoryRes) setInventory(inventoryRes);
      if (staffRes) setStaff(staffRes);
      if (customersRes) setCustomers(customersRes);
    } catch (err) {
      console.warn('Data sync warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Open Drawer and Populate Form States
  const handleOpenOrderDrawer = (order) => {
    setSelectedOrder(order);
    setEditCustomerForm({
      name: order.customer?.name || '',
      email: order.customer?.email || '',
      phoneNumber: order.customer?.phoneNumber || '',
      addressLine: order.pickupAddress?.addressLine || '',
      landmark: order.pickupAddress?.landmark || '',
      city: order.pickupAddress?.city || '',
      pincode: order.pickupAddress?.pincode || '',
    });

    setEditOrderForm({
      status: order.status,
      issueDescription: order.issueDescription || '',
      diagnosisNotes: order.diagnosisNotes || '',
      pickupFee: Number(order.pickupFee) || 79,
    });

    // Populate Estimate if exists
    if (order.estimate && order.estimate.items) {
      setEstimateItems(order.estimate.items);
      setEstimateLabor(Number(order.estimate.laborFee) || 399);
      setEstimateDiscount(Number(order.estimate.discount) || 0);
    } else {
      setEstimateItems([
        {
          title: `${order.model?.name || 'Device'} Replacement Assembly`,
          amount: 3999,
        },
      ]);
      setEstimateLabor(399);
      setEstimateDiscount(0);
    }

    setIsDrawerOpen(true);
  };

  // Save Customer Changes
  const handleSaveCustomer = async () => {
    if (!selectedOrder) return;
    try {
      await api.updateOrderCustomer(selectedOrder.id, editCustomerForm);
      showToast('Customer information updated successfully');
      fetchAllData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Save Order Details Changes
  const handleSaveOrderDetails = async () => {
    if (!selectedOrder) return;
    try {
      await api.updateOrderDetails(selectedOrder.id, editOrderForm);
      showToast('Order details & diagnosis updated successfully');
      fetchAllData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Advance Order Status
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      await api.updateOrderStatus(selectedOrder.id, newStatus);
      showToast(`Order status transitioned to ${newStatus}`);
      setEditOrderForm((prev) => ({ ...prev, status: newStatus }));
      fetchAllData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Assign Rider
  const handleAssignRider = async (riderId) => {
    if (!selectedOrder || !riderId) return;
    try {
      await api.assignRider(selectedOrder.id, riderId);
      showToast('Logistics Rider allocated to order');
      fetchAllData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Assign Technician
  const handleAssignTech = async (techId) => {
    if (!selectedOrder || !techId) return;
    try {
      await api.assignTech(selectedOrder.id, techId);
      showToast('Workshop Technician allocated to order');
      fetchAllData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Issue Quotation Estimate
  const handleIssueEstimate = async () => {
    if (!selectedOrder) return;
    try {
      await api.createEstimate(selectedOrder.id, {
        laborFee: Number(estimateLabor),
        discount: Number(estimateDiscount),
        pickupFee: Number(editOrderForm.pickupFee),
        items: estimateItems.map((it) => ({
          title: it.title,
          amount: Number(it.amount),
        })),
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      showToast('Quotation successfully issued to customer');
      fetchAllData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Update Service Price
  const handleUpdateServicePrice = async (code, field, value) => {
    try {
      const payload = { [field]: field === 'basePrice' ? Number(value) : value };
      await api.updatePricingService(code, payload);
      setServices((prev) =>
        prev.map((s) => (s.code === code ? { ...s, ...payload } : s))
      );
      showToast(`Updated ${code} price to ₹${value}`);
    } catch (err) {
      showToast(`Failed to update price: ${err.message}`);
    }
  };

  // Add Spare Part
  const handleCreatePart = async (e) => {
    e.preventDefault();
    try {
      await api.upsertSparePart(newPartForm);
      showToast(`Spare part ${newPartForm.partName} added to inventory`);
      setIsAddPartModalOpen(false);
      fetchAllData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Update Part Stock
  const handleUpdatePartStock = async (part, newStock) => {
    try {
      await api.upsertSparePart({
        partCode: part.partCode,
        modelId: part.modelId,
        partName: part.partName,
        costPrice: Number(part.costPrice),
        sellingPrice: Number(part.sellingPrice),
        stockQuantity: Number(newStock),
        minThreshold: part.minThreshold,
      });
      setInventory((prev) =>
        prev.map((p) =>
          p.partCode === part.partCode ? { ...p, stockQuantity: Number(newStock) } : p
        )
      );
      showToast(`Stock updated for ${part.partName}`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter ? o.status === orderStatusFilter : true;
    const matchesSearch = searchQuery
      ? o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.phoneNumber?.includes(searchQuery) ||
        o.model?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PICKUP_SCHEDULED':
        return <span className="badge-status blue"><Truck size={12} /> Pickup Scheduled</span>;
      case 'DEVICE_RECEIVED':
        return <span className="badge-status purple"><Boxes size={12} /> In Repair Lab</span>;
      case 'DIAGNOSIS_PENDING':
        return <span className="badge-status yellow"><Wrench size={12} /> Diagnosis Ready</span>;
      case 'ESTIMATE_SENT':
        return <span className="badge-status orange"><DollarSign size={12} /> Quote Issued</span>;
      case 'REPAIR_IN_PROGRESS':
        return <span className="badge-status red"><RefreshCw size={12} className="animate-spin" /> In Repair</span>;
      case 'QUALITY_CHECK_PASSED':
        return <span className="badge-status green"><ShieldCheck size={12} /> QC Passed</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="badge-status blue"><Truck size={12} /> Out for Delivery</span>;
      case 'DELIVERED':
        return <span className="badge-status green"><CheckCircle size={12} /> Delivered</span>;
      default:
        return <span className="badge-status gray">{status}</span>;
    }
  };

  return (
    <div className="admin-shell">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle size={18} color="#FF2B42" />
            <span style={{ fontWeight: 600 }}>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="brand-badge">F</div>
          <div className="brand-info">
            <h1>FIXLY OPS</h1>
            <span>Command Center</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview Dashboard</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ClipboardList size={18} />
            <span>Orders & Workbench</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <Tag size={18} />
            <span>Pricing & Catalog</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Boxes size={18} />
            <span>Spare Parts Inventory</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} />
            <span>Customer Directory</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            <UserCheck size={18} />
            <span>Technicians & Fleet</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="server-pill">
            <div className="status-dot"></div>
            <span>Supabase Cloud Live</span>
          </div>
          <button className="btn-icon" onClick={fetchAllData} title="Refresh All Data">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h2 className="page-title">
              {activeTab === 'overview' && 'Workshop Overview & Telemetry'}
              {activeTab === 'orders' && 'Repair Orders Operations Hub'}
              {activeTab === 'pricing' && 'Dynamic Pricing & Service Catalog'}
              {activeTab === 'inventory' && 'Spare Parts & Inventory Control'}
              {activeTab === 'customers' && 'Customer CRM & Contact Info'}
              {activeTab === 'staff' && 'Workshop Technicians & Logistics Fleet'}
            </h2>
          </div>

          <div className="topbar-right">
            <div className="admin-search-box">
              <Search size={15} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Search orders, phones, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === 'inventory' && (
              <button
                className="btn-primary"
                onClick={() => setIsAddPartModalOpen(true)}
              >
                <Plus size={16} /> Add Part
              </button>
            )}

            <button className="btn-secondary" onClick={fetchAllData}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Sync</span>
            </button>
          </div>
        </header>

        {/* View Body */}
        <div className="admin-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Telemetry Metric Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-title">Total Bookings</span>
                    <div className="stat-icon" style={{ color: '#38BDF8' }}>
                      <ClipboardList size={18} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.totalBookings}</div>
                  <span className="stat-sub">Across Powai, Mumbai & Bengaluru</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-title">In Lab Workbench</span>
                    <div className="stat-icon" style={{ color: '#FF2B42' }}>
                      <Wrench size={18} />
                    </div>
                  </div>
                  <div className="stat-value" style={{ color: '#FF2B42' }}>
                    {stats.activeRepairs}
                  </div>
                  <span className="stat-sub">Active repairs undergoing assembly</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-title">Pending Quotes</span>
                    <div className="stat-icon" style={{ color: '#FBBF24' }}>
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <div className="stat-value" style={{ color: '#FBBF24' }}>
                    {stats.pendingApprovals}
                  </div>
                  <span className="stat-sub">Awaiting customer quotation consent</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-title">Gross Revenue</span>
                    <div className="stat-icon" style={{ color: '#34D399' }}>
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <div className="stat-value" style={{ color: '#34D399' }}>
                    ₹{stats.grossRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="stat-sub">Paid bookings via Razorpay / Cash</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-title">Average TAT</span>
                    <div className="stat-icon" style={{ color: '#A78BFA' }}>
                      <Clock size={18} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.averageTatHours} hrs</div>
                  <span className="stat-sub">Doorstep pickup to safe return</span>
                </div>
              </div>

              {/* Recent Orders Overview Panel */}
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3 className="panel-card-title">Live Repair Orders in Queue</h3>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All Orders <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Device & Model</th>
                        <th>Status</th>
                        <th>Technician</th>
                        <th>Logistics Rider</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: 800, color: '#FF2B42' }}>
                            {order.orderNumber}
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{order.customer?.name}</div>
                            <div style={{ fontSize: 11, color: '#6B7280' }}>
                              {order.customer?.phoneNumber}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{order.model?.name}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                              {order.issueDescription?.slice(0, 35)}...
                            </div>
                          </td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>
                            {order.technician?.name ? (
                              <span style={{ color: '#D4D4D8' }}>{order.technician.name}</span>
                            ) : (
                              <span style={{ color: '#EF4444', fontStyle: 'italic' }}>
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td>
                            {order.rider?.name ? (
                              <span style={{ color: '#D4D4D8' }}>{order.rider.name}</span>
                            ) : (
                              <span style={{ color: '#EF4444', fontStyle: 'italic' }}>
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td style={{ fontWeight: 700 }}>
                            ₹{order.estimate?.totalAmount || '—'}
                          </td>
                          <td>
                            <button
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: 12 }}
                              onClick={() => handleOpenOrderDrawer(order)}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div>
              {/* Filter Tabs */}
              <div className="filter-tabs">
                {[
                  { label: 'All Orders', value: '' },
                  { label: 'Pickup Scheduled', value: 'PICKUP_SCHEDULED' },
                  { label: 'In Lab', value: 'DEVICE_RECEIVED' },
                  { label: 'Diagnosis Done', value: 'DIAGNOSIS_PENDING' },
                  { label: 'Estimate Sent', value: 'ESTIMATE_SENT' },
                  { label: 'Repairing', value: 'REPAIR_IN_PROGRESS' },
                  { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
                  { label: 'Delivered', value: 'DELIVERED' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    className={`filter-tab ${orderStatusFilter === tab.value ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3 className="panel-card-title">
                    Showing {filteredOrders.length} Order(s)
                  </h3>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Device</th>
                        <th>Issue Reported</th>
                        <th>Stage</th>
                        <th>Technician</th>
                        <th>Rider</th>
                        <th>Estimate</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>
                            No orders found matching this filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td style={{ fontWeight: 800, color: '#FF2B42' }}>
                              {order.orderNumber}
                            </td>
                            <td>
                              <div style={{ fontWeight: 700 }}>{order.customer?.name}</div>
                              <div style={{ fontSize: 11, color: '#6B7280' }}>
                                {order.customer?.phoneNumber}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{order.model?.name}</div>
                              <div style={{ fontSize: 11, color: '#6B7280' }}>
                                {order.model?.brand?.name}
                              </div>
                            </td>
                            <td style={{ maxWidth: 220, fontSize: 12, color: '#D4D4D8' }}>
                              {order.issueDescription}
                            </td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              {order.technician ? (
                                <span style={{ color: '#D4D4D8', fontSize: 12 }}>
                                  {order.technician.name}
                                </span>
                              ) : (
                                <span style={{ color: '#EF4444', fontSize: 11, fontWeight: 700 }}>
                                  NOT ASSIGNED
                                </span>
                              )}
                            </td>
                            <td>
                              {order.rider ? (
                                <span style={{ color: '#D4D4D8', fontSize: 12 }}>
                                  {order.rider.name}
                                </span>
                              ) : (
                                <span style={{ color: '#EF4444', fontSize: 11, fontWeight: 700 }}>
                                  NOT ASSIGNED
                                </span>
                              )}
                            </td>
                            <td style={{ fontWeight: 800, color: '#34D399' }}>
                              {order.estimate?.totalAmount ? `₹${order.estimate.totalAmount}` : 'Pending'}
                            </td>
                            <td>
                              <button
                                className="btn-primary"
                                style={{ padding: '6px 14px', fontSize: 12 }}
                                onClick={() => handleOpenOrderDrawer(order)}
                              >
                                Edit / Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC PRICING & CATALOG CONTROLS */}
          {activeTab === 'pricing' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: '#9CA3AF', fontSize: 14 }}>
                  Control and edit every repair price listed on FIXLY. Changes are saved directly to the
                  cloud database and immediately update all client mobile and web apps without requiring an app store release.
                </p>
              </div>

              <div className="pricing-grid">
                {services.map((service) => (
                  <div key={service.code} className="pricing-card">
                    <div className="pricing-card-header">
                      <div className="pricing-icon">
                        <Smartphone size={22} />
                      </div>
                      <span className="badge-status green">Live in App</span>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                        {service.title}
                      </h4>
                      <p style={{ fontSize: 12, color: '#9CA3AF', minHeight: 36 }}>
                        {service.subtitle}
                      </p>
                    </div>

                    {/* Price Input */}
                    <div className="form-group">
                      <label className="form-label">Base Price (₹)</label>
                      <div className="price-input-group">
                        <span>₹</span>
                        <input
                          type="number"
                          defaultValue={service.basePrice || service.price}
                          onBlur={(e) =>
                            handleUpdateServicePrice(service.code, 'basePrice', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Warranty Text */}
                    <div className="form-group">
                      <label className="form-label">Warranty Assurance</label>
                      <input
                        type="text"
                        className="form-input"
                        defaultValue={service.warrantyText || service.warranty}
                        onBlur={(e) =>
                          handleUpdateServicePrice(service.code, 'warrantyText', e.target.value)
                        }
                      />
                    </div>

                    {/* Subtitle / Notes */}
                    <div className="form-group">
                      <label className="form-label">Description Subtitle</label>
                      <input
                        type="text"
                        className="form-input"
                        defaultValue={service.subtitle}
                        onBlur={(e) =>
                          handleUpdateServicePrice(service.code, 'subtitle', e.target.value)
                        }
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #202026' }}>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>Auto-saves on blur</span>
                      <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>Sync: 0ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SPARE PARTS INVENTORY */}
          {activeTab === 'inventory' && (
            <div>
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3 className="panel-card-title">Spare Parts Stock & Pricing</h3>
                  <button
                    className="btn-primary"
                    onClick={() => setIsAddPartModalOpen(true)}
                  >
                    <Plus size={16} /> Add New Part
                  </button>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Part Code</th>
                        <th>Part Name</th>
                        <th>Compatible Model</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>Margin</th>
                        <th>In Stock</th>
                        <th>Status</th>
                        <th>Quick Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((part) => {
                        const margin =
                          Number(part.sellingPrice) - Number(part.costPrice);
                        const isLow = Number(part.stockQuantity) <= Number(part.minThreshold);
                        return (
                          <tr key={part.partCode}>
                            <td style={{ fontWeight: 800, color: '#38BDF8' }}>
                              {part.partCode}
                            </td>
                            <td style={{ fontWeight: 700 }}>{part.partName}</td>
                            <td>{part.model?.name || 'Multi-model'}</td>
                            <td>₹{part.costPrice}</td>
                            <td style={{ fontWeight: 800, color: '#FF2B42' }}>
                              ₹{part.sellingPrice}
                            </td>
                            <td style={{ color: '#34D399', fontWeight: 700 }}>
                              +₹{margin}
                            </td>
                            <td style={{ fontWeight: 800 }}>
                              {part.stockQuantity} units
                            </td>
                            <td>
                              {isLow ? (
                                <span className="badge-status red">
                                  <AlertTriangle size={12} /> Low Stock
                                </span>
                              ) : (
                                <span className="badge-status green">Adequate</span>
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                style={{
                                  width: 70,
                                  padding: '4px 8px',
                                  background: '#0E0E12',
                                  border: '1px solid #2D2D36',
                                  borderRadius: 6,
                                  color: '#fff',
                                }}
                                defaultValue={part.stockQuantity}
                                onBlur={(e) =>
                                  handleUpdatePartStock(part, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER DIRECTORY */}
          {activeTab === 'customers' && (
            <div>
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3 className="panel-card-title">Registered Customers & Addresses</h3>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Saved Address</th>
                        <th>Total Orders</th>
                        <th>Registered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c) => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 700 }}>{c.name || 'Unnamed'}</td>
                          <td style={{ color: '#FF2B42', fontWeight: 600 }}>
                            {c.phoneNumber}
                          </td>
                          <td>{c.email || '—'}</td>
                          <td style={{ maxWidth: 300, fontSize: 12 }}>
                            {c.addresses && c.addresses.length > 0 ? (
                              <div>
                                {c.addresses[0].addressLine}, {c.addresses[0].city} -{' '}
                                {c.addresses[0].pincode}
                              </div>
                            ) : (
                              'No address on record'
                            )}
                          </td>
                          <td style={{ fontWeight: 800 }}>
                            {c.customerOrders?.length || 0}
                          </td>
                          <td style={{ color: '#6B7280', fontSize: 12 }}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STAFF & FLEET */}
          {activeTab === 'staff' && (
            <div>
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3 className="panel-card-title">Certified Technicians & Logistics Fleet</h3>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Operational Zone</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((s) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 700 }}>{s.name}</td>
                          <td>
                            {s.role === 'TECHNICIAN' ? (
                              <span className="badge-status purple">
                                <Wrench size={12} /> Workshop Tech
                              </span>
                            ) : (
                              <span className="badge-status blue">
                                <Truck size={12} /> Doorstep Rider
                              </span>
                            )}
                          </td>
                          <td>{s.phoneNumber}</td>
                          <td>{s.email}</td>
                          <td>Powai / Mumbai Central Hub</td>
                          <td>
                            <span className="badge-status green">On Duty</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SLIDE-OVER ORDER & CUSTOMER DRAWER */}
      {isDrawerOpen && selectedOrder && (
        <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FF2B42' }}>
                    {selectedOrder.orderNumber}
                  </h3>
                  {getStatusBadge(editOrderForm.status)}
                </div>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                  {selectedOrder.model?.name} • Created{' '}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button className="btn-icon" onClick={() => setIsDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {/* SECTION 1: LIFECYCLE STAGE ACCELERATOR */}
              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Advance Repair Stage</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { label: 'Received in Lab', status: 'DEVICE_RECEIVED' },
                    { label: 'Diagnosis Done', status: 'DIAGNOSIS_PENDING' },
                    { label: 'Repair in Progress', status: 'REPAIR_IN_PROGRESS' },
                    { label: 'Quality Check Passed', status: 'QUALITY_CHECK_PASSED' },
                    { label: 'Out for Delivery', status: 'OUT_FOR_DELIVERY' },
                    { label: 'Delivered', status: 'DELIVERED' },
                  ].map((step) => (
                    <button
                      key={step.status}
                      className={`btn-secondary ${editOrderForm.status === step.status ? 'active' : ''}`}
                      style={{
                        padding: '6px 12px',
                        fontSize: 11,
                        borderColor: editOrderForm.status === step.status ? '#FF2B42' : '#2D2D36',
                        color: editOrderForm.status === step.status ? '#FF2B42' : '#fff',
                      }}
                      onClick={() => handleUpdateStatus(step.status)}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: EDIT CUSTOMER DETAILS */}
              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Customer Contact & Pickup Address</span>
                  <button
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: 11 }}
                    onClick={handleSaveCustomer}
                  >
                    <Save size={12} /> Save Customer
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editCustomerForm.name}
                      onChange={(e) =>
                        setEditCustomerForm({ ...editCustomerForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editCustomerForm.phoneNumber}
                      onChange={(e) =>
                        setEditCustomerForm({
                          ...editCustomerForm,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group full">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editCustomerForm.email}
                      onChange={(e) =>
                        setEditCustomerForm({ ...editCustomerForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group full">
                    <label className="form-label">Address Line</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editCustomerForm.addressLine}
                      onChange={(e) =>
                        setEditCustomerForm({
                          ...editCustomerForm,
                          addressLine: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Landmark</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editCustomerForm.landmark}
                      onChange={(e) =>
                        setEditCustomerForm({
                          ...editCustomerForm,
                          landmark: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City & Pincode</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="City"
                        value={editCustomerForm.city}
                        onChange={(e) =>
                          setEditCustomerForm({ ...editCustomerForm, city: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Pincode"
                        style={{ width: 100 }}
                        value={editCustomerForm.pincode}
                        onChange={(e) =>
                          setEditCustomerForm({
                            ...editCustomerForm,
                            pincode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: STAFF ALLOCATION */}
              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Allocate Workshop Staff & Rider</span>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Workbench Technician</label>
                    <select
                      className="form-select"
                      value={selectedOrder.technicianId || ''}
                      onChange={(e) => handleAssignTech(e.target.value)}
                    >
                      <option value="">Select Technician...</option>
                      {staff
                        .filter((s) => s.role === 'TECHNICIAN')
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Doorstep Rider</label>
                    <select
                      className="form-select"
                      value={selectedOrder.riderId || ''}
                      onChange={(e) => handleAssignRider(e.target.value)}
                    >
                      <option value="">Select Rider...</option>
                      {staff
                        .filter((s) => s.role === 'RIDER')
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: DIAGNOSIS & ISSUE NOTES */}
              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Diagnostic Findings & Order Notes</span>
                  <button
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: 11 }}
                    onClick={handleSaveOrderDetails}
                  >
                    <Save size={12} /> Save Notes
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Reported Issue</label>
                  <textarea
                    className="form-textarea"
                    value={editOrderForm.issueDescription}
                    onChange={(e) =>
                      setEditOrderForm({
                        ...editOrderForm,
                        issueDescription: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Technician Diagnostic Notes</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Enter workshop inspection findings (e.g., IC intact, replace flex cable)..."
                    value={editOrderForm.diagnosisNotes}
                    onChange={(e) =>
                      setEditOrderForm({
                        ...editOrderForm,
                        diagnosisNotes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* SECTION 5: ITEMIZED QUOTATION / ESTIMATE BUILDER */}
              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Itemized Quotation Generator</span>
                  <button
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: 11 }}
                    onClick={handleIssueEstimate}
                  >
                    <DollarSign size={12} /> Issue Quotation
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {estimateItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: '#0E0E12',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #202026',
                      }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1 }}
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...estimateItems];
                          updated[idx].title = e.target.value;
                          setEstimateItems(updated);
                        }}
                      />
                      <div className="price-input-group" style={{ width: 120 }}>
                        <span>₹</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const updated = [...estimateItems];
                            updated[idx].amount = Number(e.target.value);
                            setEstimateItems(updated);
                          }}
                        />
                      </div>
                      <button
                        className="btn-icon"
                        style={{ width: 30, height: 30 }}
                        onClick={() => {
                          const updated = estimateItems.filter((_, i) => i !== idx);
                          setEstimateItems(updated);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  <button
                    className="btn-secondary"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                    onClick={() =>
                      setEstimateItems([
                        ...estimateItems,
                        { title: 'Additional Spare Part / Consumable', amount: 500 },
                      ])
                    }
                  >
                    <Plus size={14} /> Add Line Item
                  </button>

                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: '1px solid #202026',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9CA3AF' }}>Doorstep Logistics Fee:</span>
                      <div className="price-input-group" style={{ width: 100 }}>
                        <span>₹</span>
                        <input
                          type="number"
                          value={editOrderForm.pickupFee}
                          onChange={(e) =>
                            setEditOrderForm({
                              ...editOrderForm,
                              pickupFee: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9CA3AF' }}>Workbench Labor & QC Fee:</span>
                      <div className="price-input-group" style={{ width: 100 }}>
                        <span>₹</span>
                        <input
                          type="number"
                          value={estimateLabor}
                          onChange={(e) => setEstimateLabor(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9CA3AF' }}>Promotional Discount:</span>
                      <div className="price-input-group" style={{ width: 100 }}>
                        <span>-₹</span>
                        <input
                          type="number"
                          value={estimateDiscount}
                          onChange={(e) => setEstimateDiscount(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 18,
                        fontWeight: 900,
                        color: '#34D399',
                        paddingTop: 8,
                        borderTop: '1px dashed #2D2D36',
                      }}
                    >
                      <span>Estimated Grand Total:</span>
                      <span>
                        ₹
                        {estimateItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0) +
                          Number(estimateLabor) +
                          Number(editOrderForm.pickupFee) -
                          Number(estimateDiscount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SPARE PART */}
      {isAddPartModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsAddPartModalOpen(false)}>
          <div
            className="drawer-panel"
            style={{ width: 480, height: 'auto', maxHeight: '85vh', borderRadius: 16, margin: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Add New Spare Part</h3>
              <button className="btn-icon" onClick={() => setIsAddPartModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePart} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Part Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 14 Pro Max OLED Screen"
                  className="form-input"
                  value={newPartForm.partName}
                  onChange={(e) => setNewPartForm({ ...newPartForm, partName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Part SKU / Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PART-AP14PM-DISP"
                  className="form-input"
                  value={newPartForm.partCode}
                  onChange={(e) => setNewPartForm({ ...newPartForm, partCode: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Cost Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newPartForm.costPrice}
                    onChange={(e) => setNewPartForm({ ...newPartForm, costPrice: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newPartForm.sellingPrice}
                    onChange={(e) => setNewPartForm({ ...newPartForm, sellingPrice: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newPartForm.stockQuantity}
                    onChange={(e) => setNewPartForm({ ...newPartForm, stockQuantity: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Min Threshold</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newPartForm.minThreshold}
                    onChange={(e) => setNewPartForm({ ...newPartForm, minThreshold: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 10, justifyContent: 'center' }}>
                <Plus size={16} /> Save to Inventory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
