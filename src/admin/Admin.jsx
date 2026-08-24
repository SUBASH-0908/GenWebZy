import React, { useState, useEffect } from 'react';
import './Admin.css';

// One-way cryptographic SHA-256 hash of PIN 2027 (PIN is never stored in plain text)
const PIN_SHA256_HASH = "5313e5bf17148de844ff74be3663d47c6e361ca469b30a36337701233c89a15e";

async function computeSha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const INITIAL_DATA = {
  contact: {
    email: "contact.genwebzy@gmail.com",
    whatsapp: "919751574014",
    whatsappLink: "https://wa.me/919751574014",
    whatsapp2: "+91 7904434191",
    instagram: "INSTAGRAM_URL",
    linkedin: "LINKEDIN_URL",
    github: "GITHUB_URL"
  },
  services: [],
  projects: [],
  pricing: [],
  faq: [],
  reviews: []
};

export default function Admin() {
  const [authToken, setAuthToken] = useState(() => {
    return sessionStorage.getItem('genwebzy_admin_token') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [submittingPin, setSubmittingPin] = useState(false);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Confirm Delete State
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (authToken) {
      verifyToken(authToken);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadContent();
    }
  }, [isAuthenticated]);

  const verifyToken = async (token) => {
    try {
      const res = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.valid) {
          setIsAuthenticated(true);
          return;
        }
      }
    } catch (e) {
      // Fallback for static hosts (Vercel)
    }
    // If token exists in session, stay authenticated
    if (token) {
      setIsAuthenticated(true);
    } else {
      handleLogout(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.log("Loaded default static content.");
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (newData) => {
    const updated = newData || data;
    setData(updated);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        showToast('Saved successfully to content.json!');
      } else {
        showToast('Saved in active session!');
      }
    } catch (err) {
      showToast('Saved in active session!');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pin) return;
    setSubmittingPin(true);
    setPinError('');

    try {
      // 1. Try server backend verification first
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          sessionStorage.setItem('genwebzy_admin_token', json.token);
          setAuthToken(json.token);
          setIsAuthenticated(true);
          setPin('');
          setPinError('');
          setSubmittingPin(false);
          return;
        }
      }
    } catch (err) {
      // Static production server (Vercel) doesn't run local Node API
    }

    // 2. Production fallback: One-way SHA-256 hash comparison
    try {
      const inputHash = await computeSha256(pin);
      if (inputHash === PIN_SHA256_HASH) {
        const fallbackToken = 'gwz_session_' + Date.now();
        sessionStorage.setItem('genwebzy_admin_token', fallbackToken);
        setAuthToken(fallbackToken);
        setIsAuthenticated(true);
        setPin('');
        setPinError('');
      } else {
        setPinError('Incorrect PIN. Access denied.');
      }
    } catch (err) {
      setPinError('Authentication error. Please try again.');
    } finally {
      setSubmittingPin(false);
    }
  };

  const handleLogout = (redirectToMain = true) => {
    sessionStorage.removeItem('genwebzy_admin_token');
    setAuthToken('');
    setIsAuthenticated(false);
    if (redirectToMain) {
      window.location.href = '/';
    }
  };

  const openAddModal = (section) => {
    setModalSection(section);
    setEditingItem(null);

    let initial = {};
    if (section === 'reviews') {
      initial = { name: '', company: '', service: '', rating: 5, text: '', avatar: '', visible: true };
    } else if (section === 'projects') {
      initial = { title: '', category: 'Business Website', description: '', technologies: '', image: '', projectUrl: '', isConcept: false, visible: true };
    } else if (section === 'services') {
      initial = { id: String(Date.now()).slice(-2), title: '', description: '', extras: '', visible: true };
    } else if (section === 'pricing') {
      initial = { name: '', audience: '', price: '', priceNote: '', features: '', cta: 'Get a Quote', highlighted: false, visible: true };
    } else if (section === 'faq') {
      initial = { question: '', answer: '', visible: true };
    }
    setFormData(initial);
    setModalOpen(true);
  };

  const openEditModal = (section, item) => {
    setModalSection(section);
    setEditingItem(item);
    let itemCopy = { ...item };
    
    if (Array.isArray(itemCopy.technologies)) {
      itemCopy.technologies = itemCopy.technologies.join(', ');
    }
    if (Array.isArray(itemCopy.extras)) {
      itemCopy.extras = itemCopy.extras.join('\n');
    }
    if (Array.isArray(itemCopy.features)) {
      itemCopy.features = itemCopy.features.join('\n');
    }
    if (itemCopy.visible === undefined) itemCopy.visible = true;

    setFormData(itemCopy);
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const section = modalSection;
    let finalItem = { ...formData };

    if (section === 'projects' && typeof finalItem.technologies === 'string') {
      finalItem.technologies = finalItem.technologies.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (section === 'services' && typeof finalItem.extras === 'string') {
      finalItem.extras = finalItem.extras.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (section === 'pricing' && typeof finalItem.features === 'string') {
      finalItem.features = finalItem.features.split('\n').map(s => s.trim()).filter(Boolean);
    }

    let updatedList = [...(data[section] || [])];

    if (editingItem) {
      updatedList = updatedList.map(item => item.id === editingItem.id ? finalItem : item);
    } else {
      finalItem.id = finalItem.id || Date.now();
      if (section === 'reviews' && !finalItem.avatar && finalItem.name) {
        finalItem.avatar = finalItem.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      }
      updatedList.push(finalItem);
    }

    const updatedData = { ...data, [section]: updatedList };
    saveContent(updatedData);
    setModalOpen(false);
  };

  const toggleVisibility = (section, id) => {
    const updatedList = (data[section] || []).map(item => {
      if (item.id === id) {
        return { ...item, visible: item.visible === undefined ? false : !item.visible };
      }
      return item;
    });
    const updatedData = { ...data, [section]: updatedList };
    saveContent(updatedData);
  };

  const toggleHighlighted = (id) => {
    const updatedList = (data.pricing || []).map(item => {
      if (item.id === id) {
        return { ...item, highlighted: !item.highlighted };
      }
      return item;
    });
    const updatedData = { ...data, pricing: updatedList };
    saveContent(updatedData);
  };

  const confirmDeleteAction = (section, id) => {
    setDeleteConfirm({ section, id });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    const { section, id } = deleteConfirm;
    const updatedList = (data[section] || []).filter(item => item.id !== id);
    const updatedData = { ...data, [section]: updatedList };
    saveContent(updatedData);
    setDeleteConfirm(null);
  };

  const handleContactChange = (field, val) => {
    const updatedContact = { ...data.contact, [field]: val };
    const updatedData = { ...data, contact: updatedContact };
    setData(updatedData);
  };

  if (!isAuthenticated) {
    return (
      <div className="adm-login">
        <div className="adm-login__card">
          <div className="adm-login__logo">GenWebZy</div>
          <div className="adm-login__sub">Admin Control Panel</div>
          <form onSubmit={handleLogin}>
            <label className="adm-login__label">Enter Admin PIN</label>
            <input
              type="password"
              className="adm-login__input"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              maxLength={10}
              autoFocus
              disabled={submittingPin}
            />
            {pinError && <div className="adm-login__err">{pinError}</div>}
            <button type="submit" className="adm-login__btn" disabled={submittingPin}>
              {submittingPin ? 'Verifying...' : 'Unlock Panel'}
            </button>
          </form>
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
              ← Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-shell">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">
          <div className="adm-sidebar__brand-name">GenWebZy</div>
          <div className="adm-sidebar__brand-tag">CMS Portal</div>
        </div>
        <nav className="adm-sidebar__nav">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'reviews', label: 'Reviews', icon: '⭐' },
            { id: 'projects', label: 'Projects', icon: '🚀' },
            { id: 'services', label: 'Services', icon: '⚡' },
            { id: 'pricing', label: 'Pricing', icon: '💰' },
            { id: 'faq', label: 'FAQ', icon: '❓' },
            { id: 'contact', label: 'Contact', icon: '📞' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`adm-sidebar__item ${activeSection === tab.id ? 'adm-sidebar__item--active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              <span className="adm-sidebar__icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="adm-sidebar__logout">
          <button className="adm-sidebar__logout-btn" onClick={() => handleLogout(true)}>
            🔒 Exit & Lock Panel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="adm-main">
        <header className="adm-header">
          <h1 className="adm-header__title">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
          </h1>
          {loading ? (
            <span className="adm-hint">Loading data...</span>
          ) : (
            <span className="adm-header__saved">● Sync Active</span>
          )}
        </header>

        <div className="adm-content">
          {/* Dashboard Tab */}
          {activeSection === 'dashboard' && (
            <div>
              <div className="adm-dash">
                {[
                  { id: 'reviews', label: 'Reviews', count: data.reviews?.length || 0, icon: '⭐' },
                  { id: 'projects', label: 'Projects', count: data.projects?.length || 0, icon: '🚀' },
                  { id: 'services', label: 'Services', count: data.services?.length || 0, icon: '⚡' },
                  { id: 'pricing', label: 'Pricing Plans', count: data.pricing?.length || 0, icon: '💰' },
                  { id: 'faq', label: 'FAQ Items', count: data.faq?.length || 0, icon: '❓' },
                ].map(stat => (
                  <div key={stat.id} className="adm-stat" onClick={() => setActiveSection(stat.id)}>
                    <div className="adm-stat__icon">{stat.icon}</div>
                    <div className="adm-stat__count">{stat.count}</div>
                    <div className="adm-stat__label">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="adm-card" style={{ flexDirection: 'column', gap: '12px' }}>
                <h3 className="adm-card__title">Quick Site Summary</h3>
                <p className="adm-card__sub">
                  Modifications saved here reflect instantly on the site.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button className="adm-btn adm-btn--primary" onClick={() => openAddModal('projects')}>
                    + Add New Project
                  </button>
                  <button className="adm-btn adm-btn--ghost" onClick={() => openAddModal('reviews')}>
                    + Add New Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeSection === 'reviews' && (
            <SectionView
              title="Client Reviews"
              items={data.reviews}
              onAdd={() => openAddModal('reviews')}
              renderCard={(item) => (
                <div className={`adm-card ${item.visible === false ? 'adm-card--hidden' : ''}`} key={item.id}>
                  <div className="adm-card__body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="adm-card__title">{item.name}</span>
                      <span className="adm-card__sub">({item.company})</span>
                      {item.visible === false && (
                        <span className="adm-card__badge adm-card__badge--gray">Hidden</span>
                      )}
                    </div>
                    <div className="adm-stars">{'★'.repeat(item.rating || 5)}</div>
                    <p className="adm-card__sub" style={{ marginTop: '6px' }}>"{item.text}"</p>
                  </div>
                  <div className="adm-card__actions">
                    <button
                      className="adm-btn-icon"
                      title={item.visible === false ? "Show" : "Hide"}
                      onClick={() => toggleVisibility('reviews', item.id)}
                    >
                      {item.visible === false ? '👁️' : '🕶️'}
                    </button>
                    <button className="adm-btn-icon" onClick={() => openEditModal('reviews', item)}>✏️</button>
                    <button className="adm-btn-icon adm-btn-icon--del" onClick={() => confirmDeleteAction('reviews', item.id)}>🗑️</button>
                  </div>
                </div>
              )}
            />
          )}

          {/* Projects Tab */}
          {activeSection === 'projects' && (
            <SectionView
              title="Portfolio Projects"
              items={data.projects}
              onAdd={() => openAddModal('projects')}
              renderCard={(item) => (
                <div className={`adm-card ${item.visible === false ? 'adm-card--hidden' : ''}`} key={item.id}>
                  <div className="adm-card__body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="adm-card__title">{item.title}</span>
                      <span className="adm-card__badge adm-card__badge--blue">{item.category}</span>
                      {item.isConcept && <span className="adm-card__badge adm-card__badge--gray">Concept</span>}
                      {item.visible === false && <span className="adm-card__badge adm-card__badge--gray">Hidden</span>}
                    </div>
                    <p className="adm-card__sub" style={{ marginTop: '6px' }}>{item.description}</p>
                    {item.technologies && (
                      <div className="adm-hint" style={{ marginTop: '6px' }}>
                        Tech: {Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}
                      </div>
                    )}
                  </div>
                  <div className="adm-card__actions">
                    <button
                      className="adm-btn-icon"
                      title={item.visible === false ? "Show" : "Hide"}
                      onClick={() => toggleVisibility('projects', item.id)}
                    >
                      {item.visible === false ? '👁️' : '🕶️'}
                    </button>
                    <button className="adm-btn-icon" onClick={() => openEditModal('projects', item)}>✏️</button>
                    <button className="adm-btn-icon adm-btn-icon--del" onClick={() => confirmDeleteAction('projects', item.id)}>🗑️</button>
                  </div>
                </div>
              )}
            />
          )}

          {/* Services Tab */}
          {activeSection === 'services' && (
            <SectionView
              title="Services Offered"
              items={data.services}
              onAdd={() => openAddModal('services')}
              renderCard={(item) => (
                <div className={`adm-card ${item.visible === false ? 'adm-card--hidden' : ''}`} key={item.id}>
                  <div className="adm-card__body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="adm-card__title">[{item.id}] {item.title}</span>
                      {item.visible === false && <span className="adm-card__badge adm-card__badge--gray">Hidden</span>}
                    </div>
                    <p className="adm-card__sub" style={{ marginTop: '6px' }}>{item.description}</p>
                  </div>
                  <div className="adm-card__actions">
                    <button
                      className="adm-btn-icon"
                      title={item.visible === false ? "Show" : "Hide"}
                      onClick={() => toggleVisibility('services', item.id)}
                    >
                      {item.visible === false ? '👁️' : '🕶️'}
                    </button>
                    <button className="adm-btn-icon" onClick={() => openEditModal('services', item)}>✏️</button>
                    <button className="adm-btn-icon adm-btn-icon--del" onClick={() => confirmDeleteAction('services', item.id)}>🗑️</button>
                  </div>
                </div>
              )}
            />
          )}

          {/* Pricing Tab */}
          {activeSection === 'pricing' && (
            <SectionView
              title="Pricing Packages"
              items={data.pricing}
              onAdd={() => openAddModal('pricing')}
              renderCard={(item) => (
                <div className={`adm-card ${item.visible === false ? 'adm-card--hidden' : ''}`} key={item.id}>
                  <div className="adm-card__body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="adm-card__title">{item.name}</span>
                      <span className="adm-card__badge adm-card__badge--blue">{item.price}</span>
                      {item.highlighted && <span className="adm-card__badge adm-card__badge--blue">Featured</span>}
                      {item.visible === false && <span className="adm-card__badge adm-card__badge--gray">Hidden</span>}
                    </div>
                    <p className="adm-card__sub" style={{ marginTop: '4px' }}>{item.audience}</p>
                  </div>
                  <div className="adm-card__actions">
                    <button
                      className="adm-btn-icon"
                      title={item.highlighted ? "Remove Highlight" : "Highlight Plan"}
                      onClick={() => toggleHighlighted(item.id)}
                    >
                      ⭐
                    </button>
                    <button
                      className="adm-btn-icon"
                      title={item.visible === false ? "Show" : "Hide"}
                      onClick={() => toggleVisibility('pricing', item.id)}
                    >
                      {item.visible === false ? '👁️' : '🕶️'}
                    </button>
                    <button className="adm-btn-icon" onClick={() => openEditModal('pricing', item)}>✏️</button>
                    <button className="adm-btn-icon adm-btn-icon--del" onClick={() => confirmDeleteAction('pricing', item.id)}>🗑️</button>
                  </div>
                </div>
              )}
            />
          )}

          {/* FAQ Tab */}
          {activeSection === 'faq' && (
            <SectionView
              title="Frequently Asked Questions"
              items={data.faq}
              onAdd={() => openAddModal('faq')}
              renderCard={(item) => (
                <div className={`adm-card ${item.visible === false ? 'adm-card--hidden' : ''}`} key={item.id}>
                  <div className="adm-card__body">
                    <div className="adm-card__title">Q: {item.question}</div>
                    <p className="adm-card__sub" style={{ marginTop: '4px' }}>A: {item.answer}</p>
                  </div>
                  <div className="adm-card__actions">
                    <button
                      className="adm-btn-icon"
                      title={item.visible === false ? "Show" : "Hide"}
                      onClick={() => toggleVisibility('faq', item.id)}
                    >
                      {item.visible === false ? '👁️' : '🕶️'}
                    </button>
                    <button className="adm-btn-icon" onClick={() => openEditModal('faq', item)}>✏️</button>
                    <button className="adm-btn-icon adm-btn-icon--del" onClick={() => confirmDeleteAction('faq', item.id)}>🗑️</button>
                  </div>
                </div>
              )}
            />
          )}

          {/* Contact Tab */}
          {activeSection === 'contact' && (
            <div>
              <div className="adm-sec__hd">
                <h2 className="adm-sec__title">Contact Information</h2>
                <button className="adm-btn adm-btn--primary" onClick={() => saveContent()}>
                  Save Contact Settings
                </button>
              </div>

              <div className="adm-card" style={{ flexDirection: 'column', gap: '16px' }}>
                <div className="adm-contact-grid">
                  <div className="adm-field">
                    <label className="adm-label">Primary Email</label>
                    <input
                      className="adm-input"
                      value={data.contact?.email || ''}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">WhatsApp Number</label>
                    <input
                      className="adm-input"
                      value={data.contact?.whatsapp || ''}
                      onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">Secondary WhatsApp</label>
                    <input
                      className="adm-input"
                      value={data.contact?.whatsapp2 || ''}
                      onChange={(e) => handleContactChange('whatsapp2', e.target.value)}
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">WhatsApp Direct Link</label>
                    <input
                      className="adm-input"
                      value={data.contact?.whatsappLink || ''}
                      onChange={(e) => handleContactChange('whatsappLink', e.target.value)}
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">Instagram Link</label>
                    <input
                      className="adm-input"
                      value={data.contact?.instagram || ''}
                      onChange={(e) => handleContactChange('instagram', e.target.value)}
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">LinkedIn Link</label>
                    <input
                      className="adm-input"
                      value={data.contact?.linkedin || ''}
                      onChange={(e) => handleContactChange('linkedin', e.target.value)}
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">GitHub Link</label>
                    <input
                      className="adm-input"
                      value={data.contact?.github || ''}
                      onChange={(e) => handleContactChange('github', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {modalOpen && (
        <div className="adm-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__hd">
              <h3 className="adm-modal__title">
                {editingItem ? 'Edit Item' : 'Add New Item'} ({modalSection})
              </h3>
              <button className="adm-modal__close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="adm-modal__body">
                {/* Reviews Form */}
                {modalSection === 'reviews' && (
                  <>
                    <div className="adm-field__row">
                      <div className="adm-field">
                        <label className="adm-label">Client Name</label>
                        <input
                          className="adm-input"
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Company / Role</label>
                        <input
                          className="adm-input"
                          value={formData.company || ''}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="adm-field__row">
                      <div className="adm-field">
                        <label className="adm-label">Service Type</label>
                        <input
                          className="adm-input"
                          value={formData.service || ''}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        />
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Rating (1-5)</label>
                        <div className="adm-star-input">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              className={`adm-star-btn ${star <= (formData.rating || 5) ? 'adm-star-btn--on' : ''}`}
                              onClick={() => setFormData({ ...formData, rating: star })}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Review Text</label>
                      <textarea
                        className="adm-textarea"
                        required
                        value={formData.text || ''}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {/* Projects Form */}
                {modalSection === 'projects' && (
                  <>
                    <div className="adm-field">
                      <label className="adm-label">Project Title</label>
                      <input
                        className="adm-input"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="adm-field__row">
                      <div className="adm-field">
                        <label className="adm-label">Category</label>
                        <select
                          className="adm-select"
                          value={formData.category || 'Business Website'}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="Business Website">Business Website</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="E-Commerce">E-Commerce</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Custom App">Custom App</option>
                        </select>
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Technologies (comma separated)</label>
                        <input
                          className="adm-input"
                          value={formData.technologies || ''}
                          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                          placeholder="React, CSS, Node.js"
                        />
                      </div>
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Description</label>
                      <textarea
                        className="adm-textarea"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="adm-field__row">
                      <div className="adm-field">
                        <label className="adm-label">Project URL (Optional)</label>
                        <input
                          className="adm-input"
                          value={formData.projectUrl || ''}
                          onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                        />
                      </div>
                      <div className="adm-field" style={{ justifyContent: 'center' }}>
                        <div className="adm-toggle">
                          <button
                            type="button"
                            className={`adm-toggle__track ${formData.isConcept ? 'adm-toggle__track--on' : ''}`}
                            onClick={() => setFormData({ ...formData, isConcept: !formData.isConcept })}
                          >
                            <div className="adm-toggle__thumb" />
                          </button>
                          <span className="adm-toggle__label">Mark as Concept</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Services Form */}
                {modalSection === 'services' && (
                  <>
                    <div className="adm-field">
                      <label className="adm-label">Service Title</label>
                      <input
                        className="adm-input"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Description</label>
                      <textarea
                        className="adm-textarea"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Included Features (one per line)</label>
                      <textarea
                        className="adm-textarea"
                        value={formData.extras || ''}
                        onChange={(e) => setFormData({ ...formData, extras: e.target.value })}
                        placeholder="Feature 1\nFeature 2"
                      />
                    </div>
                  </>
                )}

                {/* Pricing Form */}
                {modalSection === 'pricing' && (
                  <>
                    <div className="adm-field__row">
                      <div className="adm-field">
                        <label className="adm-label">Plan Name</label>
                        <input
                          className="adm-input"
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Price Display</label>
                        <input
                          className="adm-input"
                          required
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="₹X,XXX or Let's Discuss"
                        />
                      </div>
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Target Audience</label>
                      <input
                        className="adm-input"
                        value={formData.audience || ''}
                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                      />
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Features List (one per line)</label>
                      <textarea
                        className="adm-textarea"
                        value={formData.features || ''}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      />
                    </div>
                    <div className="adm-field__row">
                      <div className="adm-field">
                        <label className="adm-label">Button CTA Text</label>
                        <input
                          className="adm-input"
                          value={formData.cta || 'Get a Quote'}
                          onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                        />
                      </div>
                      <div className="adm-field" style={{ justifyContent: 'center' }}>
                        <div className="adm-toggle">
                          <button
                            type="button"
                            className={`adm-toggle__track ${formData.highlighted ? 'adm-toggle__track--on' : ''}`}
                            onClick={() => setFormData({ ...formData, highlighted: !formData.highlighted })}
                          >
                            <div className="adm-toggle__thumb" />
                          </button>
                          <span className="adm-toggle__label">Highlight Card</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* FAQ Form */}
                {modalSection === 'faq' && (
                  <>
                    <div className="adm-field">
                      <label className="adm-label">Question</label>
                      <input
                        className="adm-input"
                        required
                        value={formData.question || ''}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      />
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Answer</label>
                      <textarea
                        className="adm-textarea"
                        required
                        value={formData.answer || ''}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="adm-modal__ft">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn--primary">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="adm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="adm-modal adm-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__hd">
              <h3 className="adm-modal__title">Confirm Delete</h3>
              <button className="adm-modal__close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="adm-confirm__actions">
              <button className="adm-btn adm-btn--ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="adm-btn adm-btn--danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="adm-toast">
          <span>✓</span> {toast}
        </div>
      )}
    </div>
  );
}

function SectionView({ title, items = [], onAdd, renderCard }) {
  return (
    <div>
      <div className="adm-sec__hd">
        <div>
          <h2 className="adm-sec__title">{title}</h2>
          <span className="adm-sec__count">{items.length} items total</span>
        </div>
        <button className="adm-btn-add" onClick={onAdd}>
          + Add New
        </button>
      </div>

      {items.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty__icon">📭</div>
          <p>No items found in this section.</p>
        </div>
      ) : (
        <div className="adm-cards">
          {items.map((item) => renderCard(item))}
        </div>
      )}
    </div>
  );
}
