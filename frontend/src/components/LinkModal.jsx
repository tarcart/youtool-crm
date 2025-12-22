import React, { useState } from 'react';
import axios from 'axios';

const LinkModal = ({ isOpen, onClose, targetType, sourceItem, options, refresh }) => {
    const [selectedId, setSelectedId] = useState("");

    if (!isOpen) return null;

    const handleLink = async () => {
        if (!selectedId) return alert("Please select an item to link.");
        try {
            const token = localStorage.getItem('token');
            const fieldMap = {
                'Organizations': 'organizationId',
                'Opportunities': 'opportunityId',
                'Projects': 'projectId'
            };

            const fieldName = fieldMap[targetType];
            
            // Send update to the current record to link the selected item
            await axios.put(`/api/${sourceItem.type}/${sourceItem.data.id}`, 
                { [fieldName]: parseInt(selectedId) }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            refresh();
            onClose();
            setSelectedId("");
        } catch (err) {
            alert("Linking failed. Ensure the backend route supports this relationship.");
        }
    };

    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <div style={modalHeader}>
                    <h2 style={{color:'#333', fontSize: '18px'}}>Link {targetType}</h2>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>
                <div style={{ padding: '30px 50px' }}>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                        Select an existing {targetType.slice(0,-1)} to associate with this record.
                    </p>
                    <select 
                        style={whiteSelect} 
                        value={selectedId} 
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        <option value="">-- Choose {targetType.slice(0,-1)} --</option>
                        {options.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name || `${opt.firstName} ${opt.lastName}`}</option>
                        ))}
                    </select>
                </div>
                <div style={modalFooter}>
                    <button onClick={onClose} style={cancelBtn}>Cancel</button>
                    <button onClick={handleLink} style={saveBtn}>Link Record</button>
                </div>
            </div>
        </div>
    );
};

const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 };
const modalBox = { backgroundColor: '#fff', width: '500px', borderRadius: '8px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 50px rgba(0,0,0,0.2)' };
const modalHeader = { padding: '20px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const whiteSelect = { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#333', outline: 'none' };
const modalFooter = { padding: '20px 25px', borderTop: '1px solid #eee', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '15px' };
const saveBtn = { backgroundColor: '#d94d11', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', fontWeight: 'bold' };
const cancelBtn = { background: 'none', border: 'none', color: '#666', fontWeight: 'bold' };
const closeBtn = { background: 'none', border: 'none', fontSize: '20px', color: '#bbb' };

export default LinkModal;