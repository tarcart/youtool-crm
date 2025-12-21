import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Opportunities = () => {
    const [opps, setOpps] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contacts, setContacts] = useState([]); // Needed to link deal to a person
    const [newOpp, setNewOpp] = useState({ title: '', value: '', stage: 'Discovery', contactId: '' });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [oppRes, contactRes] = await Promise.all([
                axios.get('http://localhost:5001/api/opportunities', { headers }),
                axios.get('http://localhost:5001/api/contacts', { headers })
            ]);
            setOpps(oppRes.data);
            setContacts(contactRes.data);
        } catch (err) { console.error("Error loading opportunities", err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const payload = { 
            ...newOpp, 
            value: newOpp.value.replace(/[^0-9]/g, ""), // Clean currency input
            contactId: parseInt(newOpp.contactId) 
        };
        try {
            await axios.post('http://localhost:5001/api/opportunities', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            setNewOpp({ title: '', value: '', stage: 'Discovery', contactId: '' });
            fetchData();
        } catch (err) { alert("Failed to create opportunity"); }
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Sales Opportunities</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-500">+ New Opportunity</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opps.map(opp => (
                    <div key={opp.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-blue-400">{opp.title}</h3>
                            <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">{opp.stage}</span>
                        </div>
                        <p className="text-2xl font-extrabold mb-2">${parseInt(opp.value).toLocaleString()}</p>
                        <p className="text-gray-400 text-sm italic">Contact: {opp.contact?.firstName} {opp.contact?.lastName}</p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <form onSubmit={handleCreate} className="bg-gray-800 p-8 rounded-xl w-96 border border-gray-600 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Create New Deal</h2>
                        <input placeholder="Deal Title (e.g. 500 Unit Order)" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded mb-4" onChange={e => setNewOpp({...newOpp, title: e.target.value})} />
                        <input placeholder="Value ($)" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded mb-4" onChange={e => setNewOpp({...newOpp, value: e.target.value})} />
                        <select required className="w-full bg-gray-900 border border-gray-700 p-3 rounded mb-4" onChange={e => setNewOpp({...newOpp, contactId: e.target.value})}>
                            <option value="">Link to Contact...</option>
                            {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                        </select>
                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400">Cancel</button>
                            <button className="bg-blue-600 px-6 py-2 rounded font-bold">Save Deal</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Opportunities;