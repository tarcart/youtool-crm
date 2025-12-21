import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityTimeline from './components/ActivityTimeline';
import LogActivityForm from './components/LogActivityForm';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Controls the "New" popup
    const [newContact, setNewContact] = useState({ firstName: '', lastName: '', email: '', status: 'Lead' });

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/contacts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContacts(res.data);
        } catch (err) { console.error("Fetch error:", err); }
    };

    useEffect(() => { fetchContacts(); }, []);

    // 1. ADDED: Handle saving a new contact
    const handleCreateContact = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/contacts', newContact, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false); // Close modal
            setNewContact({ firstName: '', lastName: '', email: '', status: 'Lead' }); // Reset form
            fetchContacts(); // Refresh list
        } catch (err) { alert("Error creating contact"); }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen relative">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Contacts</h3>
                {/* 2. FIXED: Button now triggers state */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + New Contact
                </button>
            </div>

            {/* Main Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {contacts.map(c => (
                            <tr key={c.id} onClick={() => setSelectedContact(c)} className="hover:bg-blue-50 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap">{c.firstName} {c.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">{c.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 3. NEW CONTACT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
                        <h2 className="text-xl font-bold mb-4">Create New Contact</h2>
                        <form onSubmit={handleCreateContact} className="space-y-4">
                            <input 
                                placeholder="First Name" required
                                className="w-full border p-2 rounded"
                                onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                            />
                            <input 
                                placeholder="Last Name" required
                                className="w-full border p-2 rounded"
                                onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                            />
                            <input 
                                placeholder="Email" type="email" required
                                className="w-full border p-2 rounded"
                                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                            />
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Contact</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Slide-Over Detail Panel (Only shows when a contact is clicked) */}
            {selectedContact && (
                <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl p-6 border-l overflow-y-auto">
                    <button onClick={() => setSelectedContact(null)} className="mb-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                    <h2 className="text-xl font-bold mb-4">{selectedContact.firstName} {selectedContact.lastName}</h2>
                    <LogActivityForm contactId={selectedContact.id} onActivityAdded={() => {}} />
                    <ActivityTimeline contactId={selectedContact.id} />
                </div>
            )}
        </div>
    );
};

export default Contacts;