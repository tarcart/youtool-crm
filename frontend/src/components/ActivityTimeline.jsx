import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PhoneIcon, ChatBubbleBottomCenterTextIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ActivityTimeline = ({ contactId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/activities/contact/${contactId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load activities", err);
            setLoading(false);
        }
    };

    useEffect(() => { if (contactId) fetchActivities(); }, [contactId]);

    if (loading) return <p className="text-sm text-gray-500 italic">Loading timeline...</p>;

    return (
        <div className="flow-root mt-6">
            <ul className="-mb-8">
                {activities.map((activity, idx) => (
                    <li key={activity.id}>
                        <div className="relative pb-8">
                            {/* Connector Line */}
                            {idx !== activities.length - 1 ? (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                        activity.type === 'CALL' ? 'bg-blue-500' : 'bg-green-500'
                                    }`}>
                                        {activity.type === 'CALL' ? 
                                            <PhoneIcon className="h-5 w-5 text-white" /> : 
                                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-white" />
                                        }
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {activity.description}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-xs text-gray-400">
                                        <time>{new Date(activity.createdAt).toLocaleDateString()}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityTimeline;