import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import Timer from "./components/Timer";
import TaskManager from "./components/TaskManager";
import Timeline from "./components/Timeline";
import TamagotchiMode from "./modes/tamagotchi/TamagotchiMode";
import BookmarkOptions from "./components/BookmarkOptions";
import "./App.css";
import "./styles/global.css";
import './styles/fonts.css';
import { Settings, Coffee, Dumbbell, Moon, Sun, Gamepad2, Music } from "lucide-react";
import Footer from './components/Footer';
import pixelatedWave from './assets/icons/pixelated-wave.svg';


// Utility to get today's key
const getTodayKey = () => new Date().toISOString().split('T')[0];
const FOCUS_KEY = (date = new Date()) => `focusTime-${getTodayKey(date)}`;
const TASKS_KEY = 'tasks';

function formatFocusTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h > 0 ? `${h}h ` : ''}${m}m`;
}

export default function App() {
  // Load tasks from localStorage or default
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) return JSON.parse(stored);
    return [{ label: "Enter Task", duration: 45 * 60 }];
  });
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(tasks[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isTamagotchiMode, setIsTamagotchiMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [focusTime, setFocusTime] = useState(() => {
    const stored = localStorage.getItem(FOCUS_KEY());
    return stored ? parseInt(stored, 10) : 0;
  });
  const timerRef = useRef();
  const beepSound = useRef(new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'));
  const [isTaskCompleting, setIsTaskCompleting] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Save tasks to localStorage on change
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Save focus time to localStorage on change
  useEffect(() => {
    localStorage.setItem(FOCUS_KEY(), focusTime);
  }, [focusTime]);

  // Restore today's focus time on load (in case date changes)
  useEffect(() => {
    const stored = localStorage.getItem(FOCUS_KEY());
    setFocusTime(stored ? parseInt(stored, 10) : 0);
  }, []);

  useEffect(() => {
    setTimeRemaining(tasks[currentTaskIndex]?.duration || 45 * 60);
    setIsRunning(false);
  }, [currentTaskIndex, tasks.length]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((t) => t - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      handleTaskEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);


  // Play beep sound when timer changes
  useEffect(() => {
    if (isSoundEnabled && timeRemaining > 0 && timeRemaining % 60 === 0) {
      beepSound.current.play();
    }
  }, [timeRemaining, isSoundEnabled]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleAddMinute = () => setTimeRemaining((t) => Math.min(t + 60, 7200));
  const handleSubtractMinute = () => setTimeRemaining((t) => Math.max(t - 60, 0));
  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(tasks[currentTaskIndex]?.duration || 45 * 60);
  };
  const handlePrevTask = () => {
    if (currentTaskIndex > 0) setCurrentTaskIndex((i) => i - 1);
  };
  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) setCurrentTaskIndex((i) => i + 1);
    else setShowTaskManager(true);
  };
  const handleTaskEnd = () => {
    setIsRunning(false);
    // Add completed duration to today's focus time
    const completed = tasks[currentTaskIndex]?.duration || 0;
    setFocusTime((prev) => prev + completed);
    
    // Remove the completed task
    const newTasks = tasks.filter((_, i) => i !== currentTaskIndex);
    setTasks(newTasks);
    
    // Reset to default state if no tasks left
    if (newTasks.length === 0) {
      setCurrentTaskIndex(0);
      setTimeRemaining(45 * 60);
      setShowTaskManager(true);
    } else {
      // Move to next task if available
      const nextIndex = Math.min(currentTaskIndex, newTasks.length - 1);
      setCurrentTaskIndex(nextIndex);
      setTimeRemaining(newTasks[nextIndex].duration);
      setIsRunning(true);
    }
  };
  const handleManageTasks = () => setShowTaskManager(true);

  // Add bookmark handler
  const handleAddBookmark = (type, timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return;
    const hour = h + m / 60;
    const label = type === "coffee" ? "Break" : 
                  type === "gym" ? "Gym" : 
                  type === "sleep" ? "Sleep" : 
                  type === "wake" ? "Wake Up" : type;
    setBookmarks((prev) => [...prev, { type, hour, label }]);
  };

  // Remove bookmark handler
  const handleRemoveBookmark = (index) => {
    setBookmarks((prev) => prev.filter((_, i) => i !== index));
  };

  // TaskManager logic
  const handleAddTask = (task) => {
    const newTasks = [...tasks, { label: task.label, duration: task.duration, startTimestamp: Date.now() }];
    setTasks(newTasks);
    setShowTaskManager(false);
  };
  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);

    // If we're deleting the current task
    if (index === currentTaskIndex) {
      if (newTasks.length > 0) {
        const nextIndex = Math.min(index, newTasks.length - 1);
        setCurrentTaskIndex(nextIndex);
        setTimeRemaining(newTasks[nextIndex].duration);
      } else {
        setCurrentTaskIndex(0);
        setTimeRemaining(45 * 60);
        setShowTaskManager(true);
      }
    } else if (index < currentTaskIndex) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };
  const handleReorderTasks = (fromIndex, toIndex) => {
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);
    setTasks(newTasks);
    if (currentTaskIndex === fromIndex) setCurrentTaskIndex(toIndex);
    setShowTaskManager(false);
  };

  const handleEditTaskLabel = (newLabel) => {
    setTasks(tasks => {
      const updated = [...tasks];
      updated[currentTaskIndex] = { ...updated[currentTaskIndex], label: newLabel };
      return updated;
    });
  };

  // Reset today's focus time
  const handleResetFocusTime = () => {
    setFocusTime(0);
    localStorage.setItem(FOCUS_KEY(), 0);
  };

  const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, "0");
  const seconds = String(timeRemaining % 60).padStart(2, "0");
  const canScrollPrev = currentTaskIndex > 0;
  const canScrollNext = currentTaskIndex < tasks.length - 1;
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  return (
    <div className={`app-root-layout ${isTamagotchiMode ? 'tamagotchi-mode' : ''}`}>
      <div className={`navbar ${isTamagotchiMode ? 'tamagotchi-navbar' : ''}`}>
        <span className={`logo ${isTamagotchiMode ? 'tamagotchi-logo' : ''}`}>
        {isTamagotchiMode ? (
          <img 
            src= {pixelatedWave} 
            alt="Flow Pixel Logo" 
            style={{
              width: '85px',
              height: 'auto',
              marginBottom:'0.8em',
              filter: 'drop-shadow(2px 4px 8px rgba(230, 230, 230, 0.88))'
            }} 
          />
        ) : (          
          <svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" height="512"  viewBox="0 0 592.495 592.495" width="75">
            <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
               <feDropShadow dx="2" dy="4" stdDeviation="8" flood-color="rgba(18, 18, 18, 0.88)" />
             </filter>
           </defs>
           <g filter="url(#shadow)"><path d="m164.684 288.504c-5.469-.005-9.964-4.318-10.196-9.782-.95-23.91 7.148-47.299 22.678-65.502 4.87-6.08 10.312-11.679 16.251-16.72 4.237-3.725 10.692-3.31 14.417.927s3.31 10.692-.927 14.417c-.092.081-.186.161-.282.239-4.935 4.193-9.458 8.848-13.508 13.901-12.373 14.388-18.876 32.906-18.216 51.871.239 5.637-4.136 10.4-9.773 10.639-.001 0-.002 0-.003 0z"></path><circle cx="234.955" cy="183.866" r="10.215"></circle><circle cx="30.647" cy="316.666" r="10.215"></circle><circle cx="388.186" cy="265.589" r="10.215"></circle><circle cx="429.048" cy="306.451" r="10.215"></circle><path d="m493.702 326.881c-16.862-.365-33.55 3.467-48.563 11.153-12.317 6.474-26.094 9.669-40.004 9.278-13.873.395-27.615-2.785-39.904-9.233-33.608-14.732-53.047-50.28-47.316-86.525 1.355-11.241 6.816-21.586 15.333-29.045 6.357-5.905 14.936-8.811 23.573-7.985 9.268 2.336 17.376 7.949 22.825 15.801 1.823 2.788 4.891 4.512 8.22 4.617 3.314.045 6.458-1.468 8.491-4.086 12.709-15.91 14.755-37.848 5.21-55.835-15.697-31.368-58.014-52.448-105.321-52.448-36.931 0-105.656 8.459-150.996 65.128-21.684 25.922-32.943 58.988-31.584 92.756.768 17.652-5.616 34.868-17.707 47.752-11.32 12.063-27.084 18.965-43.626 19.103h-1.256c-12.662.388-25.232-2.272-36.652-7.757-5.14-2.325-11.192-.043-13.517 5.098-.598 1.324-.908 2.759-.908 4.211v2.708c-.071 30.063 13.366 58.567 36.602 77.643 24.319 19.893 56.287 27.813 87.08 21.573 5.239-.951 10.558-1.393 15.882-1.322 13.581-.258 27.021 2.795 39.158 8.897 15.26 7.829 32.21 11.79 49.359 11.534 16.856.365 33.538-3.468 48.544-11.153 12.314-6.473 26.087-9.668 39.993-9.278 13.899-.389 27.665 2.804 39.974 9.273 15.004 7.692 31.687 11.527 48.544 11.158 16.862.365 33.55-3.467 48.563-11.153 25.238-12.37 54.779-12.37 80.017 0 15.013 7.686 31.701 11.519 48.563 11.153 5.638.004 10.212-4.564 10.216-10.203 0-.027 0-.055 0-.082-.33-45.915-21.3-132.731-98.793-132.731zm48.573 113.313c-30.67-14.876-66.465-14.878-97.136-.005-12.317 6.474-26.094 9.669-40.004 9.278-13.903.391-27.673-2.804-39.984-9.278-15.002-7.687-31.681-11.52-48.533-11.153-16.859-.367-33.545 3.468-48.553 11.158-12.313 6.468-26.082 9.661-39.984 9.273-13.775.405-27.424-2.737-39.636-9.123-19.442-9.721-55.644-27.823-55.644-62.384 0-5.642-4.574-10.215-10.215-10.215-5.642 0-10.215 4.574-10.215 10.215.119 19.409 8.227 37.913 22.416 51.157-5.05.139-10.08.683-15.043 1.626-24.799 5.036-50.55-1.316-70.161-17.308-15.164-12.446-25.203-30.049-28.195-49.436 9.669 2.65 19.666 3.912 29.691 3.746h1.467c22.074-.17 43.116-9.372 58.228-25.464 15.895-16.902 24.297-39.503 23.303-62.684-1.096-28.831 8.577-57.038 27.135-79.13 37.99-47.496 94.405-57.462 135.037-57.462 45.663 0 77.126 21.334 87.035 41.156 3.825 7.024 4.773 15.26 2.644 22.969-7.165-6.655-16.108-11.085-25.743-12.754-14.421-1.616-117.637-9.55-144.902 57.133-11.676 26.057-10.374 56.096 3.512 81.045 18.505 32.951 59.307 58.126 106.483 65.707.538.087 1.082.131 1.626.13 5.642-.009 10.208-4.59 10.198-10.232-.008-5.009-3.647-9.273-8.593-10.069-41.161-6.614-76.377-27.898-91.899-55.541-10.882-19.503-11.779-43.033-2.414-63.308 16.051-39.261 53.333-48.244 82.327-48.809-10.063 10.202-16.619 23.341-18.721 37.516-7.375 45.399 16.814 90.057 58.868 108.684 14.984 7.664 31.638 11.483 48.464 11.113 16.862.365 33.55-3.467 48.563-11.153 12.461-6.523 26.394-9.719 40.452-9.278 62.723-.005 74.951 73.378 77.331 101.665-10.201-1.059-20.111-4.039-29.205-8.785z"></path></g>
          </svg> 
        )}
         Flow
        </span>
      </div>
      <div className="main-layout">
        <div className="timer-panel">
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', position: 'relative' }}>
              {/* Focus Time Display */}
              <div style={{fontWeight: 600, fontSize: '1.1rem', color: '#fff', marginRight: '1.5rem',fontFamily: isTamagotchiMode ? "'Minecraftia', monospace" : 'inherit', letterSpacing: '0.08em', textShadow: isTamagotchiMode ? '0 0 5px #fdfdfdff' : 'none'  }}>
                Today's Focus Time: {formatFocusTime(focusTime)}
              </div>

                <BookmarkOptions onAddBookmark={handleAddBookmark} isTamagotchiMode={isTamagotchiMode} />

              <button 
                className={`tamagotchi-toggle ${isTamagotchiMode ? 'active' : ''}`}
                onClick={() => setIsTamagotchiMode(!isTamagotchiMode)}
                title="Switch Mode"
              >
                <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="24px"
    height="24px"
    fillRule="nonzero"
  >
    <g
      fill="#dadada"
      fillRule="nonzero"
      stroke="none"
      strokeWidth="1"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="10"
      fontFamily="none"
      fontWeight="none"
      fontSize="none"
      textAnchor="none"
      style={{ mixBlendMode: "normal" }}
    >
      <g transform="scale(10.66667,10.66667)">
        <path d="M2,2v19h11v-5h-6v-9h14v-5zM9,9v5h6v7h6v-12z" />
      </g>
    </g>
  </svg>
              </button>
              {/* to reset Focus Time Button */}
              <button style={{marginLeft: 'auto', background: '#222', color: '#fff', border: '1px solid #b2b2b2', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 500, cursor: 'pointer' }} onClick={handleResetFocusTime}>
                Reset Focus Time
              </button>
            </div>
            <div className="timer-card" style={{
              opacity: isTaskCompleting ? 0 : 1,
              transform: isTaskCompleting ? 'translateY(20px)' : 'translateY(0)',
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
            }}>
              <Timer
                label={tasks.length === 0 ? "Add task to get started" : tasks[currentTaskIndex]?.label || "Add Task"}
                minutes={minutes}
                seconds={seconds}
                isRunning={isRunning}
                onStart={handleStart}
                onPause={handlePause}
                onPrev={handlePrevTask}
                onNext={handleNextTask}
                onAddMinute={handleAddMinute}
                onSubtractMinute={handleSubtractMinute}
                onManageTasks={handleManageTasks}
                canScrollPrev={canScrollPrev}
                canScrollNext={canScrollNext}
                onAddBookmark={handleAddBookmark}
                onEditTaskLabel={handleEditTaskLabel}
                onReset={handleReset}
              />
            </div>
            {showTaskManager && (
              <div className="task-manager-modal-window">
                <div className="task-manager-modal-inner">
                  <TaskManager
                    tasks={tasks}
                    onAdd={handleAddTask}
                    onDelete={handleDeleteTask}
                    onReorder={handleReorderTasks}
                    onClose={() => setShowTaskManager(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="timeline-sidebar">
          <Timeline bookmarks={bookmarks} currentHour={currentHour} onRemoveBookmark={handleRemoveBookmark} />
        </div>
      </div>
      <Footer isTamagotchiMode={isTamagotchiMode} />
    </div>
);
}
