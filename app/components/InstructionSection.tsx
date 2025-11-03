"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface InstructionSectionProps {
    id: string;
    title: string;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

export default function InstructionSection({ 
    id, 
    title, 
    icon, 
    defaultOpen = true, 
    children 
}: InstructionSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div id={id} className="mb-4 scroll-mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-[#1a2930]/50 hover:bg-[#1a2930]/70 rounded-lg border border-[#54FFA4]/20 hover:border-[#54FFA4]/40 transition-all group"
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-[#54FFA4]">{icon}</span>}
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#54FFA4] transition-colors">
                        {title}
                    </h3>
                </div>
                {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-[#54FFA4]" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
            </button>
            
            {isOpen && (
                <div className="mt-2 pl-4 pr-2 py-3 text-gray-200 space-y-3 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
}
