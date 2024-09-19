// src/renderer/components/PomodoroTimer.jsx
import React, { useState, useEffect } from 'react';

function PomodoroTimer() {
    const [time, setTime] = useState(25 * 60); // Default 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);

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
        setTime((minutes * 60) + seconds); // Set the timer using edited minutes and seconds
        setIsActive(true);
    };

    const handleStop = () => {
        setIsActive(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(25 * 60);
        setMinutes(25);
        setSeconds(0);
    };

    const handleMinutesChange = (event) => {
        const value = event.target.value;
        setMinutes(value === '' ? '' : Math.max(0, Math.min(59, Number(value))));
    };

    const handleSecondsChange = (event) => {
        const value = event.target.value;
        setSeconds(value === '' ? '' : Math.max(0, Math.min(59, Number(value))));
    };

    const handleClick = () => {
        if (isActive) {
            handleStop();
        } else {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <div className="container">
            <h2>Pomodoro Timer</h2>
            <div onClick={handleClick} style={{ cursor: isActive ? 'pointer' : 'default' }}>
                {isEditing ? (
                    <div>
                        <input 
                            type="number" 
                            value={minutes}
                            onChange={handleMinutesChange}
                            onBlur={handleBlur}
                            placeholder="MM"
                            min="0"
                            max="59"
                            className="timer-input"
                        /> : 
                        <input 
                            type="number" 
                            value={seconds}
                            onChange={handleSecondsChange}
                            onBlur={handleBlur}
                            placeholder="SS"
                            min="0"
                            max="59"
                            className="timer-input"
                        />
                    </div>
                ) : (
                    <div>{formatTime(time)}</div>
                )}
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