// src/renderer/components/Sidebar.jsx
import React from 'react';

function Sidebar({ currentTab, setCurrentTab }) {
    return (
        <div className="sidebar">
            <button 
                className={`tab-button ${currentTab === 'dashboard' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('dashboard')}
            >
                Dashboard
            </button>
            <button 
                className={`tab-button ${currentTab === 'tasks' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('tasks')}
            >
                Tasks
            </button>
        </div>
    );
}

export default Sidebar;