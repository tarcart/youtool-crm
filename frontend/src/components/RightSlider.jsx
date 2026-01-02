import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- HELPERS ---
const safeFormatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) { return ''; }
    return '';
};

const formatCurrency = (val) => {
    if (!val && val !== 0) return "";
    const cleanValue = val.toString().replace(/[^\d.]/g, "");
    const parts = cleanValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? parts[0] + "." + parts[1].slice(0, 2) : parts[0];
};

const getProbColor = (val) => {
    const p = parseInt(val);
    if (isNaN(p) || p <= 25) return '#9ca3af'; 
    if (p <= 50) return '#ec4899'; 
    if (p <= 85) return '#dc2626'; 
    return '#16a34a'; 
};

const RightSlider = ({ selectedItem, onClose, refresh, allContacts = [], allOrgs = [], allOpps = [] }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [formData, setFormData] = useState({});
    const [sections, setSections] = useState([]);
    const [expandedSections, setExpandedSections] = useState(['Details', 'Description Information', 'Additional Information', 'System Information']);
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [canDrag, setCanDrag] = useState(false);
    const [expandedRelated, setExpandedRelated] = useState(['Contacts', 'Opportunities']);

    const { type, data } = selectedItem || {};

    const getFieldConfig = () => {
        const commonSystem = [
            { label: 'Created At', key: 'createdAt', readOnly: true },
            { label: 'Updated At', key: 'updatedAt', readOnly: true },
            { label: 'Record ID', key: 'id', readOnly: true }
        ];

        const configs = {
            opportunities: [
                { title: 'Details', fields: [
                    { label: 'Opportunity Name', key: 'name', type: 'text' },
                    { label: 'Stage', key: 'stage', type: 'select', options: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] }
                ]},
                { title: 'Description Information', fields: [
                    { label: 'Description', key: 'description', type: 'textarea' }
                ]},
                { title: 'Additional Information', fields: [
                    { label: 'Category', key: 'category', type: 'text' },
                    { label: 'Winning (%)', key: 'probability', type: 'probability' },
                    { label: 'Forecast Close Date', key: 'expectedClose', type: 'date' },
                    { label: 'Actual Close Date', key: 'actualClose', type: 'date' },
                    { label: 'Value', key: 'value', type: 'currency' },
                    { label: 'Income', key: 'incomeValue', type: 'text' }
                ]},
                { title: 'System Information', fields: commonSystem }
            ],
            contacts: [
                { title: 'Details', fields: [
                    { label: 'First Name', key: 'firstName', type: 'text' },
                    { label: 'Last Name', key: 'lastName', type: 'text' },
                    { label: 'Email', key: 'email', type: 'text' },
                    { label: 'Phone', key: 'phone', type: 'text' },
                    { label: 'Job Title', key: 'jobTitle', type: 'text' }
                ]},
                { title: 'System Information', fields: commonSystem }
            ],
            organizations: [
                { title: 'Details', fields: [
                    { label: 'Organization Name', key: 'name', type: 'text' },
                    { label: 'Industry', key: 'industry', type: 'text' },
                    { label: 'Website', key: 'website', type: 'text' }
                ]},
                { title: 'System Information', fields: commonSystem }
            ],
            tasks: [
                { title: 'Details', fields: [
                    { label: 'Subject', key: 'subject', type: 'text' },
                    { label: 'Status', key: 'status', type: 'select', options: ['Not Started', 'In Progress', 'Completed', 'Deferred'] },
                    { label: 'Priority', key: 'priority', type: 'select', options: ['High', 'Normal', 'Low'] }
                ]},
                { title: 'Additional Information', fields: [
                    { label: 'Due Date', key: 'dueDate', type: 'date' }
                ]},
                { title: 'Description Information', fields: [
                    { label: 'Description', key: 'description', type: 'textarea' }
                ]},
                { title: 'System Information', fields: commonSystem }
            ]
        };
        return configs[type] || configs.opportunities;
    };

    useEffect(() => {
        if (data) {
            let initial = { ...data };
            if (initial.value) initial.value = formatCurrency(initial.value);
            setFormData(initial);
            setSections(getFieldConfig());
            setHasChanges(false);
        }
    }, [selectedItem, data]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData };
            if (payload.value) payload.value = parseFloat(payload.value.toString().replace(/[^0-9.]/g, ""));
            await axios.put(`/api/${type}/${data.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            refresh(); setHasChanges(false);
        } catch (e) { alert("Save failed"); } finally { setSaving(false); }
    };

    const renderInput = (field) => {
        if (field.readOnly) return <div style={readOnlyValue}>{formData[field.key] || ''}</div>;
        const common = { 
            value: formData[field.key] || '', 
            onChange: (e) => { setFormData({ ...formData, [field.key]: e.target.value }); setHasChanges(true); }, 
            style: inputStyle 
        };
        
        if (field.type === 'currency') return <div style={inputWrapper}><span style={prefix}>$</span><input {...common} onChange={(e) => { setFormData({ ...formData, [field.key]: formatCurrency(e.target.value) }); setHasChanges(true); }} style={{ ...inputStyle, paddingLeft: '25px' }} /></div>;
        if (field.type === 'probability') return <div style={inputWrapper}><input {...common} onChange={(e) => { const val = e.target.value.replace(/\D/g, ""); if (val <= 100) { setFormData({...formData, [field.key]: val}); setHasChanges(true); } }} /><span style={{ ...suffix, color: getProbColor(formData[field.key]) }}>%</span></div>;
        if (field.type === 'date') return <div style={inputWrapper}><input type="text" value={safeFormatDate(formData[field.key])} readOnly style={inputStyle} /><span style={suffix}>📅</span><input type="date" style={hiddenDateInput} onChange={(e) => { setFormData({...formData, [field.key]: e.target.value}); setHasChanges(true); }} /></div>;
        if (field.type === 'textarea') return <textarea {...common} style={{ ...inputStyle, height: '100px', padding: '10px' }} />;
        if (field.type === 'select') return <select {...common}>{field.options.map(o => <option key={o} value={o}>{o}</option>)}</select>;
        return <input {...common} />;
    };

    const relatedGroups = useMemo(() => {
        if (type !== 'organizations') return [];
        return [
            { title: 'Contacts', items: allContacts.filter(c => c.organizationId === data.id), type: 'contacts' },
            { title: 'Opportunities', items: allOpps.filter(o => o.organizationId === data.id), type: 'opportunities' }
        ].filter(g => g.items.length > 0);
    }, [type, data.id, allContacts, allOpps]);

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={sliderStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div>
                        <span style={typeBadge}>{type === 'opportunities' ? 'OPPORTUNITY' : type.toUpperCase().slice(0, -1)}</span>
                        <h2 style={{ margin: '5px 0', color: '#333', fontSize: '22px', fontWeight: 'bold' }}>{formData.name || `${formData.firstName || ''} ${formData.lastName || ''}` || formData.subject}</h2>
                    </div>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>
                
                <div style={tabContainer}>
                    {['Details', 'Related', 'Activity'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t.toLowerCase())} 
                            style={{ ...tabStyle, borderBottom: activeTab === t.toLowerCase() ? '3px solid #d94d11' : 'none', color: activeTab === t.toLowerCase() ? '#d94d11' : '#666' }}>
                            {t}
                        </button>
                    ))}
                </div>
                
                <div style={contentArea}>
                    {activeTab === 'details' && sections.map((s, i) => (
                        <div key={s.title} style={sectionBox} draggable={canDrag} onDragStart={() => setDraggedIndex(i)} onDragOver={e => e.preventDefault()} onDrop={() => { const re = [...sections]; const m = re.splice(draggedIndex, 1)[0]; re.splice(i, 0, m); setSections(re); }}>
                            <div style={sectionHeader} className="section-header">
                                <div onClick={() => setExpandedSections(expandedSections.includes(s.title) ? expandedSections.filter(x => x !== s.title) : [...expandedSections, s.title])} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '10px', fontSize: '10px' }}>{expandedSections.includes(s.title) ? '▼' : '▶'}</span> {s.title}
                                </div>
                                <div onMouseEnter={() => setCanDrag(true)} onMouseLeave={() => setCanDrag(false)} style={{ cursor: 'grab', color: '#ccc', paddingLeft: '15px', fontSize: '18px' }}>⋮⋮</div>
                            </div>
                            {expandedSections.includes(s.title) && (
                                <div style={{ padding: '15px 0' }}>
                                    {s.fields.map(f => (
                                        <div key={f.label} style={rowStyle}>
                                            <label style={labelStyle}>{f.label}</label>
                                            <div style={{ flex: 1 }}>{renderInput(f)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {activeTab === 'related' && (
                        <div style={{ backgroundColor: '#fff' }}>
                            {relatedGroups.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No related records found.</div>
                            ) : (
                                relatedGroups.map(group => (
                                    <div key={group.title} style={{ borderBottom: '1px solid #eee' }}>
                                        <div style={sectionHeader} onClick={() => setExpandedRelated(expandedRelated.includes(group.title) ? expandedRelated.filter(x => x !== group.title) : [...expandedRelated, group.title])}>
                                            <span>{expandedRelated.includes(group.title) ? '▼' : '▶'} {group.title}</span>
                                            <span style={countBadge}>{group.items.length}</span>
                                        </div>
                                        {expandedRelated.includes(group.title) && (
                                            <div style={{ padding: '15px 20px' }}>
                                                {group.items.map(item => (
                                                    <div key={item.id} style={relatedItemCard}>
                                                        <div style={{ fontWeight: 'bold', color: '#d94d11', marginBottom: '5px' }}>{item.name || `${item.firstName} ${item.lastName}`}</div>
                                                        <div style={relatedGrid}>
                                                            {group.type === 'opportunities' ? (
                                                                <><div><label style={miniLabel}>Stage:</label> {item.stage}</div><div><label style={miniLabel}>Value:</label> ${formatCurrency(item.value)}</div></>
                                                            ) : (
                                                                <><div><label style={miniLabel}>Email:</label> {item.email}</div><div><label style={miniLabel}>Phone:</label> {item.phone || 'N/A'}</div></>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {hasChanges && (
                    <div style={footerStyle}>
                        <button onClick={() => { setFormData(data); setHasChanges(false); }} style={cancelBtn}>Cancel</button>
                        <button onClick={handleSave} style={saveBtn}>{saving ? '...' : 'Save Changes'}</button>
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{ __html: `.section-header:hover { background: #f3f6f8; }` }} />
        </div>
    );
};

