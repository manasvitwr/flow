import React, { useState, useEffect, useRef } from "react";
import { Settings, MoreVertical, ChevronLeft, ChevronRight, Coffee, Dumbbell, Moon, Sun, Maximize2, RotateCcw } from "lucide-react";
import "./fullscreen.css";
const BOOKMARK_ICONS = [
  { type: "coffee", icon: <Coffee size={22} />, label: "Break" },
  { type: "gym", icon: <Dumbbell size={22} />, label: "Gym" },
  { type: "sleep", icon: <Moon size={22} />, label: "Sleep" },
  { type: "wake", icon: <Sun size={22} />, label: "Wake Up" },
];

export default function Timer({
  label,
  minutes,
  seconds,
  isRunning,
  onStart,
  onPause,
  onPrev,
  onNext,
  onAddMinute,
  onSubtractMinute,
  onManageTasks,
  canScrollPrev,
  canScrollNext,
  onAddBookmark,
  onEditTaskLabel,
  onReset
}) {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerCardRef = useRef(null);

  // Update editValue when label prop changes
  useEffect(() => {
    setEditValue(label);
  }, [label]);

  const handleBookmarkClick = async (type) => {
    let time = window.prompt("Enter time for this event (e.g. 22:00 for 10 PM):");
    if (time && onAddBookmark) {
      onAddBookmark(type, time);
    }
    setShowBookmarks(false);
  };

  const handleLabelClick = () => {
    setEditValue(label);
    setEditingLabel(true);
  };
  const handleLabelBlur = () => {
    setEditingLabel(false);
    if (editValue !== label && onEditTaskLabel) {
      onEditTaskLabel(editValue);
    }
  };
  const handleLabelKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const handleStartPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  };

  const handleReset = () => {
    setHasStarted(false);
    onReset();
  };

  const toggleFullscreen = () => {
    const timerCard = timerCardRef.current;
    if (!timerCard) return;
    
    if (!isFullscreen) {
      if (timerCard.requestFullscreen) {
        timerCard.requestFullscreen().catch(err => {
          console.log('Fullscreen request failed:', err);
        });
      } else if (timerCard.webkitRequestFullscreen) {
        timerCard.webkitRequestFullscreen().catch(err => {
          console.log('Webkit fullscreen request failed:', err);
        });
      } else if (timerCard.msRequestFullscreen) {
        timerCard.msRequestFullscreen().catch(err => {
          console.log('MS fullscreen request failed:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.log('Exit fullscreen failed:', err);
        });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch(err => {
          console.log('Webkit exit fullscreen failed:', err);
        });
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch(err => {
          console.log('MS exit fullscreen failed:', err);
        });
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="timer-card" ref={timerCardRef}>
      <div className="timer-header-row">
        <div className="task-label-pill fg-black-pill" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
          {editingLabel ? (
            <input
              value={editValue}
              autoFocus
              onChange={e => setEditValue(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
              className="task-label-input"
            />
          ) : (
            label
          )}
        </div>
        <div className="manage-tasks fg-manage" onClick={onManageTasks}>
          Manage Tasks <MoreVertical size={18} />
        </div>
      </div>
      <div className="timer-main-row">
        <button
          className="timer-arrow"
          onClick={onPrev}
          disabled={!canScrollPrev}
          aria-label="Previous Task"
        >
          &lt;
        </button>
        <div className="timer-controls-col">
          <button className="timer-start" onClick={handleStartPause}>
            {isRunning ? "Pause" : "Start"}
          </button>
          {hasStarted && (
            <button className="timer-start" onClick={handleReset} title="Reset Timer">
              Reset
            </button>
          )}
        </div>
        <div className="timer-digits">{minutes}:{seconds}</div>
        <div className="timer-plusminus">
          <button className="timer-plus" onClick={onAddMinute}>+</button>
          <button className="timer-minus" onClick={onSubtractMinute}>-</button>
        </div>
        <button
          className="timer-arrow"
          onClick={() => {
            if (canScrollNext) {
              onNext();
            } else {
              onManageTasks();
            }
          }}
          aria-label="Next Task"
        >
          &gt;
        </button>
      </div>
      <div className="timer-labels-row">
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
      <button 
        className="fullscreen-btn bottom-right" 
        onClick={toggleFullscreen}
        title="Toggle Fullscreen"
      >
        <Maximize2 size={22} />
      </button>
    </div>
  );
}
