import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const CreateModal = ({ 
    isOpen, onClose, activeTab, refresh, user,
    allOrgs = [], allContacts = [], allOpps = [], 
    allProjects = [], allTasks = [], existingTags = [], existingCategories = [] 
}) => {
    const [newData, setNewData] = useState({ 
        opp_name: "", opp_probability: "0", opp_value: "", opp_bidType: "Estimated", opp_description: "",
        con_firstName: "", con_lastName: "", con_email: "", con_phone: "", con_jobTitle: "",
        org_name: "", org_industry: "", org_website: "",
        task_subject: "", task_dueDate: "",
        proj_name: "", proj_startDate: "", proj_endDate: "",
        tags: [], categories: [], incomeType: "Percentage (%)", incomeValue: "",
        rel2_box1: "Organizations", rel2_box2: "", rel2_box3: "",
        links: [] 
    });

    const [tagInput, setTagInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [expanded, setExpanded] = useState(['Details', 'Description Information', 'Additional Information', 'Related', 'Tag Information']);
    const [sections, setSections] = useState([]);
    const [activeSubModal, setActiveSubModal] = useState(null);
    const [subModalFields, setSubModalFields] = useState({});

    // UX and Hover state
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [hoveredSection, setHoveredSection] = useState(null);
    const [hoveredField, setHoveredField] = useState(null);

    // --- HELPERS ---
    const toTitleCase = (str) => (str || "").toString().replace(/\b\w/g, (char) => char.toUpperCase());
    
    const getSingularType = (plural) => {
        const mapping = { "Opportunities": "Opportunity", "Tasks": "Task", "Contacts": "Contact", "Organizations": "Organization", "Projects": "Project" };
        return mapping[plural] || (plural && plural.endsWith('s') ? plural.slice(0, -1) : plural);
    };

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDateMask = (val) => {
        const clean = val.replace(/\D/g, "").slice(0, 8); 
        let formatted = clean;
        if (clean.length > 2) formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
        if (clean.length > 4) formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
        return formatted;
    };

    const toIsoDate = (val) => {
        if (!val || !val.includes('/')) return "";
        const [m, d, y] = val.split('/');
        return y && m && d ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : "";
    };

    const formatCurrency = (val) => {
        if (!val) return "";
        const cleanValue = val.toString().replace(/[^\d.]/g, "");
        const parts = cleanValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.length > 1 ? parts[0] + "." + parts[1].slice(0, 2) : parts[0];
    };

    const getCalculatedIncome = () => {
        const bidNum = parseFloat((newData.opp_value || "0").replace(/[^\d.]/g, "")) || 0;
        const incNum = parseFloat((newData.incomeValue || "0").replace(/[^\d.]/g, "")) || 0;
        const result = newData.incomeType.includes("Percentage") ? (bidNum * incNum) / 100 : incNum;
        return formatCurrency(result.toFixed(2));
    };

    const getProbColor = (val) => {
        const p = parseInt(val);
        if (isNaN(p) || p <= 25) return '#9ca3af'; 
        if (p <= 50) return '#ec4899'; 
        if (p <= 85) return '#dc2626'; 
        return '#16a34a'; 
    };

    const getTargetList = (type) => {
        const key = type?.toLowerCase();
        if (key === 'contacts') return allContacts;
        if (key === 'opportunities') return allOpps;
        if (key === 'projects') return allProjects;
        if (key === 'tasks') return allTasks;
        return allOrgs;
    };

    // --- LOGIC ---
    const handleAddCategory = () => {
        const val = toTitleCase(categoryInput.trim());
        if (val && !newData.categories.includes(val)) {
            setNewData(p => ({ ...p, categories: [...p.categories, val] }));
            setCategoryInput("");
        }
    };

    const handleAddTag = () => {
        const val = toTitleCase(tagInput.trim());
        if (val && !newData.tags.includes(val)) {
            setNewData(p => ({ ...p, tags: [...p.tags, val] }));
            setTagInput("");
        }
    };

    const handleAddLink = () => {
        if (!newData.rel2_box2.trim()) return;
        const newLink = { type: newData.rel2_box1, name: newData.rel2_box2, role: newData.rel2_box3 };
        setNewData(p => ({ ...p, links: [...p.links, newLink], rel2_box2: "", rel2_box3: "" }));
    };

    const handleSubModalSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const type = activeSubModal === 'Contact' ? 'contacts' : 'organizations';
            const response = await axios.post(`/api/${type}`, subModalFields, { headers: { Authorization: `Bearer ${token}` } });
            const savedRecord = response.data;
            const nameToRetain = activeSubModal === 'Contact' ? `${savedRecord.firstName} ${savedRecord.lastName}`.trim() : savedRecord.name;
            setNewData(p => ({ ...p, rel2_box2: nameToRetain }));
            setSubModalFields({}); setActiveSubModal(null); refresh(); 
            showToast(`${activeSubModal} created successfully!`);
        } catch (err) { showToast(`Failed to create ${activeSubModal}`, 'error'); }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            let payload = {};
            if (activeTab === 'opportunities') {
                payload = { name: newData.opp_name, value: parseFloat(newData.opp_value.replace(/,/g, "")) || 0, probability: parseInt(newData.opp_probability), description: newData.opp_description, links: newData.links };
            } else if (activeTab === 'contacts') {
                payload = { firstName: newData.con_firstName, lastName: newData.con_lastName, email: newData.con_email, phone: newData.con_phone };
            } else if (activeTab === 'organizations') {
                payload = { name: newData.org_name, industry: newData.org_industry, website: newData.org_website };
            } else if (activeTab === 'tasks') {
                payload = { subject: newData.task_subject, dueDate: newData.task_dueDate };
            } else if (activeTab === 'projects') {
                payload = { name: newData.proj_name, startDate: newData.proj_startDate, endDate: newData.proj_endDate };
            }
            await axios.post(`/api/${activeTab}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            refresh(); showToast("Saved successfully!");
            setTimeout(() => onClose(), 800); 
        } catch (err) { showToast("Save failed: " + err.message, 'error'); 
        } finally { setIsSaving(false); }
    };

    // --- SCHEMA ---
    const allFields = useMemo(() => {
        const modules = {
            opportunities: [
                { title: 'Details', fields: [{ name: 'opp_name', label: 'Opportunity Name', required: true }] },
                { title: 'Description Information', fields: [{ name: 'opp_description', label: 'Description', type: 'textarea' }]},
                { title: 'Additional Information', fields: [
                    { name: 'category', label: 'Category', type: 'dynamic-category' },
                    { name: 'opp_probability', label: 'Winning (%)', type: 'probability-slider' },
                    { name: 'forecastCloseDate', label: 'Forecast Close Date', type: 'date' },
                    { name: 'actualCloseDate', label: 'Actual Close Date', type: 'date' },
                    { name: 'opp_value', label: 'Value', type: 'complex-value' },
                    { name: 'income', label: 'Projected Income', type: 'income-calculator' }
                ]}
            ],
            contacts: [{ title: 'Details', fields: [{ name: 'con_firstName', label: 'First Name', required: true }, { name: 'con_lastName', label: 'Last Name', required: true }, { name: 'con_email', label: 'Email' }, { name: 'con_phone', label: 'Phone' }, { name: 'con_jobTitle', label: 'Job Title' }] }],
            organizations: [{ title: 'Details', fields: [{ name: 'org_name', label: 'Organization Name', required: true }, { name: 'org_industry', label: 'Industry' }, { name: 'org_website', label: 'Website' }] }],
            tasks: [{ title: 'Details', fields: [{ name: 'task_subject', label: 'Subject', required: true }, { name: 'task_dueDate', label: 'Due Date', type: 'date' }] }],
            projects: [{ title: 'Details', fields: [{ name: 'proj_name', label: 'Project Name', required: true }, { name: 'proj_startDate', label: 'Start Date', type: 'date' }, { name: 'proj_endDate', label: 'End Date', type: 'date' }] }]
        };
        const common = [{ id: 'rel2', title: 'Related', fields: [{ name: 'rel2_box', label: 'Links', type: 'triple-box' }] }, { id: 'tags', title: 'Tag Information', fields: [{ name: 'tagList', label: 'Tag List', type: 'dynamic-tags' }] }];
        return [...(modules[activeTab] || modules.opportunities), ...common];
    }, [activeTab]);

    useEffect(() => { if (isOpen) setSections(allFields.filter(s => s?.title !== 'Details')); }, [isOpen, allFields]);

    // --- RENDER ENGINE ---
    const renderFields = (fields) => (
        <div style={fieldGrid}>
            {fields.map(f => (
                <div key={f.name} style={fieldRow}>
                    <div style={fieldLabelContainer}><label style={fieldLabel}>{f.label}</label></div>
                    <div style={{flex: 1, minWidth: 0, position: 'relative'}}>
                        {f.required && (<div style={requiredFlag}><span style={requiredAsterisk}>*</span></div>)}

                        {f.type === 'triple-box' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={linkerStrictRow}>
                                    {/* FIXED: SELECT DROPDOWN WIDTH */}
                                    <select 
                                        style={{...whiteInput, width: '160px', flex: 'none', borderColor: hoveredField === f.name + '_sel' ? '#9ca3af' : '#d1d5db'}} 
                                        value={newData.rel2_box1} onChange={e => setNewData({...newData, rel2_box1: e.target.value, rel2_box2: ''})}
                                        onMouseEnter={() => setHoveredField(f.name + '_sel')} onMouseLeave={() => setHoveredField(null)}
                                    >
                                        <option value="Tasks">Tasks</option><option value="Contacts">Contacts</option><option value="Organizations">Organizations</option><option value="Opportunities">Opportunities</option><option value="Projects">Projects</option>
                                    </select>
                                    <div style={{position: 'relative', flex: 1.5, minWidth: 0}}>
                                        {/* ADDED: MODERN MAGNIFYING GLASS ICON */}
                                        <div style={searchIconModern}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        </div>
                                        <input 
                                            list="rel-list" 
                                            style={{...whiteInput, paddingLeft: '38px', paddingRight: newData.rel2_box2.length > 0 ? '135px' : '10px', borderColor: hoveredField === f.name + '_search' ? '#9ca3af' : '#d1d5db'}} 
                                            placeholder="Search records..." value={newData.rel2_box2} 
                                            onMouseEnter={() => setHoveredField(f.name + '_search')} onMouseLeave={() => setHoveredField(null)}
                                            onChange={e => setNewData({...newData, rel2_box2: e.target.value})} 
                                        />
                                        <datalist id="rel-list">{getTargetList(newData.rel2_box1).filter(o => (o.name || `${o.firstName || ''} ${o.lastName || ''}`).toLowerCase().includes((newData.rel2_box2 || "").toLowerCase())).slice(0, 10).map(o => (<option key={o.id} value={o.name || `${o.firstName || ''} ${o.lastName || ''}`} />))}</datalist>
                                        {newData.rel2_box2.length > 0 && (<button type="button" onClick={() => setActiveSubModal(getSingularType(newData.rel2_box1))} style={quickAddSearchBtn}>+ Add New {getSingularType(newData.rel2_box1)}</button>)}
                                    </div>
                                    <input style={{...whiteInput, flex: 1, minWidth: 0, borderColor: hoveredField === f.name + '_role' ? '#9ca3af' : '#d1d5db'}} placeholder="Relationship / Role" value={newData.rel2_box3} onMouseEnter={() => setHoveredField(f.name + '_role')} onMouseLeave={() => setHoveredField(null)} onChange={e => setNewData({...newData, rel2_box3: e.target.value})} />
                                    <button type="button" onClick={handleAddLink} style={plusBtn}>+</button>
                                </div>
                                {newData.links.length > 0 && <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>{newData.links.map((l, i) => <div key={i} style={catBadge}><b>{getSingularType(l.type)}:</b> {l.name} {l.role && `(${l.role})`} <span onClick={() => setNewData(p=>({...p, links:p.links.filter((_,idx)=>idx!==i)}))} style={{cursor:'pointer'}}>✕</span></div>)}</div>}
                            </div>
                        ) : f.type === 'probability-slider' ? (
                            <div style={{display:'flex', alignItems:'center', gap:'20px'}}><input type="range" min="0" max="100" value={newData.opp_probability} style={{flex:1, accentColor:getProbColor(newData.opp_probability)}} onChange={e => setNewData(p=>({...p, opp_probability: e.target.value}))} /><span style={{fontWeight:'bold', color:getProbColor(newData.opp_probability)}}>{newData.opp_probability}%</span></div>
                        ) : f.type === 'dynamic-category' || f.type === 'dynamic-tags' ? (
                            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                                <div style={{display:'flex', gap:'8px'}}>
                                    <input style={{...whiteInput, borderColor: hoveredField === f.name ? '#9ca3af' : '#d1d5db'}} placeholder={f.type === 'dynamic-tags' ? "Add tags..." : "Add category..."} value={f.type === 'dynamic-tags' ? tagInput : categoryInput} onMouseEnter={() => setHoveredField(f.name)} onMouseLeave={() => setHoveredField(null)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), f.type === 'dynamic-tags' ? handleAddTag() : handleAddCategory())} onChange={e => f.type === 'dynamic-tags' ? setTagInput(toTitleCase(e.target.value)) : setCategoryInput(toTitleCase(e.target.value))} />
                                    <button type="button" style={plusBtn} onClick={f.type === 'dynamic-tags' ? handleAddTag : handleAddCategory}>+</button>
                                </div>
                                <div style={{display:'flex', flexWrap: 'wrap', gap: '10px'}}>{(f.type === 'dynamic-tags' ? newData.tags : newData.categories).map(t => <span key={t} style={f.type === 'dynamic-tags' ? tagBadge : catBadge}>{t} <span style={{cursor:'pointer'}} onClick={() => setNewData(p=>({...p, [f.type==='dynamic-tags'?'tags':'categories']: p[f.type==='dynamic-tags'?'tags':'categories'].filter(x=>x!==t)}))}>✕</span></span>)}</div>
                            </div>
                        ) : f.type === 'date' ? (
                            <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                                <input type="text" style={{...whiteInput, paddingRight:'45px', borderColor: hoveredField === f.name ? '#9ca3af' : '#d1d5db'}} placeholder="MM/DD/YYYY" maxLength={10} value={newData[f.name]} onMouseEnter={() => setHoveredField(f.name)} onMouseLeave={() => setHoveredField(null)} onChange={e => setNewData(p=>({...p, [f.name]: handleDateMask(e.target.value)}))} />
                                <div style={modernCalendarOverlay}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><input type="date" style={hiddenModernDateInput} value={toIsoDate(newData[f.name])} onChange={e => { if(!e.target.value) return; const [y,m,d] = e.target.value.split('-'); setNewData(p=>({...p, [f.name]: `${m}/${d}/${y}`})); }} /></div>
                            </div>
                        ) : f.type === 'complex-value' ? (
                            <div style={{display:'flex', gap:'8px'}}>
                                <select style={{...whiteInput, width: '100px'}}><option>USD $</option></select>
                                <input style={{...whiteInput, borderColor: hoveredField === 'opp_val' ? '#9ca3af' : '#d1d5db'}} placeholder="Bid Amount" value={newData.opp_value} onMouseEnter={() => setHoveredField('opp_val')} onMouseLeave={() => setHoveredField(null)} onChange={e => setNewData(p=>({...p, opp_value: formatCurrency(e.target.value)}))} />
                                <select style={{...whiteInput, width: '180px'}} value={newData.opp_bidType} onChange={e => setNewData(p=>({...p, opp_bidType: e.target.value}))}><option value="Estimated">Estimated</option><option value="Fixed">Fixed</option><option value="Flexible">Flexible</option><option value="Probable">Probable</option><option value="Highly Probable">Highly Probable</option></select>
                            </div>
                        ) : f.type === 'income-calculator' ? (
                            <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                                <select style={{...whiteInput, width: '150px'}} value={newData.incomeType} onChange={e => setNewData(p=>({...p, incomeType: e.target.value}))}><option value="Percentage (%)">Percentage (%)</option><option value="Fixed ($)">Fixed ($)</option></select>
                                <input style={{...whiteInput, flex:1, borderColor: hoveredField === 'inc_val' ? '#9ca3af' : '#d1d5db'}} placeholder="e.g. 10" value={newData.incomeValue} onMouseEnter={() => setHoveredField('inc_val')} onMouseLeave={() => setHoveredField(null)} onChange={e => setNewData(p=>({...p, incomeValue: e.target.value}))} />
                                <div style={incomeDisplay}>Total: USD $ {getCalculatedIncome()}</div>
                            </div>
                        ) : (
                            <input style={{...whiteInput, borderColor: hoveredField === f.name ? '#9ca3af' : '#d1d5db'}} value={newData[f.name]} onMouseEnter={() => setHoveredField(f.name)} onMouseLeave={() => setHoveredField(null)} onChange={e => setNewData(p=>({...p, [f.name]: f.name.includes('name') ? toTitleCase(e.target.value) : e.target.value}))} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    if (!isOpen) return null;

    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <div style={modalHeader}><h2 style={{color:'#333'}}>Add New {getSingularType(toTitleCase(activeTab))}</h2><button onClick={onClose} style={closeIconHeader}>✕</button></div>
                <form style={{flex: 1, overflowY: 'auto'}} onSubmit={e => e.preventDefault()}>
                    <div style={{borderBottom:'1px solid #eee'}}><div style={{...sectionToggle, backgroundColor: hoveredSection === 'Details' ? '#ebf1f5' : '#f3f6f8'}} onMouseEnter={() => setHoveredSection('Details')} onMouseLeave={() => setHoveredSection(null)} onClick={() => setExpanded(p => p.includes('Details') ? p.filter(t => t !== 'Details') : [...p, 'Details'])}>{expanded.includes('Details') ? '▼' : '▶'} Details</div>{expanded.includes('Details') && renderFields(allFields.find(s => s?.title === 'Details')?.fields)}</div>
                    {sections.map((s) => (<div key={s.title} style={{borderBottom: '1px solid #eee'}}><div style={{...sectionToggle, backgroundColor: hoveredSection === s.title ? '#ebf1f5' : '#f3f6f8'}} onMouseEnter={() => setHoveredSection(s.title)} onMouseLeave={() => setHoveredSection(null)} onClick={() => setExpanded(p => p.includes(s.title) ? p.filter(t => t !== s.title) : [...p, s.title])}><div style={{flex: 1}}>{expanded.includes(s.title) ? '▼' : '▶'} {s.title}</div><div style={grabHandle}>⋮⋮</div></div>{expanded.includes(s.title) && renderFields(s.fields)}</div>))}
                </form>
                <div style={modalFooter}>
                    <button onClick={handleSave} disabled={isSaving} style={{...saveBtn, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer'}}>{isSaving ? 'Saving...' : 'Save'}</button>
                    <button onClick={onClose} style={closeBtnAlt}>Close</button>
                </div>
            </div>
            {activeSubModal && (<div style={secondaryModalOverlay}><div style={secondaryModalBox}><div style={modalHeader}><h2>Add New {activeSubModal}</h2><button onClick={() => setActiveSubModal(null)} style={closeIconHeader}>✕</button></div><div style={{padding: '30px', flex: 1, overflowY: 'auto'}}>{activeSubModal === 'Contact' ? (<div style={{display:'flex', flexDirection:'column', gap:'15px'}}><div style={subSectionHeader}>Name and Occupation</div><div style={{display:'flex', gap:'10px'}}><input style={whiteInput} placeholder="Prefix" /><input style={whiteInput} placeholder="First Name *" onChange={e => setSubModalFields({...subModalFields, firstName: toTitleCase(e.target.value)})} /><input style={whiteInput} placeholder="Last Name *" onChange={e => setSubModalFields({...subModalFields, lastName: toTitleCase(e.target.value)})} /></div><input style={whiteInput} placeholder="Title" /><div style={subSectionHeader}>Contact Details</div><input style={whiteInput} placeholder="Email" /><input style={whiteInput} placeholder="Phone" /><div style={subSectionHeader}>Address Information</div><textarea style={{...whiteInput, height:'60px', fontFamily: "'Inter', sans-serif"}} placeholder="Mailing Street" /></div>) : (<div style={{display:'flex', flexDirection:'column', gap:'15px'}}><div style={subSectionHeader}>Details</div><input style={whiteInput} placeholder="Organization Name *" onChange={e => setSubModalFields({...subModalFields, name: toTitleCase(e.target.value)})} /><input style={whiteInput} placeholder="Industry" /><input style={whiteInput} placeholder="Website" /></div>)}</div><div style={modalFooter}><button onClick={handleSubModalSave} style={saveBtn}>Save {activeSubModal}</button><button onClick={() => setActiveSubModal(null)} style={closeBtnAlt}>Cancel</button></div></div></div>)}
            {toast && (<div style={{position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981', color: '#fff', padding: '10px 20px', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 5000, fontWeight: 'bold', fontSize: '14px'}}>{toast.message}</div>)}
        </div>
    );
};

// --- STYLES ---
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 };
const secondaryModalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000 };
const secondaryModalBox = { backgroundColor: '#fff', width: '900px', height: '85vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' };
const modalBox = { backgroundColor: '#fff', width: '1050px', height: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 50px rgba(0,0,0,0.2)' };
const modalHeader = { padding: '20px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const sectionToggle = { padding: '12px 25px', fontWeight: 'bold', fontSize: '12px', display: 'flex', cursor: 'pointer', alignItems: 'center', color: '#333', transition: 'background-color 0.2s ease' };
const fieldGrid = { padding: '20px 60px', display: 'flex', flexDirection: 'column', gap: '10px' };
const fieldRow = { display: 'flex', alignItems: 'flex-start' };
const fieldLabelContainer = { width: '200px', textAlign: 'right', marginRight: '25px', marginTop: '10px' };
const fieldLabel = { fontSize: '12px', color: '#666', fontWeight: '600', display: 'block' };
const whiteInput = { boxSizing: 'border-box', width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', color: '#333', backgroundColor: '#fff', outline: 'none', transition: 'all 0.2s ease-in-out', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica', sans-serif" };
const requiredFlag = { position: 'absolute', top: '1px', right: '1px', width: '0', height: '0', borderStyle: 'solid', borderWidth: '0 16px 16px 0', borderColor: 'transparent #f87171 transparent transparent', pointerEvents: 'none', zIndex: 5, borderRadius: '0 3px 0 0' };
const requiredAsterisk = { position: 'absolute', top: '0', right: '-15px', color: '#fff', fontSize: '10px', fontWeight: 'bold' };
const linkerStrictRow = { display: 'flex', gap: '8px', width: '100%', alignItems: 'center' };
const searchIconModern = { position: 'absolute', left: '14px', top: '12px', zIndex: 5, pointerEvents: 'none', display: 'flex', alignItems: 'center' };
const incomeDisplay = { boxSizing: 'border-box', padding: '10px', fontSize: '13px', color: '#333', flex: '1.2 1 200px', backgroundColor: '#f9fafb', fontWeight: 'bold', border: '1px solid #d1d5db', borderRadius: '4px' };
const plusBtn = { boxSizing: 'border-box', width: '40px', height: '38px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff', fontSize: '18px', color: '#666' };
const quickAddSearchBtn = { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#ebf5ff', color: '#007bff', border: '1px solid #cce5ff', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', zIndex: 10 };
const modernCalendarOverlay = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const hiddenModernDateInput = { position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' };
const catBadge = { background: '#ebf5ff', color: '#007bff', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: '1px solid #cce5ff', display: 'flex', alignItems: 'center', gap: '8px' };
const tagBadge = { background: '#fff7ed', color: '#ea580c', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', gap: '8px' };
const grabHandle = { cursor: 'grab', color: '#ccc', fontSize: '18px', paddingLeft: '15px' };
const closeIconHeader = { border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' };
const modalFooter = { padding: '20px 30px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '12px' };
const saveBtn = { backgroundColor: '#d94d11', color: '#fff', border: 'none', padding: '12px 35px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const closeBtnAlt = { backgroundColor: '#fff', color: '#666', border: '1px solid #d1d5db', padding: '12px 25px', borderRadius: '4px', cursor: 'pointer' };
const subSectionHeader = { fontSize: '13px', fontWeight: 'bold', color: '#007bff', borderBottom: '1px solid #ebf5ff', paddingBottom: '5px', marginTop: '10px' };

export default CreateModal;