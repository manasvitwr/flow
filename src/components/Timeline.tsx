import React from "react";
import { Clock, Coffee, Dumbbell, Moon, Sun } from "lucide-react";

const HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

const ICONS = {
  coffee: <Coffee size={20} />, gym: <Dumbbell size={20} />, sleep: <Moon size={20} />, wake: <Sun size={20} />
};

export default function Timeline({ bookmarks = [], currentHour, onRemoveBookmark }) {
  return (
    <div className="timeline-outer">
      <div className="timeline-label">Your Day</div>
      <div className="timeline-bar">
        {HOURS.map((h) => (
          <div key={h} className="timeline-tick" style={{ top: `${(h / 24) * 100}%` }}>
            <span className="timeline-hour">{h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}</span>
          </div>
        ))}
        {/* Avatar at current time */}
        <div className="timeline-avatar" style={{ top: `${(currentHour / 24) * 100}%` }}>
          <span className="timeline-you">You</span>
          <img src="/src/assets/icons/avatar.svg" alt="You" />
        </div>
        {/* Bookmarks */}
        {bookmarks.map((bm, i) => (
          <div
            key={i}
            className="timeline-bookmark"
            style={{ top: `${(bm.hour / 24) * 100}%`, cursor: 'pointer' }}
            title={bm.label || bm.type}
            onClick={() => onRemoveBookmark && onRemoveBookmark(i)}
          >
            {ICONS[bm.type]}
          </div>
        ))}
      </div>
    </div>
  );
}
