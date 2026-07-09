"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Calendar, 
  Share2, 
  Play, 
  Check, 
  ArrowRight, 
  Lock, 
  Zap,
  TrendingUp,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X as CloseIcon
} from "lucide-react";

// Custom SVG Brand Icons
const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} style={props.style}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} style={props.style}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} style={props.style}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={props.style}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Home() {
  // Tabs & Prompt
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");
  const [prompt, setPrompt] = useState(
    "Cinematic drone shot of neon-lit Tokyo streets in rain, cyberpunk style, high-speed camera"
  );
  
  // Real Video Config State
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [stylePreset, setStylePreset] = useState("Cyberpunk Cinematic");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [resolution, setResolution] = useState("720p");

  // Real API Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [generationError, setGenerationError] = useState("");

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Social Account Linking State
  const [connectedAccounts, setConnectedAccounts] = useState({
    youtube: true,
    instagram: true,
    linkedin: false,
    twitter: true,
  });

  // Scheduled Posts
  const [scheduledCount, setScheduledCount] = useState(3);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Prompt defaults when toggling tabs
  useEffect(() => {
    if (activeTab === "video") {
      setPrompt("Cinematic drone shot of neon-lit Tokyo streets in rain, cyberpunk style, high-speed camera");
    } else {
      setPrompt("Minimalist glassmorphic concept card showing AI node connections, vibrant violet and blue gradient background, 3D render");
    }
    setHasGenerated(false);
    setGeneratedVideoUrl("");
    setGeneratedImageUrl("");
    setGenerationError("");
    setGenerationProgress(0);
  }, [activeTab]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const toggleConnection = (platform: "youtube" | "instagram" | "linkedin" | "twitter") => {
    setConnectedAccounts(prev => {
      const nextState = !prev[platform];
      triggerToast(nextState ? `Connected to ${platform.toUpperCase()}` : `Disconnected ${platform.toUpperCase()}`);
      return { ...prev, [platform]: nextState };
    });
  };

  // Real dynamic polling flow for Google Veo API
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    setHasGenerated(false);
    setGenerationError("");
    setGenerationProgress(5);
    setGenerationStep("Submitting prompt to Google Veo API...");
    setGeneratedVideoUrl("");

    try {
      if (activeTab === "image") {
        // Fallback for image generation in Phase 1 (simulated result directly)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGeneratedImageUrl("SIMULATED_IMAGE");
        setIsGenerating(false);
        setHasGenerated(true);
        triggerToast("AI Image generated successfully!");
        return;
      }

      // 1. Submit Request to next.js backend generate endpoint
      const genResponse = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          aspectRatio,
          duration,
          style: stylePreset,
          resolution
        })
      });

      const genData = await genResponse.json();
      if (!genResponse.ok) {
        throw new Error(genData.error || "Failed to start video generation.");
      }

      const operationId = genData.operationId;
      setGenerationProgress(25);
      setGenerationStep("Video generation request accepted. Queued in Google LRO list...");

      // 2. Poll the status API periodically
      let pollCount = 0;
      pollIntervalRef.current = setInterval(async () => {
        try {
          pollCount++;
          // Simulated display step increments
          const currentMockProgress = Math.min(85, 25 + pollCount * 5);
          setGenerationProgress(currentMockProgress);
          setGenerationStep(`Rendering frames on Google TPU clusters (Check ${pollCount})...`);

          const statusResponse = await fetch("/api/video/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId })
          });

          const statusData = await statusResponse.json();
          if (!statusResponse.ok) {
            throw new Error(statusData.error || "Failed checking operation status.");
          }

          if (statusData.error) {
            throw new Error(statusData.error);
          }

          if (statusData.done) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setGeneratedVideoUrl(statusData.videoUrl);
            setGenerationProgress(100);
            setGenerationStep("Done!");
            setIsGenerating(false);
            setHasGenerated(true);
            triggerToast("Veo Video generated successfully!");
          }
        } catch (pollErr: any) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setIsGenerating(false);
          // Show user-friendly missing Veo access error
          const msg = pollErr?.message || "Generation error occurred.";
          if (msg.includes("permission") || msg.includes("access") || msg.includes("not enabled")) {
            setGenerationError("Google Veo API access required");
          } else {
            setGenerationError(msg);
          }
          triggerToast("Generation failed.");
        }
      }, 4000);

    } catch (err: any) {
      setIsGenerating(false);
      const msg = err?.message || "Generation error occurred.";
      if (msg.includes("permission") || msg.includes("access") || msg.includes("not enabled") || msg.includes("not configured")) {
        setGenerationError("Google Veo API access required");
      } else {
        setGenerationError(msg);
      }
      triggerToast("Generation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 z-50 glass rounded-xl p-4 flex items-center gap-3 transition-all duration-300 transform shadow-2xl ${
          showToast ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
        }`}
        id="notification-toast"
      >
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">System Alert</p>
          <p className="text-xs text-zinc-400">{toastMessage}</p>
        </div>
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[50%] h-[40%] bg-violet-950/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 w-full glass border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              FlugelClips
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#integrations" className="hover:text-white transition-colors">Social Links</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="#demo"
              id="btn-login"
              className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </a>
            <a 
              href="#demo"
              id="btn-nav-signup"
              className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl"></span>
              <span className="relative block px-4 py-2 text-sm font-semibold text-white bg-zinc-950 rounded-[11px] group-hover:bg-transparent transition-all duration-300">
                Get Started
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/5 text-xs text-purple-300 mb-6 animate-float">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Next-gen AI models are now live (Google Veo & Flux integration)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-gradient-purple">
            Turn Ideas into Viral Clips, Instantly
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Generate stunning short-form videos and eye-catching images with AI. Securely link social media profiles and automate your posting calendar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a 
              href="#demo" 
              id="btn-hero-cta"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-300 flex items-center gap-2 group"
            >
              Start Generating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#features" 
              id="btn-hero-secondary"
              className="px-8 py-4 glass text-zinc-300 hover:text-white font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/10"
            >
              Explore Features
            </a>
          </div>

          {/* Interactive Live Generator Demo Container */}
          <div className="mt-20 w-full max-w-5xl rounded-2xl glass-card p-4 md:p-6 border border-white/10 relative shadow-2xl" id="demo">
            {/* Ambient Backglow */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-2xl blur-xl pointer-events-none"></div>
            
            {/* Header controls inside mockup */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/5 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-black/40 rounded-lg p-1 border border-white/5">
                  <button 
                    onClick={() => setActiveTab("video")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                      activeTab === "video" 
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/10" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    AI Video Generator
                  </button>
                  <button 
                    onClick={() => setActiveTab("image")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                      activeTab === "image" 
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/10" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    AI Image Generator
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[10px] text-purple-400 font-mono bg-purple-500/5 px-2.5 py-1 rounded border border-purple-500/10">
                  <Cpu className="w-3 h-3" />
                  Google Veo & FLUX.1
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                API Engines Connected
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 text-left">
              {/* Settings Panel (Col 5) */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Prompt Input</label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 resize-none transition-all placeholder:text-zinc-600"
                      placeholder="Describe what you want the AI to create..."
                      required
                      id="input-prompt"
                    />
                  </div>

                  {activeTab === "video" && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Negative Prompt</label>
                      <input 
                        type="text"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600"
                        placeholder="e.g. low quality, blurry, text, watermark..."
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Aspect Ratio</label>
                      <select 
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50"
                        id="select-aspect-ratio"
                      >
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Shorts/Reels)</option>
                        <option value="1:1">1:1 (Square Feed)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Style Preset</label>
                      <select 
                        value={stylePreset}
                        onChange={(e) => setStylePreset(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50"
                        id="select-style"
                      >
                        <option value="Cyberpunk Cinematic">Cyberpunk Cinematic</option>
                        <option value="Vibrant 3D Render">Vibrant 3D Render</option>
                        <option value="Minimalist Vector Art">Minimalist Vector Art</option>
                        <option value="Photorealistic DSLR">Photorealistic DSLR</option>
                        <option value="None">None (Pure Prompt)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Resolution</label>
                      <select 
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50"
                        id="select-resolution"
                      >
                        <option value="720p">720p (Fast)</option>
                        <option value="1080p">1080p (HD)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-400 uppercase tracking-wider">Duration</span>
                        <span className="text-purple-400 font-semibold font-mono">{duration}s</span>
                      </div>
                      <select 
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50"
                        id="select-duration"
                      >
                        <option value={5}>5 Seconds</option>
                        <option value={8}>8 Seconds</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    id="btn-generate"
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        Generating via Google Veo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate with Google Veo
                      </>
                    )}
                  </button>
                </form>

                {/* Social Autopilot Simulator */}
                <div className="mt-2 bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-purple-400" />
                      Social Sync Channels
                    </span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-semibold">
                      OAuth Enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      onClick={() => toggleConnection("youtube")}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                        connectedAccounts.youtube 
                          ? "bg-red-500/10 border-red-500/30 text-red-400" 
                          : "bg-white/20 border-white/5 text-zinc-500 hover:bg-white/5"
                      }`}
                    >
                      <Youtube className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-semibold">YouTube</span>
                    </button>

                    <button 
                      onClick={() => toggleConnection("instagram")}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                        connectedAccounts.instagram 
                          ? "bg-pink-500/10 border-pink-500/30 text-pink-400" 
                          : "bg-white/20 border-white/5 text-zinc-500 hover:bg-white/5"
                      }`}
                    >
                      <Instagram className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-semibold">Insta</span>
                    </button>

                    <button 
                      onClick={() => toggleConnection("linkedin")}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                        connectedAccounts.linkedin 
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                          : "bg-white/20 border-white/5 text-zinc-500 hover:bg-white/5"
                      }`}
                    >
                      <Linkedin className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-semibold">LinkedIn</span>
                    </button>

                    <button 
                      onClick={() => toggleConnection("twitter")}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                        connectedAccounts.twitter 
                          ? "bg-sky-500/10 border-sky-500/30 text-sky-400" 
                          : "bg-white/20 border-white/5 text-zinc-500 hover:bg-white/5"
                      }`}
                    >
                      <Twitter className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-semibold">X (Twitter)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Rendering Sandbox / Live Preview (Col 7) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative aspect-video lg:aspect-auto lg:h-[400px] bg-black/60 rounded-xl overflow-hidden border border-white/10 flex flex-col items-center justify-center">
                  
                  {/* Default State */}
                  {!isGenerating && !hasGenerated && !generationError && (
                    <div className="flex flex-col items-center text-center p-6 gap-3">
                      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                        {activeTab === "video" ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                      </div>
                      <p className="text-sm font-semibold text-white">AI Media Studio</p>
                      <p className="text-xs text-zinc-500 max-w-sm">
                        Enter your prompt and configuration on the left and start generation. Powered by Google Veo.
                      </p>
                      <span className="text-[10px] text-zinc-600 mt-2">Powered by Google Veo</span>
                    </div>
                  )}

                  {/* Error State */}
                  {generationError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/90 z-20 text-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-white">Generation Failed</p>
                      <p className="text-xs text-red-400 max-w-md font-mono bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                        {generationError}
                      </p>
                      <button 
                        onClick={() => setGenerationError("")} 
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold rounded-lg transition-all"
                      >
                        Reset Studio
                      </button>
                    </div>
                  )}

                  {/* Generation Loading State */}
                  {isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/80 z-20">
                      <div className="w-full max-w-xs flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs font-mono text-purple-400">
                          <span>Google Veo Engine</span>
                          <span>{generationProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${generationProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] text-zinc-400 text-center font-mono mt-1 animate-pulse">
                          {generationStep}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rendered Output */}
                  {hasGenerated && !generationError && (
                    <div className="absolute inset-0 w-full h-full z-10 transition-all duration-500 overflow-hidden flex items-center justify-center bg-zinc-950">
                      {activeTab === "video" ? (
                        <div className="w-full h-full relative flex items-center justify-center bg-black">
                          {generatedVideoUrl ? (
                            <video 
                              src={generatedVideoUrl} 
                              controls 
                              autoPlay 
                              loop 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            /* Visual placeholder for successful API compilation if URL missing */
                            <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-tr from-purple-950/70 via-indigo-950/50 to-zinc-900">
                              <div className="z-10 flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-black/60 border border-purple-500/30 flex items-center justify-center text-purple-400 glow-purple animate-pulse cursor-pointer">
                                  <Play className="w-6 h-6 fill-purple-400 translate-x-0.5" />
                                </div>
                                <span className="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 border border-purple-500/20 rounded text-center">
                                  Google Veo Asset Rendered Successfully
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Player UI overlays */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-400 z-10 bg-black/60 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-sm pointer-events-none">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              0:00 / 0:05
                            </span>
                            <span>Google Veo MP4</span>
                          </div>
                        </div>
                      ) : (
                        /* Simulated Glassmorphism Image via rich layered cards and node links */
                        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-indigo-950 via-zinc-950 to-purple-950">
                          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          
                          {/* Generated vector card */}
                          <div className="w-[60%] h-[60%] rounded-xl glass-card border border-white/10 glow-indigo flex flex-col justify-between p-4 transform rotate-2 animate-float">
                            <div className="flex items-center justify-between">
                              <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                              </div>
                              <span className="text-[8px] font-mono text-zinc-500">NODE_v1.0</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="h-1.5 w-12 bg-white/20 rounded"></div>
                              <div className="h-1 w-20 bg-white/10 rounded"></div>
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-400 z-10 bg-black/60 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
                            <span>1024 x 1024</span>
                            <span className="text-indigo-400 font-semibold">PNG</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Automation & Calendar scheduling preview (Only after generation) */}
                <div className={`transition-all duration-500 ${hasGenerated ? "opacity-100 translate-y-0" : "opacity-50 pointer-events-none"}`}>
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-3.5 text-left">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        AI Copilot Copywriting
                      </span>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Below caption has been custom-drafted using GPT-4o corresponding to your asset styles and features.
                      </p>
                    </div>

                    <div className="bg-black/50 border border-white/5 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed font-mono">
                      {activeTab === "video" ? (
                        <span>
                          🌧️ Neon rain hitting Tokyo streets. A cinematic drone swoop down through cyberpunk skyscrapers. Built with FlugelClips. #cyberpunk #neon #tokyo #aiart #aivideo #motiondesign
                        </span>
                      ) : (
                        <span>
                          💎 Pure glassmorphism rendered using FLUX.1 models. Deep indigo shadows meeting neon highlights. Create yours now with FlugelClips! #ux #ui #glassmorphism #generativeart
                        </span>
                      )}
                    </div>

                    {/* Schedule Post Trigger */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs text-zinc-400 font-semibold">Schedule: Tomorrow, 10:00 AM</span>
                      </div>
                      <button 
                        onClick={() => {
                          setScheduledCount(prev => prev + 1);
                          triggerToast("Scheduled! Post added to your Content Calendar.");
                        }}
                        className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1"
                        id="btn-schedule-post"
                      >
                        Queue Publication
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-24 border-t border-white/5 scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Everything you need for Social Domination
            </h2>
            <p className="mt-4 text-zinc-400 text-base md:text-lg">
              Stop spending hours rendering clips manually. We compile, generate, caption, and schedule with high-fidelity APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Video Generation</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Produce cinematic video sequences from plain text using state-of-the-art models like Google Veo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Fidelity Image Engines</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Generate high-resolution social graphics, thumbnails, and feed posts using FLUX.1. Supports variable aspect ratios.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Social Auto-Post</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Link profiles securely. Post or schedule to X (Twitter), LinkedIn, YouTube, and Instagram via certified API channels.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart AI Captioning</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Let GPT-4o draft viral hooks, hashtags, and social descriptions optimized individually for each social media channel.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Content Calendar</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Organize, edit, reschedule, or cancel pending publications. View all drafts, posted items, and failure logs.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Autopilot Scheduling</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A background database cron queue automatically publishes your scheduled media to corresponding platforms at optimal hours.
              </p>
            </div>

          </div>
        </section>

        {/* SOCIAL CONNECTION CENTER MOCK */}
        <section id="integrations" className="py-24 border-t border-white/5 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/5 px-3 py-1.5 rounded-full border border-purple-500/15 inline-block mb-4">
                Secure Integrations
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                One-Click Account Linkage
              </h2>
              <p className="mt-6 text-zinc-400 text-sm md:text-base leading-relaxed">
                Our OAuth integration allows you to connect channels safely. Access tokens are encrypted inside the Supabase database using industry-grade AES-256 GCM encryption.
              </p>

              <div className="mt-8 flex flex-col gap-3 text-sm text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span>Full support for YouTube Shorts publishing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span>Instagram & Facebook Graph API verified client</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span>Automatic token refreshing in background</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Integrations Dashboard Grid */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col gap-4 text-left relative">
                
                {/* Visual Title */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-bold text-white">Connected Platforms</h3>
                    <p className="text-[10px] text-zinc-500">Enable or disable linked channels to manage autopost targets</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded">
                    Linked: {Object.values(connectedAccounts).filter(Boolean).length} / 4
                  </span>
                </div>

                {/* Connection entries */}
                <div className="flex flex-col gap-3">
                  
                  {/* YouTube */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">YouTube Shorts</span>
                        {connectedAccounts.youtube ? (
                          <span className="text-[10px] text-zinc-400">Linked as <strong className="text-zinc-300">FlugelClips Studio</strong></span>
                        ) : (
                          <span className="text-[10px] text-zinc-600">Disconnected</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleConnection("youtube")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                        connectedAccounts.youtube 
                          ? "bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500/20" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                      id="btn-link-youtube"
                    >
                      {connectedAccounts.youtube ? "Disconnect" : "Link Channel"}
                    </button>
                  </div>

                  {/* Instagram */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">Instagram Reels</span>
                        {connectedAccounts.instagram ? (
                          <span className="text-[10px] text-zinc-400">Linked as <strong className="text-zinc-300">@flugel.clips.ai</strong></span>
                        ) : (
                          <span className="text-[10px] text-zinc-600">Disconnected</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleConnection("instagram")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                        connectedAccounts.instagram 
                          ? "bg-pink-500/10 border-pink-500/25 text-pink-400 hover:bg-pink-500/20" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                      id="btn-link-instagram"
                    >
                      {connectedAccounts.instagram ? "Disconnect" : "Link Profile"}
                    </button>
                  </div>

                  {/* LinkedIn */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Linkedin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">LinkedIn Feed</span>
                        {connectedAccounts.linkedin ? (
                          <span className="text-[10px] text-zinc-400">Linked Profile</span>
                        ) : (
                          <span className="text-[10px] text-zinc-600">Disconnected</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleConnection("linkedin")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                        connectedAccounts.linkedin 
                          ? "bg-blue-500/10 border-blue-500/25 text-blue-400 hover:bg-blue-500/20" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                      id="btn-link-linkedin"
                    >
                      {connectedAccounts.linkedin ? "Disconnect" : "Link Profile"}
                    </button>
                  </div>

                  {/* X (Twitter) */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                        <Twitter className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">X (Twitter)</span>
                        {connectedAccounts.twitter ? (
                          <span className="text-[10px] text-zinc-400">Linked as <strong className="text-zinc-300">@FlugelClips</strong></span>
                        ) : (
                          <span className="text-[10px] text-zinc-600">Disconnected</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleConnection("twitter")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                        connectedAccounts.twitter 
                          ? "bg-sky-500/10 border-sky-500/25 text-sky-400 hover:bg-sky-500/20" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                      id="btn-link-twitter"
                    >
                      {connectedAccounts.twitter ? "Disconnect" : "Link Account"}
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section id="pricing" className="py-24 border-t border-white/5 scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/5 px-3 py-1.5 rounded-full border border-purple-500/15 inline-block mb-4">
              Simple Billing
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Choose your creative power
            </h2>
            <p className="mt-4 text-zinc-400 text-sm md:text-base">
              All plans include API rendering and scheduling tools. Subscriptions powered by Stripe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Free Plan */}
            <div className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-sm font-semibold text-zinc-400">Starter</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$0</span>
                    <span className="ml-1 text-sm text-zinc-500">/ month</span>
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">Perfect to test AI capabilities and explore sandbox features.</p>
                </div>
                
                <div className="h-px bg-white/5 w-full"></div>
                
                <ul className="flex flex-col gap-4 text-xs text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>10 credits per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Standard AI rendering (SDXL & Google Veo)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Link up to 2 social channels</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-600">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Autopilot Scheduling queue</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => triggerToast("Signed up for Free Tier (Simulated)")}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all border border-white/10"
                  id="btn-pricing-free"
                >
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Creator Plan (Popular) */}
            <div className="glass-card rounded-2xl p-8 border border-purple-500/25 flex flex-col justify-between text-left relative overflow-hidden bg-purple-500/5 glow-purple">
              {/* Popular Tag */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-full shadow-lg">
                Most Popular
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-sm font-semibold text-purple-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-purple-300" />
                    Creator
                  </span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$19</span>
                    <span className="ml-1 text-sm text-zinc-500">/ month</span>
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">For active builders publishing regular short-form clips.</p>
                </div>
                
                <div className="h-px bg-white/10 w-full"></div>
                
                <ul className="flex flex-col gap-4 text-xs text-zinc-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span><strong>150 credits</strong> per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>High-priority Flux & Google Veo engines</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Connect unlimited social accounts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Full Autopilot Scheduling queue</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>GPT-4o smart social copywriting</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => triggerToast("Redirecting to Stripe payment flow (Simulated)")}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all"
                  id="btn-pricing-creator"
                >
                  Subscribe Creator
                </button>
              </div>
            </div>

            {/* Agency Plan */}
            <div className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-sm font-semibold text-zinc-400">Agency</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$49</span>
                    <span className="ml-1 text-sm text-zinc-500">/ month</span>
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">For agencies managing cross-platform publishing pipelines.</p>
                </div>
                
                <div className="h-px bg-white/5 w-full"></div>
                
                <ul className="flex flex-col gap-4 text-xs text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span><strong>500 credits</strong> per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Maximum API rendering priority</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Unlimited accounts & agency sub-profiles</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Priority background cron scheduling</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Dedicated support & custom brand templates</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => triggerToast("Redirecting to Stripe payment flow (Simulated)")}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all border border-white/10"
                  id="btn-pricing-agency"
                >
                  Subscribe Agency
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-24 py-12 relative z-10 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              FlugelClips
            </span>
          </div>

          <p className="text-xs text-zinc-500">
            © 2026 FlugelClips Inc. All rights reserved. Powered by Google Veo, Flux, OpenAI & Supabase.
          </p>

          <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
