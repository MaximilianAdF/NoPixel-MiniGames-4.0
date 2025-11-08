'use client';

import { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext';
import { useLoading } from '../contexts/LoadingContext';
import { Keyboard, RotateCcw, Check, X, Settings as SettingsIcon, Info, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Reserved keys that games use
const RESERVED_KEYS = [
  'q', 'w', 'e', 'r', 'a', 's', 'd',                     // Chopping game
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',     // PinCracker game (numbers)
  'backspace', 'enter',                                  // PinCracker game (controls)
];

export default function SettingsPage() {
  const { shortcuts, updateShortcut, resetToDefaults } = useKeyboardShortcuts();
  const { setPageLoading } = useLoading();
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>('');

  const handleKeyCapture = (e: React.KeyboardEvent) => {
    if (!isListening) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const key = e.key;
    const keyLower = key.toLowerCase();
    
    // Check if key is reserved for games
    if (RESERVED_KEYS.includes(keyLower)) {
      setError(`The "${key}" key is reserved for game controls (Chopping: Q/W/E/R/A/S/D, PinCracker: 0-9/Backspace/Enter)`);
      setPendingKey('');
      return;
    }
    
    // Check if key is already used by another shortcut
    const existingShortcut = shortcuts.find(
      s => s.key.toLowerCase() === keyLower && s.action !== editingAction
    );
    if (existingShortcut) {
      setError(`The "${key}" key is already used for "${existingShortcut.label}"`);
      setPendingKey('');
      return;
    }
    
    setError('');
    setPendingKey(key);
  };

  const startEditing = (action: string, currentKey: string) => {
    setEditingAction(action);
    setPendingKey(currentKey);
    setIsListening(true);
    setError('');
  };

  const saveEdit = () => {
    if (editingAction && pendingKey && !error) {
      updateShortcut(editingAction as any, pendingKey);
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingAction(null);
    setPendingKey('');
    setIsListening(false);
    setError('');
  };

  const getKeyDisplay = (key: string) => {
    const keyMap: Record<string, string> = {
      'Escape': 'ESC',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      ' ': 'Space',
    };
    return keyMap[key] || key.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-[#54FFA4] transition-colors mb-6 group animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your keyboard shortcuts and preferences</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl animate-fade-in shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up-delay-1">
          
          {/* Main Content - Keyboard Shortcuts */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="p-6 border-b-2 border-[#54FFA4]/20 bg-[#0F1B21]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-7 h-7 text-[#54FFA4]" />
                  <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={resetToDefaults}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all border-2 border-gray-600 hover:border-gray-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-semibold hidden sm:inline">Reset</span>
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">Click on any row to customize the shortcut</p>
            </div>

            {/* Shortcuts List */}
            <div className="p-6" onKeyDown={handleKeyCapture} tabIndex={0}>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={shortcut.action}
                    onClick={() => editingAction !== shortcut.action && startEditing(shortcut.action, shortcut.key)}
                    className={`group p-4 rounded-xl border-2 transition-all cursor-pointer animate-fade-in-up ${
                      editingAction === shortcut.action 
                        ? 'bg-[#54FFA4]/10 border-[#54FFA4] shadow-lg' 
                        : 'bg-[#0F1B21]/30 border-[#54FFA4]/20 hover:border-[#54FFA4]/40 hover:bg-[#0F1B21]/50'
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      
                      {/* Action Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-lg mb-1">
                          {shortcut.label}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {shortcut.description}
                        </div>
                      </div>

                      {/* Key Assignment */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {editingAction === shortcut.action ? (
                          <>
                            <input
                              type="text"
                              value={isListening ? (pendingKey ? getKeyDisplay(pendingKey) : 'Press a key...') : getKeyDisplay(pendingKey)}
                              readOnly
                              className="w-28 px-3 py-2 bg-[#54FFA4]/20 border-2 border-[#54FFA4] rounded-lg text-[#54FFA4] font-mono text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#54FFA4]/50 animate-pulse"
                              placeholder="Press key..."
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEdit();
                              }}
                              className="p-2 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                              title="Save"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEdit();
                              }}
                              className="p-2 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                              title="Cancel"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <div className="px-4 py-2 bg-[#0F1B21] border-2 border-[#54FFA4]/50 group-hover:border-[#54FFA4] text-[#54FFA4] rounded-lg font-mono font-bold text-lg transition-all shadow-md group-hover:shadow-lg min-w-[80px] text-center">
                            {getKeyDisplay(shortcut.key)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Help & Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b-2 border-blue-500/20 bg-[#0F1B21]/30">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Quick Tips</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>Shortcuts work globally across the entire site</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>They won&apos;t work when typing in text fields</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>Press ESC to close any open menu or guide</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>Changes are saved automatically to your browser</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Reserved Keys Card */}
            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-orange-500/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b-2 border-orange-500/20 bg-[#0F1B21]/30">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Reserved Keys</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2 font-semibold">Chopping Game</div>
                  <div className="flex flex-wrap gap-2">
                    {['Q', 'W', 'E', 'R', 'A', 'S', 'D'].map(key => (
                      <kbd key={key} className="px-2.5 py-1.5 bg-orange-500/10 border-2 border-orange-500/30 rounded-lg text-orange-400 font-mono text-sm font-bold">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2 font-semibold">PinCracker Game</div>
                  <div className="flex flex-wrap gap-2">
                    {['0-9', 'Backspace', 'Enter'].map(key => (
                      <kbd key={key} className="px-2.5 py-1.5 bg-orange-500/10 border-2 border-orange-500/30 rounded-lg text-orange-400 font-mono text-sm font-bold">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
