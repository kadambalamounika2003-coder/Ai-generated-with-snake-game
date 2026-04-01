import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  { id: '1', title: 'Cyber Synth 1', artist: 'AI Generator Alpha', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Neon Pulse', artist: 'AI Generator Beta', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Digital Horizon', artist: 'AI Generator Gamma', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-fuchsia-500 p-8 relative">
      {/* Decorative corner pieces */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-8 border-l-8 border-cyan-400 -mt-2 -ml-2" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-8 border-r-8 border-cyan-400 -mb-2 -mr-2" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-6 mb-8 border-b-4 border-cyan-400 pb-8">
        <div className="w-20 h-20 bg-cyan-400 flex items-center justify-center animate-pulse">
          <Music className="text-black" size={40} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white text-4xl font-bold truncate glitch-text-slow">
            {currentTrack.title}
          </h3>
          <p className="text-fuchsia-500 text-2xl truncate mt-2">
            &gt; {currentTrack.artist}
          </p>
        </div>
        {/* Visualizer bars */}
        <div className="flex items-end gap-2 h-16">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-4 bg-fuchsia-500"
              style={{ 
                height: isPlaying ? '100%' : '20%',
                animation: isPlaying ? `eq ${0.2 + i * 0.1}s steps(3) infinite alternate` : 'none',
                transformOrigin: 'bottom'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-6 w-full bg-black border-4 border-cyan-400 mb-8 relative">
        <div 
          className="h-full bg-fuchsia-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-400 hover:text-white transition-colors">
            {isMuted ? <VolumeX size={36} /> : <Volume2 size={36} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32 accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={playPrev}
            className="text-fuchsia-500 hover:text-white transition-colors"
          >
            <SkipBack size={40} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center bg-cyan-400 hover:bg-white text-black transition-colors"
          >
            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
          </button>
          <button 
            onClick={playNext}
            className="text-fuchsia-500 hover:text-white transition-colors"
          >
            <SkipForward size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}
