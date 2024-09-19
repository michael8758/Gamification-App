// src/renderer/components/PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from 'react';

function PomodoroTimer() {
    const [time, setTime] = useState(50 * 60); // Default 50 minutes
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);

    // Convert seconds to MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        let interval = null;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((time) => time - 1);
            }, 1000);
        } else if (isActive && time === 0) {
            // Send a message to the main process to show the notification
            window.electronAPI.sendNotification('Pomodoro Timer', 'Time is up!');
            setIsActive(false); // Stop the timer
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    const handleStart = () => {
        const [minutes, seconds] = timerRef.current.innerText.split(':').map(Number);
        if (!isNaN(minutes) && !isNaN(seconds)) {
            setTime(minutes * 60 + seconds);
            setIsActive(true);
        }
    };

    const handleStop = () => {
        setIsActive(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(25 * 60);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleStart();
            event.preventDefault(); // Prevent line break in contenteditable
        }
    };

    return (
        <div className="container">
            <h2>Pomodoro Timer</h2>
            <div 
                ref={timerRef}
                className="timer-display"
                contentEditable={!isActive} 
                onKeyPress={handleKeyPress}
                suppressContentEditableWarning={true} // To avoid React warning
                style={{ cursor: isActive ? 'default' : 'text' }}
            >
                {formatTime(time)}
            </div>
            {!isActive && (
                <div className="button-group">
                    <button className="button" onClick={handleStart}>Start</button>
                    <button className="button" onClick={handleReset}>Reset</button>
                </div>
            )}
        </div>
    );
}

export default PomodoroTimer;