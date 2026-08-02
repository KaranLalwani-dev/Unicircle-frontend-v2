import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TRACKS = [
  "/audio1.mp3",
  "/audio2.mp3",
  "/audio3.mp3",
];

export default function AudioPlayer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasManuallyPaused, setHasManuallyPaused] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down more than 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
        
        // Auto-play logic
        if (!hasManuallyPaused && audioRef.current && audioRef.current.paused) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(e => {
            // Browsers may block auto-play without prior user interaction
            console.log("Auto-play blocked by browser. Needs user interaction first.");
          });
        }
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasManuallyPaused]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setHasManuallyPaused(true);
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  // When track changes and isPlaying is true, play the new track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[currentTrackIndex];
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    }
  }, [currentTrackIndex]);
  
  // Also listen for audio ending to autoplay next
  useEffect(() => {
    const audioEl = audioRef.current;
    const handleEnded = () => {
      playNext();
    };
    if (audioEl) {
      audioEl.addEventListener("ended", handleEnded);
    }
    return () => {
      if (audioEl) {
        audioEl.removeEventListener("ended", handleEnded);
      }
    }
  }, []);

  // Simple animated heights for the visualizer
  const bars = isPlaying 
    ? ["h-2", "h-3", "h-1.5", "h-2.5"] // active animation could be CSS, but this gives a static playing look
    : ["h-1", "h-1", "h-1", "h-1"];

  return (
    <>
      <audio ref={audioRef} src={TRACKS[currentTrackIndex]} preload="metadata" />
      
      <div 
        className={`fixed bottom-4 sm:bottom-6 left-1/2 z-[100] w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] max-w-[860px] p-1.5 sm:p-2 md:p-2.5 px-3.5 sm:px-5 bg-zinc-900/80 border-2 border-zinc-800 rounded-full shadow-lg text-white flex items-center justify-between gap-2 sm:gap-3 select-none transition-all duration-500 backdrop-blur-md ${
          isVisible 
            ? "opacity-100 -translate-x-1/2 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-x-1/2 translate-y-8 pointer-events-none"
        }`}
      >
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="ml-2 sm:ml-4 font-sans font-bold tracking-wider uppercase leading-none text-[15px] sm:text-[18px] md:text-[22px] pt-0.5 text-white cursor-pointer transition-colors duration-200 hover:text-[#e2b857] whitespace-nowrap"
          aria-label="Scroll to top"
        >
          UNICIRCLE
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-[1.5px] h-3 w-4 pb-0.5">
            {/* Visualizer bars */}
            <span className={`w-[1.5px] bg-[#e2b857] rounded-full transition-all duration-200 ${isPlaying ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'h-1'}`} style={isPlaying ? { height: '80%' } : {}}></span>
            <span className={`w-[1.5px] bg-[#e2b857] rounded-full transition-all duration-200 ${isPlaying ? 'animate-[pulse_0.8s_ease-in-out_infinite_0.1s]' : 'h-1'}`} style={isPlaying ? { height: '100%' } : {}}></span>
            <span className={`w-[1.5px] bg-[#e2b857] rounded-full transition-all duration-200 ${isPlaying ? 'animate-[pulse_1.2s_ease-in-out_infinite_0.3s]' : 'h-1'}`} style={isPlaying ? { height: '60%' } : {}}></span>
            <span className={`w-[1.5px] bg-[#e2b857] rounded-full transition-all duration-200 ${isPlaying ? 'animate-[pulse_0.9s_ease-in-out_infinite_0.2s]' : 'h-1'}`} style={isPlaying ? { height: '90%' } : {}}></span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={playPrev}
              className="hover:text-white text-zinc-400 transition duration-200 border border-zinc-800 rounded p-1 bg-transparent cursor-pointer flex items-center justify-center" 
              aria-label="Previous Song"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={togglePlay}
              className="text-white hover:bg-white hover:text-black transition duration-200 uppercase font-mono text-[9px] sm:text-[10px] border border-zinc-800 rounded px-1.5 py-0.5 bg-transparent cursor-pointer min-w-[40px] text-center"
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <button 
              onClick={playNext}
              className="hover:text-white text-zinc-400 transition duration-200 border border-zinc-800 rounded p-1 bg-transparent cursor-pointer flex items-center justify-center" 
              aria-label="Next Song"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
