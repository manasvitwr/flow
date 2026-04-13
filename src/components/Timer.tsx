import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, Maximize2 } from "lucide-react";
import "./fullscreen.css";

export default function Timer({
  label, minutes, seconds, isRunning,
  onStart, onPause, onPrev, onNext,
  onAddMinute, onSubtractMinute, onManageTasks,
  canScrollPrev, canScrollNext, onEditTaskLabel, onReset
}: any) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setEditValue(label); }, [label]);

  const handleLabelBlur = () => {
    setEditingLabel(false);
    if (editValue !== label && onEditTaskLabel) onEditTaskLabel(editValue);
  };

  const handleStartPause = () => {
    if (!hasStarted) setHasStarted(true);
    if (isRunning) onPause(); else onStart();
  };

  const handleReset = () => { setHasStarted(false); onReset(); };

  const toggleFullscreen = () => {
    const el = timerCardRef.current;
    if (!el) return;
    if (!isFullscreen) {
      (el.requestFullscreen ? el.requestFullscreen() : (el as any).webkitRequestFullscreen?.()).catch?.(console.warn);
    } else {
      (document.exitFullscreen ? document.exitFullscreen() : (document as any).webkitExitFullscreen?.()).catch?.(console.warn);
    }
    setIsFullscreen(!isFullscreen);
  };

  // Split into individual digit characters for label alignment
  const m0 = minutes[0], m1 = minutes[1];
  const s0 = seconds[0], s1 = seconds[1];

  return (
    <div className="timer-card" ref={timerCardRef}>

      {/* Header: spacer | task-pill (center) | manage (right) */}
      <div className="timer-header-row">
        <div className="timer-header-spacer" />
        <div className="task-label-pill" onClick={() => { setEditValue(label); setEditingLabel(true); }} style={{ cursor: 'pointer' }}>
          {editingLabel ? (
            <input value={editValue} autoFocus
              onChange={e => setEditValue(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
              className="task-label-input"
            />
          ) : label}
        </div>
        <div className="manage-tasks fg-manage" onClick={onManageTasks}>
          Manage Tasks <MoreVertical size={18} />
        </div>
      </div>

      {/* Main row: ‹ | controls | digit-grid | +/- | › */}
      <div className="timer-main-row">
        <button className="timer-arrow" onClick={onPrev} disabled={!canScrollPrev} aria-label="Previous Task">‹</button>

        <div className="timer-controls-col">
          <button className="timer-start" onClick={handleStartPause}>{isRunning ? "Pause" : "Start"}</button>
          {hasStarted && <button className="timer-start" onClick={handleReset}>Reset</button>}
        </div>

        {/* digit-group: big numbers + labels anchored under ones digits */}
        <div className="digit-group">
          <div className="digit-grid">
            {/* Row 1 – digits */}
            <span className="digit">{m0}</span>
            <span className="digit">{m1}</span>
            <span className="d-colon">:</span>
            <span className="digit">{s0}</span>
            <span className="digit">{s1}</span>
            {/* Row 2 – labels: col 2 = Minutes, col 5 = Seconds */}
            <span className="lbl-fill" />
            <span className="lbl-text">Minutes</span>
            <span className="lbl-fill" />
            <span className="lbl-fill" />
            <span className="lbl-text">Seconds</span>
          </div>
        </div>

        <div className="timer-plusminus">
          <button className="timer-plus" onClick={onAddMinute}>+</button>
          <button className="timer-minus" onClick={onSubtractMinute}>−</button>
        </div>

        <button className="timer-arrow" onClick={() => canScrollNext ? onNext() : onManageTasks()} aria-label="Next Task">›</button>
      </div>

      <button className="fullscreen-btn bottom-right" onClick={toggleFullscreen} title="Toggle Fullscreen">
        <Maximize2 size={22} />
      </button>
    </div>
  );
}
