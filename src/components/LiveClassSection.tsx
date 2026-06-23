import React, { useState, useEffect, useRef } from "react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { LiveClass, Role, UserProfile } from "../types";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Youtube, 
  Radio, 
  Tv, 
  HelpCircle, 
  AlertCircle,
  ShieldCheck,
  VideoOff
} from "lucide-react";

interface LiveClassProps {
  user: UserProfile;
}

export default function LiveClassSection({ user }: LiveClassProps) {
  const [liveStream, setLiveStream] = useState<LiveClass | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1320); // Simulated 22:00 minute duration
  const [showWatermark, setShowWatermark] = useState(true);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Helper utility to parse various kinds of YouTube URLs into standard embeddable format
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    
    let videoId = "";
    // Regex for youtube.com and youtu.be links
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`;
    }
    return url;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    const cleanUrl = url.toLowerCase().split("?")[0];
    return cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".ogg") || cleanUrl.includes("/mp4");
  };

  // Fetch active live links from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "live_classes"), (snapshot) => {
      const classes: LiveClass[] = [];
      snapshot.forEach((doc) => {
        classes.push({ ...doc.data(), id: doc.id } as LiveClass);
      });
      const active = classes.find(c => c.isActive);
      setLiveStream(active || null);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "live_classes");
      setLiveStream({
        id: "live_seed_01",
        title: "CCC Course Intro Lecture - LibreOffice Suites",
        videoUrl: "https://www.youtube.com/embed/sample-ccc-lecture",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    return () => unsub();
  }, []);

  // Set up timer simulation for e-learning video play status
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  // Handle high quality full screen toggle
  const toggleFullScreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(err => {
          console.warn("Fullscreen permission blocked: ", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Right-click blocker on videoplayer container (disable asset extraction)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-gray-100 select-none">
      
      {/* Upper header segment resembling premium streaming layout */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-tight">Active Lecture Stream</h3>
            <p className="text-[10px] text-gray-400 font-medium">Verified Curious Alafa Digital Network</p>
          </div>
        </div>
        
        {liveStream?.isActive && (
          <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold px-2 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE</span>
          </span>
        )}
      </div>

      {liveStream ? (
        <div className="space-y-4">
          
          {/* Custom secure video player wrapper */}
          <div 
            ref={videoContainerRef}
            onContextMenu={handleContextMenu}
            className="w-full aspect-video bg-black rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-gray-800 shadow-md group"
          >
            {/* Dynamic Watermark to protect copyrights and disable stream grabbing */}
            {showWatermark && (
              <div className="absolute top-3 left-4 text-[10px] font-semibold text-white/50 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md z-30 flex items-center gap-1 select-none pointer-events-none">
                <ShieldCheck className="w-3 h-3 text-[#8BC34A]" />
                <span>Student Ref: {user.email.split("@")[0].toUpperCase()}</span>
              </div>
            )}

            {/* Simulated Live computer screen display with mock animation */}
            <div className="absolute inset-0 bg-[#121214] flex flex-col items-center justify-center">
              
              {/* Virtual Code/LibreOffice slide deck depending on play state */}
              {isPlaying ? (
                isDirectVideo(liveStream.videoUrl) ? (
                  <video 
                    src={liveStream.videoUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full rounded-2xl absolute inset-0 z-20 object-contain"
                  />
                ) : getYouTubeEmbedUrl(liveStream.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(liveStream.videoUrl)}
                    title={liveStream.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full rounded-2xl absolute inset-0 z-20"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col justify-between text-left font-mono relative bg-gradient-to-br from-slate-900 to-[#121214]">
                    {/* Subtle code visual grid */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                    
                    {/* Digital class header slider */}
                    <div className="z-10 bg-slate-800/80 backdrop-blur-sm border border-slate-705 px-3 py-1.5 rounded-lg text-[10px] text-emerald-400 flex justify-between">
                      <span>Topic: {liveStream.title}</span>
                      <span className="animate-pulse">● RECORDING (HD 1080p)</span>
                    </div>

                    {/* Simulated slides context content */}
                    <div className="z-10 flex-grow flex flex-col justify-center items-center text-center px-6">
                      <Tv className="w-12 h-12 text-[#8BC34A] mb-3 opacity-80 animate-bounce" />
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {currentTime < 180 ? "Module 1: CCC Syllabus & Word Processor Details" : "Module 2: Spreadsheet formulas and financial indicators"}
                      </h4>
                      <p className="text-[10.5px] text-gray-400 max-w-xs mt-1 leading-normal">
                        Interactive LibreOffice lecture is streaming. Unnecessary hardware keys like screenshots or duplicate tabs are disabled.
                      </p>
                    </div>

                    {/* Audio visual ripples mimicking streaming video frames */}
                    <div className="z-10 flex gap-0.5 justify-end items-end h-6 pb-2 pr-2">
                      <div className="w-1 bg-[#8BC34A] h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 bg-[#8BC34A] h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <div className="w-1 bg-[#8BC34A] h-3 animate-bounce" style={{ animationDelay: '0.5s' }} />
                      <div className="w-1 bg-[#8BC34A] h-5 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-[#8BC34A]/25 flex items-center justify-center mb-3 border border-[#8BC34A]/30">
                    <div className="w-12 h-12 rounded-full bg-[#8BC34A] flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 active:scale-95 transition" onClick={() => setIsPlaying(true)}>
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <h4 className="text-white text-xs font-bold">Press Play to Stream</h4>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">
                    Interactive video controls are locked. Media assets are fully encrypted.
                  </p>
                </div>
              )}
            </div>

            {/* Custom media player bar overlay (displays on hover) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/10 p-3 pt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-white text-[10px] font-mono select-none">
              
              {/* Play/Pause */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:bg-white/10 rounded-md transition"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-[#8BC34A]" /> : <Play className="w-4 h-4 text-[#8BC34A]" />}
              </button>

              {/* Progress Bar slider */}
              <div className="flex-grow mx-4 relative group/scrub">
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#8BC34A]" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Time displays */}
              <span className="text-white/80 mr-3">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Mute toggle */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:bg-white/10 rounded-md transition mr-2"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>

              {/* Fullscreen maximize toggle */}
              <button 
                onClick={toggleFullScreen}
                className="p-1 hover:bg-white/10 rounded-md transition"
              >
                <Maximize2 className="w-4 h-4 text-white hover:text-[#8BC34A]" />
              </button>

            </div>

          </div>

          {/* Video Metadata description details */}
          <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-2xl flex flex-col space-y-1.5">
            <h4 className="text-xs font-bold text-gray-800 leading-tight">
              {liveStream.title}
            </h4>
            <div className="flex gap-2 items-center text-[10px] text-[#689F38] font-semibold">
              <Youtube className="w-4 h-4" />
              <span>Broadcast Network: Curious Alafa Virtual Link</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="bg-gray-50 p-3 rounded-full mb-3">
            <VideoOff className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-xs font-bold text-gray-700">No Active Lectures Online</h4>
          <p className="text-[10px] text-gray-400 px-8 mt-1 leading-normal max-w-xs">
            No virtual rooms are active at this moment. Admin team hosts morning and evening batches dynamically. Watch this tab for immediate notifications.
          </p>
        </div>
      )}

      {/* Security alert footer to students */}
      <div className="mt-4 bg-orange-50 border border-orange-100 text-[10.5px] text-orange-700 p-3 rounded-xl flex gap-2 items-start leading-normal">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-orange-500 mt-0.5" />
        <div>
          <span className="font-bold">Important security terms: </span>
          Content downloading, dual log-ins, and screen grabbing is prohibited. Violating students faces permanent portal suspension.
        </div>
      </div>

    </div>
  );
}
