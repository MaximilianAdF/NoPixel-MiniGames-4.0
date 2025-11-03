import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Target } from "lucide-react";

export default function ThermiteInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is the Thermite Hack?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The Thermite minigame is one of the most challenging memory-based puzzles in NoPixel 4.0. 
                    It tests your ability to memorize and recreate complex sequences of highlighted tiles under 
                    intense time pressure. Originally designed to simulate disabling laser security systems during 
                    bank heists, this minigame has become a staple test of criminal skill in the NoPixel universe.
                </p>
                <p>
                    Success requires exceptional pattern recognition, spatial memory, and the ability to stay 
                    calm under pressure. Even experienced players can struggle with higher difficulty levels, 
                    making practice absolutely essential before attempting real heists in-game.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Step by Step" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Wait for the pattern</strong> - The game will display a grid of tiles</li>
                    <li><strong>Watch carefully</strong> as tiles light up one by one in sequence</li>
                    <li><strong>Memorize the exact order</strong> - pay attention to both position and timing</li>
                    <li><strong>Wait for the sequence to end</strong> - don&apos;t click during the display phase</li>
                    <li><strong>Recreate the pattern</strong> - click each tile in the exact same order</li>
                    <li><strong>Complete perfectly</strong> - one wrong click fails the entire attempt</li>
                    <li><strong>Advance to next level</strong> - patterns get longer and faster</li>
                </ol>
            </InstructionSection>

            <InstructionSection id="scoring" title="Understanding the Scoring System" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Your score is calculated using multiple factors. Speed is important, but accuracy is paramount. 
                    The scoring algorithm considers:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Completion time</strong> - Faster recall = higher multiplier</li>
                    <li><strong>Sequence length</strong> - Longer patterns award exponentially more points</li>
                    <li><strong>Difficulty level</strong> - Higher difficulties have better base scores</li>
                    <li><strong>Perfect streaks</strong> - Consecutive successes build combo bonuses</li>
                    <li><strong>First-attempt bonus</strong> - Getting it right on the first try awards extra points</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="tips" title="Advanced Tips & Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Professional players use specific techniques to master Thermite hacks:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Chunking technique</strong> - Break long sequences into groups of 2-3 tiles. Instead of remembering &quot;1-2-3-4-5-6&quot;, think &quot;12, 34, 56&quot;</li>
                    <li><strong>Pattern visualization</strong> - See the sequence as a shape or path across the grid, like drawing a letter or symbol</li>
                    <li><strong>Verbal encoding</strong> - Quietly say positions out loud: &quot;top-left, bottom-right, center, top-right&quot;</li>
                    <li><strong>Muscle memory practice</strong> - Physically move your mouse along the pattern path during display</li>
                    <li><strong>Corner anchoring</strong> - Always note if the pattern starts or ends in a corner - these are easier to remember</li>
                    <li><strong>Elimination of distractions</strong> - Close other apps, mute notifications, focus completely</li>
                    <li><strong>Rehearsal timing</strong> - Mentally replay the sequence 2-3 times before clicking</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Progression Breakdown" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Understanding what to expect at each level helps you prepare mentally:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Beginner (Levels 1-3)</strong> - 3-4 tiles, slow flash speed, wide timing window</li>
                    <li><strong>Intermediate (Levels 4-6)</strong> - 5-6 tiles, moderate speed, requires focused attention</li>
                    <li><strong>Advanced (Levels 7-9)</strong> - 7-8 tiles, fast flashing, minimal margin for error</li>
                    <li><strong>Expert (Levels 10+)</strong> - 9+ tiles, extremely rapid sequences, professional-level skill required</li>
                </ul>
                <p>
                    Many heists in NoPixel require completion of specific difficulty levels. Practice mode allows 
                    you to train at any level, but actual heists lock you into predetermined difficulties based 
                    on the target location.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes to Avoid" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Looking away during the sequence</strong> - Even a split-second distraction can cause you to miss a tile</li>
                    <li><strong>Clicking during the display phase</strong> - Wait until the pattern fully completes before clicking</li>
                    <li><strong>Rushing your response</strong> - Take an extra 2 seconds to mentally confirm the pattern</li>
                    <li><strong>Not tracking the first tile</strong> - Forgetting where the sequence started is the #1 cause of failure</li>
                    <li><strong>Confusing adjacent tiles</strong> - Double-check similar positions like top-left vs top-center</li>
                    <li><strong>Panic clicking after mistakes</strong> - If you mess up early, don&apos;t randomly click hoping to recover</li>
                    <li><strong>Practicing only easy modes</strong> - Challenge yourself with harder difficulties regularly</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In the NoPixel GTA RP server, Thermite hacks are essential for some of the most lucrative 
                    and prestigious criminal activities. These include:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Fleeca Bank robberies</strong> - Entry-level heists requiring basic Thermite skills</li>
                    <li><strong>Paleto Bay Bank</strong> - Intermediate difficulty with higher rewards</li>
                    <li><strong>Pacific Standard Bank</strong> - Advanced Thermite sequences with massive payouts</li>
                    <li><strong>Vault heists</strong> - Multiple Thermite hacks in sequence, expert-level only</li>
                    <li><strong>Jewelry Store robberies</strong> - Occasional Thermite requirements</li>
                </ul>
                <p>
                    Failing a Thermite hack in-game doesn&apos;t just mean losing progress - it alerts police, 
                    wastes expensive materials, and can end your entire heist crew&apos;s operation. This is why 
                    serious criminals in NoPixel spend hours practicing on external trainers before attempting 
                    real jobs.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Training Recommendations" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    To truly master Thermite hacks, follow this practice regimen:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Daily practice</strong> - 15-30 minutes per day builds consistent muscle memory</li>
                    <li><strong>Gradual progression</strong> - Don&apos;t jump to expert mode immediately; master each level first</li>
                    <li><strong>Pressure simulation</strong> - Set personal time limits to simulate heist pressure</li>
                    <li><strong>Review failures</strong> - Understand why you failed specific patterns</li>
                    <li><strong>Compete on leaderboards</strong> - Push yourself against other players&apos; scores</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="memory" title="Memory Enhancement Techniques" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Improve your overall memory capacity for better Thermite performance:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>The Method of Loci</strong> - Associate each grid position with a location in a familiar place</li>
                    <li><strong>Number-shape system</strong> - Assign numbers to positions and remember them as number sequences</li>
                    <li><strong>Color association</strong> - If tiles have colors, link them to memorable objects</li>
                    <li><strong>Story creation</strong> - Build a mini-story about visiting each position in order</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="why" title="Why This Matters" icon={<Target className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Thermite proficiency isn&apos;t just about completing a minigame - it&apos;s a status symbol 
                    in the NoPixel community. Players who can consistently hit 8+ tile sequences are recruited 
                    for elite heist crews, earn respect from their criminal organizations, and unlock access to 
                    the server&apos;s most exclusive content. Master this skill, and you&apos;ll find doors opening 
                    throughout your NoPixel career.
                </p>
            </InstructionSection>
        </>
    );
}
