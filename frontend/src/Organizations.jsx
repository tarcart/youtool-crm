import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Organizations = () => {
    const [orgs, setOrgs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOrg, setNewOrg] = useState({ name: '', industry: '' });

    // 1. Fetch organizations from the backend
    const fetchOrgs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/organizations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrgs(res.data);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        }
    };

    useEffect(() => {
        fetchOrgs();
    }, []);

    // 2. Handle creating a new organization
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/organizations', newOrg, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false); // Close the modal
            setNewOrg({ name: '', industry: '' }); // Clear form
            fetchOrgs(); // Refresh the list
        } catch (err) {
            alert("Error creating organization. Check if the backend is running.");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
                >
                    + New Organization
                </button>
            </div>

            {/* Organizations Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Company Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Industry</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orgs.length > 0 ? orgs.map(org => (
                            <tr key={org.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{org.name}</td>
                                <td className="px-6 py-4 text-gray-600">{org.industry || 'Not set'}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="2" className="px-6 py-4 text-center text-gray-400">No organizations found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* NEW ORGANIZATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Organization</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Company Name</label>
                                <input 
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    placeholder="e.g. Acme Corp" 
                                    required
                                    onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-50