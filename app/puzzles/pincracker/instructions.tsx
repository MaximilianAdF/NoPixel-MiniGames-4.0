import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Zap } from "lucide-react";

export default function PincrackerInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is PIN Cracker?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The PIN Cracker minigame is a logic-based puzzle that challenges your deductive reasoning and 
                    pattern recognition skills. Similar to the classic game Mastermind, you must crack a secret PIN 
                    code by analyzing color-coded feedback from your guesses. This minigame simulates the process of 
                    bypassing electronic security systems in NoPixel 4.0, particularly for bank vaults and high-security safes.
                </p>
                <p>
                    Unlike reaction-based minigames like Lockpick or Thermite, PIN Cracker rewards methodical thinking 
                    and logical deduction. Success depends on your ability to systematically eliminate possibilities 
                    and narrow down the correct code through strategic guessing.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Guide" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Enter your first guess</strong> - Type a 4-6 digit PIN using the number pad</li>
                    <li><strong>Submit and observe feedback</strong> - Each digit gets a color indicator:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong className="text-green-400">Green</strong> - Correct digit in correct position</li>
                            <li><strong className="text-yellow-400">Yellow</strong> - Correct digit but wrong position</li>
                            <li><strong className="text-red-400">Red</strong> - Digit not in the code at all</li>
                        </ul>
                    </li>
                    <li><strong>Analyze the clues</strong> - Use feedback to deduce which digits are correct</li>
                    <li><strong>Make strategic guesses</strong> - Each guess should narrow down possibilities</li>
                    <li><strong>Crack the code</strong> - Enter the correct PIN within the attempt limit</li>
                    <li><strong>Track your attempts</strong> - Fewer attempts = higher score and better mastery</li>
                </ol>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring and Performance Metrics" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    PIN Cracker scoring rewards efficiency and deductive reasoning:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Attempt efficiency</strong> - Fewer guesses = exponentially higher scores</li>
                    <li><strong>Time bonus</strong> - Faster cracks award time multipliers</li>
                    <li><strong>First-try perfection</strong> - Cracking on attempt #1 gives massive bonus (nearly impossible!)</li>
                    <li><strong>Difficulty multiplier</strong> - Longer PINs (5-6 digits) award better scores</li>
                    <li><strong>Streak bonuses</strong> - Consecutive successful cracks build score multipliers</li>
                    <li><strong>Perfect deduction</strong> - Using optimal strategy awards bonus points</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="tips" title="Advanced Deduction Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Professional PIN crackers use these systematic approaches:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Information gathering first guess</strong> - Start with diverse digits like 1234 or 0567 to maximize information</li>
                    <li><strong>Track green positions immediately</strong> - Lock in correct positions and never change them</li>
                    <li><strong>Reposition yellow digits</strong> - If a digit is yellow, try it in every other position systematically</li>
                    <li><strong>Eliminate red digits completely</strong> - Never use red-marked digits in future guesses</li>
                    <li><strong>Process of elimination tables</strong> - Mentally (or physically) track which digits are ruled out for each position</li>
                    <li><strong>Binary search strategy</strong> - Divide possible solutions in half with each guess</li>
                    <li><strong>Pattern recognition</strong> - Common PIN patterns (1111, 1234, etc.) are rarely used in harder modes</li>
                    <li><strong>Position-by-position solving</strong> - Focus on cracking one position at a time if stuck</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Levels Explained" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    PIN Cracker difficulty scales based on code length and allowed attempts:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Easy Mode (4 digits, 8 attempts)</strong> - Perfect for learning the mechanics and basic deduction</li>
                    <li><strong>Normal Mode (4 digits, 6 attempts)</strong> - Requires efficient guessing strategy</li>
                    <li><strong>Hard Mode (5 digits, 7 attempts)</strong> - Significantly more combinations, demands logical thinking</li>
                    <li><strong>Expert Mode (6 digits, 8 attempts)</strong> - Professional-level deduction required</li>
                    <li><strong>Nightmare Mode (6 digits, 6 attempts)</strong> - Nearly perfect play needed, one mistake can fail you</li>
                </ul>
                <p className="mt-2">
                    Note: A 4-digit code has 10,000 possible combinations (0000-9999). A 6-digit code has 1,000,000 
                    combinations. Strategic deduction is essential - random guessing will fail.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes That Waste Attempts" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Ignoring yellow digit clues</strong> - If a digit is yellow, it MUST be in the code somewhere</li>
                    <li><strong>Re-using eliminated digits</strong> - Red digits are confirmed wrong, never guess them again</li>
                    <li><strong>Not locking green positions</strong> - Once a position is green, keep that digit there</li>
                    <li><strong>Random guessing</strong> - Every guess should strategically test a hypothesis</li>
                    <li><strong>Forgetting previous feedback</strong> - Review all past guesses before making a new one</li>
                    <li><strong>Panicking under pressure</strong> - Take time to think even when attempts are running low</li>
                    <li><strong>Not tracking eliminations</strong> - Mental notes aren&apos;t enough for 5-6 digit codes</li>
                    <li><strong>Changing locked digits</strong> - Never modify a position that has already shown green</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, PIN Cracker appears in critical moments during heists:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Bank vault security</strong> - Bypass electronic locks on vault doors</li>
                    <li><strong>ATM hacking</strong> - Crack PIN codes to steal from ATMs</li>
                    <li><strong>Safe cracking</strong> - Access high-value safes in homes and businesses</li>
                    <li><strong>Security system disabling</strong> - Override alarm PINs</li>
                    <li><strong>Evidence tampering</strong> - Access police evidence systems (extremely risky)</li>
                </ul>
                <p className="mt-2">
                    Failed PIN Cracker attempts in NoPixel have serious consequences: alerting police, 
                    locking out the system permanently, or even triggering silent alarms. Many heist crews 
                    assign their best logical thinker to handle PIN Cracker sections because failure means 
                    the entire job is compromised.
                </p>
            </InstructionSection>

            <InstructionSection id="strategy" title="Optimal Solving Strategy" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Here&apos;s a proven step-by-step approach for 4-digit codes:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Guess 1: Information gathering</strong> - Try 0123 or 4567 to test diverse digits</li>
                    <li><strong>Analyze Guess 1 results:</strong>
                        <ul className="list-disc pl-5 mt-1">
                            <li>Lock any green positions</li>
                            <li>Note all yellow digits and their current wrong positions</li>
                            <li>Eliminate all red digits from future consideration</li>
                        </ul>
                    </li>
                    <li><strong>Guess 2: Reposition yellows</strong> - Move yellow digits to different positions while keeping greens locked</li>
                    <li><strong>Guess 3: Fill gaps</strong> - Use untested digits for remaining unknown positions</li>
                    <li><strong>Guess 4: Final deduction</strong> - By now you should have enough info to deduce the exact code</li>
                </ol>
                <p className="mt-3">
                    <strong>Example walkthrough:</strong><br/>
                    Target code: 7491 (unknown to player)<br/>
                    Guess 1: 0123 → All red (eliminate 0,1,2,3)<br/>
                    Guess 2: 4567 → 4 yellow, 7 yellow (4 and 7 are in code but wrong positions)<br/>
                    Guess 3: 7498 → 7 green, 4 green, 9 green, 8 red (positions 1,2,3 solved!)<br/>
                    Guess 4: 7491 → SUCCESS! ✅
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Practice Recommendations" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build PIN Cracker mastery with structured practice:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Start with 4-digit codes</strong> - Master the fundamentals before advancing</li>
                    <li><strong>Track your average attempts</strong> - Aim to consistently crack in 4-5 guesses or less</li>
                    <li><strong>Practice without time pressure</strong> - Focus on perfect logic before adding speed</li>
                    <li><strong>Study failed attempts</strong> - Review what went wrong and how to avoid it</li>
                    <li><strong>Compete on leaderboards</strong> - Compare your efficiency with top crackers</li>
                    <li><strong>Increase difficulty gradually</strong> - Move to 5-6 digits only after consistent 4-digit success</li>
                    <li><strong>Pen and paper practice</strong> - Write out elimination tables for complex codes</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="math" title="The Mathematics of PIN Cracking" icon={<Zap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Understanding the math helps you appreciate the challenge:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>4-digit code</strong> - 10,000 possible combinations (10^4)</li>
                    <li><strong>5-digit code</strong> - 100,000 possible combinations (10^5)</li>
                    <li><strong>6-digit code</strong> - 1,000,000 possible combinations (10^6)</li>
                </ul>
                <p className="mt-2">
                    With only 6-8 attempts allowed, random guessing has a near-zero success rate. However, 
                    with optimal strategy using color-coded feedback, expert players can crack 4-digit codes 
                    in an average of 4.5 attempts, and 6-digit codes in 6-7 attempts.
                </p>
                <p className="mt-2">
                    Each guess provides valuable information: with 10 possible digits and 4 positions, 
                    a single guess can theoretically give you up to 40 bits of information through the 
                    color feedback system.
                </p>
            </InstructionSection>
        </>
    );
}
