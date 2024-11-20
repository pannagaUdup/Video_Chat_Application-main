
// import React, { useState, useEffect } from 'react';
// import './LoginCss/VideoCallHistory.css'
// import { link } from '../link';

// const VideoHistoryWithPages = () => {
//     const [filters, setFilters] = useState({
//         participantName: '',
//         startDate: '',
//         endDate: '',
//         sortBy: 'date',
//     });
//     const [videoSessions, setVideoSessions] = useState([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);

//     const fetchVideoSessions = async (page = 0) => {
//         const queryParams = new URLSearchParams({
//             participantName: filters.participantName,
//             startDate: filters.startDate,
//             endDate: filters.endDate,
//             sortBy: filters.sortBy,
//             page: page,
//             size: 6  // Number of items in a page allowed
//         }).toString();

//         try {
//             const response = await fetch(`${link.baseUrl}/user-sessions-page?${queryParams}`, {
//                 method: 'GET',
//                 credentials: 'include',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const data = await response.json();

//             // Make sure to handle undefined or malformed response
//             setVideoSessions(Array.isArray(data.sessions) ? data.sessions : []);
//             setCurrentPage(data.currentPage || 0);
//             setTotalPages(data.totalPages || 0);
//         } catch (error) {
//             console.error('Error fetching video sessions:', error);
//             setVideoSessions([]);  // Set empty array on error
//         }
//     };

//     useEffect(() => {
//         fetchVideoSessions(); // Fetch data when component mounts
//     }, [filters]);

//     const handlePageChange = (page) => {
//         fetchVideoSessions(page - 1);  // Page number starts from 0 on the backend
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters((prevFilters) => ({
//             ...prevFilters,
//             [name]: value,
//         }));
//     };

//     const calculateDuration = (startTime, endTime) => {
//         const start = new Date(startTime);
//         const end = endTime ? new Date(endTime) : new Date();
//         const durationMs = end - start;

//         const hours = Math.floor(durationMs / (1000 * 60 * 60));
//         const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
//         return `${hours}h ${minutes}m`;
//     };

//     return (
//         <div className="video-history-container">
//             <h4>Video Call History</h4>

//             {/* Search and Filter Section */}
//             <div className="filter-container">
//                 <input
//                     type="text"
//                     name="participantName"
//                     placeholder="Search by participant"
//                     value={filters.participantName}
//                     onChange={handleFilterChange}
//                     className="filter-input"
//                 />
//                 <span>Start Date</span>
//                 <input
//                     type="date"
//                     name="startDate"
//                     value={filters.startDate}
//                     onChange={handleFilterChange}
//                     className="filter-input"
//                 />
//                 <span>End Date</span>
//                 <input
//                     type="date"
//                     name="endDate"
//                     value={filters.endDate}
//                     onChange={handleFilterChange}
//                     className="filter-input"
//                 />
//                 <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="filter-select">
//                     <option value="date">Sort by Date</option>
//                     <option value="duration">Sort by Duration</option>
//                 </select>
//             </div>

//             {/* Display Video Call History */}
//             {videoSessions && videoSessions.length === 0 ? (
//                 <p>No video call history available.</p>
//             ) : (
//                 <div className="video-session-grid">
//                     {videoSessions.map((session) => (
//                         <div key={session.videoId} className="video-session-card">
//                             <h4>Room Code: {session.roomCode}</h4>
//                             <p>Start Time: {new Date(session.startTime).toLocaleString()}</p>
//                             <p>End Time: {session.endTime ? new Date(session.endTime).toLocaleString() : 'Ongoing'}</p>
//                             <p>Duration: {calculateDuration(session.startTime, session.endTime)}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Pagination */}
//             <div className="pagination">
//                 {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                         key={index}
//                         className={`pagination-button ${currentPage === index ? 'active' : ''}`}
//                         onClick={() => handlePageChange(index + 1)}
//                     >
//                         {index + 1}
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default VideoHistoryWithPages;

import React, { useState, useEffect } from 'react';
import './LoginCss/VideoCallHistory.css';
import { link } from '../link';

const VideoHistoryWithPages = () => {
    const [filters, setFilters] = useState({
        participantName: '',
        startDate: '',
        endDate: '',
        sortBy: 'date',
    });
    const [videoSessions, setVideoSessions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchVideoSessions = async (page = 0) => {
        const queryParams = new URLSearchParams({
            participantName: filters.participantName,
            startDate: filters.startDate,
            endDate: filters.endDate,
            sortBy: filters.sortBy,
            page: page,
            size: 6  // Number of items in a page allowed
        }).toString();

        try {
            const response = await fetch(`${link.baseUrl}/user-sessions-page?${queryParams}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            // Make sure to handle undefined or malformed response
            setVideoSessions(Array.isArray(data.sessions) ? data.sessions : []);
            setCurrentPage(data.currentPage || 0);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Error fetching video sessions:', error);
            setVideoSessions([]);  // Set empty array on error
        }
    };

    useEffect(() => {
        fetchVideoSessions(); // Fetch data when component mounts
    }, [filters]);

    const handlePageChange = (page) => {
        fetchVideoSessions(page - 1);  // Page number starts from 0 on the backend
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        const durationMs = end - start;

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

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
            {videoSessions.length === 0 ? (
                <p>No video call history available.</p>
            ) : (
                <div className="video-session-grid">
                    {videoSessions.map((session, index) => (
                        <div key={session.videoId || index} className="video-session-card">
                            <h4>Room Code: {session.roomCode}</h4>
                            <p>Start Time: {new Date(session.startTime).toLocaleString()}</p>
                            <p>End Time: {session.endTime ? new Date(session.endTime).toLocaleString() : 'Ongoing'}</p>
                            <p>Duration: {calculateDuration(session.startTime, session.endTime)}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}  // Ensure the pagination button has a unique key
                        className={`pagination-button ${currentPage === index ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VideoHistoryWithPages;
