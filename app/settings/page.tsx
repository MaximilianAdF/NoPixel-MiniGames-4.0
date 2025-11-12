'use client';

import { useState } from 'react';
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext';
import { useUser } from '../contexts/UserContext';
import { Keyboard, RotateCcw, Check, X, Info, AlertCircle, ArrowLeft, ShieldAlert, Trash2, AlertTriangle, Loader2, User, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';

const RESERVED_KEYS = [
  'q', 'w', 'e', 'r', 'a', 's', 'd',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'backspace', 'enter',
];

type SettingsTab = 'shortcuts' | 'account';

const settingsCategories = [
  { id: 'shortcuts', name: 'Keyboard Shortcuts', icon: Keyboard, description: 'Customize your keyboard shortcuts' },
  { id: 'account', name: 'Account Management', icon: ShieldAlert, description: 'Manage your account and data' },
];

export default function SettingsPage() {
  const { shortcuts, updateShortcut, resetToDefaults } = useKeyboardShortcuts();
  const { user, isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>('shortcuts');
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleKeyCapture = (e: React.KeyboardEvent) => {
    if (!isListening) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const key = e.key;
    const keyLower = key.toLowerCase();
    
    if (RESERVED_KEYS.includes(keyLower)) {
      setError(`The "${key}" key is reserved for game controls (Chopping: Q/W/E/R/A/S/D, PinCracker: 0-9/Backspace/Enter)`);
      setPendingKey('');
      return;
    }
    
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

  const confirmationTarget = user?.username ?? '';
  const confirmationMatches = confirmationTarget.length > 0 && deleteConfirmationInput.trim() === confirmationTarget;

  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
    setDeleteConfirmationInput('');
    setDeleteErrorMessage('');
    setDeleteLoading(false);
  };

  const closeDeleteDialog = () => {
    if (deleteLoading) return;
    setShowDeleteDialog(false);
    setDeleteConfirmationInput('');
    setDeleteErrorMessage('');
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      setDeleteErrorMessage('You need to be logged in to delete your account.');
      return;
    }

    const trimmedInput = deleteConfirmationInput.trim();
    if (trimmedInput !== confirmationTarget) {
      setDeleteErrorMessage('Please type your username exactly as shown (case-sensitive).');
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteErrorMessage('');

      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.href = '/?accountDeleted=1';
        return;
      }

      let errorMessage = 'Failed to delete account. Please try again.';
      try {
        const data = await response.json();
        if (data?.error) {
          errorMessage = data.error;
        }
      } catch (err) {
        // ignore parse errors
      }

      setDeleteErrorMessage(errorMessage);
    } catch (err) {
      setDeleteErrorMessage('Something went wrong. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeCategory = settingsCategories.find(cat => cat.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-[#54FFA4] transition-colors mb-6 group animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up-delay-1">
          
          {/* Sidebar - Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl sticky top-4">
              <div className="px-6 py-4 bg-[#0F1B21]/50 border-b-2 border-[#54FFA4]/30">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5 text-[#54FFA4]" />
                  <span className="text-white font-bold">Settings</span>
                </div>
              </div>
              
              <div className="divide-y divide-[#54FFA4]/20">
                {settingsCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id as SettingsTab)}
                      className={`w-full px-6 py-4 flex items-center gap-3 transition-all ${
                        activeTab === category.id
                          ? 'bg-gradient-to-r from-[#54FFA4]/20 to-[#45e894]/20 border-l-4 border-[#54FFA4] text-white'
                          : 'text-gray-300 hover:bg-[#0F1B21]/30'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${activeTab === category.id ? 'text-[#54FFA4]' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Active Category Header */}
            {activeCategory && (
              <div className="mb-6 bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <activeCategory.icon className="w-8 h-8 text-[#54FFA4]" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">{activeCategory.name}</h2>
                      <p className="text-gray-400 text-sm mt-1">{activeCategory.description}</p>
                    </div>
                  </div>
                  {activeTab === 'shortcuts' && (
                    <button
                      onClick={resetToDefaults}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Reset All</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl animate-fade-in shadow-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Shortcuts Content */}
            {activeTab === 'shortcuts' && (
              <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl">

                <div className="p-6" onKeyDown={handleKeyCapture} tabIndex={0}>
                  <div className="space-y-2">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={shortcut.action}
                        onClick={() => editingAction !== shortcut.action && startEditing(shortcut.action, shortcut.key)}
                        className={`group p-4 rounded-xl transition-all cursor-pointer border ${
                          editingAction === shortcut.action 
                            ? 'bg-[#54FFA4]/10 border-[#54FFA4] shadow-lg scale-[1.01]' 
                            : 'bg-[#0F1B21]/40 border-[#54FFA4]/10 hover:border-[#54FFA4]/30 hover:bg-[#0F1B21]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold mb-0.5">
                              {shortcut.label}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {shortcut.description}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {editingAction === shortcut.action ? (
                              <>
                                <input
                                  type="text"
                                  value={isListening ? (pendingKey ? getKeyDisplay(pendingKey) : 'Press a key...') : getKeyDisplay(pendingKey)}
                                  readOnly
                                  className="w-24 px-3 py-2 bg-[#54FFA4]/20 border-2 border-[#54FFA4] rounded-lg text-[#54FFA4] font-mono text-center text-sm font-bold focus:outline-none animate-pulse"
                                  placeholder="Press key..."
                                  autoFocus
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveEdit();
                                  }}
                                  className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all"
                                  title="Save"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelEdit();
                                  }}
                                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="px-3 py-1.5 bg-[#0F1B21] border border-[#54FFA4]/40 group-hover:border-[#54FFA4] text-[#54FFA4] rounded-lg font-mono text-sm font-bold transition-all min-w-[60px] text-center">
                                {getKeyDisplay(shortcut.key)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-6 bg-[#0F1B21]/30 border-t-2 border-[#54FFA4]/20">
                  <div className="flex items-start gap-3 text-sm text-gray-400">
                    <Info className="w-4 h-4 text-[#54FFA4] mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p>Click any shortcut to customize it. Shortcuts work globally except in text fields.</p>
                      <p className="text-xs text-gray-500">Reserved keys: Q/W/E/R/A/S/D (Chopping), 0-9/Backspace/Enter (PinCracker)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Content */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {isLoggedIn && user ? (
                  <>
                    {/* User Info Card */}
                    <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-6 shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <User className="w-6 h-6 text-[#54FFA4]" />
                        <h3 className="text-xl font-bold text-white">Profile Information</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-[#0F1B21]/40 rounded-lg">
                          <span className="text-gray-400 text-sm">Username</span>
                          <span className="text-white font-semibold">{user.username}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#0F1B21]/40 rounded-lg">
                          <span className="text-gray-400 text-sm">Account Type</span>
                          <span className="text-white font-semibold">Discord</span>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-red-500/30 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-6 bg-red-500/5 border-b-2 border-red-500/20">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                          <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            Permanently delete your account and all associated data. This includes your profile, statistics, game history, and challenge progress. <strong className="text-red-400">This action cannot be undone.</strong>
                          </p>
                        </div>
                        <button
                          onClick={openDeleteDialog}
                          disabled={!confirmationTarget}
                          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                            !confirmationTarget
                              ? 'bg-red-700/40 text-red-200 cursor-not-allowed border border-red-500/30'
                              : 'bg-red-600 hover:bg-red-500 text-white border border-red-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete Account Permanently
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-12 shadow-2xl text-center">
                    <ShieldAlert className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Not Logged In</h3>
                    <p className="text-gray-400">Please log in to manage your account settings.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-red-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            
            <div className="flex items-start gap-3 mb-4">
              <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Delete Account</h3>
                <p className="text-gray-300 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-gray-200 text-sm leading-relaxed">
                You are about to permanently delete your account and all associated data. To confirm, please type your username <strong className="text-white">{confirmationTarget}</strong> below.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Type your username to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && confirmationMatches && !deleteLoading) {
                    handleDeleteAccount();
                  }
                }}
                placeholder={confirmationTarget}
                disabled={deleteLoading}
                className="w-full px-4 py-3 bg-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#54FFA4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
            </div>

            {deleteErrorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{deleteErrorMessage}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeDeleteDialog}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold transition-all border-2 border-gray-600 hover:border-gray-500 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!confirmationMatches || deleteLoading}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all border-2 border-red-500/50 shadow-lg ${
                  !confirmationMatches || deleteLoading
                    ? 'bg-red-700/40 text-red-100 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-xl'
                }`}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
