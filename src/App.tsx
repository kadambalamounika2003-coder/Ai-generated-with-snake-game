/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-digital overflow-hidden relative selection:bg-fuchsia-500/50 screen-tear">
      <div className="scanline-effect" />
      
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 border-b-4 border-fuchsia-500 pb-4">
          <div className="flex items-center gap-4">
            <Terminal className="text-cyan-400 animate-pulse" size={48} />
            <div className="flex items-center">
              <div className="w-8 h-12 bg-fuchsia-500 animate-ping mr-4" />
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white glitch-text">
                SYS.SNAKE_EXEC
              </h1>
            </div>
          </div>
          <div className="text-2xl text-fuchsia-500 tracking-widest border-4 border-cyan-400 px-4 py-2 bg-black glitch-text-slow hidden sm:block">
            STATUS: ONLINE
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative">
          {/* Right Side Glitch Artifacts */}
          <div className="absolute right-0 top-1/4 flex flex-col items-end gap-4 opacity-100 pointer-events-none z-0 hidden lg:flex">
            <div className="w-16 h-6 bg-cyan-400 glitch-text" />
            <div className="w-32 h-2 bg-fuchsia-500 mr-8" />
            <div className="w-8 h-8 border-4 border-cyan-400 mr-12 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="w-48 h-8 bg-fuchsia-500 mt-16 glitch-text" />
            <div className="w-6 h-6 bg-white mr-24" />
            <div className="w-12 h-4 border-2 border-cyan-400 mr-4 mt-8" />
          </div>

          {/* Game Section */}
          <div className="flex-shrink-0 z-10">
            <SnakeGame />
          </div>

          {/* Player Section */}
          <div className="w-full max-w-md flex flex-col gap-8 z-10">
            <div className="space-y-4 border-l-8 border-cyan-400 pl-6">
              <h2 className="text-4xl font-bold text-fuchsia-500 tracking-widest glitch-text-slow flex items-center gap-4">
                <span className="w-6 h-6 bg-cyan-400 animate-pulse" />
                AUDIO_STREAM
              </h2>
              <div className="text-cyan-400 text-2xl leading-relaxed font-digital">
                <p>&gt; NEURAL_LINK_ESTABLISHED.</p>
                <p>&gt; INITIATING_AUDIO_PLAYBACK.</p>
                <p>&gt; MAINTAIN_SNAKE_INTEGRITY.</p>
              </div>
            </div>
            
            <MusicPlayer />
          </div>
        </main>
      </div>
    </div>
  );
}

