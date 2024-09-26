import React, { useState } from 'react';

function Menu({ setCurrentTab }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="menu-container">
            <div className="hamburger-icon" onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>

            {isOpen && (
                <div className="menu-options">
                    <button onClick={() => setCurrentTab('dashboard')}>Dashboard</button>
                    <button onClick={() => setCurrentTab('tasks')}>Tasks</button>
                </div>
            )}
        </div>
    );
}

export default Menu;