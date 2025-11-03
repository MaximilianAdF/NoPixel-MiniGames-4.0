import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Wrench } from "lucide-react";

export default function RepairKitInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Repair Kit?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The Repair Kit minigame is a precision timing challenge that tests your rhythm, reaction speed, and 
                    consistency under pressure. Players must hit precise timing windows by pressing keys or clicking at 
                    exact moments as indicators move through repair zones. This minigame simulates the mechanical skill 
                    and focused attention required for vehicle repairs, locksmithing, and technical sabotage in NoPixel 4.0.
                </p>
                <p>
                    Unlike pattern-based puzzles or logic challenges, Repair Kit is pure skill execution. Success depends 
                    on your ability to develop muscle memory, anticipate timing patterns, and maintain perfect consistency 
                    across multiple repair stages. Even a single mistimed input can damage your progress or fail the entire repair.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Mechanics" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Observe the repair interface</strong> - A moving indicator travels across a timing bar</li>
                    <li><strong>Identify the sweet spot</strong> - A highlighted zone shows where to hit (usually center/green area)</li>
                    <li><strong>Track the indicator movement</strong> - Watch the speed and predict when it enters the zone</li>
                    <li><strong>Execute at perfect timing</strong> - Press Space or Click when indicator is in the sweet spot</li>
                    <li><strong>Perfect hit feedback</strong> - Visual/audio confirmation shows success (green flash, success sound)</li>
                    <li><strong>Good hit feedback</strong> - Yellow zones award partial points but may require repeat</li>
                    <li><strong>Miss feedback</strong> - Red zones or missed timing damages progress or fails stage</li>
                    <li><strong>Complete all stages</strong> - Most repairs require 3-7 successful timing hits to finish</li>
                    <li><strong>Final assessment</strong> - Overall accuracy determines repair quality and score</li>
                </ol>
                <p className="mt-2">
                    <strong>Timing zone breakdown:</strong> Green (perfect) = center 10-15% of zone, Yellow (good) = 30-40% around center, 
                    Red (failure) = outer edges or complete miss.
                </p>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring System and Accuracy Tiers" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Repair Kit scoring rewards precision and consistency:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Perfect hits</strong> - Maximum points per stage (100 pts), green indicator flash</li>
                    <li><strong>Good hits</strong> - Reduced points (60-80 pts), yellow indicator, still passes stage</li>
                    <li><strong>Okay hits</strong> - Minimal points (30-50 pts), orange indicator, may require retry</li>
                    <li><strong>Missed hits</strong> - Zero points, red indicator, damages overall progress</li>
                    <li><strong>Perfect repair bonus</strong> - All stages hit perfectly awards 2-3x score multiplier</li>
                    <li><strong>Speed bonuses</strong> - Completing repair quickly without hesitation grants time bonuses</li>
                    <li><strong>Consistency streak</strong> - Multiple perfect hits in a row build combo multipliers</li>
                    <li><strong>Difficulty multipliers</strong> - Harder repairs with faster indicators give better base scores</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="tips" title="Expert Timing and Precision Techniques" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Professional mechanics use these advanced strategies:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Rhythm establishment</strong> - Count the beat of indicator movement (1...2...3...CLICK)</li>
                    <li><strong>Anticipatory timing</strong> - Press slightly before visual arrival to account for reaction delay</li>
                    <li><strong>Visual anchoring</strong> - Focus eyes on the sweet spot, not the moving indicator</li>
                    <li><strong>Audio cues utilization</strong> - Use sound effects to time clicks without looking</li>
                    <li><strong>Breathing sync</strong> - Exhale as you click to reduce tension and improve precision</li>
                    <li><strong>Pre-click tension</strong> - Keep finger hovering over button, ready to execute instantly</li>
                    <li><strong>Speed adaptation</strong> - If indicators speed up between stages, recalibrate timing immediately</li>
                    <li><strong>Input delay compensation</strong> - Learn your system&apos;s lag and press earlier accordingly</li>
                    <li><strong>Mental metronome</strong> - Develop internal timing sense to hit consistently without visual reliance</li>
                    <li><strong>Recovery focus</strong> - After a miss, reset mental state immediately for next stage</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Levels and Progression" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Repair Kit difficulty escalates through multiple factors:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Beginner (slow indicators, large zones)</strong> - 2-3 stages, generous timing windows, perfect for learning</li>
                    <li><strong>Intermediate (medium speed, normal zones)</strong> - 4-5 stages, standard timing windows, requires focus</li>
                    <li><strong>Advanced (fast indicators, smaller zones)</strong> - 5-6 stages, tight timing, demands precision</li>
                    <li><strong>Expert (very fast, tiny zones)</strong> - 6-7 stages, frame-perfect timing needed, professional level</li>
                    <li><strong>Master (variable speed, moving zones)</strong> - Indicators change speed mid-stage, zones shift positions</li>
                </ul>
                <p className="mt-2">
                    <strong>Additional complexity modifiers:</strong> Some advanced repairs include direction changes (indicator reverses), 
                    multi-zone stages (hit two zones in sequence), or distraction elements (screen shake, visual interference).
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes That Ruin Repairs" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Reactive instead of predictive</strong> - Waiting to see indicator in zone causes late hits</li>
                    <li><strong>Overthinking timing</strong> - Hesitation ruins natural rhythm, trust muscle memory</li>
                    <li><strong>Not accounting for lag</strong> - Ignoring input delay consistently causes missed hits</li>
                    <li><strong>Tense fingers/hands</strong> - Muscle tension slows reaction time and reduces accuracy</li>
                    <li><strong>Visual overload</strong> - Watching indicator instead of focusing on sweet spot center</li>
                    <li><strong>Panic clicking</strong> - Mashing multiple times hoping one hits actually reduces accuracy</li>
                    <li><strong>Loss of rhythm</strong> - Breaking tempo between stages ruins timing consistency</li>
                    <li><strong>Fatigue ignorance</strong> - Continuing when tired dramatically reduces precision</li>
                    <li><strong>Hardware issues</strong> - Using wireless peripherals with lag or low monitor refresh rates</li>
                    <li><strong>No warm-up practice</strong> - Starting cold without calibrating timing sense</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, Repair Kits are essential for multiple criminal and civilian activities:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Vehicle emergency repairs</strong> - Fix damaged cars during police chases to continue escape</li>
                    <li><strong>Heist getaway maintenance</strong> - Repair getaway vehicles mid-robbery for reliable escape</li>
                    <li><strong>Racing preparation</strong> - Pre-race tuning and mid-race repairs in street racing circuits</li>
                    <li><strong>Mechanic profession</strong> - Players who work as mechanics use this skill constantly</li>
                    <li><strong>Combat damage recovery</strong> - Repair vehicles after shootouts to remain mobile</li>
                    <li><strong>Locksmithing</strong> - Advanced lock mechanisms require similar timing-based manipulation</li>
                    <li><strong>Sabotage operations</strong> - Reverse repair process to damage competitor vehicles</li>
                </ul>
                <p className="mt-2">
                    In high-pressure scenarios, the difference between life and arrest often comes down to repair speed. 
                    A criminal who can perfectly execute repairs in 10 seconds versus 30 seconds has a massive tactical advantage. 
                    Many criminal organizations specifically recruit members with excellent repair timing skills for high-stakes heists.
                </p>
            </InstructionSection>

            <InstructionSection id="hardware" title="Hardware and Performance Optimization" icon={<Wrench className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Optimize your setup for maximum timing precision:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Monitor refresh rate</strong> - Use 120Hz+ for smoother indicator movement and faster visual feedback</li>
                    <li><strong>Input method</strong> - Wired keyboards have lower latency than wireless (1-5ms vs 10-30ms)</li>
                    <li><strong>Mouse vs keyboard</strong> - Test both, some players prefer clicking, others keyboard timing</li>
                    <li><strong>Response time settings</strong> - Disable mouse acceleration and pointer precision in OS settings</li>
                    <li><strong>Game mode optimization</strong> - Enable Windows Game Mode to reduce background interference</li>
                    <li><strong>VSync considerations</strong> - Disable VSync if input lag is noticeable</li>
                    <li><strong>Physical positioning</strong> - Keep hands in comfortable, tension-free position</li>
                    <li><strong>Screen distance</strong> - Position monitor 18-24 inches away for optimal reaction time</li>
                </ul>
                <p className="mt-2">
                    <strong>Input delay testing:</strong> Most systems have 30-50ms total input lag. Top players compensate by pressing 
                    30-50ms before visual confirmation, effectively predicting the perfect timing.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Training Regimen for Perfect Timing" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Develop world-class repair timing through structured practice:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Warm-up phase (5 mins)</strong> - Start with slowest difficulty to calibrate timing sense</li>
                    <li><strong>Consistency drills (10 mins)</strong> - Practice same difficulty level until 90%+ perfect rate</li>
                    <li><strong>Speed progression (10 mins)</strong> - Gradually increase indicator speed while maintaining accuracy</li>
                    <li><strong>Pressure training (10 mins)</strong> - Practice with music or distractions to simulate stress</li>
                    <li><strong>Failure recovery (5 mins)</strong> - Intentionally miss, then practice recovering rhythm</li>
                    <li><strong>Cool-down perfect runs (5 mins)</strong> - End session with flawless completions to build confidence</li>
                </ol>
                <p className="mt-2">
                    <strong>Daily practice goal:</strong> 30-45 minutes of focused repair practice builds muscle memory. 
                    Consistent daily practice is better than long sporadic sessions.
                </p>
            </InstructionSection>

            <InstructionSection id="psychology" title="Mental Game and Focus Techniques" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Master the psychological aspects of timing challenges:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Flow state entry</strong> - Clear mind of distractions, focus solely on rhythm</li>
                    <li><strong>Positive visualization</strong> - Before starting, visualize perfect execution</li>
                    <li><strong>Mistake neutrality</strong> - Don&apos;t dwell on misses, immediately reset mental state</li>
                    <li><strong>Breathing control</strong> - Deep breaths between stages maintain calm focus</li>
                    <li><strong>Confidence building</strong> - Track improvement over time to build self-belief</li>
                    <li><strong>Pressure inoculation</strong> - Practice with stakes (compete on leaderboards) to handle stress</li>
                    <li><strong>Autopilot trust</strong> - Let muscle memory execute, don&apos;t overthink</li>
                </ul>
                <p className="mt-2">
                    <strong>Performance psychology insight:</strong> Studies show that timing accuracy drops 15-25% under stress. 
                    The best players train specifically under pressure conditions to minimize this degradation.
                </p>
            </InstructionSection>
        </>
    );
}
