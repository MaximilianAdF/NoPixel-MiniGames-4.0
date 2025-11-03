import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Zap } from "lucide-react";

export default function RoofRunningInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Roof Running?" icon={<Info className="w-5 h-5" />}>
                <p>
                    Roof Running is a strategic tile-matching puzzle game that challenges your planning, pattern recognition, 
                    and forward-thinking abilities. Players must clear colored tiles from the board by matching groups of 
                    three or more adjacent tiles of the same color. This minigame simulates the quick decision-making and 
                    route planning required during parkour escapes across Los Santos rooftops in NoPixel 4.0.
                </p>
                <p>
                    Unlike reflex-based minigames, Roof Running is a pure strategy challenge where every move matters. 
                    One wrong clear can make the board unsolvable, leaving you with isolated tiles. Success requires 
                    visualizing cascading effects, planning multiple moves ahead, and understanding tile physics as 
                    groups collapse and shift after clearing.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Rules" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Survey the board</strong> - Colored tiles are arranged in a grid pattern</li>
                    <li><strong>Identify matching groups</strong> - Find clusters of 3+ adjacent tiles (horizontal or vertical)</li>
                    <li><strong>Click to select and clear</strong> - Click any tile in a valid group to clear all connected same-color tiles</li>
                    <li><strong>Tiles collapse</strong> - Remaining tiles fall downward to fill gaps (gravity effect)</li>
                    <li><strong>Tiles shift left</strong> - Empty columns cause remaining columns to shift left</li>
                    <li><strong>Chain reactions possible</strong> - New groups may form after tiles collapse</li>
                    <li><strong>Clear the entire board</strong> - Remove all tiles to complete the level successfully</li>
                    <li><strong>Avoid unsolvable states</strong> - If only singles/pairs remain, you&apos;ve failed</li>
                </ol>
                <p className="mt-2">
                    <strong>Critical rules:</strong> Only tiles touching horizontally or vertically count as adjacent 
                    (diagonal doesn&apos;t count). Minimum group size is 3 tiles. The game automatically detects 
                    unsolvable states and ends the attempt.
                </p>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring System and Optimization" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Roof Running scoring rewards strategic planning:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Group size multiplier</strong> - 3 tiles = base points, 4 tiles = 1.5x, 5+ tiles = 2x or higher</li>
                    <li><strong>Combo cascades</strong> - Chain reactions from falling tiles multiply score exponentially</li>
                    <li><strong>Move efficiency bonus</strong> - Clearing board in fewer moves awards completion bonuses</li>
                    <li><strong>Perfect clear reward</strong> - Removing every single tile gives massive bonus points</li>
                    <li><strong>Large group priority</strong> - Clearing 6+ tile groups in single move gives special bonuses</li>
                    <li><strong>Color diversity bonus</strong> - Balanced clearing across all colors prevents penalties</li>
                    <li><strong>Time bonuses</strong> - Faster solves award speed multipliers on some difficulty levels</li>
                </ul>
                <p className="mt-2">
                    <strong>Optimal strategy:</strong> Maximum score comes from clearing largest possible groups first, 
                    then engineering cascades through strategic tile positioning.
                </p>
            </InstructionSection>

            <InstructionSection id="tips" title="Expert Strategic Planning Techniques" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Master-level players use these advanced strategies:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Initial scan priority</strong> - Identify all large groups (5+ tiles) before making first move</li>
                    <li><strong>Cascade visualization</strong> - Mentally simulate how tiles will fall after each clear</li>
                    <li><strong>Corner preservation</strong> - Keep corner tiles connected to maintain solving options</li>
                    <li><strong>Column management</strong> - Track which columns have isolated colors that could become stuck</li>
                    <li><strong>Bottom-up thinking</strong> - Consider bottom-row moves carefully as they affect entire columns</li>
                    <li><strong>Isolation prevention</strong> - Never create single tiles or 2-tile pairs with no expansion possibility</li>
                    <li><strong>Color balancing</strong> - Monitor color distribution to avoid trapping minority colors</li>
                    <li><strong>Forced move recognition</strong> - Identify moves that MUST be made eventually and time them optimally</li>
                    <li><strong>Dead-end detection</strong> - Recognize board states that will lead to unsolvability several moves ahead</li>
                    <li><strong>Optimal path planning</strong> - For max scores, plan full solving sequence before first click</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Levels and Complexity" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Roof Running difficulty scales across multiple factors:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Beginner (3 colors, small grid)</strong> - Forgiving layouts with obvious large groups, easy to solve</li>
                    <li><strong>Intermediate (4 colors, medium grid)</strong> - Requires basic planning, some tricky positions</li>
                    <li><strong>Advanced (5 colors, large grid)</strong> - Multiple solution paths, need to think ahead 3-4 moves</li>
                    <li><strong>Expert (6+ colors, large grid)</strong> - Narrow solution paths, one wrong move can fail attempt</li>
                    <li><strong>Master (6+ colors, complex layouts)</strong> - Intentionally difficult starting positions requiring perfect play</li>
                </ul>
                <p className="mt-2">
                    <strong>Complexity factors:</strong> More colors = harder to match. Scattered distribution = more planning needed. 
                    Unbalanced color ratios = higher risk of isolation. Larger boards = more moves to track mentally.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Critical Mistakes That Cause Failure" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Clearing 3-tile groups prematurely</strong> - Save small groups for later, prioritize large groups</li>
                    <li><strong>Not simulating tile collapse</strong> - Failing to visualize how tiles shift ruins planning</li>
                    <li><strong>Creating isolated singles</strong> - A single tile with no same-color neighbors is unremovable</li>
                    <li><strong>Ignoring bottom tiles</strong> - Bottom-row clears have massive cascading effects</li>
                    <li><strong>Reactive instead of proactive</strong> - Making moves without considering next 2-3 steps</li>
                    <li><strong>Color tunnel vision</strong> - Focusing on one color while neglecting others leads to isolation</li>
                    <li><strong>Rushing without planning</strong> - First instinct is often wrong, take time to analyze</li>
                    <li><strong>Missing cascade opportunities</strong> - Not recognizing potential chain reactions wastes points</li>
                    <li><strong>Over-confidence on easy boards</strong> - Simple layouts can still become unsolvable with bad sequencing</li>
                    <li><strong>Not counting remaining tiles</strong> - Losing track of color distribution causes dead ends</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, Roof Running represents parkour escapes and rooftop navigation:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Police chase escapes</strong> - Navigate rooftops during high-speed pursuits</li>
                    <li><strong>Heist getaway routes</strong> - Plan optimal escape paths after bank robberies</li>
                    <li><strong>Tactical positioning</strong> - Access advantageous rooftop positions for shootouts</li>
                    <li><strong>Stealth infiltration</strong> - Enter secure areas via rooftop access points</li>
                    <li><strong>Criminal hideouts</strong> - Reach hidden rooftop meeting spots</li>
                    <li><strong>Urban exploration</strong> - Discover shortcuts and secret routes across the city</li>
                </ul>
                <p className="mt-2">
                    In roleplay scenarios, criminals who master roof running have a significant advantage in foot chases. 
                    The ability to plan optimal parkour routes under pressure separates professional criminals from amateurs. 
                    Police officers also use roof running skills to cut off escape routes and maintain pursuit from elevated positions.
                </p>
                <p className="mt-2">
                    The minigame&apos;s strategic planning mirrors real parkour: one bad jump (move) can end your escape route 
                    (make board unsolvable), while perfect route planning allows for smooth, efficient escapes with room for 
                    improvisation.
                </p>
            </InstructionSection>

            <InstructionSection id="solving" title="Mathematical Solving Strategy" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Approach Roof Running puzzles systematically:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Step 1: Initial analysis</strong> - Count total tiles per color, identify largest groups</li>
                    <li><strong>Step 2: Identify forced moves</strong> - Find groups that MUST be cleared to avoid isolation</li>
                    <li><strong>Step 3: Map cascades</strong> - Visualize which clears will create new groups via tile collapse</li>
                    <li><strong>Step 4: Build move tree</strong> - Plan sequence of 3-5 moves that maintain solvability</li>
                    <li><strong>Step 5: Execute with checkpoints</strong> - After each move, verify board remains solvable</li>
                </ol>
                <p className="mt-2">
                    <strong>Solvability test:</strong> A board is solvable if and only if you can find a sequence where no 
                    color becomes completely isolated (all instances are singles or pairs with no expansion options). Work 
                    backwards from the goal state (empty board) to verify your move sequence.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Practice Path to Mastery" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build Roof Running expertise through progressive training:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Beginner phase</strong> - Focus on completing boards, don&apos;t worry about move efficiency</li>
                    <li><strong>Pattern recognition</strong> - Learn common group formations and how they collapse</li>
                    <li><strong>Cascade training</strong> - Practice predicting exactly how tiles will fall and shift</li>
                    <li><strong>Isolation drills</strong> - Intentionally create near-failures to learn what NOT to do</li>
                    <li><strong>Speed solving</strong> - Once mechanics are mastered, add time pressure</li>
                    <li><strong>Move optimization</strong> - Challenge yourself to solve in minimum possible moves</li>
                    <li><strong>Mental simulation</strong> - Practice solving boards completely in your head before clicking</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="detection" title="Understanding Unsolvable Detection" icon={<Zap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    The game automatically detects impossible situations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>No valid groups remain</strong> - All remaining tiles are singles or pairs</li>
                    <li><strong>Isolated colors</strong> - A color exists only as disconnected singles</li>
                    <li><strong>Unmatchable pairs</strong> - Two tiles of same color exist but cannot be connected</li>
                </ul>
                <p className="mt-2">
                    When detected, the game immediately ends to save time. This is helpful for learning - if you hit 
                    unsolvable states frequently, it means you&apos;re not planning far enough ahead. Top players rarely 
                    see unsolvable states because they verify each move maintains solvability.
                </p>
                <p className="mt-2">
                    <strong>Recovery technique:</strong> If you realize you&apos;re one move away from unsolvable, some 
                    boards allow escape by clearing specific groups that reunite isolated colors through tile collapse. 
                    This requires advanced cascade prediction.
                </p>
            </InstructionSection>
        </>
    );
}
