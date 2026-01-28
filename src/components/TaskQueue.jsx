import React, { useState, useCallback } from "react";
import Timer from "./Timer";

export default function TaskQueue({ tasks, onTaskChange }) {
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleEnd = useCallback(() => {
    const nextIdx = (currentTaskIdx + 1) % tasks.length;
    setCurrentTaskIdx(nextIdx);
    setIsPaused(false);
    setResetKey((k) => k + 1);
    onTaskChange && onTaskChange(nextIdx);
  }, [currentTaskIdx, tasks.length, onTaskChange]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleReset = () => {
    setResetKey((k) => k + 1);
    setIsPaused(false);
  };

  const currentTask = tasks[currentTaskIdx];

  return (
    <div className="timer-box">
      <div className="task-label">{currentTask.label}</div>
      <Timer
        duration={currentTask.duration}
        isPaused={isPaused}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        onEnd={handleEnd}
        keyReset={resetKey}
      />
    </div>
  );
}
