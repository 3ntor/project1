import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Calendar.css';

const Calendar = ({ onDateSelect, onTimeSelect, selectedDate, selectedTime, bookedSlots = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Generate time slots
  const allTimeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  // Working days (Sunday to Thursday)
  const workingDays = [0, 1, 2, 3, 4]; // 0 = Sunday, 1 = Monday, etc.

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Check if date is available (not booked and is a working day)
  const isDateAvailable = (date) => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Can't book past dates
    if (date < today) return false;
    
    // Check if it's a working day
    if (!workingDays.includes(date.getDay())) return false;
    
    // Check if date has available slots (simulate API call)
    const hasAvailableSlots = Math.random() > 0.3; // 70% chance of availability
    
    return hasAvailableSlots;
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date) => {
    if (!date) return [];
    
    // Simulate API call to get booked slots for the date
    const bookedSlotsForDate = bookedSlots.filter(slot => 
      new Date(slot.date).toDateString() === date.toDateString()
    );
    
    const bookedTimes = bookedSlotsForDate.map(slot => slot.time);
    
    return allTimeSlots.filter(time => !bookedTimes.includes(time));
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;
    
    onDateSelect(date);
    const availableSlots = getAvailableTimeSlots(date);
    setAvailableTimeSlots(availableSlots);
  };

  // Handle time selection
  const handleTimeClick = (time) => {
    onTimeSelect(time);
  };

  // Check availability for selected date and time
  const checkAvailability = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsCheckingAvailability(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isAvailable = availableTimeSlots.includes(selectedTime);
    
    if (isAvailable) {
      alert(`✅ الموعد متاح!\nالتاريخ: ${selectedDate.toLocaleDateString('ar-EG')}\nالوقت: ${selectedTime}`);
    } else {
      alert(`❌ الموعد غير متاح\nيرجى اختيار موعد آخر`);
    }
    
    setIsCheckingAvailability(false);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="calendar-nav-btn">
          <FaChevronRight />
        </button>
        <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <button onClick={goToNextMonth} className="calendar-nav-btn">
          <FaChevronLeft />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day names */}
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              !day ? 'empty' : ''
            } ${
              day && isDateAvailable(day) ? 'available' : ''
            } ${
              day && !isDateAvailable(day) ? 'unavailable' : ''
            } ${
              day && selectedDate && day.toDateString() === selectedDate.toDateString() ? 'selected' : ''
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day && (
              <>
                <span className="day-number">{day.getDate()}</span>
                {isDateAvailable(day) && <div className="availability-indicator" />}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="selected-date-info">
          <h4>التاريخ المختار: {selectedDate.toLocaleDateString('ar-EG')}</h4>
          <p>المواعيد المتاحة: {availableTimeSlots.length} موعد</p>
        </div>
      )}

      {/* Available Time Slots */}
      {selectedDate && availableTimeSlots.length > 0 && (
        <div className="time-slots-container">
          <h4>المواعيد المتاحة:</h4>
          <div className="time-slots-grid">
            {availableTimeSlots.map(time => (
              <button
                key={time}
                className={`time-slot ${
                  selectedTime === time ? 'selected' : ''
                }`}
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Check Availability Button */}
      {selectedDate && selectedTime && (
        <div className="availability-check">
          <button
            className="btn btn-primary check-availability-btn"
            onClick={checkAvailability}
            disabled={isCheckingAvailability}
          >
            {isCheckingAvailability ? 'جاري الفحص...' : 'فحص التوفر'}
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-indicator available"></div>
          <span>متاح</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator unavailable"></div>
          <span>غير متاح</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator selected"></div>
          <span>مختار</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;