import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, Target } from "lucide-react";

export default function ThermiteInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is the Thermite Hack?" icon={<Info className="w-5 h-5" />}>
                <p>
                    The Thermite minigame in NoPixel 4.0 is a chain-reaction puzzle played on a 6×6 grid. Every cell holds a piece with one of three ranges — short, medium, or long — and a status that decays from full to half to empty each time you click it. Your goal is to keep the chain alive: every click highlights a new set of squares determined by the clicked piece&apos;s range, and the only valid next moves are those highlighted squares.
                </p>
                <p>
                    Reach the target score before you click yourself into a corner. Run out of highlighted squares and the hack fails. It tests spatial planning and reading the board — not memorization or twitch reflexes.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Step by Step" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>The board populates</strong> — a 6×6 grid of pieces, with one or more squares highlighted as your starting move</li>
                    <li><strong>Click a highlighted square</strong> — its status drops one step (full → half → empty)</li>
                    <li><strong>Watch the new highlights propagate</strong> — squares within the clicked piece&apos;s range get highlighted as your next legal moves</li>
                    <li><strong>Earn a kill</strong> — taking a square from half to empty scores +1 point</li>
                    <li><strong>Chain combos</strong> — three kills within one second of each other triggers a combo bonus</li>
                    <li><strong>Plan to keep chains going</strong> — every click reassigns the clicked square to a fresh random piece, so your range options keep changing</li>
                    <li><strong>Win at the target score</strong> — reach the target (24 for sewer, 28 for vault) and the hack succeeds</li>
                    <li><strong>Lose if you stall</strong> — if a click highlights zero new squares, you&apos;re out of moves and the hack fails</li>
                </ol>
            </InstructionSection>

            <InstructionSection id="scoring" title="Understanding the Scoring System" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Score comes from two sources: kills and combos. The math is simple but the strategy isn&apos;t.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Kills (+1 each)</strong> — taking a square from half → empty awards one point</li>
                    <li><strong>Combo bonus</strong> — three kills within a one-second rolling window awards <code>2^N</code> points, where N is the number of combos you&apos;ve already chained in this run</li>
                    <li><strong>First combo</strong> = +1 bonus, <strong>second</strong> = +2, <strong>third</strong> = +4, <strong>fourth</strong> = +8, and so on (exponential)</li>
                    <li><strong>Full → half clicks award nothing</strong> — they&apos;re setup moves to position the next kill</li>
                    <li><strong>Target score</strong> — the win condition. Sewer preset = 24, Vault preset = 28</li>
                </ul>
                <p className="mt-3">
                    Late-run combos are wildly more valuable than early ones. A skilled player will set up a fast 3-kill burst near the end rather than collect kills slowly throughout.
                </p>
            </InstructionSection>

            <InstructionSection id="tips" title="Advanced Tips & Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    The chain is everything. Top players think two clicks ahead, not just one:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Know the piece patterns</strong> — short highlights immediate neighbors, medium highlights cells two away on a checkerboard pattern, long reaches three cells out. Each pattern leaves a different set of follow-up options</li>
                    <li><strong>Pre-stage your kills</strong> — click full squares (no score) to leave a cluster of half squares ready to be killed in a fast burst for the combo</li>
                    <li><strong>Combos require speed</strong> — three kills in one second means you need to know your next two clicks before you start. Plan the sequence, then execute</li>
                    <li><strong>Long-range pieces are gold</strong> — they reach across the board and give you the most flexibility for the next click. Save them for when you&apos;re in a corner</li>
                    <li><strong>Avoid dead-end squares</strong> — never click a square if you can predict it will leave zero highlighted cells. That&apos;s game over</li>
                    <li><strong>The reassigned piece is random</strong> — you can&apos;t control what range the clicked square becomes, only what it was. Account for this volatility</li>
                    <li><strong>Edges and corners are dangerous</strong> — they highlight fewer follow-up squares than center cells. Lean toward the middle when you can</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Progression Breakdown" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    The two presets correspond to the in-game heists, but you can also configure custom difficulty in settings:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Sewer Generators</strong> — 6×6 grid, target score 24, 60-second timer. The standard Maze Bank sewer hack</li>
                    <li><strong>Vault</strong> — 6×6 grid, target score 28, 60-second timer. Same board size as sewer but a higher score requirement means you have to chain combos to win in time</li>
                    <li><strong>Custom</strong> — open settings to change grid dimensions, target score, and timer duration. Useful for practicing combo timing on smaller boards or stress-testing your reads on larger ones</li>
                </ul>
                <p>
                    The default preset matches what you&apos;ll see in-game. Practice on Sewer until you&apos;re consistent, then graduate to Vault — the score difference forces you to start using combos.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes to Avoid" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Clicking the first highlighted thing you see</strong> — without checking what it will highlight next, you risk dead-ending the chain</li>
                    <li><strong>Ignoring the piece type before clicking</strong> — short, medium, and long pieces produce wildly different next-move sets. Always check the piece before committing</li>
                    <li><strong>Trying to combo without setup</strong> — combos need three half squares within range of each other. If you don&apos;t pre-stage half squares, you&apos;ll never hit the timing</li>
                    <li><strong>Killing every half square the moment you can</strong> — sometimes you want to leave a half square alive as a future combo piece</li>
                    <li><strong>Treating corners and edges the same as the middle</strong> — corner cells have fewer neighbors at every range, so they&apos;re much higher risk to click</li>
                    <li><strong>Chasing high-value combos when you&apos;re behind on the clock</strong> — sometimes the safer 1-point kill wins the round better than a risky 4-point combo attempt</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, the Thermite minigame is triggered when disabling laser security systems during major heists. The two presets here mirror the actual in-game configurations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Maze Bank sewer generators</strong> — the entry hack for the sewer infiltration route. Lower target score, faster to complete</li>
                    <li><strong>Maze Bank vault</strong> — the final hack inside the vault itself. Higher target score, you need combos to make the timer</li>
                </ul>
                <p>
                    Other heist locations may require Thermite hacks with different parameters, but the mechanic — chain-attack with range-based highlights — is the same everywhere. Practice the core mechanic here and it transfers to whatever the server throws at you.
                </p>
                <p>
                    Failing a Thermite mid-heist wastes the consumable, alerts security, and often ends the crew&apos;s run. This is why every serious heister practices on external trainers before attempting real jobs.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Training Recommendations" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    A productive practice routine looks like:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Start on Sewer</strong> — get to a consistent win rate without using combos. This builds your board-reading reflexes</li>
                    <li><strong>Then practice setups</strong> — on Sewer, deliberately try to land at least one 3-kill combo every run, even if it costs you wins at first</li>
                    <li><strong>Graduate to Vault</strong> — the higher target forces combos. You won&apos;t hit 28 in 60 seconds with single kills alone</li>
                    <li><strong>Shrink the grid</strong> — practice on smaller custom boards (4×4, 5×5) to drill combo timing in a constrained space</li>
                    <li><strong>Review failed runs</strong> — when a hack fails on out-of-moves, replay the last 3 clicks in your head. What should you have clicked instead?</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="memory" title="Reading the Board" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    The mental skill that matters most isn&apos;t memory — it&apos;s rapid pattern recognition. Train these reads:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Range silhouettes</strong> — learn the shape of each piece&apos;s reach. Glance at any piece and immediately see its kill zone</li>
                    <li><strong>Half-square clusters</strong> — scan the board for any 3 half squares within range of a single piece. That&apos;s a combo waiting to happen</li>
                    <li><strong>Branch counting</strong> — before clicking, estimate how many cells the next click will highlight. Aim for clicks that produce more options, not fewer</li>
                    <li><strong>Edge awareness</strong> — develop a habit of mentally flagging which highlighted squares are in corners or edges. Click those last; they have fewer follow-ups</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="why" title="Why This Matters" icon={<Target className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Thermite is the gatekeeper to the most valuable heists in NoPixel — Fleeca, Paleto, Pacific Standard, vault crews. Players who can consistently hit Vault preset under timer pressure get recruited for elite crews and pull the big scores. Practice this mechanic until the chain reads are automatic, and you&apos;ll find yourself trusted with hacks the rest of the server can&apos;t reliably finish.
                </p>
            </InstructionSection>
        </>
    );
}
