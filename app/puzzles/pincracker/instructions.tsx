import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Zap } from "lucide-react";

export default function PincrackerInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is PIN Cracker?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The PIN Cracker minigame is a logic-based puzzle that challenges your deductive reasoning and
                    pattern recognition skills. Similar to the classic game Mastermind, you must crack a secret PIN
                    code by analyzing color-coded feedback from your guesses. The hidden PIN is built from distinct
                    digits — no digit ever repeats — and in NoPixel 4.0 this hack appears on high-value targets like
                    the Maze Bank.
                </p>
                <p>
                    Unlike minigames that lean purely on speed and reflexes, PIN Cracker rewards methodical thinking
                    and logical deduction. You get unlimited guesses, but a countdown timer (20 seconds by default)
                    keeps the pressure on: read the color clues, eliminate possibilities, and lock in the full code
                    before the clock hits zero.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Guide" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Type your guess</strong> - Press the number keys 0-9 to fill the slots left to right (4 slots by default, 2-6 in settings). On mobile, tap the puzzle and type. Backspace deletes the last digit</li>
                    <li><strong>Submit with Enter or the Crack button</strong> - The guess only submits once every slot is filled. Each digit then gets a color indicator, revealed slot by slot:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong className="text-green-400">Green</strong> - Correct digit in correct position</li>
                            <li><strong className="text-yellow-400">Yellow</strong> - Correct digit but wrong position</li>
                            <li><strong className="text-red-400">Red</strong> - Digit not in the code at all</li>
                        </ul>
                    </li>
                    <li><strong>Analyze the clues</strong> - Use feedback to deduce which digits are correct</li>
                    <li><strong>Make strategic guesses</strong> - Each guess should narrow down possibilities</li>
                    <li><strong>Crack the code</strong> - Turn every slot green before the timer runs out; you have unlimited guesses, only the clock can beat you</li>
                    <li><strong>Use Auto Clear to taste</strong> - By default your guess is wiped after each reveal; turn Auto Clear off in settings to keep it, then backspace only the digits you want to change</li>
                </ol>
            </InstructionSection>

            <InstructionSection id="scoring" title="Winning, Losing, and the Timer" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    PIN Cracker has one simple win condition and one simple fail condition:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Win</strong> - Submit a guess where every slot lights up green before time expires</li>
                    <li><strong>Lose</strong> - The countdown timer reaches zero; there is no attempt limit and a wrong guess never ends the run</li>
                    <li><strong>Default timer</strong> - 20 seconds, adjustable from 5 to 30 seconds in the settings</li>
                    <li><strong>Competitive preset</strong> - Competitive runs use a fixed 4-digit PIN and a 24-second timer</li>
                    <li><strong>1v1 matches</strong> - Both players crack the same 4-digit PIN from a shared seed; first to finish wins</li>
                    <li><strong>Stats tracking</strong> - Your wins, losses, and completion times are recorded, so faster and more consistent cracks are what mastery looks like</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="tips" title="Advanced Deduction Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Professional PIN crackers use these systematic approaches:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Information gathering first guess</strong> - Start with diverse digits like 0123 to maximize information</li>
                    <li><strong>Never repeat a digit within a guess</strong> - The code has no repeated digits, so a duplicate wastes a slot of information</li>
                    <li><strong>Track green positions immediately</strong> - Lock in correct positions and never change them</li>
                    <li><strong>Reposition yellow digits</strong> - A yellow digit is in the code, just not there; try it in the remaining unsolved positions</li>
                    <li><strong>Eliminate red digits completely</strong> - Never use red-marked digits in future guesses</li>
                    <li><strong>Turn Auto Clear off</strong> - Keeping your last guess on screen lets you preserve greens and only retype the slots you are testing</li>
                    <li><strong>Read during the reveal</strong> - The colors appear one slot at a time; plan your next guess while the reveal animation walks across</li>
                    <li><strong>Position-by-position solving</strong> - Focus on cracking one position at a time if stuck</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Settings Explained" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    You control the difficulty yourself through the settings panel:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Pin Length (2-6 digits, default 4)</strong> - Longer codes mean far more possibilities and more slots to confirm</li>
                    <li><strong>Timer (5-30 seconds, default 20)</strong> - A shorter clock forces faster reading and faster typing</li>
                    <li><strong>Auto Clear toggle</strong> - On wipes your guess after each reveal; off keeps it so you can edit with Backspace</li>
                    <li><strong>Competitive mode</strong> - Locked to 4 digits and 24 seconds so every run is comparable</li>
                    <li><strong>Daily challenge</strong> - Uses the pin length and target time set by that day&apos;s challenge</li>
                </ul>
                <p className="mt-2">
                    Note: because digits never repeat, a 4-digit code has 5,040 possible orderings and a 6-digit code
                    has 151,200. Strategic deduction shrinks that fast - random guessing against the clock will not.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes That Waste Time" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Ignoring yellow digit clues</strong> - If a digit is yellow, it MUST be in the code somewhere</li>
                    <li><strong>Re-using eliminated digits</strong> - Red digits are confirmed wrong, never guess them again</li>
                    <li><strong>Not locking green positions</strong> - Once a position is green, keep that digit there</li>
                    <li><strong>Repeating digits in a guess</strong> - The code never contains duplicates, so a repeated digit teaches you nothing new</li>
                    <li><strong>Random guessing</strong> - Unlimited guesses tempt you to spam, but every submission costs reveal time; test a hypothesis instead</li>
                    <li><strong>Forgetting previous feedback</strong> - Review what past guesses told you before making a new one</li>
                    <li><strong>Panicking at the beeps</strong> - The timer beeps as it ticks down; stay methodical instead of mashing digits</li>
                    <li><strong>Waiting to submit</strong> - The Crack button only works once all slots are filled, so type your full guess and fire immediately</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, PIN Cracker appears in critical moments during heists:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>High-security banks</strong> - Bypass electronic locks on targets like the Maze Bank</li>
                    <li><strong>Safe cracking</strong> - Access high-value safes in homes and businesses</li>
                    <li><strong>Security system bypassing</strong> - Break through PIN-protected electronic systems</li>
                </ul>
                <p className="mt-2">
                    Failing the hack mid-heist has serious consequences: wasted time while police respond, burned
                    equipment, or a blown job entirely. Many heist crews assign their best logical thinker to handle
                    PIN Cracker sections because a calm, systematic solver cracks it well inside the timer.
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
                    Guess 1: 0123 → 1 yellow, rest red (eliminate 0, 2, 3; 1 is in the code but not in slot 2)<br/>
                    Guess 2: 4567 → 4 yellow, 7 yellow, rest red (4 and 7 are in the code but wrong positions; eliminate 5, 6)<br/>
                    Guess 3: 7498 → 7 green, 4 green, 9 green, 8 red (positions 1, 2, 3 solved - and the leftover yellow 1 must fill the last slot)<br/>
                    Guess 4: 7491 → SUCCESS!
                </p>
                <p className="mt-2">
                    Guesses are free - only the clock matters - so the real skill is reading each reveal quickly and
                    typing the next guess without hesitation.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Practice Recommendations" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build PIN Cracker mastery with structured practice:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Start with the defaults</strong> - 4 digits and 20 seconds is the baseline; master it before changing anything</li>
                    <li><strong>Stretch the timer while learning</strong> - Set it to 30 seconds to practise perfect logic before adding speed</li>
                    <li><strong>Then squeeze the clock</strong> - Drop toward 5-10 seconds to train fast feedback reading and clean typing</li>
                    <li><strong>Scale up the pin length</strong> - Move to 5-6 digits only after consistent 4-digit success</li>
                    <li><strong>Experiment with Auto Clear</strong> - Try both modes and learn which lets you re-enter refined guesses faster</li>
                    <li><strong>Study failed attempts</strong> - Review what went wrong and how to avoid it</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="math" title="The Mathematics of PIN Cracking" icon={<Zap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Understanding the math helps you appreciate the challenge. Because the code never repeats a digit,
                    the possibilities are permutations, not raw combinations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>2-digit code</strong> - 90 possible orderings (10 × 9)</li>
                    <li><strong>4-digit code</strong> - 5,040 possible orderings (10 × 9 × 8 × 7)</li>
                    <li><strong>6-digit code</strong> - 151,200 possible orderings</li>
                </ul>
                <p className="mt-2">
                    You are racing a 20-second default clock rather than an attempt counter, and each submission spends
                    real time on the slot-by-slot reveal - so guesses are effectively limited by how fast you can read
                    and type. Random guessing has a near-zero success rate, but the color feedback is powerful: a single
                    well-chosen 4-digit guess classifies four digits at once, and two opening guesses can account for
                    eight of the ten digits.
                </p>
                <p className="mt-2">
                    The no-repeat rule is your biggest lever. Every yellow digit must fit in one of the few positions
                    you have not confirmed, and every green permanently removes a slot from consideration - expert
                    players routinely crack the default 4-digit code in three or four quick guesses.
                </p>
            </InstructionSection>
        </>
    );
}
