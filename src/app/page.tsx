"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Compass,
  Search,
  Heart,
  Clock,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  X,
  Upload,
  Cpu,
  History,
  BookOpenText,
  ChevronDown,
  Layers,
  Zap,
  Accessibility,
  Play,
  Wand,
  Feather,
  Rocket
} from "lucide-react";
import { compressImage, calculateReadingTime } from "./utils/image-utils";
import DualLayerButton from "./components/DualLayerButton";

// Story Style structure
interface StoryStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  badgeClass: string;
}

const STORY_STYLES: StoryStyle[] = [
  {
    id: "whimsical",
    name: "Whimsical",
    description: "Playful, magical, fairy-tale like",
    icon: Sparkles,
    colorClass: "border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-800",
    badgeClass: "bg-amber-100/70 text-amber-800 border-amber-200/60"
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Exploratory, daring, inspiring",
    icon: Compass,
    colorClass: "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800",
    badgeClass: "bg-emerald-100/70 text-emerald-800 border-emerald-200/60"
  },
  {
    id: "mystery",
    name: "Mystery",
    description: "Intriguing, suspenseful, full of secrets",
    icon: Search,
    colorClass: "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-800",
    badgeClass: "bg-indigo-100/70 text-indigo-800 border-indigo-200/60"
  },
  {
    id: "emotional",
    name: "Emotional",
    description: "Deeply moving, touching, reflective",
    icon: Heart,
    colorClass: "border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-800",
    badgeClass: "bg-rose-100/70 text-rose-800 border-rose-200/60"
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Epic, mythical, magical realms",
    icon: Wand,
    colorClass: "border-violet-200 bg-violet-50/50 hover:bg-violet-50 text-violet-800",
    badgeClass: "bg-violet-100/70 text-violet-800 border-violet-200/60"
  },
  {
    id: "scifi",
    name: "Sci-Fi",
    description: "Futuristic, space wonder, technology",
    icon: Rocket,
    colorClass: "border-cyan-200 bg-cyan-50/50 hover:bg-cyan-50 text-cyan-800",
    badgeClass: "bg-cyan-100/70 text-cyan-800 border-cyan-200/60"
  },
  {
    id: "nostalgic",
    name: "Nostalgic",
    description: "Vintage memories, classic reflections",
    icon: History,
    colorClass: "border-orange-200 bg-orange-50/50 hover:bg-orange-50 text-orange-800",
    badgeClass: "bg-orange-100/70 text-orange-800 border-orange-200/60"
  },
  {
    id: "poetic",
    name: "Poetic",
    description: "Dreamy, lyrical, abstract thoughts",
    icon: Feather,
    colorClass: "border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-800",
    badgeClass: "bg-teal-100/70 text-teal-800 border-teal-200/60"
  }
];

interface GeneratedStory {
  id: string;
  title: string;
  story: string;
  moods: string[];
  style: string;
  timestamp: number;
  imageUrl: string;
}

// Background hand-drawn star decoration
function VectorStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="#F15A5A" opacity="0.6" />
    </svg>
  );
}

// Background curvy trail dotted line
function DottedArrowCurve() {
  return (
    <svg className="absolute hidden lg:block top-[-10px] left-[42%] w-[220px] h-[100px] pointer-events-none overflow-visible z-0" viewBox="0 0 220 100" fill="none">
      <path
        d="M20,90 C80,80 120,20 200,60"
        stroke="#F15A5A"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Arrow tip */}
      <path d="M195,54 L201,60 L194,65" stroke="#F15A5A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  );
}

