import React, { useEffect, useRef } from 'react';
import { Music } from 'lucide-react';
import './TamagotchiMode.css';

const TamagotchiMode = ({ 
  isSoundEnabled, 
  setIsSoundEnabled
}) => {
  const clickSoundRef = useRef(null);

  // Play click sound when enabled
  const handleClick = () => {
    if (isSoundEnabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(e => console.log("Sound play aborted", e));
    }
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <>
      {/* Sound Toggle */}
      <button 
        className={`sound-toggle ${isSoundEnabled ? 'active' : ''}`}
        onClick={handleClick}
        title={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
      >
        <Music size={16} />
      </button>
      
      {/* Hidden audio element for click sounds */}
      <audio 
        ref={clickSoundRef} 
        src="/clickbeep.mp3" 
        preload="auto"
      />
    </>
  );
};

export default TamagotchiMode;