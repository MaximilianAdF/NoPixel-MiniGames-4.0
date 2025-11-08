"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, BookOpen, X, GripVertical, GripHorizontal, Clock } from "lucide-react";
import usePersistantState from "../utils/usePersistentState";
import { useMediaQuery } from "../utils/useMediaQuery";
import { useKeyboardShortcuts } from "../contexts/KeyboardShortcutsContext";
import { useGuide } from "../contexts/GuideContext";

interface GameInstructionsProps {
    gameId: string;
    title: string;
    children: React.ReactNode;
}

export default function GameInstructions({ gameId, title, children }: GameInstructionsProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { registerHandler, unregisterHandler } = useKeyboardShortcuts();
    const { setIsOpen: setGlobalIsOpen, setWidth: setGlobalWidth } = useGuide();
    const [isOpen, setIsOpen] = usePersistantState<boolean>(
        `game-instructions-${gameId}`,
        true // Default to open for first-time visitors (AdSense requirement)
    );
    
    // Track if component has mounted (client-side only)
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Use ref to track current isOpen state for keyboard shortcuts (avoids closure issues)
    const isOpenRef = useRef(isOpen);
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);
    
    const [activeSection, setActiveSection] = useState<string>("");
    const [scrollProgress, setScrollProgress] = useState(0);
    const desktopContentRef = useRef<HTMLDivElement>(null);
    const mobileContentRef = useRef<HTMLDivElement>(null);
    const [readingTime, setReadingTime] = useState(0);
    
    // Resizable panel state
    const [desktopWidth, setDesktopWidth] = usePersistantState<number>(
        `game-instructions-${gameId}-width`,
        380 // Default width
    );
    const [mobileHeight, setMobileHeight] = usePersistantState<number>(
        `game-instructions-${gameId}-height`,
        40 // Default 40vh
    );
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });

    // Swipe gesture state
    const [swipeStart, setSwipeStart] = useState<{ y: number; time: number } | null>(null);
    const [swipeDistance, setSwipeDistance] = useState(0);
    const SWIPE_THRESHOLD = 50; // Minimum distance for swipe
    const VELOCITY_THRESHOLD = 0.3; // Minimum velocity (pixels per millisecond)

    // Sync local state with global guide context (only on changes, not every render)
    useEffect(() => {
        setGlobalIsOpen(isOpen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // setGlobalIsOpen intentionally omitted to prevent loop

    useEffect(() => {
        if (!isMobile) {
            setGlobalWidth(desktopWidth);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desktopWidth, isMobile]); // setGlobalWidth intentionally omitted to prevent loop

    // Register keyboard shortcuts for guide
    useEffect(() => {
        // Register handler to toggle guide (use ref to get current state)
        registerHandler('openGuide', () => {
            setIsOpen(!isOpenRef.current);
        });

        // Register handler to close guide
        registerHandler('closeMenu', () => {
            setIsOpen(false);
        });

        // Cleanup
        return () => {
            unregisterHandler('openGuide');
            unregisterHandler('closeMenu');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerHandler, unregisterHandler]); // setIsOpen is captured in closure, don't need in deps

    // ESC key to close guide panel (now handled by keyboard shortcuts context)
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, setIsOpen]);

    // Calculate reading time on mount
    useEffect(() => {
        const ref = isMobile ? mobileContentRef.current : desktopContentRef.current;
        if (ref) {
            const text = ref.innerText || '';
            const words = text.trim().split(/\s+/).length;
            const minutes = Math.ceil(words / 200); // Average 200 words per minute
            setReadingTime(minutes);
        }
    }, [children, isMobile]);

    // Track scroll progress
    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            const scrollTop = target.scrollTop;
            const scrollHeight = target.scrollHeight - target.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            setScrollProgress(progress);
        };

        const content = isMobile ? mobileContentRef.current : desktopContentRef.current;
        if (content) {
            content.addEventListener('scroll', handleScroll);
            return () => content.removeEventListener('scroll', handleScroll);
        }
    }, [isOpen, isMobile]);

    // Close on mobile by default to not block the game
    useEffect(() => {
        if (isMobile && isOpen) {
            // On mobile, start closed to avoid blocking the game
            const mobileClosedKey = `game-instructions-${gameId}-mobile-closed`;
            const hasSeenBefore = localStorage.getItem(mobileClosedKey);
            if (!hasSeenBefore) {
                setIsOpen(false);
                localStorage.setItem(mobileClosedKey, "true");
            }
        }
    }, [isMobile, gameId, isOpen, setIsOpen]);

    // Desktop resize handlers
    const handleDesktopResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        resizeStartRef.current = {
            x: e.clientX,
            y: 0,
            width: desktopWidth,
            height: 0
        };
    };

    // Mobile resize handlers
    const handleMobileResizeStart = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        resizeStartRef.current = {
            x: 0,
            y: clientY,
            width: 0,
            height: mobileHeight
        };
    };

    // Resize move handler
    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isMobile) {
                // Desktop: resize width
                const delta = resizeStartRef.current.x - e.clientX;
                const newWidth = Math.min(Math.max(resizeStartRef.current.width + delta, 280), 600);
                setDesktopWidth(newWidth);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isMobile) {
                // Mobile: resize height
                const delta = resizeStartRef.current.y - e.touches[0].clientY;
                const viewportHeight = window.innerHeight;
                const newHeightPx = (resizeStartRef.current.height / 100) * viewportHeight + delta;
                const newHeightVh = Math.min(Math.max((newHeightPx / viewportHeight) * 100, 20), 70);
                setMobileHeight(newHeightVh);
            }
        };

        const handleResizeEnd = () => {
            setIsResizing(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('mouseup', handleResizeEnd);
        document.addEventListener('touchend', handleResizeEnd);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handleResizeEnd);
            document.removeEventListener('touchend', handleResizeEnd);
        };
    }, [isResizing, isMobile, setDesktopWidth, setMobileHeight]);

    // Swipe gesture handlers for mobile
    const handleSwipeStart = (e: React.TouchEvent) => {
        // Only handle swipes when not resizing
        if (isResizing) return;
        
        const touch = e.touches[0];
        setSwipeStart({ y: touch.clientY, time: Date.now() });
        setSwipeDistance(0);
    };

    const handleSwipeMove = (e: React.TouchEvent) => {
        if (!swipeStart || isResizing) return;

        const touch = e.touches[0];
        const distance = swipeStart.y - touch.clientY; // Negative = swipe down, Positive = swipe up
        setSwipeDistance(distance);
    };

    const handleSwipeEnd = () => {
        if (!swipeStart || isResizing) {
            setSwipeStart(null);
            setSwipeDistance(0);
            return;
        }

        const duration = Date.now() - swipeStart.time;
        const velocity = swipeDistance / duration; // pixels per millisecond

        // Swipe up to open (positive distance and velocity)
        if (swipeDistance > SWIPE_THRESHOLD && velocity > VELOCITY_THRESHOLD) {
            setIsOpen(true);
        }
        // Swipe down to close (negative distance and velocity)
        else if (swipeDistance < -SWIPE_THRESHOLD && velocity < -VELOCITY_THRESHOLD) {
            setIsOpen(false);
        }

        setSwipeStart(null);
        setSwipeDistance(0);
    };

    // Extract section headings from children for table of contents
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(sectionId);
        }
    };

    return (
        <>
            {/* Desktop: Side Panel */}
            {!isMobile && (
                <>
                    {/* Toggle Button - Always visible */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`
                            fixed top-1/2 -translate-y-1/2
                            w-12 h-24
                            bg-gradient-to-br from-[#0F1B21] to-[#1a2930]
                            border-2 border-[#54FFA4]/30
                            rounded-l-lg
                            flex items-center justify-center
                            hover:border-[#54FFA4]/60
                            ${isResizing ? '' : 'transition-all duration-300'}
                            z-30
                            group
                            ${!isMounted ? '!transition-none' : ''}
                        `}
                        style={isMounted ? { right: isOpen ? `${desktopWidth}px` : '0px' } : { right: '0px' }}
                        aria-label={isOpen ? "Hide instructions" : "Show instructions"}
                    >
                        {isMounted && (
                            <>
                                {isOpen ? (
                                    <ChevronRight className="w-6 h-6 text-[#54FFA4] group-hover:scale-110 transition-transform" />
                                ) : (
                                    <BookOpen className="w-6 h-6 text-[#54FFA4] group-hover:scale-110 transition-transform" />
                                )}
                            </>
                        )}
                    </button>

                    {/* Panel Content */}
                    <div
                        className={`
                            fixed top-0 right-0 h-full
                            bg-gradient-to-br from-[#0F1B21]/95 to-[#1a2930]/95
                            backdrop-blur-sm
                            ${isOpen ? 'border-l-2 border-[#54FFA4]/30' : ''}
                            ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}
                            ${!isMounted ? '!transition-none' : ''}
                            z-20
                            overflow-hidden
                        `}
                        style={isMounted ? { width: isOpen ? `${desktopWidth}px` : '0px' } : { width: '0px' }}
                    >
                        {/* Resize Handle */}
                        {isOpen && (
                            <div
                                onMouseDown={handleDesktopResizeStart}
                                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-[#54FFA4]/20 transition-colors z-10"
                            >
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-20 flex items-center justify-center">
                                    <GripVertical className="w-4 h-4 text-[#54FFA4]/40 group-hover:text-[#54FFA4]/80 transition-colors" />
                                </div>
                            </div>
                        )}

                        {/* Scroll Progress Bar */}
                        {isOpen && (
                            <div className="absolute left-2 top-0 bottom-0 w-1 bg-[#54FFA4]/10 rounded-full">
                                <div 
                                    className="w-full bg-gradient-to-b from-[#54FFA4] to-[#54FFA4]/60 rounded-full transition-all duration-150"
                                    style={{ height: `${scrollProgress}%` }}
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div ref={desktopContentRef} className="h-full overflow-y-auto p-6 pt-8 pl-8">
                            <div className="flex items-center justify-between gap-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-[#54FFA4]" />
                                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                                </div>
                                {readingTime > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-[#54FFA4]/70">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{readingTime} min read</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-200 space-y-4 prose prose-invert prose-sm max-w-none">
                                {children}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Mobile: Bottom Sheet */}
            {isMobile && (
                <>
                    {/* Toggle Button - Always visible */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`
                            fixed left-1/2 -translate-x-1/2
                            w-auto px-4 h-12
                            bg-gradient-to-br from-[#0F1B21] to-[#1a2930]
                            border-2 border-[#54FFA4]/30
                            rounded-lg
                            flex items-center gap-2
                            hover:border-[#54FFA4]/60
                            ${isResizing ? '' : 'transition-all duration-300'}
                            z-30
                            group
                            shadow-lg
                            ${!isMounted ? '!transition-none' : ''}
                        `}
                        style={isMounted ? { bottom: isOpen ? `${mobileHeight}vh` : '1rem' } : { bottom: '1rem' }}
                        aria-label={isOpen ? "Hide instructions" : "Show instructions"}
                    >
                        {isMounted && (
                            <>
                                {isOpen ? (
                                    <>
                                        <ChevronDown className="w-5 h-5 text-[#54FFA4]" />
                                        <span className="text-white text-sm font-medium">Hide Guide</span>
                                        <X className="w-4 h-4 text-[#54FFA4]" />
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="w-5 h-5 text-[#54FFA4]" />
                                        <span className="text-white text-sm font-medium">How to Play</span>
                                    </>
                                )}
                            </>
                        )}
                    </button>

                    {/* Panel Content - Resizable height */}
                    <div
                        onTouchStart={handleSwipeStart}
                        onTouchMove={handleSwipeMove}
                        onTouchEnd={handleSwipeEnd}
                        className={`
                            fixed left-0 right-0 bottom-0
                            bg-gradient-to-br from-[#0F1B21]/98 to-[#1a2930]/98
                            backdrop-blur-md
                            border-t-2 border-[#54FFA4]/30
                            ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}
                            z-20
                            overflow-hidden
                            shadow-2xl
                            ${!isMounted ? '!transition-none' : ''}
                        `}
                        style={isMounted ? { 
                            height: isOpen ? `${mobileHeight}vh` : '0vh',
                            transform: swipeDistance !== 0 ? `translateY(${-swipeDistance}px)` : undefined
                        } : { height: '0vh' }}
                    >
                        {/* Resize Handle */}
                        {isOpen && (
                            <div
                                onTouchStart={handleMobileResizeStart}
                                onMouseDown={handleMobileResizeStart}
                                className="absolute top-0 left-0 right-0 h-6 cursor-ns-resize group hover:bg-[#54FFA4]/20 transition-colors touch-none z-10"
                            >
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                                    <GripHorizontal className="w-8 h-3 text-[#54FFA4]/40 group-hover:text-[#54FFA4]/80 transition-colors" />
                                </div>
                            </div>
                        )}

                        {/* Scroll Progress Bar */}
                        {isOpen && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#54FFA4]/10">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#54FFA4] to-[#54FFA4]/60 transition-all duration-150"
                                    style={{ width: `${scrollProgress}%` }}
                                />
                            </div>
                        )}
                        
                        {/* Content */}
                        <div ref={mobileContentRef} className="h-full overflow-y-auto p-4 pt-10 pb-20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-[#54FFA4]" />
                                    <h2 className="text-lg font-bold text-white">{title}</h2>
                                </div>
                                {readingTime > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] text-[#54FFA4]/70">
                                        <Clock className="w-3 h-3" />
                                        <span>{readingTime}m</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-200 space-y-3 prose prose-invert prose-sm max-w-none mobile-instructions">
                                {children}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
