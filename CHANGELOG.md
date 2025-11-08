# Changelog

All notable changes to NoPixel 4.0 Minigames will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-08

### 🎉 Major Release - Complete Platform Launch

This is the first major stable release representing months of development. The platform is now a complete competitive training environment with user accounts, global leaderboards, and comprehensive statistics tracking.

---

## ✨ What's New

### 🔐 **Discord Authentication System**
- **Login with Discord** - Connect your Discord account to track progress
- **User Sessions** - Stay logged in for 7 days
- **Profile Syncing** - Avatar, username, and display name from Discord
- **Optional Login** - All games playable without account (login required for leaderboards/profiles/daily challenge)

### 🏆 **Global Leaderboards**
- **NEW PAGE**: `/leaderboards` - Browse all rankings in one place
- **7 Game Leaderboards** - Compete in Thermite, Lockpick, PinCracker, Laundromat, Roof Running, Word Memory, and Chopping
- **Level Leaderboard** - Top players by total XP earned
- **Streak Leaderboard** - Longest daily challenge completion streaks
- **Pagination System** - Browse through all ranks (not just top 10)
- **Your Rank Display** - See where you stand globally
- **Public Profiles** - Click any player to view their full stats

### 🎯 **Competitive Mode**
- **Standard Presets** - Play with official settings to qualify for leaderboards
- **Visual Indicators** - Know when you're playing competitively
- **Leaderboard Eligibility** - Only standard preset games count toward rankings
- **Per-Game Requirements** - Each game has specific competitive settings (e.g., Thermite: 6×6 grid, 60s timer)

### 👤 **User Profiles**
- **NEW PAGE**: `/profile` - Your personal stats dashboard (login required)
- **NEW PAGE**: `/profile/[userId]` - Public profile pages for any player
- **Level & XP System** - Track your progress and level up
- **Per-Game Statistics**:
  - Best times and scores (competitive and overall)
  - Average performance
  - Win/loss records  
  - Total playtime per game
- **Leaderboard Ranks** - See your rank in each category with color-coded badges
- **Daily Challenge History** - View your last 7 challenge attempts
- **Streak Tracking** - Current streak and longest streak records

### ⚙️ **Settings & Customization**
- **NEW PAGE**: `/settings` - Customize your experience
- **Keyboard Shortcuts** - Remap any shortcut to your preference
- **Conflict Detection** - Automatic warnings for duplicate keys
- **Reserved Keys** - Protection for game-specific controls
- **Auto-Save** - Preferences saved automatically

### 📖 **Open Source Page**
- **NEW PAGE**: `/open-source` - Learn about the project
- **Tech Stack** - Full technology breakdown
- **Contribution Guide** - How to contribute to the project
- **GitHub Links** - Direct links to repository and issues
- **MIT License** - Open source license information

### 🔥 **Daily Challenge System** (NEW!)
- **NEW FEATURE**: `/daily-challenge` - Special daily puzzle that changes every 24 hours
- **One Attempt Per Day** - Everyone gets the same challenge, but you only get one shot
- **Streak Tracking** - Complete challenges consecutively to build a streak
- **Streak Rewards** - Bonus XP multipliers for maintaining your streak (up to 2.5x at 30+ days)
- **Challenge History** - View your last 7 daily challenge attempts with scores and times
- **Leaderboard Integration** - Compete for the longest daily streak globally
- **Best Streak Record** - Your personal best streak is permanently tracked

### 🏅 **XP & Leveling System**
- **Smart Difficulty Multipliers**:
  - Easy settings: 0.05x-0.5x XP (discourage farming)
  - Normal settings: 1.0x XP (baseline)
  - Hard settings: 1.3x-3.0x XP (reward challenge)
- **Cubic Scaling** - Exponential penalties for easy mode prevent abuse
- **Level Formula** - `level = floor(cbrt(xp / 25)) + 1`
- **Progress Tracking** - XP bar shows progress to next level

### 📊 **Analytics & Tracking**
- **Game Events** - Track starts, completions, failures, quits
- **Performance Metrics** - Score, time, difficulty tracked per game
- **Popularity Stats** - See which games are most played
- **User Behavior** - Understand how players use the platform

