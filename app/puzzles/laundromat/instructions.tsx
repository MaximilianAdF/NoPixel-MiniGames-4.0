import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Eye } from "lucide-react";

export default function LaundryInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Laundromat?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The Laundromat minigame is a fast-paced pattern matching and memory challenge that tests your visual 
                    recognition speed and cognitive processing under time pressure. Players must quickly identify and match 
                    symbols, patterns, or sequences as they appear on a grid, simulating the rapid decision-making and 
                    attention to detail required in high-stakes NoPixel money laundering operations.
                </p>
                <p>
                    Unlike logic puzzles like PIN Cracker or reflex tests like Lockpick, Laundromat combines elements of 
                    both memory (tracking symbol positions) and speed (racing against the clock). Success requires a balance 
                    of quick pattern recognition, strategic board scanning, and maintaining focus under increasing pressure.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Mechanics" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Observe the board layout</strong> - Symbols, icons, or patterns appear on a grid</li>
                    <li><strong>Identify matching pairs</strong> - Find two identical symbols/patterns to match</li>
                    <li><strong>Click/tap to select</strong> - First click selects, second click attempts match</li>
                    <li><strong>Match confirmed</strong> - Correct matches disappear and award points</li>
                    <li><strong>Match failed</strong> - Wrong matches may flip back or incur time/point penalties</li>
                    <li><strong>Build combos</strong> - Consecutive correct matches multiply your score</li>
                    <li><strong>Beat the timer</strong> - Clear all pairs before time runs out for maximum score</li>
                    <li><strong>Chain bonuses</strong> - Rapid matching awards speed multipliers</li>
                </ol>
                <p className="mt-2">
                    <strong>Key gameplay variants:</strong> Some versions use card flipping (memory game style), 
                    others use symbol matching (match-3 style), and advanced modes combine both mechanics with 
                    moving or rotating symbols.
                </p>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring System and Multipliers" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Laundromat scoring rewards both speed and accuracy:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Base match points</strong> - Each correct match awards foundational points</li>
                    <li><strong>Combo multipliers</strong> - Consecutive matches build 2x, 3x, 4x+ multipliers</li>
                    <li><strong>Speed bonuses</strong> - Rapid matching (under 2 seconds per match) grants bonus points</li>
                    <li><strong>Time remaining bonus</strong> - Finishing with extra time awards completion bonuses</li>
                    <li><strong>Perfect clear rewards</strong> - Zero mistakes gives perfect score multiplier</li>
                    <li><strong>Chain reaction bonuses</strong> - Matching adjacent pairs in sequence awards extra points</li>
                    <li><strong>Difficulty scaling</strong> - Harder boards with more symbols give better base scores</li>
                </ul>
                <p className="mt-2">
                    <strong>Penalty system:</strong> Wrong matches may deduct points, reduce combo multipliers, 
                    or add time penalties depending on difficulty level.
                </p>
            </InstructionSection>

            <InstructionSection id="tips" title="Expert Pattern Recognition Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Professional Laundromat players use these advanced techniques:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Initial board scan</strong> - Spend the first 2-3 seconds scanning the entire board before making first match</li>
                    <li><strong>Quadrant strategy</strong> - Divide board into sections, clear one section at a time systematically</li>
                    <li><strong>Peripheral vision training</strong> - Use your full field of view to spot matches without direct focus</li>
                    <li><strong>Pattern chunking</strong> - Group similar symbols mentally to reduce cognitive load</li>
                    <li><strong>Priority matching</strong> - Clear obvious pairs first to build early combo momentum</li>
                    <li><strong>Memory palace technique</strong> - Mentally map symbol positions using spatial memory</li>
                    <li><strong>Rhythm maintenance</strong> - Develop consistent matching rhythm to maximize combo uptime</li>
                    <li><strong>Mistake recovery</strong> - If you break a combo, immediately find an easy match to restart streak</li>
                    <li><strong>Edge-to-center clearing</strong> - Start at board edges and work inward for better coverage</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Levels and Progression" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Laundromat difficulty scales across multiple dimensions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Beginner (3x3 or 4x4 grid)</strong> - Few symbol types, generous timer, perfect for learning mechanics</li>
                    <li><strong>Intermediate (4x5 or 5x5 grid)</strong> - More symbols, tighter timer, requires focus</li>
                    <li><strong>Advanced (6x6 or 6x8 grid)</strong> - Many symbol types, moderate time pressure, demands memory skills</li>
                    <li><strong>Expert (8x8 grid)</strong> - High symbol variety, strict timer, professional-level pattern recognition needed</li>
                    <li><strong>Master (dynamic boards)</strong> - Symbols rotate, move, or swap positions, extreme difficulty</li>
                </ul>
                <p className="mt-2">
                    <strong>Additional difficulty modifiers:</strong> Some versions add distracting animations, similar-looking 
                    symbols, color variations, or time-limited matches that expire if not cleared quickly.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes to Avoid" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Panic clicking</strong> - Random clicking hoping to get lucky destroys combo streaks</li>
                    <li><strong>Tunnel vision</strong> - Focusing on one board area while missing easier matches elsewhere</li>
                    <li><strong>Ignoring combos</strong> - Not prioritizing combo maintenance leaves points on the table</li>
                    <li><strong>Memory overload</strong> - Trying to remember too many positions at once leads to confusion</li>
                    <li><strong>Breaking rhythm</strong> - Hesitating too long between matches kills momentum</li>
                    <li><strong>No board scan</strong> - Starting immediately without surveying the board wastes early seconds</li>
                    <li><strong>Chasing perfection</strong> - Spending too long looking for the perfect match wastes time</li>
                    <li><strong>Distraction susceptibility</strong> - Letting animations or visual effects break concentration</li>
                    <li><strong>Late-game panic</strong> - Rushing carelessly when timer runs low causes preventable mistakes</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, the Laundromat minigame represents the money laundering process:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Cash cleaning operations</strong> - Wash dirty money through legitimate business fronts</li>
                    <li><strong>Transaction processing</strong> - Match financial records to obscure illegal fund sources</li>
                    <li><strong>Time-sensitive operations</strong> - Police raids can interrupt, making speed critical</li>
                    <li><strong>Batch processing</strong> - Larger heists require multiple successful laundry runs</li>
                    <li><strong>Heat management</strong> - Faster completion = less law enforcement attention</li>
                    <li><strong>Profit margins</strong> - Better scores = higher money retention after laundering fees</li>
                </ul>
                <p className="mt-2">
                    In roleplay, criminals use laundromats, car washes, and arcades as fronts for money laundering. 
                    The minigame simulates sorting and processing financial transactions under the pressure of potential 
                    police investigation. High-level criminal organizations assign their most detail-oriented members to 
                    laundry operations because mistakes can alert the police or result in money seizure.
                </p>
            </InstructionSection>

            <InstructionSection id="memory" title="Memory Techniques and Cognitive Training" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Improve your Laundromat performance with memory science:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Spatial memory mapping</strong> - Associate symbol positions with physical locations (top-left, center-right, etc.)</li>
                    <li><strong>Chunking method</strong> - Group 3-4 symbols together as single memory units</li>
                    <li><strong>Visual mnemonics</strong> - Create mental stories linking similar symbols</li>
                    <li><strong>Pattern recognition drills</strong> - Practice identifying common symbol arrangements offline</li>
                    <li><strong>Working memory expansion</strong> - Gradually increase how many positions you can track simultaneously</li>
                    <li><strong>Attention training</strong> - Practice maintaining focus during timed activities in daily life</li>
                    <li><strong>Speed reading techniques</strong> - Train your visual processing speed with rapid image recognition</li>
                </ul>
                <p className="mt-2">
                    Studies show that regular practice of matching games improves general cognitive abilities including 
                    processing speed, working memory capacity, and visual attention span.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Practice Path to Mastery" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build Laundromat expertise through structured practice:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Week 1: Fundamentals</strong> - Focus on accuracy over speed, master matching mechanics</li>
                    <li><strong>Week 2: Speed building</strong> - Gradually reduce time per match while maintaining accuracy</li>
                    <li><strong>Week 3: Combo management</strong> - Practice maintaining combos even under pressure</li>
                    <li><strong>Week 4: Board scanning</strong> - Develop quick initial assessment skills</li>
                    <li><strong>Week 5: Memory drills</strong> - Work on tracking more symbol positions simultaneously</li>
                    <li><strong>Week 6: Advanced patterns</strong> - Move to larger grids and more complex symbol sets</li>
                </ol>
                <p className="mt-2">
                    <strong>Daily practice routine:</strong> 5 warm-up matches → 10 timed challenges → 5 accuracy-focused matches → 
                    Review mistakes and patterns
                </p>
            </InstructionSection>

            <InstructionSection id="visual" title="Visual Processing Optimization" icon={<Eye className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Maximize your visual pattern recognition abilities:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Screen distance</strong> - Position monitor 20-28 inches away for optimal peripheral vision use</li>
                    <li><strong>Brightness/contrast</strong> - Adjust settings so symbols are clearly distinguishable</li>
                    <li><strong>Eye movement minimization</strong> - Train to use peripheral vision instead of constant eye darting</li>
                    <li><strong>Blink management</strong> - Blink consciously during symbol clearing to prevent eye strain</li>
                    <li><strong>Focus point strategy</strong> - Keep eyes centered on board, let peripherals detect matches</li>
                    <li><strong>Color sensitivity</strong> - If color-blind, focus on symbol shapes rather than colors</li>
                    <li><strong>Reduce visual distractions</strong> - Minimize background movement and screen clutter</li>
                </ul>
                <p className="mt-2">
                    Pro tip: Many expert players slightly unfocus their eyes to see the board holistically rather than 
                    fixating on individual symbols, allowing faster overall pattern detection.
                </p>
            </InstructionSection>
        </>
    );
}
