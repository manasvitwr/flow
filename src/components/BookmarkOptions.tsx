import React, { useState } from "react";
import { Coffee, Dumbbell, Moon, Sun, Settings } from "lucide-react";
import TimeSelectorModal from "./TimeSelectorModal";
import outputCompressed from '../assets/icons/output_compressed.svg';

export default function BookmarkOptions({ onAddBookmark, isTamagotchiMode = false }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  
  const BOOKMARK_ICONS = [
    { type: "coffee", icon: <Coffee size={24} />, label: "Break" },
    { type: "gym", icon: <Dumbbell size={24} />, label: "Gym" },
    { type: "sleep", icon: <Moon size={24} />, label: "Sleep" },
    { type: "wake", icon: <Sun size={24} />, label: "Wake Up" },
  ];

  function handleTypeClick(type) {
    setSelectedType(type);
    setShowTimePicker(true);
    setShowOptions(false);
  }

  function handleTimeSelect(time) {
    if (onAddBookmark && selectedType) {
      // Convert time string (HH:MM) to hour decimal
      const [hours, minutes] = time.split(':').map(Number);
      const hourDecimal = hours + (minutes / 60);
      
      onAddBookmark(selectedType, hourDecimal);
    }
    setShowTimePicker(false);
    setSelectedType(null);
  }

  function handleCancel() {
    setShowTimePicker(false);
    setSelectedType(null);
  }

  return (
    <>
      <button 
        className="bookmark-options-btn" 
        onClick={() => setShowOptions(!showOptions)}
      >
        Bookmark Options 
        <span className="bookmark-gear">
          {isTamagotchiMode ? (
            <img 
              src={outputCompressed}
              alt="gear" 
              width="35"
              height="30"
              style={{
    marginBottom: '10px', 
    filter: 'drop-shadow(2px 2px 0px rgba(255, 255, 255, 0.32)) drop-shadow(0px -1px 0px rgba(0,0,0,0.5)) drop-shadow(1px 0px 0px rgba(0,0,0,0.5)) drop-shadow(-1px 0px 0px rgba(0,0,0,0.5))',
    transform: 'scale(1.05)'
  }}  
            />
          ) : (
            <Settings size={18} />
          )}
        </span>
      </button>
      
      {showOptions && (
        <div className="bookmark-icons-row">
          {BOOKMARK_ICONS.map((bm) => (
            <button
              key={bm.type}
              className="bookmark-icon-btn"
              title={bm.label}
              onClick={() => handleTypeClick(bm.type)}
            >
              {bm.icon}
              <span className="bookmark-icon-label">{bm.label}</span>
            </button>
          ))}
        </div>
      )}

      {showTimePicker && (
        <TimeSelectorModal 
          onClose={handleCancel} 
          onSelect={handleTimeSelect} 
        />
      )}
    </>
  );
}