// Left hand side dotted trail
function DottedCurveLeft() {
  return (
    <svg className="absolute hidden lg:block top-[20%] left-[2%] w-[120px] h-[150px] pointer-events-none overflow-visible z-0" viewBox="0 0 120 150" fill="none">
      <path
        d="M10,10 C60,40 20,110 80,140"
        stroke="#F5A623"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

// Botanical Watercolor Branches (leafs behind the book)
function BotanicalLeaves() {
  return (
    <svg className="absolute bottom-[20px] left-[-35px] w-[160px] h-[220px] pointer-events-none overflow-visible z-0 select-none opacity-80" viewBox="0 0 160 220" fill="none">
      <path d="M30,200 C50,150 80,80 120,20" stroke="#8F9F81" strokeWidth="2.5" strokeLinecap="round" />
      {/* Leaves left */}
      <path d="M50,160 C40,150 30,155 35,165 C40,175 50,170 50,160 Z" fill="#9DB28C" />
      <path d="M70,120 C60,110 50,115 55,125 C60,135 70,130 70,120 Z" fill="#9DB28C" />
      <path d="M90,80 C80,70 70,75 75,85 C80,95 90,90 90,80 Z" fill="#9DB28C" />
      {/* Leaves right */}
      <path d="M55,170 C65,160 75,165 70,175 C65,185 55,180 55,170 Z" fill="#9DB28C" />
      <path d="M75,130 C85,120 95,125 90,135 C85,145 75,140 75,130 Z" fill="#9DB28C" />
      <path d="M95,90 C105,80 115,85 110,95 C105,105 95,100 95,90 Z" fill="#9DB28C" />
      <path d="M115,50 C125,40 135,45 130,55 C125,65 115,60 115,50 Z" fill="#9DB28C" />
      {/* Top bud */}
      <path d="M120,20 C120,10 125,15 125,20 C125,25 120,25 120,20 Z" fill="#8F9F81" />
    </svg>
  );
}

function BotanicalLeavesRight() {
  return (
    <svg className="absolute bottom-[-10px] left-[120px] w-[140px] h-[180px] pointer-events-none overflow-visible z-0 select-none opacity-60" viewBox="0 0 140 180" fill="none">
      <path d="M20,160 C40,120 70,70 100,20" stroke="#8F9F81" strokeWidth="2" strokeLinecap="round" />
      <path d="M40,130 C32,122 25,125 28,133 C31,141 40,138 40,130 Z" fill="#9DB28C" />
      <path d="M60,95 C52,87 45,90 48,98 C51,106 60,103 60,95 Z" fill="#9DB28C" />
      <path d="M80,60 C72,52 65,55 68,63 C71,71 80,68 80,60 Z" fill="#9DB28C" />
      <path d="M45,140 C53,132 61,135 58,143 C55,151 45,148 45,140 Z" fill="#9DB28C" />
      <path d="M65,105 C73,97 81,100 78,108 C75,116 65,113 65,105 Z" fill="#9DB28C" />
      <path d="M85,70 C93,62 101,65 98,73 C95,81 85,78 85,70 Z" fill="#9DB28C" />
    </svg>
  );
}

// Inkwell and Quill SVG
function InkwellAndQuill() {
  return (
    <div className="absolute bottom-[2px] right-[-24px] w-24 h-24 pointer-events-none select-none z-30">
      <svg className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)]" viewBox="0 0 100 100" fill="none">
        {/* Inkpot base (dark glass jar) */}
        <path d="M32,68 C32,64 36,60 40,60 L60,60 C64,60 68,64 68,68 L64,88 C64,90 60,92 56,92 L44,92 C40,92 36,90 36,88 Z" fill="#202A35" />
        <ellipse cx="50" cy="62" rx="12" ry="2" fill="#151D25" />
        
        {/* Glass reflection */}
        <path d="M38,70 L39,85 C39,87 41,88 43,88" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.12" />
        
        {/* Golden metallic neck ring */}
        <rect x="43" y="52" width="14" height="6" rx="1.5" fill="#D4AF37" />
        <ellipse cx="50" cy="52" rx="7" ry="1.5" fill="#B5942D" />

        {/* Quill Feather (inserted in neck) */}
        {/* Quill shaft */}
        <path d="M50,53 C53,40 59,25 72,6" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
        
        {/* Feather vanes (soft brown/gold) */}
        <path
          d="M72,6 C70,13 67,20 63,26 C59,32 55,36 54,41 C53,44 53,47 53,50 L55,50 C55,47 56,44 57,40 C59,36 64,30 69,24 C74,18 78,12 80,6 Z"
          fill="#C6A98A"
          opacity="0.9"
        />
        <path
          d="M72,6 C73,13 75,20 77,26 C79,32 83,36 84,41 C85,44 85,47 85,50 L83,50 C83,47 82,44 81,40 C79,36 75,30 71,24 C67,18 64,12 62,6 Z"
          fill="#B79E81"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

// Torn Paper Bottom Edge divider
function TornPaperDivider() {
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none transform translate-y-1">
      <svg className="relative block w-full h-[24px]" viewBox="0 0 1200 24" preserveAspectRatio="none" fill="currentColor">
        <path
          d="M0,15 L18,11 L35,16 L53,9 L70,18 L88,11 L105,17 L122,12 L140,19 L158,10 L175,15 L193,8 L210,18 L228,11 L245,16 L263,9 L280,18 L298,11 L315,16 L333,9 L350,18 L368,11 L385,16 L403,9 L420,18 L438,11 L455,16 L473,9 L490,18 L508,11 L525,16 L543,9 L560,18 L578,11 L595,16 L613,9 L630,18 L648,11 L665,16 L683,9 L700,18 L718,11 L735,16 L753,9 L770,18 L788,11 L805,16 L823,9 L840,18 L858,11 L875,16 L893,9 L910,18 L928,11 L945,16 L963,9 L980,18 L998,11 L1015,16 L1033,9 L1050,18 L1068,11 L1085,16 L1103,9 L1120,18 L1138,11 L1155,16 L1173,9 L1190,18 L1200,12 L1200,24 L0,24 Z"
          className="text-white"
        />
      </svg>
    </div>
  );
}

export default function PixelTaleApp() {
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressedData, setCompressedData] = useState<{
    base64: string;
    mimeType: string;
    originalSize: number;
    compressedSize: number;
  } | null>(null);

  // App logic state
  const [selectedStyle, setSelectedStyle] = useState<string>("whimsical");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState<GeneratedStory | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<GeneratedStory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Navigation scroll observer
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll target refs
  const heroRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const generatorRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      if (featuresRef.current && scrollPos >= featuresRef.current.offsetTop) {
        setActiveSection("features");
      } else if (generatorRef.current && scrollPos >= generatorRef.current.offsetTop) {
        setActiveSection("generator");
      } else if (howItWorksRef.current && scrollPos >= howItWorksRef.current.offsetTop) {
        setActiveSection("how-it-works");
      } else {
        setActiveSection("hero");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToRef = (ref: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
    if (ref.current) {
      const topOffset = ref.current.offsetTop - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth"
      });
    }
  };

  // Simulated loading checkmarks
  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      const t1 = setTimeout(() => setLoadingStep(1), 2500);
      const t2 = setTimeout(() => setLoadingStep(2), 5500);
      const t3 = setTimeout(() => setLoadingStep(3), 8500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setLoadingStep(0);
    }
  }, [loading]);

  // Load session history on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("pixeltale_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history from sessionStorage", e);
      }
    }
  }, []);

  // Save history helper
  const saveToHistory = (newStory: GeneratedStory) => {
    const updated = [newStory, ...history].slice(0, 10);
    setHistory(updated);
    sessionStorage.setItem("pixeltale_history", JSON.stringify(updated));
  };

  // Drag and Drop hook
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError("This image exceeds the 8 MB upload limit. Please choose a smaller file.");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      const result = await compressImage(file);
      setCompressedData(result);
    } catch (e: any) {
      console.error(e);
      setError("Failed to process and compress image. Please try another image.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxFiles: 1
  });

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setCompressedData(null);
    setError(null);
    setCurrentStory(null);
  };

  // Generate Story Action
  const generateStory = async () => {
    if (!compressedData) {
      // Trigger file selector programmatically if no file selected
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      } else {
        setError("Please upload an image first.");
      }
      return;
    }
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: compressedData.base64,
          mimeType: compressedData.mimeType,
          genre: selectedStyle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate story from server.");
      }

      const newStory: GeneratedStory = {
        id: Math.random().toString(36).substring(2, 9),
        title: data.title,
        story: data.story,
        moods: data.moods,
        style: selectedStyle,
        timestamp: Date.now(),
        imageUrl: imagePreview || ""
      };

      setCurrentStory(newStory);
      saveToHistory(newStory);

      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#F15A5A", "#F5A623", "#8F9F81", "#E67E22"]
      });

    } catch (e: any) {
      console.error(e);
      setError(e.message || "We couldn't generate a story right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = currentStory
      ? `"${currentStory.title}"\n\n${currentStory.story}\n\nMoods: ${currentStory.moods.join(", ")}`
      : `"The Cabin by the Lake"\n\nAs the last rays of sunlight kissed the mountain peaks, the little cabin by the lake glowed like a secret only nature knew. The trees whispered in the evening breeze, and the water held the sky in a gentle embrace...`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-cozy-bg flex flex-col font-sans relative antialiased">
      
      {/* 1. Header Navigation */}
      <header className="w-full border-b border-cozy-slate/10 bg-cozy-bg/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          
          {/* Logo brand */}
          <button onClick={() => scrollToRef(heroRef)} className="flex items-center gap-2.5 cursor-pointer text-left">
            {/* Real SVG Logo with gold/red gradient */}
            <div className="h-8 w-9 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 36 32" fill="none">
                <path d="M4,28 C10,28 14,24 17,24 L17,2.5 C14,2.5 10,6 4,6 Z" fill="#EE9825" />
                <path d="M19,2.5 C22,2.5 26,6 32,6 L32,28 C26,28 22,24 19,24 Z" fill="#F15A5A" />
              </svg>
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-cozy-slate">
              Pixel<span className="text-primary">Tale</span>
            </span>
          </button>

          {/* Centered link nodes */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-cozy-slate/80">
            <button onClick={() => scrollToRef(howItWorksRef)} className="hover:text-primary transition-colors cursor-pointer">
              How it Works
            </button>
            <button onClick={() => scrollToRef(featuresRef)} className="hover:text-primary transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToRef(generatorRef)} className="hover:text-primary transition-colors cursor-pointer">
              Playground
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) {
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth"
                      });
                    }, 100);
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-cozy-slate/15 bg-white hover:bg-gray-50 transition-all text-cozy-slate shadow-sm"
              >
                <History className="h-3.5 w-3.5 text-primary" />
                <span>History ({history.length})</span>
              </button>
            )}
            
            <button
              onClick={() => scrollToRef(generatorRef)}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <Sparkles className="h-3 w-3 fill-current text-white/90" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Cozy Hero Section (Visual Presentation Only) */}
      <section
        ref={heroRef}
        className="relative w-full bg-gradient-to-b from-[#FCFAF6] to-[#FFF9F6] pt-16 pb-24 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden"
      >
        {/* Background stars and dotted path overlays */}
        <DottedArrowCurve />
        <DottedCurveLeft />
        
        <VectorStar className="absolute top-[8%] left-[8%] w-5 h-5 pointer-events-none" />
        <VectorStar className="absolute top-[28%] right-[44%] w-4 h-4 pointer-events-none" />
        <VectorStar className="absolute top-[18%] right-[46%] w-3 h-3 pointer-events-none" />
        <VectorStar className="absolute bottom-[20%] left-[45%] w-4 h-4 pointer-events-none" />

        <div className="max-w-[1360px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Column: Context, Features, Actions */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFDCD3] text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5 text-secondary fill-current" />
              <span>AI-Powered Story Generator</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-[72px] leading-[1.06] font-normal text-cozy-slate tracking-tight">
                Turn Photos <br />
                Into <span className="text-primary">Stories.</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed max-w-xl">
                Upload a photo, choose a storytelling style, and let AI weave a short story inspired by your image.
              </p>
            </div>

            {/* Recreated 3-item Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 pb-2">
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/15 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                  <Sparkles className="h-5 w-5 fill-current" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-cozy-slate">AI Vision</h4>
                  <p className="text-[10px] text-gray-400 font-light leading-snug">Understands every detail</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-cozy-slate">Beautiful Stories</h4>
                  <p className="text-[10px] text-gray-400 font-light leading-snug">100–220 word narratives</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-cozy-slate">Multiple Styles</h4>
                  <p className="text-[10px] text-gray-400 font-light leading-snug">Whimsical, Adventure, Mystery & more</p>
                </div>
              </div>

            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <button
                onClick={() => scrollToRef(generatorRef)}
                className="group relative inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3.5 px-7 rounded-full shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Generate Your Story</span>
                <Sparkles className="h-4 w-4 fill-current text-white/90 animate-pulse" />
              </button>

              <button
                onClick={() => scrollToRef(howItWorksRef)}
                className="inline-flex items-center gap-2.5 text-xs font-bold text-cozy-slate hover:text-primary transition-colors cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* Social Proof ratings */}
            <div className="flex items-center gap-3 pt-6">
              <div className="flex -space-x-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User 1" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User 2" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="User 3" />
              </div>
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Sparkles className="h-3 w-3 fill-current" />
                  <Sparkles className="h-3 w-3 fill-current" />
                  <Sparkles className="h-3 w-3 fill-current" />
                  <Sparkles className="h-3 w-3 fill-current" />
                  <Sparkles className="h-3 w-3 fill-current" />
                </div>
                <p className="text-[10px] text-gray-400 font-semibold leading-none">Loved by storytellers everywhere</p>
              </div>
            </div>

          </div>

          {/* Right Column: Recreated Visual Mockup (Static Showcase) */}
          <div className="lg:col-span-6 relative w-full flex flex-col items-center justify-center py-8">
            
            {/* Botanical Foliage behind book */}
            <BotanicalLeaves />
            <BotanicalLeavesRight />

            {/* 1. Rotated Photo Card (Static Preview) */}
            <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl bg-white p-2 border border-cozy-slate/5 shadow-2xl transform -rotate-3 z-10">
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-gray-50 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/cabin_lake.png"
                  alt="Mockup cabin on the lake sunset background"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 2. Open Paper Book (Static Preview) */}
            <div className="relative w-full max-w-[450px] min-h-[380px] h-auto rounded-3xl bg-[#FFFDFB] shadow-2xl border border-cozy-slate/10 overflow-hidden transform rotate-2 -mt-20 z-20 flex">
              
              {/* Paper Fold Crevice shadow */}
              <div className="absolute inset-y-0 left-[50%] -translate-x-1/2 w-4 bg-gradient-to-r from-transparent via-black/8 to-transparent pointer-events-none z-10" />

              {/* Bookmark Ribbon */}
              <div className="absolute right-6 top-0 w-4 h-16 pointer-events-none z-10 shadow-sm">
                <svg className="w-full h-full" viewBox="0 0 16 64" fill="none">
                  <path d="M0,0 L16,0 L16,56 L8,48 L0,56 Z" fill="#F15A5A" />
                </svg>
              </div>

              {/* Left Page: Holds the Story Text */}
              <div className="w-[50%] p-6 pr-3 flex flex-col justify-between h-full bg-[#FFFDFB] text-left select-text relative">
                <div className="space-y-3 pr-1">
                  
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 uppercase tracking-wider">Peaceful</span>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100 uppercase tracking-wider">Nature</span>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100 uppercase tracking-wider font-semibold">Golden Hour</span>
                  </div>

                  <h3 className="font-serif font-bold text-base md:text-lg text-cozy-slate leading-tight font-serif tracking-tight">
                    The Cabin by the Lake
                  </h3>

                  <p className="font-story font-light text-[10px] md:text-[11px] text-gray-600 leading-relaxed font-light font-serif">
                    As the last rays of sunlight kissed the mountain peaks, the little cabin by the lake glowed like a secret only nature knew. The trees whispered in the evening breeze, and the water held the sky in a gentle embrace...
                  </p>

                </div>

                {/* Left Page Actions footer */}
                <div className="flex items-center justify-between border-t border-cozy-slate/5 pt-3 text-[9px] font-semibold text-gray-400">
                  <div className="flex items-center gap-1 font-light">
                    <Clock className="h-3 w-3 text-gray-300" />
                    <span>1 min read</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer"
                      title="Copy Story"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-green-500 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Page: Holds decorative Quill/Inkpot details */}
              <div className="w-[50%] pl-3 relative bg-[#FFFDFB] h-full">
                {/* Inkpot vector sitting inside the page */}
                <InkwellAndQuill />
              </div>

            </div>

          </div>

        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 cursor-pointer pointer-events-auto"
            onClick={() => scrollToRef(howItWorksRef)}
          >
            <span className="text-[9px] text-cozy-slate/30 uppercase tracking-widest font-semibold">How it Works</span>
            <ChevronDown className="h-4 w-4 text-cozy-slate/30" />
          </motion.div>
        </div>

        {/* Torn paper divider edge */}
        <TornPaperDivider />
      </section>

      {/* 3. Rebuilt "How it Works" workspace section */}
      <section
        ref={howItWorksRef}
        className="w-full bg-white px-6 md:px-12 lg:px-24 py-24 scroll-mt-12 text-center"
      >
        <div className="max-w-[1360px] mx-auto space-y-16">
          
          <div className="max-w-xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-1 text-primary text-xs font-bold uppercase tracking-wider">
              <span>✦</span>
              <span>Process Flow</span>
              <span>✦</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-normal text-cozy-slate tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Transform snapshots into beautiful custom-styled prose in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Step 1 */}
            <div className="space-y-4 text-center p-6 border border-cozy-slate/5 rounded-3xl hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-[#FFF0EB] text-primary font-bold flex items-center justify-center text-lg mx-auto shadow-sm">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-cozy-slate">Upload a Photo</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs mx-auto">
                Drag and drop or click to upload your snapshot. Our canvas compression engine automatically shrinks it to keep upload speeds blazing fast.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center p-6 border border-cozy-slate/5 rounded-3xl hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-[#FFF9F6] text-secondary font-bold flex items-center justify-center text-lg mx-auto shadow-sm">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-cozy-slate">Select a Style</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs mx-auto">
                Choose between Whimsical, Adventure, Mystery, or Emotional styles. Each style alters the prompt's narrative parameters for custom output styles.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center p-6 border border-cozy-slate/5 rounded-3xl hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-[#8F9F81]/15 text-[#8F9F81] font-bold flex items-center justify-center text-lg mx-auto shadow-sm">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-cozy-slate">AI Weaves the Narrative</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs mx-auto">
                Gemini 3.5 Flash reviews visual components—colors, items, expressions, and scenery—and outputs a beautifully formatted creative short story.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Dedicated Interactive Generator Section */}
      <section
        ref={generatorRef}
        className="w-full bg-[#FCFAF6] border-t border-cozy-slate/5 px-6 md:px-12 lg:px-24 py-24 scroll-mt-12"
      >
        <div className="max-w-[1360px] mx-auto space-y-12">
          
          <div className="max-w-xl mx-auto space-y-3 text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">Interactive Playground</span>
            <h2 className="text-3xl md:text-5xl font-serif font-normal text-cozy-slate tracking-tight">
              Create Your Story
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Drag and drop an image below, choose a storytelling style, and generate a story.
            </p>
          </div>

          {/* Interactive Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch pt-4">
            
            {/* Left Side: Upload Control & Style Options */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-white border border-cozy-slate/10 p-8 rounded-3xl shadow-sm">
              
              <div className="space-y-6">
                <span className="text-xs font-bold text-cozy-slate/50 uppercase tracking-widest block">Step 1: Upload Image</span>
                
                {/* Upload uploader box */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary bg-gray-50/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <div className="space-y-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Workspace template preview"
                        className="h-44 w-full object-cover rounded-xl border border-gray-100"
                      />
                      <span className="text-xs text-primary font-semibold block hover:underline">Click or drag to change image</span>
                    </div>
                  ) : (
                    <div className="py-6 space-y-3">
                      <Upload className="h-10 w-10 text-gray-300 mx-auto" />
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-cozy-slate block">Drag and drop photo here</span>
                        <span className="text-[10px] text-gray-400 block">or click to browse from files (JPEG, PNG, WebP)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold text-cozy-slate/50 uppercase tracking-widest block">Step 2: Choose Style</span>
                  <div className="flex flex-wrap gap-2">
                    {STORY_STYLES.map((style) => {
                      const StyleIcon = style.icon;
                      const isSelected = selectedStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-[11px] font-semibold cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? "bg-primary border-primary text-white shadow-sm"
                              : "bg-white border-gray-200 text-cozy-slate hover:bg-gray-50"
                          }`}
                        >
                          <StyleIcon className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-gray-400"}`} />
                          <span>{style.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Error display */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-start gap-2">
                  <X className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 3: Trigger button */}
              <button
                onClick={generateStory}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loading ? "Generating Tale..." : "Generate Your Story"}</span>
                <Sparkles className="h-4 w-4 fill-current text-white/95" />
              </button>

            </div>

            {/* Right Side: Generated Output Card */}
            <div className="lg:col-span-7 relative flex items-center justify-center min-h-[400px]">
              
              <AnimatePresence mode="wait">
                {loading ? (
                  /* Floating loader steps */
                  <motion.div
                    key="workspace-loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-[450px] bg-white border border-gray-100 rounded-3xl p-8 shadow-xl space-y-6 text-left"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-secondary">
                      <Sparkles className="h-5 w-5 text-secondary fill-current animate-spin" />
                      <span>AI Analyzing Snapshot...</span>
                    </div>

                    <ul className="space-y-3.5 text-xs text-gray-500 font-medium">
                      <li className="flex items-center gap-2.5">
                        {loadingStep >= 1 ? (
                          <Check className="h-4.5 w-4.5 text-green-500 stroke-[3]" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-secondary/80 animate-ping ml-1.5 mr-1" />
                        )}
                        <span className={loadingStep >= 1 ? "text-gray-800 line-through opacity-50" : ""}>Reading the scene</span>
                      </li>
                      
                      <li className="flex items-center gap-2.5">
                        {loadingStep >= 2 ? (
                          <Check className="h-4.5 w-4.5 text-green-500 stroke-[3]" />
                        ) : (
                          <div className={`h-2 w-2 rounded-full bg-secondary/80 ml-1.5 mr-1 ${loadingStep >= 1 ? "animate-ping" : "opacity-45"}`} />
                        )}
                        <span className={loadingStep >= 2 ? "text-gray-800 line-through opacity-50" : ""}>Finding hidden details</span>
                      </li>

                      <li className="flex items-center gap-2.5">
                        {loadingStep >= 3 ? (
                          <Check className="h-4.5 w-4.5 text-green-500 stroke-[3]" />
                        ) : (
                          <div className={`h-2 w-2 rounded-full bg-secondary/80 ml-1.5 mr-1 ${loadingStep >= 2 ? "animate-ping" : "opacity-45"}`} />
                        )}
                        <span className={loadingStep >= 3 ? "text-gray-800 line-through opacity-50" : ""}>Imagining the story</span>
                      </li>
                    </ul>

                    {/* Progress slider bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-primary h-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 10, ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                ) : currentStory ? (
                  /* Recreated Open Book with the output */
                  /* Horizontal Story Card Layout */
                  <motion.div
                    key="workspace-story"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-[640px] min-h-[380px] h-auto rounded-3xl bg-[#FFFDFB] shadow-xl border border-cozy-slate/10 overflow-hidden p-8 flex flex-col justify-between text-left"
                  >
                    {/* Soft watermarked leaf/feather in the corner */}
                    <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
                      <BookOpen className="h-28 w-28 text-primary" />
                    </div>

                    <div className="space-y-5 select-text relative z-10">
                      {/* Top Header Row: Mood tags & reading time */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cozy-slate/5 pb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {currentStory.moods.slice(0, 3).map((mood, mIdx) => {
                            const styleConfig = STORY_STYLES.find(s => s.id === selectedStyle) || STORY_STYLES[0];
                            return (
                              <span
                                key={mIdx}
                                className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${styleConfig.badgeClass}`}
                              >
                                {mood}
                              </span>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                          <Clock className="h-3.5 w-3.5 text-gray-300" />
                          <span>{calculateReadingTime(currentStory.story)} read</span>
                        </div>
                      </div>

                      {/* Story Title */}
                      <h3 className="font-serif font-bold text-2xl md:text-3xl text-cozy-slate leading-tight tracking-tight">
                        {currentStory.title}
                      </h3>

                      {/* Story Body - Spanning full horizontal width */}
                      <p className="font-story font-light text-sm md:text-base text-gray-600 leading-relaxed font-serif pt-1">
                        {currentStory.story}
                      </p>
                    </div>

                    {/* Bottom Actions footer */}
                    <div className="flex flex-wrap items-center justify-between border-t border-cozy-slate/5 pt-5 mt-6 text-xs font-semibold text-gray-400 relative z-10 gap-3">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleCopy}
                          className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Copy Story"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-green-500 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>Copy Story</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={generateStory}
                          className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Regenerate Story"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Regenerate</span>
                        </button>
                      </div>

                      <button
                        onClick={clearImage}
                        className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer text-primary/80"
                        title="Start Over"
                      >
                        <X className="h-4 w-4" />
                        <span>New Image</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Empty state workspace placeholder */
                  <motion.div
                    key="workspace-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-dashed border-cozy-slate/20 bg-white/40 rounded-3xl p-8 min-h-[300px] max-w-[400px] flex flex-col items-center justify-center text-center gap-5 shadow-sm w-full"
                  >
                    <div className="h-16 w-16 rounded-full bg-white border border-cozy-slate/10 flex items-center justify-center shadow-md relative">
                      <BookOpenText className="h-7 w-7 text-primary animate-pulse" />
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-secondary"></span>
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <h3 className="font-serif font-bold text-cozy-slate text-lg">Awaiting Your Inspiration</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        Upload a photo and pick a style on the left, then click Generate to begin.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Service Bento Grid */}
      <section
        ref={featuresRef}
        className="w-full bg-white px-6 md:px-12 lg:px-24 py-24 border-y border-cozy-slate/5 scroll-mt-6"
      >
        <div className="max-w-[1360px] mx-auto space-y-16">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-cozy-slate tracking-tight">
              Crafted with Technical Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Gemini */}
            <div className="p-8 rounded-3xl bg-[#FCFAF6] border border-cozy-slate/10 flex flex-col justify-between h-64 hover:border-primary/45 transition-colors">
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-100/50 border border-amber-200/50 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-cozy-slate">Gemini 3.5 Flash</h3>
              </div>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Utilizes Gemini 3.5 Flash for high-speed, cost-efficient, and instruction-compliant story generation.
              </p>
            </div>

            {/* Bento Card 2: Compression */}
            <div className="p-8 rounded-3xl bg-[#FCFAF6] border border-cozy-slate/10 flex flex-col justify-between h-64 hover:border-secondary/45 transition-colors">
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-100/50 border border-blue-200/50 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-cozy-slate">Canvas Compression</h3>
              </div>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Client-side canvas engine automatically shrinks uploads by up to 95%, protecting bandwidth and API execution speed.
              </p>
            </div>

            {/* Bento Card 3: Accessibility */}
            <div className="p-8 rounded-3xl bg-[#FCFAF6] border border-cozy-slate/10 flex flex-col justify-between h-64 hover:border-[#8F9F81]/45 transition-colors">
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                  <Accessibility className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-cozy-slate">Fully Accessible</h3>
              </div>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Engineered with semantic HTML structure, proper focus ring states, and ARIA announcement support.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Session History Drawer (Bottom collapsible list) */}
      {showHistory && history.length > 0 && (
        <section className="w-full bg-white border-t border-cozy-slate/15 px-6 md:px-12 lg:px-24 py-12 scroll-mt-6">
          <div className="max-w-[1360px] mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-cozy-slate/10 pb-4">
              <h3 className="font-serif font-semibold text-lg text-cozy-slate flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-primary animate-pulse" />
                <span>Local Session History</span>
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto max-h-[350px] pr-2">
              {history.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setCurrentStory(story);
                    setImagePreview(story.imageUrl);
                    setSelectedStyle(story.style);
                    scrollToRef(generatorRef);
                    
                    fetch(story.imageUrl)
                      .then(res => res.blob())
                      .then(blob => {
                        const file = new File([blob], "history-image.jpg", { type: blob.type });
                        setSelectedFile(file);
                        return compressImage(file);
                      })
                      .then(res => setCompressedData(res))
                      .catch(err => console.error("Could not sync history file", err));
                  }}
                  className="group relative cursor-pointer border border-cozy-slate/10 rounded-2xl overflow-hidden bg-[#FCFAF6] hover:border-primary/50 transition-all flex flex-col justify-between hover:shadow-sm"
                >
                  <div className="p-4 flex gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-cozy-slate/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                    <div className="overflow-hidden space-y-1">
                      <h4 className="font-semibold text-xs text-cozy-slate truncate group-hover:text-primary transition-all">
                        {story.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed font-light font-serif">
                        {story.story}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-cozy-slate/5 bg-white flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-primary/80 capitalize">{story.style}</span>
                    <span className="text-[9px] text-gray-400">
                      {new Date(story.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Minimalist Footer */}
      <footer className="w-full bg-cozy-slate text-white border-t border-white/5 relative z-10">
        
        {/* Top Footer Section: Large CTA Card */}
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 py-16">
          <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Start Today</span>
              <h2 className="text-2xl md:text-3xl font-serif font-normal text-white tracking-tight">
                Every picture has a story waiting to be told.
              </h2>
            </div>
            
            <button
              onClick={() => scrollToRef(generatorRef)}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-6 rounded-full shadow-md active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <span>Generate Now</span>
              <Sparkles className="h-3.5 w-3.5 fill-current text-white/90" />
            </button>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs text-white/50 font-light">
          <div className="flex items-center gap-2">
            {/* Real SVG Logo with gold/red gradient */}
            <div className="h-6 w-7 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 36 32" fill="none">
                <path d="M4,28 C10,28 14,24 17,24 L17,2.5 C14,2.5 10,6 4,6 Z" fill="#EE9825" />
                <path d="M19,2.5 C22,2.5 26,6 32,6 L32,28 C26,28 22,24 19,24 Z" fill="#F15A5A" />
              </svg>
            </div>
            <span className="font-serif font-bold text-sm tracking-tight text-white">
              Pixel<span className="text-primary">Tale</span>
            </span>
          </div>
          <p>© {new Date().getFullYear()} PixelTale. All rights reserved.</p>
        </div>

      </footer>

    </div>
  );
}
