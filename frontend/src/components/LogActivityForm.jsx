import React, { useState } from 'react';
import axios from 'axios';

const LogActivityForm = ({ contactId, onActivityAdded }) => {
    const [type, setType] = useState('NOTE');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/activities', 
                { contactId, type, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDescription('');
            onActivityAdded(); // Refresh the timeline
        } catch (err) { alert("Error logging activity"); }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex space-x-2 mb-2">
                <button type="button" onClick={() => setType('CALL')} className={`px-3 py-1 text-xs rounded-full ${type === 'CALL' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Call</button>
                <button type="button" onClick={() => setType('NOTE')} className={`px-3 py-1 text-xs rounded-full ${type === 'NOTE' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Note</button>
            </div>
            <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What happened on the call?"
                className="w-full text-sm p-2 border rounded focus:ring-blue-500"
                rows="2"
                required
            />
            <button type="submit" className="mt-2 w-full bg-slate-800 text-white text-xs py-2 rounded hover:bg-slate-700">Save Activity</button>
        </form>
    );
};

export default LogActivityForm;