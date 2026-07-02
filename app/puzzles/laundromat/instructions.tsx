import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Eye } from "lucide-react";

export default function LaundryInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Laundromat?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The Laundromat minigame is the rotating-lock safe hack from NoPixel 4.0 — the colour-match
                    lock you crack on the safe at the Laundromat in GTA RP. The lock is built from concentric
                    rings, each carrying coloured balls and coloured gates. You rotate one ring at a time until
                    every gate lines up with a ball of its own colour (or an empty gap), then commit to the unlock.
                </p>
                <p>
                    It runs on the same lock mechanic as the Lockpick minigame, but tuned harder: five rings
                    instead of four, and only 12 seconds on the clock instead of 20. Success comes down to fast
                    colour reading and decisive rotation — there is no memorisation and no clicking on the board itself.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Mechanics" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Read the lock</strong> - Five concentric rings appear, each with 12 positions. Coloured balls (red, yellow, blue) sit on the ring, and coloured gate arcs sit fixed just outside it</li>
                    <li><strong>Start on the innermost ring</strong> - Only the active ring responds to input; you work from the inside out</li>
                    <li><strong>Rotate the ring</strong> - Press <strong>A</strong> / <strong>Left Arrow</strong> or <strong>D</strong> / <strong>Right Arrow</strong> (or the on-screen Rotate buttons) to turn the balls one notch at a time. The gates never move</li>
                    <li><strong>Line up the colours</strong> - Every gate must end up over either a ball of its own colour or an empty position. Balls that are not under a gate do not matter</li>
                    <li><strong>Commit with Unlock</strong> - Press <strong>Enter</strong> or <strong>Space</strong> (or the Unlock button) to attempt the ring</li>
                    <li><strong>Wrong alignment = instant fail</strong> - If any gate sits over a wrong-colour ball when you unlock, the lockpick bends and the run ends immediately</li>
                    <li><strong>Correct alignment = next ring</strong> - The cleared ring locks in with a success chime and the next ring outward becomes active</li>
                    <li><strong>Beat the timer</strong> - One shared 12-second countdown covers all five rings. Clear the last ring before it expires to win</li>
                </ol>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring and Win Conditions" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Laundromat keeps score in rings, not points:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Score = rings cleared</strong> - Each successful unlock advances your score by one, up to 5 of 5</li>
                    <li><strong>Win condition</strong> - Unlock every ring before the countdown reaches zero</li>
                    <li><strong>Fail condition 1: bad unlock</strong> - Pressing Unlock with any gate over a wrong-colour ball ends the run on the spot</li>
                    <li><strong>Fail condition 2: timeout</strong> - The 12-second timer expiring ends the run regardless of progress</li>
                    <li><strong>No combos or multipliers</strong> - There are no speed bonuses, streaks, or point penalties; rotating extra times costs you nothing but clock</li>
                </ul>
                <p className="mt-2">
                    <strong>What that means in practice:</strong> speed only matters because of the shared timer.
                    An unlock is either safe or fatal, so accuracy always comes before pace.
                </p>
            </InstructionSection>

            <InstructionSection id="tips" title="Expert Colour-Match Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Consistent Laundromat players use these techniques:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Gates first, balls second</strong> - Scan the fixed gate colours on the active ring before touching anything; they define the target alignment</li>
                    <li><strong>Ignore ungated balls</strong> - Only balls that end up under a gate are checked. Most of the ring is noise; focus on the handful of gate positions</li>
                    <li><strong>Empty gaps are free</strong> - A gate over an empty position is already safe, so you rarely need every gate colour-matched</li>
                    <li><strong>Rotate the short way</strong> - The ring wraps around, so pick the direction that reaches alignment in fewer notches instead of spinning one way by habit</li>
                    <li><strong>Verify every gate before Unlock</strong> - One quick lap of the gates costs a fraction of a second; a bad unlock costs the whole run</li>
                    <li><strong>Use the chime as your cue</strong> - Each cleared ring plays a success sound; snap your eyes to the next ring outward the moment you hear it</li>
                    <li><strong>Keep rotating while you read</strong> - Extra rotations are free, so you can step the ring while checking gates rather than freezing to think</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty, Settings and Modes" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    The default setup mirrors the in-game hack, and practice mode lets you tune it:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Default (in-game)</strong> - 5 rings, 12-second timer. Roughly 2.4 seconds per ring including the unlock check</li>
                    <li><strong>Custom levels</strong> - The settings panel lets you set 2 to 10 rings per run</li>
                    <li><strong>Custom timer</strong> - Adjustable from 5 up to 100 seconds; stretch it while learning, then tighten it back down</li>
                    <li><strong>Daily challenge</strong> - A fixed configuration shared by everyone that day, with settings locked</li>
                    <li><strong>1v1 mode</strong> - Head-to-head matches where both players crack an identical lock from the same seed</li>
                    <li><strong>Compared to Lockpick</strong> - Same mechanic, but Lockpick gives you 4 rings in 20 seconds; Laundromat demands 5 rings in 12</li>
                </ul>
                <p className="mt-2">
                    <strong>Randomness per ring:</strong> each ring rolls its own colours, ball count and gate count,
                    so no two locks read the same — the skill is the reading process, not a memorised solution.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes to Avoid" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Unlocking on a guess</strong> - The single biggest run-killer; one unchecked gate over a wrong-colour ball ends everything instantly</li>
                    <li><strong>Trying to match every ball</strong> - Only gated positions are checked; wasting notches to &quot;tidy up&quot; ungated balls burns the clock for nothing</li>
                    <li><strong>Spinning one direction by default</strong> - Going the long way around a 12-position ring can double your rotation count</li>
                    <li><strong>Checking only the nearest gates</strong> - Gates sit all around the ring; the mismatch that fails you is usually the one on the far side you never looked at</li>
                    <li><strong>Rotating the wrong ring mentally</strong> - Only the current ring moves. Reading gates on an outer ring while rotating the inner one wastes precious seconds</li>
                    <li><strong>Freezing to plan</strong> - With 12 seconds for five rings, standing still is losing; read while you rotate</li>
                    <li><strong>Panic-spinning at the buzzer</strong> - When the timer beeps low, random rotation rarely lands an alignment; a calm final gate-check is still faster</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, this lock guards the safe at the Laundromat robbery:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Safe cracking</strong> - The hack fires when a criminal crew hits the Laundromat safe for its cash box</li>
                    <li><strong>One-shot pressure</strong> - In-game, a bent pick means a failed attempt while police response timers keep running</li>
                    <li><strong>Shared lock family</strong> - The same rotating colour-match lock appears on other NoPixel targets, so the skill transfers</li>
                    <li><strong>Why practise here</strong> - Failing on the server wastes the crew&apos;s setup and window; failing in the browser costs a two-second restart</li>
                </ul>
                <p className="mt-2">
                    In roleplay, the laundromat is a classic front business, which is why it became one of the
                    city&apos;s recognisable mid-tier robberies. Crews typically send their most reliable hacker
                    to the safe because the 12-second window leaves no room for a fumbled attempt.
                </p>
            </InstructionSection>

            <InstructionSection id="memory" title="Reading Rings Faster" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    The core skill is turning a cluttered ring into a short checklist:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Count the gates, not the balls</strong> - A ring only ever has 4-7 gates; treat each ring as a short checklist instead of reading all twelve positions</li>
                    <li><strong>Anchor on one gate</strong> - Pick a single mismatched gate, rotate until its colour arrives, then check whether the rest fell into place</li>
                    <li><strong>Think in notches</strong> - The ring moves in fixed 30-degree steps; learning to see &quot;that match is three notches right&quot; beats nudging and re-checking</li>
                    <li><strong>Scan in one direction</strong> - Sweep the gates clockwise every time so you never skip one; a consistent scan pattern becomes automatic</li>
                    <li><strong>Verbalise colours</strong> - Silently naming &quot;red, gap, blue, blue&quot; as you sweep keeps the check deliberate under time pressure</li>
                </ul>
                <p className="mt-2">
                    None of this requires memory between rings — each ring is solved fresh — but a practised
                    scan routine is what compresses a ring from four seconds down to two.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Practice Path to Mastery" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build up to the real 5-rings-in-12-seconds configuration in stages:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Learn the check</strong> - Set 2 rings and a long timer (30+ seconds) in settings; focus purely on verifying every gate before each unlock</li>
                    <li><strong>Add rings</strong> - Step up to 5 rings while keeping the relaxed timer; get used to the inside-out progression</li>
                    <li><strong>Tighten the clock</strong> - Drop the timer toward 12 seconds in stages; your gate-scan should stay identical, just faster</li>
                    <li><strong>Drill the default</strong> - Grind 5 rings / 12 seconds until wins are routine rather than lucky</li>
                    <li><strong>Add stakes</strong> - Use the daily challenge and 1v1 matches to practise under pressure against other players</li>
                </ol>
                <p className="mt-2">
                    <strong>Session structure:</strong> short, frequent sessions beat marathons — ten focused runs
                    a day builds the colour-reading reflex without the sloppy habits that come from tilted grinding.
                </p>
            </InstructionSection>

            <InstructionSection id="visual" title="Visual Setup and Colour Reading" icon={<Eye className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    The whole game is colour discrimination under time pressure, so your setup matters:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Three colours only</strong> - Everything is red, yellow, or blue; make sure your display renders them clearly distinct</li>
                    <li><strong>Brightness/contrast</strong> - The board sits on a dark background; a too-dim screen makes the red and blue balls easy to confuse at a glance</li>
                    <li><strong>Disable heavy colour filters</strong> - Aggressive night-light or warm-tint modes shift yellow and red together, which directly hurts your reads</li>
                    <li><strong>Whole-ring vision</strong> - Gates sit all around the circle; sit far enough back that the active ring fits comfortably in view without eye darting</li>
                    <li><strong>Watch the gates, not the motion</strong> - While rotating, keep your eyes parked on the gate positions and let the balls flow underneath them</li>
                </ul>
                <p className="mt-2">
                    Pro tip: mismatches pop out faster than matches. Instead of confirming each gate is right,
                    sweep the ring looking for anything that reads wrong — if nothing jumps out, unlock.
                </p>
            </InstructionSection>
        </>
    );
}
