import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n) => String(n).padStart(2, '0');

const toLocalDateOnly = (val) => {
  if (!val) return null;
  const datePart = val.includes('T') ? val.split('T')[0] : val;
  const [y, m, d] = datePart.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const parseValue = (val) => {
  if (!val) return { date: null, hour: 9, minute: 0 };
  const [datePart, timePart] = val.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [h, min] = timePart ? timePart.split(':').map(Number) : [9, 0];
  const date = new Date(y, m - 1, d);
  return {
    date: isNaN(date.getTime()) ? null : date,
    hour: typeof h === 'number' && !isNaN(h) ? h : 9,
    minute: typeof min === 'number' && !isNaN(min) ? min : 0,
  };
};

const buildValue = (date, hour, minute) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(hour);
  const min = pad(minute);
  return `${y}-${m}-${d}T${h}:${min}`;
};

const formatDisplay = (val) => {
  if (!val) return '';
  const { date, hour, minute } = parseValue(val);
  if (!date) return '';
  const ampm = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const monthName = MONTHS[date.getMonth()].slice(0, 3);
  return `${monthName} ${pad(date.getDate())}, ${date.getFullYear()}  ${pad(h12)}:${pad(minute)} ${ampm}`;
};

const QUICK_TIMES = [
  { label: '9 AM', hour: 9, minute: 0 },
  { label: '11 AM', hour: 11, minute: 0 },
  { label: '2 PM', hour: 14, minute: 0 },
  { label: '5 PM', hour: 17, minute: 0 },
];

