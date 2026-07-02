export default function LockpickInstructions() {
    return (
        <>
            <h3 className="text-lg font-semibold text-[#54FFA4] mt-0">Understanding Lockpicking in NoPixel</h3>
            <p>
                The Lockpick minigame is one of the most fundamental skills in NoPixel 4.0, representing
                the mechanical process of bypassing vehicle and property locks. It&apos;s a rotating-ring
                colour-match puzzle: the lock is drawn as a set of concentric rings dotted with red, yellow,
                and blue pins, with colour-coded slots fixed just outside each ring. Your job is to rotate
                each ring until every slot sits over a pin of its own colour - or over no pin at all - and
                then commit to the unlock.
            </p>
            <p>
                There is no sweeping needle and no click-timing window here. The whole lock runs on a single
                countdown (20 seconds by default for 4 rings), so the pressure comes from reading colours
                quickly and rotating efficiently across every ring before the clock hits zero.
            </p>

            <h3 className="text-lg font-semibold text-[#54FFA4]">How to Play - Detailed Breakdown</h3>
            <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Read the lock</strong> - The default lock has 4 concentric rings; the innermost ring is active first</li>
                <li><strong>Tell pins from slots</strong> - The filled coloured dots (pins) sit on the ring and rotate with it; the short coloured arcs just outside the ring are the slots, and they never move</li>
                <li><strong>Rotate the active ring</strong> - Press LEFT ARROW / A or RIGHT ARROW / D (or the on-screen buttons) to turn it one notch at a time; each ring has 12 positions spaced 30&deg; apart</li>
                <li><strong>Line up the colours</strong> - Every slot must be either empty (no pin beneath it) or sitting over a pin of the same colour</li>
                <li><strong>Unlock</strong> - Press ENTER or SPACE to confirm. If every slot checks out, the ring locks in and the next ring outward becomes active</li>
                <li><strong>Clear every ring</strong> - Unlock all the rings before the timer runs out to pick the lock</li>
                <li><strong>Don&apos;t guess</strong> - Unlocking while any slot covers a wrong-colour pin bends the lockpick instantly and fails the whole attempt</li>
            </ol>

            <h3 className="text-lg font-semibold text-[#54FFA4]">Scoring and Win Conditions</h3>
            <p>
                There are no bonus points, multipliers, or precision ratings - the lock only cares about
                clean alignments:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Score = rings cleared</strong> - Each successful unlock advances you one ring; your score is how many rings you cleared</li>
                <li><strong>Win</strong> - Clear every ring before the countdown ends</li>
                <li><strong>Instant loss</strong> - Pressing Unlock with even one mismatched pin under a slot bends the pick and ends the run on the spot</li>
                <li><strong>Timeout loss</strong> - The countdown covers the entire lock, not each ring; if it expires mid-ring, the attempt fails</li>
                <li><strong>Audio feedback</strong> - A success chime plays each time a ring clears, and the timer ticks audibly every second so you can track the clock without looking away</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#54FFA4]">Professional Tips & Techniques</h3>
            <p>
                Experienced lockpickers use these strategies to achieve consistent success:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Scan before you spin</strong> - Read the slot colours first, then look for the matching pin pattern; aimless rotating burns the shared timer</li>
                <li><strong>Rotate the short way</strong> - With only 12 positions per ring, a valid alignment is never more than six notches away; count the gap and turn in the cheaper direction</li>
                <li><strong>Empty slots are free</strong> - A slot with no pin beneath it is already satisfied; you only need to check the occupied ones</li>
                <li><strong>Verify every occupied slot</strong> - Before pressing Unlock, sweep around the whole ring once; a single overlooked mismatch ends the run</li>
                <li><strong>Bank time on the inner rings</strong> - The countdown is shared across all rings, so clearing early rings quickly leaves breathing room for the later ones</li>
                <li><strong>Use the chime</strong> - The success sound confirms a cleared ring, letting you snap your eyes to the next ring immediately</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#54FFA4]">Practice Settings and Difficulty</h3>
            <p>
                In practice mode you can tune the lock to make drills easier or harder than the default:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Levels (2-10)</strong> - Sets how many rings the lock has; the default is 4</li>
                <li><strong>Timer (5-100 seconds)</strong> - Sets the countdown for the whole lock; the default is 20 seconds</li>
                <li><strong>Ring makeup is random</strong> - Each ring generates with roughly 5-12 pins and 4-7 slots in random colours, so no two locks read the same</li>
                <li><strong>Fixed-rule modes</strong> - Daily challenges and 1v1 matches run on their own fixed rules, so custom settings only apply to free practice</li>
            </ul>
            <p>
                A good progression: shorten the timer at 4 rings until unlocks feel automatic, then add
                rings to train sustained focus across a longer lock.
            </p>

            <h3 className="text-lg font-semibold text-[#54FFA4]">Common Mistakes That Cost Lockpicks</h3>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Unlocking on a partial check</strong> - Confirming after matching the two or three slots in front of you while a mismatched pin hides on the far side of the ring</li>
                <li><strong>Trying to fill empty slots</strong> - Rotating to put a pin under every slot wastes time; empty slots are already safe</li>
                <li><strong>Confusing pins with slots</strong> - The pins move with the ring, the slots don&apos;t; mixing them up makes alignments look wrong when they aren&apos;t</li>
                <li><strong>Rotating the long way around</strong> - Spinning eight notches when the match was four notches the other way doubles your time spent per ring</li>
                <li><strong>Fixating on one ring</strong> - The timer covers the whole lock; a perfect but slow first ring can still doom the attempt</li>
                <li><strong>Rushing the final ring</strong> - Most bent picks happen on the last ring under time pressure; one calm verification sweep is faster than a restart</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#54FFA4]">NoPixel Roleplay Applications</h3>
            <p>
                Lockpicking is used constantly throughout NoPixel criminal roleplay for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Vehicle theft</strong> - Stealing cars for joyriding, chopping, or resale is the classic trigger for this minigame</li>
                <li><strong>Boosting contracts</strong> - Timed vehicle-theft jobs where a failed pick can blow the whole run</li>
                <li><strong>Locked doors and properties</strong> - Various buildings and secured areas use the same rotating-ring lock</li>
            </ul>
            <p>
                On the server, a failed pick bends the lockpick, costs you the item, and can draw unwanted
                attention - which is exactly why criminals drill the minigame in a free trainer first.
            </p>

            <h3 className="text-lg font-semibold text-[#54FFA4]">Controls Reference</h3>
            <p>
                <strong>LEFT ARROW / A</strong> - Rotate the active ring counter-clockwise (one notch per press)<br/>
                <strong>RIGHT ARROW / D</strong> - Rotate the active ring clockwise (one notch per press)<br/>
                <strong>ENTER / SPACE</strong> - Attempt the unlock on the current ring<br/>
                <strong>ON-SCREEN BUTTONS</strong> - Rotate Left, Rotate Right, and Unlock work by mouse or touch
            </p>

            <h3 className="text-lg font-semibold text-[#54FFA4]">Why Lockpicking Mastery Is Essential</h3>
            <p>
                Unlike optional minigames, lockpicking is mandatory for criminal success in NoPixel - you&apos;ll
                face this lock every time you go for a vehicle. Because one mismatched pin or an expired timer
                fails the entire attempt, consistency matters more than flash: the players who read colours
                fast, rotate the short way, and verify before unlocking are the ones who get into cars cleanly
                on the first try.
            </p>
            <p>
                Master the rotating rings here and you&apos;ll never fumble a pick when it counts - fail to
                practise, and you&apos;ll keep bending lockpicks at the worst possible moments in the city.
            </p>
        </>
    );
}
