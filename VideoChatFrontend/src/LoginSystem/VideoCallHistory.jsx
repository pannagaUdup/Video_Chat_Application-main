import React, { useEffect, useState } from 'react';
import './LoginCss/VideoCallHistory.css'
import { link } from '../link';


// const VideoCallHistory = () => {
//     const [videoSessions, setVideoSessions] = useState([]);
//     const [error, setError] = useState('');
//     const [filters, setFilters] = useState({
//         participantName: '',
//         startDate: '',
//         endDate: '',
//         sortBy: 'date',
//         expandedRoom: null,  // Store the currently expanded room ID
//     });

//     useEffect(() => {
//         const fetchVideoSessions = async () => {
//             try {
//                 const queryParams = new URLSearchParams(filters).toString();
//                 const response = await fetch(`http://localhost:8080/user-sessions?${queryParams}`, {
//                     method: 'GET',
//                     credentials: 'include',
//                     headers: { 'Content-Type': 'application/json' },
//                 });

//                 if (response.ok) {
//                     let data = await response.json();
//                     // Sort the data based on the current filter
//                     if (filters.sortBy === 'duration') {
//                         data = data.sort((a, b) => {
//                             const durationA = new Date(a.endTime).getTime() - new Date(a.startTime).getTime();
//                             const durationB = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
//                             return durationA - durationB;
//                         });
//                     } else {
//                         data = data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Default sort by date (startTime)
//                     }
//                     setVideoSessions(data);
//                 } else {
//                     const message = await response.text();
//                     setError(message);
//                 }
//             } catch (error) {
//                 setError('Error fetching video sessions');
//             }
//         };

//         fetchVideoSessions();
//     }, [filters]);

//     // Handle filter changes
//     const handleFilterChange = (e) => {
//         setFilters({ ...filters, [e.target.name]: e.target.value });
//     };

//     // Calculate the duration between startTime and endTime
//     const calculateDuration = (startTime, endTime) => {
//         const start = new Date(startTime);
//         const end = endTime ? new Date(endTime) : new Date();
//         const durationMs = end - start;

//         const hours = Math.floor(durationMs / (1000 * 60 * 60));
//         const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
//         return `${hours}h ${minutes}m`;
//     };

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div style={{ padding: '20px' }}>
//             <h2>Video Call History</h2>

//             {/* Search and Filter Section */}
//             <div style={{ marginBottom: '20px' }}>
//                 <input
//                     type="text"
//                     name="participantName"
//                     placeholder="Search by participant"
//                     value={filters.participantName}
//                     onChange={handleFilterChange}
//                     style={{ marginRight: '10px' }}
//                 />
//                 <input
//                     type="date"
//                     name="startDate"
//                     value={filters.startDate}
//                     onChange={handleFilterChange}
//                     style={{ marginRight: '10px' }}
//                 />
//                 <input
//                     type="date"
//                     name="endDate"
//                     value={filters.endDate}
//                     onChange={handleFilterChange}
//                     style={{ marginRight: '10px' }}
//                 />
//                 <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
//                     <option value="date">Sort by Date</option>
//                     <option value="duration">Sort by Duration</option>
//                 </select>
//             </div>

//             {/* Display Video Call History */}
//             {videoSessions.length === 0 ? (
//                 <p>No video call history available.</p>
//             ) : (
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
//                     {videoSessions.map((session) => (
//                         <div
//                             key={session.videoId}
//                             style={{
//                                 border: '1px solid #ccc',
//                                 borderRadius: '8px',
//                                 padding: '15px',
//                                 backgroundColor: '#f9f9f9',
//                                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                             }}
//                         >
//                             <h3>Room Code: {session.roomCode}</h3>
//                             <p>Start Time: {new Date(session.startTime).toLocaleString()}</p>
//                             <p>End Time: {session.endTime ? new Date(session.endTime).toLocaleString() : 'Ongoing'}</p>
//                             <p>Duration: {calculateDuration(session.startTime, session.endTime)}</p>
//                             <button
//                                 onClick={() =>
//                                     setFilters({ ...filters, expandedRoom: filters.expandedRoom === session.videoId ? null : session.videoId })
//                                 }
//                             >
//                                 {filters.expandedRoom === session.videoId ? 'Hide Participants' : 'Show Participants'}
//                             </button>

