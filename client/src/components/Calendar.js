import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import './Calendar.css';

const Calendar = ({ onDateSelect, selectedDate, bookedDates = [] }) => {
  const { language, isRTL } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(selectedDate || null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Check if date is available
  const isDateAvailable = (date) => {
    if (!date) return false;
    
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    
    // Check if date is booked
    const dateString = date.toISOString().split('T')[0];
    return !bookedDates.includes(dateString);
  };

  // Check availability for selected date
  const checkAvailability = async (date) => {
    if (!date) return;
    
    setCheckingAvailability(true);
    
    try {
      // Mock API call - in real app, call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSlots = [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '12:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: false },
        { time: '16:00', available: true },
        { time: '17:00', available: true }
      ];
      
      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableSlots([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (!isDateAvailable(date)) return;
    
    setSelectedDay(date);
    onDateSelect(date);
    checkAvailability(date);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Get month name
  const getMonthName = (date) => {
    const months = language === 'ar' 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  };

  // Get day names
  const getDayNames = () => {
    return language === 'ar'
      ? ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  const days = getDaysInMonth(currentDate);
  const dayNames = getDayNames();

  return (
    <div className={`calendar-container ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="nav-btn">
          <FaChevronLeft />
        </button>
        <h3 className="month-year">
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h3>
        <button onClick={goToNextMonth} className="nav-btn">
          <FaChevronRight />
        </button>
      </div>

      {/* Day Names */}
      <div className="calendar-days-header">
        {dayNames.map((day, index) => (
          <div key={index} className="day-name">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              !day ? 'empty' : ''
            } ${
              day && isDateAvailable(day) ? 'available' : 'unavailable'
            } ${
              selectedDay && day && selectedDay.toDateString() === day.toDateString() ? 'selected' : ''
            }`}
            onClick={() => handleDateSelect(day)}
          >
            {day && (
              <>
                <span className="day-number">{day.getDate()}</span>
                {isDateAvailable(day) && (
                  <div className="availability-indicator">
                    <span className="dot"></span>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Availability Check */}
      {selectedDay && (
        <div className="availability-section">
          <h4>{t('checkAvailability', language)}</h4>
          <p className="selected-date">
            {selectedDay.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          
          {checkingAvailability ? (
            <div className="loading-slots">
              <div className="spinner"></div>
              <span>{t('loading', language)}</span>
            </div>
          ) : (
            <div className="time-slots">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`time-slot ${slot.available ? 'available' : 'booked'}`}
                  >
                    <span className="time">{slot.time}</span>
                    {slot.available ? (
                      <FaCheck className="status-icon available" />
                    ) : (
                      <FaTimes className="status-icon booked" />
                    )}
                  </div>
                ))
              ) : (
                <p className="no-slots">{t('noAvailableSlots', language)}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot available"></div>
          <span>{t('available', language)}</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot unavailable"></div>
          <span>{t('unavailable', language)}</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot selected"></div>
          <span>{t('selected', language)}</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;