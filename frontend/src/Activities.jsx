import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Activities = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchAllActivities = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('/api/activities', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setActivities(res.data);
            } catch (err) { console.error("History fetch error", err); }
        };
        fetchAllActivities();
    }, []);

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-8">Recent Activity Feed</h1>
            <div className="space-y-4">
                {activities.map(act => (
                    <div key={act.id} className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 shadow flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{act.type}</span>
                            <p className="mt-1 text-gray-200">{act.description}</p>
                            <p className="text-xs text-gray-500 mt-2">Logged for: {act.contact?.firstName} {act.contact?.lastName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">{new Date(act.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400">{new Date(act.createdAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Activities;