const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const DateTimeInput = ({
  value,
  onChange,
  name,
  id,
  min,
  max,
  disabled = false,
  placeholder = 'Select date & time',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 300 });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const { date: selDate, hour: selHour, minute: selMinute } = parseValue(value);

  const [viewDate, setViewDate] = useState(() => {
    if (selDate) return { year: selDate.getFullYear(), month: selDate.getMonth() };
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [pendingDate, setPendingDate] = useState(selDate);
  const [pendingHour, setPendingHour] = useState(selHour);
  const [pendingMinute, setPendingMinute] = useState(selMinute);

  // Sync state if external value changes
  useEffect(() => {
    const parsed = parseValue(value);
    setPendingDate(parsed.date);
    setPendingHour(parsed.hour);
    setPendingMinute(parsed.minute);
    if (parsed.date) {
      setViewDate({ year: parsed.date.getFullYear(), month: parsed.date.getMonth() });
    }
  }, [value]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 340;
    const dropdownWidth = 300;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Flip upwards if space below is too tight AND more space is available above
    const openUp = spaceBelow < dropdownHeight + 8 && spaceAbove > spaceBelow;

    let top = openUp ? rect.top - dropdownHeight - 6 : rect.bottom + 6;

    // Strict clamping so popover is never pushed beyond viewport top or bottom
    if (top < 10) {
      top = 10;
    } else if (top + dropdownHeight > window.innerHeight - 10) {
      top = Math.max(10, window.innerHeight - dropdownHeight - 10);
    }

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 12) {
      left = window.innerWidth - dropdownWidth - 12;
    }
    if (left < 12) left = 12;

    setDropdownPos({ top, left, width: dropdownWidth });
  }, []);

  const openDropdown = () => {
    if (disabled) return;
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = (e) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) return;
      updatePosition();
    };

    const handleOutside = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) return;
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  const minDate = min ? toLocalDateOnly(min) : null;
  const maxDate = max ? toLocalDateOnly(max) : null;

  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const fireChange = (date, hour, minute) => {
    if (onChange) {
      onChange({ target: { name, value: buildValue(date, hour, minute) } });
    }
  };

  const handleDayClick = (day) => {
    const date = new Date(viewDate.year, viewDate.month, day);
    if (isDateDisabled(date)) return;
    setPendingDate(date);
    fireChange(date, pendingHour, pendingMinute);
  };

  const handleHour12Change = (h12) => {
    const isPM = pendingHour >= 12;
    let new24 = isPM ? (h12 % 12) + 12 : h12 % 12;
    setPendingHour(new24);
    if (pendingDate) fireChange(pendingDate, new24, pendingMinute);
  };

  const handleMinuteChange = (minVal) => {
    setPendingMinute(minVal);
    if (pendingDate) fireChange(pendingDate, pendingHour, minVal);
  };

  const handleAmPmToggle = (targetAmPm) => {
    const isCurrentlyPM = pendingHour >= 12;
    if (targetAmPm === 'PM' && !isCurrentlyPM) {
      const new24 = pendingHour + 12;
      setPendingHour(new24);
      if (pendingDate) fireChange(pendingDate, new24, pendingMinute);
    } else if (targetAmPm === 'AM' && isCurrentlyPM) {
      const new24 = pendingHour - 12;
      setPendingHour(new24);
      if (pendingDate) fireChange(pendingDate, new24, pendingMinute);
    }
  };

  const handleQuickTime = (qt) => {
    setPendingHour(qt.hour);
    setPendingMinute(qt.minute);
    const dateToUse = pendingDate || new Date();
    if (!pendingDate) setPendingDate(dateToUse);
    fireChange(dateToUse, qt.hour, qt.minute);
  };

  const handleNow = () => {
    const now = new Date();
    const currentMin = now.getMinutes();
    const roundedMin = (Math.round(currentMin / 5) * 5) % 60;
    setPendingDate(now);
    setPendingHour(now.getHours());
    setPendingMinute(roundedMin);
    setViewDate({ year: now.getFullYear(), month: now.getMonth() });
    fireChange(now, now.getHours(), roundedMin);
    setIsOpen(false);
  };

  const handleClear = () => {
    setPendingDate(null);
    setPendingHour(9);
    setPendingMinute(0);
    fireChange(null, 9, 0);
    setIsOpen(false);
  };

  const handleDone = () => {
    if (!pendingDate) {
      const today = new Date();
      setPendingDate(today);
      fireChange(today, pendingHour, pendingMinute);
    }
    setIsOpen(false);
  };

  const prevMonth = () =>
    setViewDate((p) =>
      p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 }
    );

  const nextMonth = () =>
    setViewDate((p) =>
      p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 }
    );

  const renderDays = () => {
    const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
    const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.year, viewDate.month, day);
      const isSelected =
        pendingDate &&
        date.getFullYear() === pendingDate.getFullYear() &&
        date.getMonth() === pendingDate.getMonth() &&
        date.getDate() === pendingDate.getDate();
      const isToday = date.getTime() === today.getTime();
      const isDisabled = isDateDisabled(date);

      cells.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDayClick(day)}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            border: isToday && !isSelected ? '1px solid var(--color-primary)' : 'none',
            backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
            color: isDisabled
              ? 'var(--color-text-dim)'
              : isSelected
              ? '#fff'
              : 'var(--color-text)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.35 : 1,
            fontWeight: isSelected ? 700 : 400,
            transition: 'background 0.12s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            if (!isDisabled && !isSelected) {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {day}
        </button>
      );
    }
    return cells;
  };

  const currentH12 = pendingHour % 12 === 0 ? 12 : pendingHour % 12;
  const currentAmPm = pendingHour < 12 ? 'AM' : 'PM';

  const minuteChoices = MINUTE_OPTIONS.includes(pendingMinute)
    ? MINUTE_OPTIONS
    : [...MINUTE_OPTIONS, pendingMinute].sort((a, b) => a - b);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Styled trigger */}
      <div
        ref={triggerRef}
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openDropdown}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDropdown()}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 12px',
          backgroundColor: 'var(--color-surface-alt)',
          border: `1px solid ${isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 8,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          boxShadow: isOpen ? '0 0 0 3px var(--color-primary-muted)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          userSelect: 'none',
          outline: 'none',
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            color: value ? 'var(--color-text)' : 'var(--color-text-dim)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Clock
          style={{
            width: 15,
            height: 15,
            color: isOpen ? 'var(--color-primary)' : 'var(--color-text-muted)',
            flexShrink: 0,
            marginLeft: 8,
            transition: 'color 0.15s',
          }}
        />
      </div>

      {/* Popover mounted at document.body via Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            data-datetime-dropdown
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              maxHeight: 'calc(100vh - 20px)',
              overflowY: 'auto',
              zIndex: 999999,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              padding: '10px 12px',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.88), 0 0 0 1px rgba(255, 255, 255, 0.06)',
              animation: 'dropdownFadeIn 0.15s ease',
            }}
          >
            {/* Header Preview Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                backgroundColor: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar style={{ width: 12, height: 12, color: 'var(--color-primary)' }} />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    color: pendingDate ? 'var(--color-text)' : 'var(--color-text-dim)',
                  }}
                >
                  {pendingDate
                    ? `${MONTHS[pendingDate.getMonth()].slice(0, 3)} ${pad(pendingDate.getDate())}`
                    : 'Choose date'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock style={{ width: 11, height: 11, color: 'var(--color-primary)' }} />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}
                >
                  {pad(currentH12)}:{pad(pendingMinute)} {currentAmPm}
                </span>
              </div>
            </div>

            {/* Month navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <button
                type="button"
                onClick={prevMonth}
                style={{
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '2px 5px',
                  borderRadius: 5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft style={{ width: 12, height: 12 }} />
              </button>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {MONTHS[viewDate.month]} {viewDate.year}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                style={{
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '2px 5px',
                  borderRadius: 5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
            </div>

            {/* Day headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                marginBottom: 3,
                gap: 1,
              }}
            >
              {DAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: 'center',
                    fontSize: 9,
                    color: 'var(--color-text-dim)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 1,
                justifyItems: 'center',
                marginBottom: 8,
              }}
            >
              {renderDays()}
            </div>

            {/* Time Controls Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)',
                borderRadius: 7,
                padding: '6px 8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'var(--color-text-dim)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Clock style={{ width: 10, height: 10 }} />
                  Time
                </span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {QUICK_TIMES.map((qt) => (
                    <button
                      key={qt.label}
                      type="button"
                      onClick={() => handleQuickTime(qt)}
                      style={{
                        fontSize: 8,
                        padding: '1px 4px',
                        borderRadius: 3,
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {qt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hour, Minute, AM/PM Pickers */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {/* Hour Select */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <select
                    value={currentH12}
                    onChange={(e) => handleHour12Change(Number(e.target.value))}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 5,
                      padding: '3px 4px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {pad(h)}
                      </option>
                    ))}
                  </select>
                </div>

                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dim)' }}>
                  :
                </span>

                {/* Minute Select */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <select
                    value={pendingMinute}
                    onChange={(e) => handleMinuteChange(Number(e.target.value))}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 5,
                      padding: '3px 4px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {minuteChoices.map((m) => (
                      <option key={m} value={m}>
                        {pad(m)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AM / PM Segmented Control */}
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 5,
                    padding: 1,
                    gap: 1,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleAmPmToggle('AM')}
                    style={{
                      padding: '3px 6px',
                      fontSize: 10,
                      fontWeight: currentAmPm === 'AM' ? 700 : 500,
                      backgroundColor: currentAmPm === 'AM' ? 'var(--color-primary)' : 'transparent',
                      color: currentAmPm === 'AM' ? '#fff' : 'var(--color-text-muted)',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.12s, color 0.12s',
                    }}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAmPmToggle('PM')}
                    style={{
                      padding: '3px 6px',
                      fontSize: 10,
                      fontWeight: currentAmPm === 'PM' ? 700 : 500,
                      backgroundColor: currentAmPm === 'PM' ? 'var(--color-primary)' : 'transparent',
                      color: currentAmPm === 'PM' ? '#fff' : 'var(--color-text-muted)',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.12s, color 0.12s',
                    }}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 8,
                paddingTop: 6,
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                type="button"
                onClick={handleClear}
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  padding: '2px 4px',
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Clear
              </button>

              <div style={{ display: 'flex', gap: 5 }}>
                <button
                  type="button"
                  onClick={handleNow}
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    padding: '2px 5px',
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  Now
                </button>
                <button
                  type="button"
                  onClick={handleDone}
                  style={{
                    fontSize: 11,
                    color: '#fff',
                    background: 'var(--color-primary)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
                >
                  <Check style={{ width: 11, height: 11 }} />
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DateTimeInput;
