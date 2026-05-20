
import React, { useState, useEffect } from 'react';
import './styles.css';

const CountdownTimer = ({ compact = false }) => {
  const calculateTimeLeft = (): { dias: number; horas: number; minutos: number; segundos: number } => {
     
    const targetTime = new Date('2025-12-18T00:00:00').getTime(); 
    const difference = targetTime - new Date().getTime();

    if (difference > 0) {
      return {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState<{ dias: number; horas: number; minutos: number; segundos: number }>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const formatTime = (time: number) => String(time).padStart(2, '0');

  if (compact) {
    return (
      <div className="compact">
        <div className="compact-label"><i className="pi pi-bolt compact-icon"></i>TERMINA EM</div>
        <div className="compact-time">
          {formatTime(timeLeft.dias)}D:{formatTime(timeLeft.horas)}:{formatTime(timeLeft.minutos)}:{formatTime(timeLeft.segundos)}
        </div>
      </div>
    );
  }

  return (
    <div className="regular">
      <span className="regular-label">TERMINA EM:</span>
      <div className="time-container">
        <span className="time-box">{formatTime(timeLeft.dias)}D</span>
        <span className="time-box">{formatTime(timeLeft.horas)}</span>
        <span className="colon">:</span>
        <span className="time-box">{formatTime(timeLeft.minutos)}</span>
        <span className="colon">:</span>
        <span className="time-box">{formatTime(timeLeft.segundos)}</span>
      </div>
    </div>
  );
}

export default CountdownTimer;
