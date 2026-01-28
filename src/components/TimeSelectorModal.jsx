import React, { useState, useEffect, useRef } from "react";
import { timePicker } from "analogue-time-picker";

export default function TimeSelectorModal({ onClose, onSelect }) {
  const [showTime, setShowTime] = useState(null);
  const [hour, setHour] = useState("1");
  const [minute, setMinute] = useState("00");
  const clockRef = useRef(null);

  useEffect(() => {
    if (clockRef.current) {
      const timePickerInstance = timePicker({
        element: clockRef.current,
        mode: 12,
        width: "300px",
        time: { hour: 1, minute: 0 }
      });
      setShowTime(timePickerInstance);
    }
  }, []);

  function handleClick() {
    if (showTime) {
      const timeObject = showTime.getTime();
      const formattedHour = timeObject.hour.toString().padStart(2, '0');
      const formattedMinute = timeObject.minute.toString().padStart(2, '0');
      const timeString = `${formattedHour}:${formattedMinute}`;
      onSelect(timeString);
    }
  }

  return (
    <div className="time-selector-modal">
      <div className="modal-header">
        <h3>Select Time</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="modal-content">
        <div ref={clockRef} id="clock"></div>
        <div className="button-row">
          <button className="button" onClick={handleClick}>
            Confirm Time
          </button>
          <button className="button cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}