### 🎨 **Complete UI/UX Redesign**
- **Modern Design System** - Glassmorphism, gradients, smooth animations
- **NoPixel Branding** - Consistent green (#54FFA4) theme throughout
- **Game-Specific Colors** - Each minigame has its own gradient theme
- **Mobile Responsive** - Works perfectly on phones and tablets
- **Animated Transitions** - Smooth page changes and hover effects
- **Improved Navigation** - Back buttons, breadcrumbs, clear paths

### 🔍 **SEO Optimization**
- **9 Custom OG Images** - Unique 1200x630px images for social sharing (homepage + 8 games)
- **Rich Metadata** - Enhanced titles and descriptions with emojis
- **Structured Data** - JSON-LD for Google rich snippets
- **17-Page Sitemap** - Complete site structure for search engines
- **Optimized Load Times** - Fast loading with image optimization

---

## 🔧 Technical Improvements

### 🗄️ **New Database Schema**
- **User Model Extended**:
  - `level` - Player level
  - `totalXP` - Total experience points
  - `currentDailyStreak` - Days in a row
  - `longestDailyStreak` - Best streak record
  - `keyboardShortcuts` - Custom control mappings

- **GameStats Model Enhanced**:
  - `bestScore` / `bestTime` - Leaderboard-eligible bests (standard presets only)
  - `bestScoreOverall` / `bestTimeOverall` - All-time bests (any settings)
  - `gamesWon` / `gamesLost` - Win/loss tracking
  - Separated competitive vs casual statistics

### 📡 **New API Endpoints**
- `GET /api/stats/leaderboard` - Fetch rankings with pagination
- `GET /api/stats/user` - Get current user's full stats
- `GET /api/stats/user/[userId]` - Get any user's public profile
- `POST /api/analytics/track` - Track game events
- `GET /api/analytics/popularity` - Game popularity statistics
- `GET /api/auth/discord/callback` - Discord OAuth callback
- `POST /api/auth/logout` - User logout
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update preferences

### ⚡ **Performance Optimizations**
- **Debouncing** - 2-second delay on preference saves
- **Global Caching** - 1-minute cache for frequently accessed data
- **Request Deduplication** - Prevent multiple identical API calls
- **Rate Limiting** - Protect APIs from abuse (60 req/min per user)
- **Image Optimization** - Next.js Image component with proper sizing
- **Code Splitting** - Faster initial page loads

---

---

## 🐛 Bug Fixes

### Authentication & Sessions
- Fixed flash of login prompt when already logged in
- Prevented duplicate session validation requests
- Improved error handling for expired Discord tokens
- Fixed race conditions in session cookie management

### Performance
- Reduced excessive API calls through debouncing and caching
- Fixed memory leaks in event listeners
- Optimized image loading and rendering
- Improved initial page load speed

### Game Issues
- Fixed custom settings not applying correctly in some games
- Corrected leaderboard time calculations
- Fixed competitive mode not detecting standard presets properly
- Resolved display issues with game timers

### SEO & Metadata
- Fixed search results showing Vercel branding instead of custom images
- Corrected sitemap to include all pages
- Added proper meta descriptions for all game pages
- Fixed Open Graph images not appearing on social media

### Leaderboards
- Fixed pagination not resetting when switching categories
- Corrected rank display for players outside top 10
- Fixed tie-breaking logic for identical scores/times
- Resolved empty profile pages for some users

---

## � Security & Infrastructure

### Authentication
- Discord OAuth 2.0 integration
- JWT session tokens (7-day expiration)
- Secure HTTP-only cookies
- CSRF protection via SameSite cookies

### Rate Limiting
- API protection: 60 requests/minute per user
- Leaderboard queries: 60 req/min
- Stats queries: 30 req/min
- Prevents abuse and ensures fair usage

### Database
- MongoDB schema updates for new features
- Indexes created for leaderboard performance
- User data encryption for sensitive information
- Automatic session cleanup

### Performance
- Global caching layer (1-minute duration)
- Request deduplication
- Debounced API calls (2-second delay)
- Optimized database queries

---

## 📦 Dependencies

### New Packages Added
- `jose` - JWT token handling
- `classnames` - Conditional CSS utilities
- `date-fns` - Date manipulation
- `uuid` - Unique ID generation
- `recharts` - Charting library (future use)

---

### 📚 Documentation

#### 📖 **Code Documentation**
- Added JSDoc comments to all utility functions
- Inline comments explaining complex algorithms
- Type definitions for all interfaces
- Schema documentation in model files

---

### 🎯 Next Steps / Roadmap

#### 🔜 **Coming Soon**
- [ ] Achievement system with badges
- [ ] Friend system and private challenges
- [ ] Replay system (watch your best runs)
- [ ] Twitch integration for streamers

#### 🤝 **Community Features**
- [ ] Comment system on profiles
- [ ] Following/followers
- [ ] Challenge other players
- [ ] PvP system for puzzles
- [ ] Tournament system

#### 📊 **Analytics Dashboard**
- [ ] Personal progress charts
- [ ] Skill improvement tracking
- [ ] Play session history

---

### 🙏 **Contributors**

This release represents **over 500 hours of development work** across:
- 98 files changed
- 15,000+ lines of code
- 9 new pages
- 15+ API endpoints
- Complete design system overhaul

---

### 📝 **Notes**

- This is the first major stable release (v1.0.0)
- All previous versions (0.x.x) were development/beta releases
- From now on, we will follow semantic versioning strictly
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup

---

## [0.1.0] - 2024-12-01 (Beta)

### Initial Beta Release
- Basic game implementations
- Simple authentication
- Initial MongoDB setup
- Basic styling

---
*Made with ❤️ for the NoPixel community*
**Full Changelog**: https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/compare/v0.1.0...v1.0.0
