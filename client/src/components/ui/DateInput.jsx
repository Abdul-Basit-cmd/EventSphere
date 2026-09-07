import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const toLocalDate = (val) => {
  if (!val) return null;
  const [y, m, d] = val.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const toDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDisplay = (val) => {
  if (!val) return '';
  const d = toLocalDate(val);
  if (!d || isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
};

const DateInput = ({
  value,
  onChange,
  name,
  id,
  min,
  max,
  disabled = false,
  placeholder = 'Select date',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 280 });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const getInitialView = () => {
    if (value) {
      const d = toLocalDate(value);
      if (d && !isNaN(d.getTime())) return { year: d.getFullYear(), month: d.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const [viewDate, setViewDate] = useState(getInitialView);

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const d = toLocalDate(value);
      if (d && !isNaN(d.getTime())) {
        setViewDate({ year: d.getFullYear(), month: d.getMonth() });
      }
    }
  }, [value]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 310;
    const dropdownWidth = 280;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < dropdownHeight + 8 && spaceAbove > spaceBelow;

    let top = openUp ? rect.top - dropdownHeight - 6 : rect.bottom + 6;

    // Viewport clamping
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

  const minDate = min ? toLocalDate(min) : null;
  const maxDate = max ? toLocalDate(max) : null;

  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const fireChange = (val) => {
    if (onChange) onChange({ target: { name, value: val } });
  };

  const handleDayClick = (day) => {
    const date = new Date(viewDate.year, viewDate.month, day);
    if (isDateDisabled(date)) return;
    fireChange(toDateString(date));
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isDateDisabled(today)) return;
    fireChange(toDateString(today));
    setIsOpen(false);
  };

  const handleClear = () => {
    fireChange('');
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
    const selectedDate = value ? toLocalDate(value) : null;

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.year, viewDate.month, day);
      const isSelected =
        selectedDate &&
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate();
      const isToday = date.getTime() === today.getTime();
      const isDisabled = isDateDisabled(date);

      cells.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDayClick(day)}
          style={{
            width: 30,
            height: 30,
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
            transition: 'background 0.12s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: isSelected ? 700 : 400,
          }}
          onMouseEnter={(e) => {
            if (!isDisabled && !isSelected)
              e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {day}
        </button>
      );
    }
    return cells;
  };

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
        <Calendar
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

      {/* Calendar dropdown mounted at document.body via Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            data-dateinput-dropdown
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
              padding: '12px',
              boxShadow: '0 20px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06)',
              animation: 'dropdownFadeIn 0.15s ease',
            }}
          >
            {/* Month navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
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
                  padding: '3px 6px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft style={{ width: 13, height: 13 }} />
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
                  padding: '3px 6px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </div>

            {/* Day headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                marginBottom: 4,
                gap: 2,
              }}
            >
              {DAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: 'center',
                    fontSize: 10,
                    color: 'var(--color-text-dim)',
                    fontFamily: 'var(--font-body)',
                    padding: '2px 0',
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
                gap: 2,
                justifyItems: 'center',
              }}
            >
              {renderDays()}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                paddingTop: 8,
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
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleToday}
                style={{
                  fontSize: 11,
                  color: 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              >
                Today
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DateInput;
