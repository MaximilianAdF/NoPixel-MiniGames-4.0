// Player-facing + SEO copy rendered below each minigame (see app/puzzles/PuzzleInfo).
// Mechanics are sourced from each game's own implementation so the descriptions
// stay accurate. Keys match the /puzzles/[slug] route segments.

export interface PuzzleFaq {
  q: string;
  a: string;
}

export interface PuzzleContent {
  name: string;        // display name
  intro: string;       // what it is + NoPixel context + practice framing
  howItWorks: string;  // the actual mechanic
  tips: string[];
  faq: PuzzleFaq[];
  related: string[];   // slugs of related games to cross-link
}

export const PUZZLE_CONTENT: Record<string, PuzzleContent> = {
  lockpick: {
    name: 'Lockpick',
    intro:
      "The lockpick is NoPixel 4.0's vehicle-entry minigame — the rotating-ring lock that fires when you pick cars and other locks in GTA RP. This free FiveM lockpick trainer runs in your browser, so you can rehearse the alignment as many times as you want with no server and no download.",
    howItWorks:
      'Each lock is a stack of concentric rings dotted with coloured pins and coloured slots. Rotate the active ring left or right until every slot is either empty or sitting over a same-colour pin, then press Unlock to clear it and move outward to the next ring. Clear all the rings before the timer runs out — unlock with a mismatched pin under any slot and the pick bends instantly, ending the attempt.',
    tips: [
      'Read the colours before you rotate — with only red, yellow, and blue pins, you can usually see at a glance which pin each slot needs.',
      'Rotate the short way: each ring has 12 positions, so any match is at most six steps away — count the gap and turn in the cheaper direction.',
      'Double-check every occupied slot before pressing Unlock; a single mismatched pin ends the run, and only empty or colour-matched slots are safe.',
    ],
    faq: [
      {
        q: 'Is this the same lockpick as in NoPixel 4.0 and FiveM?',
        a: 'Yes. It recreates the rotating-ring lock used for vehicle lockpicking in NoPixel 4.0 GTA RP — spin each ring to line its coloured pins up with matching slots — so the skills you build here carry straight over to the server.',
      },
      {
        q: 'Is the lockpick trainer free?',
        a: 'Completely free, and it runs in your browser — no FiveM server, account, or download needed.',
      },
      {
        q: 'How do I get better at the lockpick minigame?',
        a: "Practise reading each ring's colours and rotating straight to the match, then confirm only when every occupied slot lines up. Short, repeated sessions build the pattern recognition that makes it automatic in-game.",
      },
      {
        q: 'Is this the Prodigy RP lockpick?',
        a: 'Yes — Prodigy RP and other FiveM / NoPixel-based servers use the same rotating-ring colour-match lock, so the skills you build here carry straight over.',
      },
    ],
    related: ['laundromat', 'repair-kit'],
  },

  thermite: {
    name: 'Thermite',
    intro:
      "Thermite is NoPixel 4.0's chain-reaction hack — the 6×6 grid puzzle you crack to breach high-security targets like the Maze Bank sewers and vault in GTA RP. This free FiveM thermite trainer reproduces the 4.0 mechanic exactly, so you can drill your board reads with no download.",
    howItWorks:
      "Every square is lit at the start, so your first click can go anywhere. Clicking a highlighted square steps it down one stage (full → half → empty), reassigns it a random range piece, and re-lights the board using that piece's range (short = adjacent, medium = two out, long = three out) — those lit squares are your only legal next moves. You only score a byte when a square goes half → empty, so each byte is a two-click play: the full → half click just arms it. Land three half → empty decrypts back-to-back within about a second whose ranges form a run (1-2-3 / 3-2-1) or a matching trio for a 'CRC Bypassed!' combo bonus (+1, then +2, +4, +8…). Hit the target bytes before the timer runs out; if a click lights up zero squares you stall and the hack fails.",
    tips: [
      'Plan two or three moves ahead — the aim is to always leave yourself highlighted squares to click, not just to clear the nearest one.',
      'Learn the ranges: short highlights immediate neighbours, medium reaches two cells out on a checkerboard, long reaches three. Each leaves a very different set of follow-ups.',
      'Favour the centre and avoid dead-end clicks near the edges and corners — they highlight fewer follow-ups and are where most runs stall.',
    ],
    faq: [
      {
        q: 'Is this the NoPixel 4.0 thermite hack, or the old 3.0 one?',
        a: "This is the 4.0 version — a chain-reaction puzzle on a 6×6 grid where every click propagates new highlighted squares by range. It is not the older 3.0 'memorise and recreate the pattern' minigame.",
      },
      {
        q: 'Is the thermite trainer free to use?',
        a: 'Yes, it is free and runs in your browser with no FiveM server or download required.',
      },
      {
        q: 'How do I get better at thermite?',
        a: 'Think a few moves ahead to keep highlighted squares available, learn what each piece range highlights, and steer toward the centre — most failures come from clicking into a dead end with no new highlights.',
      },
    ],
    related: ['roof-running', 'pincracker'],
  },

  laundromat: {
    name: 'Laundromat',
    intro:
      "Laundromat is the rotating-lock safe minigame from NoPixel 4.0 — the one that runs on the safe inside the south-side Laundromat in GTA RP. This free FiveM laundromat trainer mirrors the colour-match lockpick mechanic so you can practise it in your browser.",
    howItWorks:
      'You crack a lock built from concentric rings (5 by default), each carrying coloured pins and coloured gates. Rotate the active ring left or right one notch at a time until every gate sits over a pin of its own colour (or over an empty gap), then unlock it — one wrong-colour pin under a gate bends the pick and ends the run. Clear all the rings, inside-out, before the ~12-second timer expires.',
    tips: [
      "Read each ring's gate colours before you rotate, then move straight to the alignment instead of fishing for it.",
      'A gate over an empty gap is already safe — you only need to clear the gates sitting on a wrong-colour pin, not match every one.',
      'Never unlock on a guess: one wrong-colour pin under a gate bends the pick, so confirm every gate first.',
    ],
    faq: [
      {
        q: 'Is this the NoPixel 4.0 laundromat safe minigame?',
        a: 'Yes — it recreates the rotating colour-match lock on the safe at the south-side Laundromat in NoPixel 4.0 GTA RP.',
      },
      {
        q: 'Is it free, and do I need to download anything?',
        a: 'It is free and runs entirely in your browser — no FiveM server or download required.',
      },
      {
        q: 'How do I crack the laundromat faster?',
        a: 'Read each ring at a glance, rotate the short way straight to the alignment, and only unlock once every gate is over a matching pin or an empty gap — clearing all 5 rings inside the ~12-second clock.',
      },
    ],
    related: ['lockpick', 'repair-kit'],
  },

  'roof-running': {
    name: 'Roof Running',
    intro:
      "Roof Running is NoPixel 4.0's rooftop minigame — triggered when you rob AC-Units in GTA RP. It plays like a 'Same Game' board puzzle, and this free FiveM trainer lets you practise clearing it in your browser.",
    howItWorks:
      'The board fills with coloured blocks. Click any group of two or more matching, touching blocks to clear them and let the rest collapse down — empty the whole board before the timer runs out.',
    tips: [
      'Clear the largest matching groups first; big clears collapse the board and open up new matches.',
      'Work the board so falling blocks merge into new groups instead of stranding lone blocks.',
      "Avoid leaving isolated single blocks of a colour — they're the hardest to clear at the end.",
    ],
    faq: [
      {
        q: 'Is this the NoPixel 4.0 roof running minigame?',
        a: 'Yes — it recreates the colour-matching board puzzle triggered when robbing AC-Units in NoPixel 4.0 GTA RP.',
      },
      {
        q: 'Is the roof running trainer free?',
        a: 'Yes, it is completely free and runs in your browser with no download needed.',
      },
      {
        q: 'What is the fastest way to clear the board?',
        a: 'Prioritise the biggest matching groups and keep the board collapsing so new matches form — leaving single, isolated blocks for last is what runs you out of time.',
      },
    ],
    related: ['thermite', 'pincracker'],
  },

  pincracker: {
    name: 'PinCracker',
    intro:
      "PinCracker is NoPixel 4.0's code-breaking hack — a Mastermind-style puzzle used on high-value targets like the Maze Bank in GTA RP. This free FiveM PinCracker trainer runs in your browser so you can sharpen your deduction.",
    howItWorks:
      'Submit a guess for the hidden PIN and each slot lights up green (right digit, right spot), yellow (right digit, wrong spot), or red (not in the code). The PIN is built from distinct, non-repeating digits and you get unlimited guesses — read the colour clues to deduce the full code before the countdown timer runs out.',
    tips: [
      'Open with a guess made of distinct digits to gather the most information.',
      "Read each colour clue as elimination — rule digits and positions in or out, don't just re-guess.",
      "Lock confirmed digits in place and only permute the positions you're still unsure about.",
    ],
    faq: [
      {
        q: 'Is this the NoPixel 4.0 PinCracker minigame?',
        a: 'Yes — it recreates the Mastermind-style PIN-deduction hack used on high-security targets such as the Maze Bank in NoPixel 4.0 GTA RP.',
      },
      {
        q: 'Is the PinCracker trainer free?',
        a: 'Yes, it is free and browser-based — no FiveM server or download required.',
      },
      {
        q: 'How do I crack the PIN more reliably?',
        a: 'Treat it as logic, not luck: start with distinct digits, use the colour feedback to eliminate options, and keep confirmed digits fixed while you test the rest.',
      },
    ],
    related: ['roof-running', 'word-memory'],
  },

  'repair-kit': {
    name: 'Repair Kit',
    intro:
      "Repair Kit is NoPixel 4.0's timing minigame for fixing vehicles in GTA RP. This free FiveM repair-kit trainer recreates the indicator-timing mechanic so you can practise it in your browser.",
    howItWorks:
      "A glowing block sweeps once from the left of the bar to the right at a constant speed. Press E (or tap on mobile) to stop it inside the fixed target slot — land within about 5% of the slot's centre to pass that round; miss it, or let the block overshoot roughly 7% past the slot, and the repair fails. Each round drops the slot in a new spot, and a face button cycles the sweep through four speeds.",
    tips: [
      "Tap a hair before the zone's centre to absorb input delay.",
      "Each speed is constant, so calibrate over a couple of rounds at one difficulty, then commit confidently — every round is a single pass, so there's no second sweep to wait for.",
      'Stay relaxed on the fast passes — over-anticipating causes more misses than the speed itself.',
    ],
    faq: [
      {
        q: 'Is this the NoPixel 4.0 repair kit minigame?',
        a: 'Yes — it recreates the stop-the-indicator timing minigame used when repairing vehicles in NoPixel 4.0 GTA RP.',
      },
      {
        q: 'Is it free to practise?',
        a: 'Yes, it is free and runs in your browser with no download required.',
      },
      {
        q: 'How do I hit the target zone consistently?',
        a: "Learn the marker's tempo on the first pass and tap slightly early to account for input delay. Consistency beats reacting to every pass.",
      },
    ],
    related: ['lockpick', 'laundromat'],
  },

  'word-memory': {
    name: 'Word Memory',
    intro:
      "Word Memory is NoPixel 4.0's recall hack — used on targets like the Maze Bank in GTA RP. This free FiveM word-memory trainer runs in your browser so you can practise the 'have I seen this before?' memory test.",
    howItWorks:
      'Words appear one at a time. For each, decide whether it has already appeared earlier in the run. The pool keeps growing, so the longer you last, the more you have to keep track of.',
    tips: [
      'Say each new word to yourself once — light rehearsal sticks far better than passively reading it.',
      'Group similar or themed words together so they reinforce each other in memory.',
      'Answer on instinct; your first read is usually right, and hesitation is what breaks a streak.',
    ],
    faq: [
      {
        q: 'Is this the NoPixel 4.0 word memory minigame?',
        a: 'Yes — it recreates the seen-it-before memory hack used on targets such as the Maze Bank in NoPixel 4.0 GTA RP.',
      },
      {
        q: 'Is the word memory trainer free?',
        a: 'Yes, it is free and browser-based with no download required.',
      },
      {
        q: 'How do I remember more words?',
        a: 'Rehearse each new word once and chunk similar words together. Trust your first instinct on each call rather than second-guessing.',
      },
    ],
    related: ['thermite', 'pincracker'],
  },

  chopping: {
    name: 'Chopping',
    intro:
      "Chopping is NoPixel 4.0's quick-reaction minigame — triggered when chopping (dismantling) vehicles in GTA RP. This free FiveM chopping trainer lets you practise the typing speed in your browser.",
    howItWorks:
      'A sequence of letters appears on screen, each one of seven keys — Q, W, E, R, A, S or D. Type them in order before the countdown (7 seconds by default) runs out. The catch: a single wrong key ends the run instantly, so accuracy matters as much as speed.',
    tips: [
      'Keep your fingers on the home row and your eyes on the next letter, not the one you are pressing.',
      'Prioritise accuracy first; a clean run beats a fast run full of corrections.',
      'Aim for a steady pace rather than bursts — consistency clears the sequence faster.',
    ],
    faq: [
      {
        q: 'Is this the NoPixel 4.0 chopping minigame?',
        a: 'Yes — it recreates the type-the-letters reaction minigame triggered when chopping vehicles in NoPixel 4.0 GTA RP.',
      },
      {
        q: 'Is the chopping trainer free?',
        a: 'Yes, it is free and runs in your browser with no download required.',
      },
      {
        q: 'How do I get faster at chopping?',
        a: 'Touch-type from the home row and watch the upcoming letters instead of the current one. Clean, steady runs beat fast but error-prone ones.',
      },
    ],
    related: ['lockpick', 'thermite'],
  },
};