const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' };
const sliderStyle = { width: '900px', backgroundColor: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 30px rgba(0,0,0,0.15)' };
const headerStyle = { padding: '25px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const typeBadge = { fontSize: '11px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' };
const closeBtn = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' };
const tabContainer = { display: 'flex', borderBottom: '1px solid #eee', padding: '0 30px' };
const tabStyle = { padding: '15px 0', marginRight: '30px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const contentArea = { flex: 1, overflowY: 'auto', backgroundColor: '#fff' };
const sectionBox = { borderBottom: '1px solid #e1e6eb' };
const sectionHeader = { padding: '12px 25px', backgroundColor: '#f9fafb', fontWeight: 'bold', fontSize: '13px', display: 'flex', cursor: 'pointer', justifyContent: 'space-between', alignItems: 'center', color: '#333' };
const rowStyle = { display: 'flex', padding: '8px 30px', alignItems: 'center' };
const labelStyle = { width: '200px', fontSize: '13px', color: '#6b7280', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '13px', backgroundColor: '#fff', color: '#333' };
const inputWrapper = { position: 'relative', width: '100%', display: 'flex', alignItems: 'center' };
const prefix = { position: 'absolute', left: '10px', color: '#888', fontSize: '13px' };
const suffix = { position: 'absolute', right: '10px', fontWeight: 'bold', fontSize: '13px' };
const hiddenDateInput = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' };
const relatedItemCard = { padding: '15px', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '10px', backgroundColor: '#fdfdfd' };
const relatedGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '12px', color: '#444', gap: '10px' };
const miniLabel = { fontWeight: '600', color: '#888', marginRight: '5px' };
const countBadge = { background: '#d1d5db', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', color: '#444' };
const footerStyle = { padding: '15px 30px', borderTop: '1px solid #eee', textAlign: 'right', backgroundColor: '#fdfdfd', display: 'flex', justifyContent: 'flex-end', gap: '10px' };
const saveBtn = { background: '#d94d11', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtn = { background: '#fff', color: '#666', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const readOnlyValue = { padding: '10px', color: '#333', fontSize: '13px' };

export default RightSlider;