import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Wrench } from "lucide-react";

export default function RepairKitInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Repair Kit?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The Repair Kit minigame is the stop-the-indicator timing challenge used when fixing vehicles
                    in NoPixel 4.0. A glowing block sweeps once across a horizontal bar at a constant speed, and
                    a single outlined target slot sits somewhere along that bar. Your entire job is to stop the
                    block inside the slot with one well-timed press.
                </p>
                <p>
                    Unlike pattern-based puzzles or logic challenges, Repair Kit is pure skill execution. There
                    are no stages, points, or combos - each round is a single sweep with a single press, and you
                    either land the block in the slot or you don&apos;t. The block never comes back for a second
                    pass, so hesitation is exactly as fatal as pressing too early.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Mechanics" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Spot the target slot</strong> - Each round places the outlined square at a random point along the bar (anywhere from roughly 15% to 90% of the way across)</li>
                    <li><strong>Watch the sweep</strong> - After a brief pause the glowing block starts at the left edge and travels right at a constant, unchanging speed</li>
                    <li><strong>Stop the block</strong> - Press E on desktop (or click the on-screen E button); on mobile and tablet, tap the hand button</li>
                    <li><strong>Win check</strong> - You pass if the block&apos;s centre stops within about 5% of the bar&apos;s travel from the slot&apos;s centre; the block flashes to confirm the hit</li>
                    <li><strong>Miss = fail</strong> - Stopping anywhere outside that window fails the round and everything flashes red</li>
                    <li><strong>Overshoot = fail</strong> - If you never press, the round fails automatically once the block passes roughly 7% beyond the slot; the sweep never reaches the far edge</li>
                    <li><strong>Next round</strong> - After about a second the next round starts on its own, with the slot in a new random spot at the same speed</li>
                </ol>
                <p className="mt-2">
                    <strong>Timing window breakdown:</strong> There is one tolerance and it is all-or-nothing - within
                    about 5% of the travel distance from the slot&apos;s centre is a pass, anything else is a fail. There
                    are no partial-credit zones.
                </p>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring and Win Conditions" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Repair Kit scoring is strictly pass/fail:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Hit</strong> - Stopping the block within the ~5% window scores the round as a win (1)</li>
                    <li><strong>Miss</strong> - Stopping outside the window scores it as a loss (0)</li>
                    <li><strong>Overshoot</strong> - Letting the block sail ~7% past the slot without pressing is also a loss</li>
                    <li><strong>No point tiers</strong> - There are no perfect/good/okay grades, no partial credit, and no accuracy percentages</li>
                    <li><strong>No bonuses</strong> - There are no speed bonuses, streak combos, or score multipliers - only your win rate over repeated rounds matters</li>
                    <li><strong>Same window at every speed</strong> - The tolerance stays the same on all four difficulties; faster sweeps just give you less time to use it</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="tips" title="Expert Timing and Precision Techniques" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Consistent players rely on these techniques:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Anticipatory timing</strong> - Press a hair before the block&apos;s centre reaches the slot to absorb input and display delay</li>
                    <li><strong>Visual anchoring</strong> - Fix your eyes on the target slot and let the block enter your view, rather than chasing the block across the bar</li>
                    <li><strong>Calibrate per speed</strong> - The sweep speed is constant and identical every round at a given difficulty, so a couple of rounds is enough to lock in the tempo</li>
                    <li><strong>One press, one chance</strong> - There is no second sweep, so commit to your press instead of waiting for a better pass that never comes</li>
                    <li><strong>Use the slot position</strong> - A slot far to the right gives you longer to read the block&apos;s pace; a slot near the left arrives fast, so be ready the moment the sweep starts</li>
                    <li><strong>Stay relaxed on fast speeds</strong> - Over-anticipating causes more misses than the speed itself; keep your finger resting on E, not hovering tensely</li>
                    <li><strong>Input delay compensation</strong> - Learn your system&apos;s lag and press earlier accordingly</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Levels and Progression" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Difficulty is a single dial: how fast the block crosses the bar. The face button on the right
                    cycles through four fixed speeds, and pressing it restarts the round:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Green (smiley)</strong> - The default and easiest: the block takes about 4 seconds to cross the bar</li>
                    <li><strong>Yellow (meh face)</strong> - Roughly 2 seconds per sweep; comfortable once you know the tempo</li>
                    <li><strong>Red (angry face)</strong> - About 1 second per sweep; you need to be pre-aimed at the slot</li>
                    <li><strong>Purple (dizzy face)</strong> - Around half a second per sweep; effectively a reaction-time test</li>
                    <li><strong>Cycling wraps around</strong> - Pressing the button on purple returns you to green</li>
                </ul>
                <p className="mt-2">
                    <strong>What does not change:</strong> the win window, the single-sweep format, and the random slot
                    placement are identical at every speed. There are no extra stages, moving zones, or direction
                    reversals at higher difficulties - just less time.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes That Ruin Repairs" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Reactive instead of predictive</strong> - Waiting until you see the block inside the slot means you press late; by the time your input lands, it has moved on</li>
                    <li><strong>Waiting for a second pass</strong> - The block sweeps once and the round auto-fails shortly past the slot; there is nothing to wait for</li>
                    <li><strong>Panic-pressing early</strong> - Your first press while the block is moving is your attempt; an early press outside the window is an instant miss</li>
                    <li><strong>Watching the block, not the slot</strong> - Tracking the moving block strains your timing; anchoring on the stationary slot is far more reliable</li>
                    <li><strong>Not accounting for lag</strong> - Ignoring input delay produces consistent just-late misses</li>
                    <li><strong>Tense fingers/hands</strong> - Muscle tension slows reaction time, which matters most on the red and purple speeds</li>
                    <li><strong>Skipping speeds</strong> - Jumping straight to the dizzy speed before you are consistent on green and yellow builds bad habits instead of tempo</li>
                    <li><strong>Loss of rhythm</strong> - The speed never changes mid-round, so if you miss, trust the same tempo next round instead of second-guessing it</li>
                    <li><strong>Hardware issues</strong> - Wireless peripherals with lag or low monitor refresh rates blur exactly the margin the 5% window gives you</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, the repair kit minigame comes up whenever a vehicle needs patching in the field:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Vehicle emergency repairs</strong> - Fixing a damaged car mid-chase to keep an escape alive</li>
                    <li><strong>Heist getaway maintenance</strong> - Patching the getaway vehicle so it survives the run</li>
                    <li><strong>Street racing</strong> - Repairing crash damage between or during races</li>
                    <li><strong>Mechanic roleplay</strong> - Players working as mechanics run into this timing bar constantly</li>
                    <li><strong>Combat damage recovery</strong> - Getting a shot-up vehicle moving again after a firefight</li>
                </ul>
                <p className="mt-2">
                    Because each attempt is a single sweep, fumbling it in the city means burning time you may not
                    have while sirens close in. Drilling the trainer until the press is automatic is what separates
                    a clean roadside fix from a failed one at the worst possible moment.
                </p>
            </InstructionSection>

            <InstructionSection id="hardware" title="Hardware and Performance Optimization" icon={<Wrench className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Optimize your setup for maximum timing precision:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Monitor refresh rate</strong> - Use 120Hz+ for smoother indicator movement and faster visual feedback</li>
                    <li><strong>Input method</strong> - Wired keyboards have lower latency than wireless (1-5ms vs 10-30ms)</li>
                    <li><strong>Key vs button</strong> - The E key and clicking the on-screen button both stop the block; test which feels more consistent for you</li>
                    <li><strong>Mobile play</strong> - On phones and tablets you tap the hand button instead; touch latency varies, so calibrate on the green speed first</li>
                    <li><strong>Game mode optimization</strong> - Enable Windows Game Mode to reduce background interference</li>
                    <li><strong>VSync considerations</strong> - Disable VSync if input lag is noticeable</li>
                    <li><strong>Physical positioning</strong> - Keep hands in comfortable, tension-free position</li>
                    <li><strong>Screen distance</strong> - Position monitor 18-24 inches away for optimal reaction time</li>
                </ul>
                <p className="mt-2">
                    <strong>Input delay testing:</strong> Most systems have 30-50ms total input lag. On the half-second
                    purple speed that is a tenth of the entire sweep, so pressing slightly before the block looks
                    centred is not a trick - it is required.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Training Regimen for Perfect Timing" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Develop reliable repair timing through structured practice:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Warm-up phase (5 mins)</strong> - Start on the green smiley speed (~4-second sweep) to calibrate your timing sense</li>
                    <li><strong>Consistency drills (10 mins)</strong> - Stay on one speed until you are landing the slot on the clear majority of rounds</li>
                    <li><strong>Speed progression (10 mins)</strong> - Cycle up to yellow, then red, moving on only when the previous speed feels automatic</li>
                    <li><strong>Reaction training (5 mins)</strong> - Visit the purple dizzy speed to sharpen raw reaction, even if your hit rate drops</li>
                    <li><strong>Failure recovery (5 mins)</strong> - Rounds chain automatically, so practise resetting instantly after a miss instead of carrying it into the next sweep</li>
                    <li><strong>Cool-down runs (5 mins)</strong> - Drop back a speed and end the session with a clean streak to lock in the tempo</li>
                </ol>
                <p className="mt-2">
                    <strong>Daily practice goal:</strong> 15-30 minutes of focused repair practice builds muscle memory.
                    Consistent daily practice is better than long sporadic sessions.
                </p>
            </InstructionSection>

            <InstructionSection id="psychology" title="Mental Game and Focus Techniques" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Master the psychological aspects of a one-press timing challenge:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Flow state entry</strong> - Clear mind of distractions, focus solely on the slot and the tempo</li>
                    <li><strong>Positive visualization</strong> - Before the sweep starts, picture the block stopping dead-centre in the slot</li>
                    <li><strong>Mistake neutrality</strong> - Don&apos;t dwell on misses; the next round starts within a second, so reset immediately</li>
                    <li><strong>Breathing control</strong> - Use the brief pause before each sweep to exhale and settle</li>
                    <li><strong>Confidence building</strong> - Track your hit rate per speed over time to see real improvement</li>
                    <li><strong>Commitment over hesitation</strong> - With one press per sweep, a confident slightly-early press beats a hesitant late one</li>
                    <li><strong>Autopilot trust</strong> - Once the tempo is learned, let muscle memory execute; overthinking mid-sweep causes late presses</li>
                </ul>
                <p className="mt-2">
                    <strong>Performance insight:</strong> timing accuracy degrades under stress, which is why the fast
                    speeds feel disproportionately hard. Training on red and purple until they feel routine makes the
                    green and yellow sweeps feel effortless when it counts.
                </p>
            </InstructionSection>
        </>
    );
}