//                             {/* Toggle Participant Details */}
//                             {filters.expandedRoom === session.videoId && (
//                                 <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '10px' }}>
//                                     {session.participants.map((participant) => (
//                                         <li
//                                             key={participant.userId}
//                                             style={{ paddingBottom: '5px', borderBottom: '1px solid #ddd' }}
//                                         >
//                                             <p>User: {participant.userId}</p>
//                                             <p>Start Time: {new Date(participant.startTime).toLocaleString()}</p>
//                                             <p>
//                                                 End Time: {participant.endTime ? new Date(participant.endTime).toLocaleString() : 'Ongoing'}
//                                             </p>
//                                             <p>Initiator: {participant.isInitiator ? 'Yes' : 'No'}</p>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VideoCallHistory;

// import React, { useState, useEffect } from 'react';

const VideoCallHistory = () => {
    const [videoSessions, setVideoSessions] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [filters, setFilters] = useState({
        participantName: '',
        startDate: '',
        endDate: '',
        sortBy: 'date',
        expandedRoom: null,  // Store the currently expanded room ID
    });

    const sessionsPerPage = 6; 

    useEffect(() => {
        const fetchVideoSessions = async () => {
            try {
                const queryParams = new URLSearchParams(filters).toString();
                const response = await fetch(`${link.baseUrl}/user-sessions?${queryParams}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    let data = await response.json();
                    if (filters.sortBy === 'duration') {
                         data = data.sort((a, b) => {
                            const durationA = new Date(a.endTime).getTime() - new Date(a.startTime).getTime();
                            const durationB = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
                            return durationA - durationB;
                        });
                    } else {
                        data = data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); 
                    }
                    setVideoSessions(data);
                } else {
                    const message = await response.text();
                    setError(message);
                }
            } catch (error) {
                setError('Error fetching video sessions');
            }
        };

        fetchVideoSessions();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        const durationMs = end - start;

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    // Pagnation logiccs
    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = videoSessions.slice(indexOfFirstSession, indexOfLastSession);

    const totalPages = Math.ceil(videoSessions.length / sessionsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="video-history-container">
            <h4>Video Call History</h4>

            {/* Search and Filter Section */}
            <div className="filter-container">
                <input
                    type="text"
                    name="participantName"
                    placeholder="Search by participant"
                    value={filters.participantName}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <span>Start Date</span>
                <input
                    type="date"
                    name="startDate"
                    placeholder='startDate'
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <span>End Date</span>
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="filter-select">
                    <option value="date">Sort by Date</option>
                    <option value="duration">Sort by Duration</option>
                </select>
            </div>

            {/* Display Video Call History */}
            {currentSessions.length === 0 ? (
                <p>No video call history available.</p>
            ) : (
                <div className="video-session-grid">
                    {currentSessions.map((session) => (
                        <div key={session.videoId} className="video-session-card">
                            <h4>Room Code: {session.roomCode}</h4>
                            <p>Start Time: {new Date(session.startTime).toLocaleString()}</p>
                            <p>End Time: {session.endTime ? new Date(session.endTime).toLocaleString() : 'Ongoing'}</p>
                            <p>Duration: {calculateDuration(session.startTime, session.endTime)}</p>
                            <button
                                onClick={() =>
                                    setFilters({ ...filters, expandedRoom: filters.expandedRoom === session.videoId ? null : session.videoId })
                                }
                            >
                                {filters.expandedRoom === session.videoId ? 'Hide Participants' : 'Show Participants'}
                            </button>

                            {/* Toggle Participant Details */}
                            {filters.expandedRoom === session.videoId && (
                                <ul className="participants-list">
                                    {session.participants.map((participant) => (
                                        <li key={participant.userId} className="participant-item">
                                            <p>User: {participant.userId}</p>
                                            <p>Start Time: {new Date(participant.startTime).toLocaleString()}</p>
                                            <p>
                                                End Time: {participant.endTime ? new Date(participant.endTime).toLocaleString() : 'Ongoing'}
                                            </p>
                                            {/* <p>Initiator: {participant.isInitiator ? 'Yes' : 'No'}</p> */}
                                            {participant.isInitiator && (<p>Initiator: Yes</p>)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VideoCallHistory;

