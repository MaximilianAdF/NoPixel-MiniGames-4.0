import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Zap } from "lucide-react";

export default function RoofRunningInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Roof Running?" icon={<Info className="w-5 h-5" />}>
                <p>
                    Roof Running is a &apos;Same Game&apos; style tile-clearing puzzle that challenges your planning, pattern
                    recognition, and speed. The board fills with red, green, and blue blocks, and you must wipe every
                    single one before the timer runs out. In NoPixel 4.0 this minigame triggers when you dismantle
                    AC units during rooftop robberies across Los Santos.
                </p>
                <p>
                    Roof Running blends strategy with time pressure: on the default board you have just 25 seconds to
                    clear an 8x11 grid of 88 blocks. One careless clear can strand a lone block that nothing can ever
                    remove, instantly failing the run. Success requires reading clusters at a glance, anticipating how
                    the board collapses after each clear, and clicking fast.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Rules" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Survey the board</strong> - Red, green, and blue blocks fill a grid (8 rows x 11 columns by default)</li>
                    <li><strong>Identify matching groups</strong> - Find clusters of 2+ same-colour blocks touching horizontally or vertically</li>
                    <li><strong>Click to clear</strong> - Click any block in a valid group to clear every connected same-colour block at once</li>
                    <li><strong>Blocks fall</strong> - Remaining blocks drop downward to fill the gaps (gravity effect)</li>
                    <li><strong>Columns shift left</strong> - Fully emptied columns collapse, sliding the rest of the board left</li>
                    <li><strong>New groups form</strong> - Falling and shifting blocks can merge into fresh clusters for you to clear</li>
                    <li><strong>Clear the entire board</strong> - Remove every block before the timer expires to win</li>
                    <li><strong>Avoid stranding blocks</strong> - A lone block with no way to pair up can never be cleared</li>
                </ol>
                <p className="mt-2">
                    <strong>Critical rules:</strong> Only blocks touching horizontally or vertically count as connected
                    (diagonal doesn&apos;t count). The minimum clearable group is 2 blocks - clicking an isolated single
                    does nothing. You fail instantly if only one block of any colour remains on the board, if no touching
                    pair is left anywhere, or if the timer hits zero.
                </p>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring System and Optimization" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Roof Running keeps scoring simple and honest:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Score = blocks cleared</strong> - Every block you remove counts for one point, whether it fell in a huge clear or a pair</li>
                    <li><strong>Full clear to win</strong> - The round only counts as a success when the entire board is empty (88 blocks on default settings)</li>
                    <li><strong>No partial credit for winning</strong> - Clearing most of the board still ends in failure if anything is stranded or the clock runs out</li>
                    <li><strong>Time is the real currency</strong> - There are no combo or speed multipliers; finishing at all within the timer is the challenge</li>
                    <li><strong>Stats tracking</strong> - Your cleared-block count and completion time are recorded, so faster full clears are how you improve</li>
                </ul>
                <p className="mt-2">
                    <strong>Optimal strategy:</strong> Since every block is worth the same, optimise for board control and
                    speed - clear big groups to keep the board collapsing, and never waste seconds on moves that risk
                    stranding a colour.
                </p>
            </InstructionSection>

            <InstructionSection id="tips" title="Expert Strategic Planning Techniques" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Master-level players use these advanced strategies:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Initial scan priority</strong> - Spot the large groups (5+ blocks) in your first glance at the board</li>
                    <li><strong>Cascade visualization</strong> - Mentally simulate how blocks will fall and shift after each clear</li>
                    <li><strong>Big groups first</strong> - Large clears collapse the most board and create the most new matches</li>
                    <li><strong>Column management</strong> - Track columns holding rare colours that could end up stranded</li>
                    <li><strong>Bottom-up thinking</strong> - Clears near the bottom reshuffle entire columns, so weigh them carefully</li>
                    <li><strong>Isolation prevention</strong> - Never make a clear that leaves a colour as one lone block; that fails instantly</li>
                    <li><strong>Colour counting</strong> - Keep rough track of how many of each colour remain so no colour gets trapped</li>
                    <li><strong>Use the collapse</strong> - Gravity and the left-shift can reunite separated blocks; engineer clears that bring them together</li>
                    <li><strong>Click while you think</strong> - Clear obvious safe groups immediately and plan the tricky endgame as the board shrinks</li>
                    <li><strong>Endgame awareness</strong> - The last few clears decide the run; make sure the final blocks of each colour end up touching</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Levels and Complexity" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Roof Running always uses three colours - difficulty comes from the board size and the clock, both
                    adjustable in the practice settings:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Rows (5-10)</strong> - Taller boards mean longer columns and deeper cascades to predict</li>
                    <li><strong>Columns (5-15)</strong> - Wider boards add more blocks and more left-shifts to track</li>
                    <li><strong>Timer (5-100 seconds)</strong> - The clock is the main difficulty dial; shorter timers demand instant reads</li>
                    <li><strong>Default challenge (8x11, 25 seconds)</strong> - The standard setup: 88 blocks in 25 seconds, matching the on-server pressure</li>
                    <li><strong>Fixed modes</strong> - Daily challenges and 1v1 matches lock the settings, so practise at the defaults to prepare</li>
                </ul>
                <p className="mt-2">
                    <strong>Complexity factors:</strong> Bigger boards = more blocks per second required. Shorter timers =
                    less room to plan. Scattered colour distribution = higher risk of stranding a block. Start roomy, then
                    tighten the timer as you improve.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Critical Mistakes That Cause Failure" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Stranding a single block</strong> - Reducing any colour to one lone block anywhere on the board is an instant fail</li>
                    <li><strong>Not simulating the collapse</strong> - Failing to visualize how blocks fall and shift ruins your plan</li>
                    <li><strong>Overplanning</strong> - Freezing to analyse burns the 25-second clock; obvious clears should be instant</li>
                    <li><strong>Ignoring bottom blocks</strong> - Bottom-row clears have massive cascading effects on the columns above</li>
                    <li><strong>Colour tunnel vision</strong> - Grinding one colour while neglecting others is how the last blocks end up separated</li>
                    <li><strong>Breaking up rare colours</strong> - If a colour is down to a few blocks, keep them connected until you clear them together</li>
                    <li><strong>Clicking dead singles</strong> - Clicking a block with no same-colour neighbour does nothing and wastes time</li>
                    <li><strong>Forgetting the left-shift</strong> - Emptied columns slide the board left, which can split groups you were counting on</li>
                    <li><strong>Over-confidence on easy boards</strong> - Simple layouts can still become unsolvable with bad sequencing</li>
                    <li><strong>Not counting remaining blocks</strong> - Losing track of colour distribution causes dead ends in the endgame</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, Roof Running is the rooftop AC unit robbery activity:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>AC unit theft</strong> - Crews climb onto rooftops and dismantle air-conditioning units for parts</li>
                    <li><strong>The hack trigger</strong> - This tile-clearing puzzle pops when you start stripping a unit</li>
                    <li><strong>Time pressure</strong> - Fumbling the puzzle wastes precious minutes while police response builds</li>
                    <li><strong>Parkour routes</strong> - Reaching the units means climbing and jumping between rooftops, giving the activity its name</li>
                    <li><strong>Fence the loot</strong> - Stolen AC parts are sold on for a payout, making clean fast clears profitable</li>
                    <li><strong>Escape planning</strong> - Crews plan rooftop exit routes before starting, since cops check known roof-running spots</li>
                </ul>
                <p className="mt-2">
                    In roleplay scenarios, criminals who can clear this puzzle quickly and consistently strip more units per
                    run and spend less time exposed on rooftops. A failed puzzle is wasted loot and wasted time while the
                    heat builds.
                </p>
                <p className="mt-2">
                    The minigame&apos;s pressure mirrors the activity itself: one bad decision (a clear that strands a block)
                    ends the attempt, while a clean, planned sequence gets you off the roof with the loot before anyone
                    notices.
                </p>
            </InstructionSection>

            <InstructionSection id="solving" title="Mathematical Solving Strategy" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Approach Roof Running boards systematically:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Step 1: Initial analysis</strong> - Spot the largest groups and any colour that looks scarce or scattered</li>
                    <li><strong>Step 2: Clear the safe groups</strong> - Big clusters far from scarce colours are almost always safe to clear immediately</li>
                    <li><strong>Step 3: Map cascades</strong> - Visualize which clears will drop or shift separated blocks into new groups</li>
                    <li><strong>Step 4: Protect the endgame</strong> - Plan the final clears so the last blocks of each colour finish touching</li>
                    <li><strong>Step 5: Verify as you go</strong> - Before each risky clear, check that no colour will be left as a lone block</li>
                </ol>
                <p className="mt-2">
                    <strong>Solvability test:</strong> The board is lost the moment any colour is down to a single block, or
                    when no touching pair remains anywhere. Separated blocks of the same colour are not dead yet - gravity
                    and the left-shift can reunite them - but every clear you make must keep a path to bringing them together.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Practice Path to Mastery" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build Roof Running expertise through progressive training:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Beginner phase</strong> - Raise the timer in settings and focus on full clears without time pressure</li>
                    <li><strong>Pattern recognition</strong> - Learn common cluster shapes and how they collapse after a clear</li>
                    <li><strong>Cascade training</strong> - Practice predicting exactly how blocks will fall and columns will shift</li>
                    <li><strong>Isolation drills</strong> - Study your failures: identify the exact clear that stranded the losing block</li>
                    <li><strong>Speed solving</strong> - Step the timer down toward the 25-second default as your reads get faster</li>
                    <li><strong>Board scaling</strong> - Grow the grid toward the full 8x11 once smaller boards feel automatic</li>
                    <li><strong>Instant openings</strong> - Train yourself to make the first two or three clears within seconds of the board appearing</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="detection" title="Understanding Unsolvable Detection" icon={<Zap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    The game automatically detects impossible situations and ends the run immediately:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Lone colour</strong> - Exactly one block of any colour remains anywhere on the board; it can never be cleared</li>
                    <li><strong>No valid groups remain</strong> - No two same-colour blocks are touching anywhere, so no clear is possible</li>
                    <li><strong>Timer expiry</strong> - The countdown reaching zero fails the attempt regardless of board state</li>
                </ul>
                <p className="mt-2">
                    When detected, the game ends instantly rather than letting you click in vain. This is helpful for
                    learning - if you hit unsolvable states frequently, you&apos;re not tracking colour counts far enough
                    ahead. Top players rarely see them because they check every risky clear against the lone-block rule.
                </p>
                <p className="mt-2">
                    <strong>Recovery technique:</strong> Separated blocks of the same colour are not an automatic loss. As
                    long as two or more of that colour exist, clears that trigger the right gravity drops and column shifts
                    can bring them back together - this rescue play requires accurate cascade prediction.
                </p>
            </InstructionSection>
        </>
    );
}
