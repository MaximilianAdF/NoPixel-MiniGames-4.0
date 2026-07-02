import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, BookOpen } from "lucide-react";

export default function WordMemoryInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Word Memory?" icon={<Info className="w-5 h-5" />}>
                <p>
                    Word Memory is a cognitive challenge that tests your short-term memory retention, recall accuracy,
                    and decision-making speed under pressure. Words are presented one at a time and for each one you must
                    correctly identify whether it is appearing for the first time (NEW) or has been shown
                    previously in the current run (SEEN). This minigame simulates the recall hack used on targets
                    like the Maze Bank in NoPixel 4.0.
                </p>
                <p>
                    Unlike reflex-based minigames or pattern puzzles, Word Memory is a pure test of cognitive function —
                    and it is sudden death. There are no strikes and no second chances: a single wrong call ends the run
                    instantly, and the entire word list shares one countdown. By default you must clear 25 words in
                    25 seconds, which leaves roughly one second per decision.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Rules" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Run begins</strong> - The first word appears, the progress counter starts at 0, and the countdown bar begins draining</li>
                    <li><strong>Make your judgment</strong> - Decide whether this exact word has already appeared earlier in this run</li>
                    <li><strong>Click your answer</strong> - Press the green NEW button (first appearance) or the purple SEEN button (repeat); on mobile, just tap</li>
                    <li><strong>Correct answer</strong> - A short beep confirms it, the counter ticks up, and the next word appears immediately</li>
                    <li><strong>Wrong answer</strong> - The run ends instantly with a fail; there are no strikes and no mistake allowance</li>
                    <li><strong>Beat the clock</strong> - One timer covers the whole run; if it empties before you finish, the run fails</li>
                    <li><strong>Win the run</strong> - Answer every word in the sequence correctly before time runs out</li>
                </ol>
                <p className="mt-2">
                    <strong>Key challenge:</strong> Each run draws from a pool of only half as many unique words as its length —
                    a default 25-word run uses roughly a dozen unique words — so repeats come fast and often. Expect around
                    half of everything you see to be a word you have already answered.
                </p>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring System and Performance Metrics" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Word Memory scoring is simple and unforgiving:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Score = words cleared</strong> - Your score is the number of words you answered correctly before the run ended</li>
                    <li><strong>Progress counter</strong> - The number above the word (e.g. 12/25) shows how far through the sequence you are</li>
                    <li><strong>Win condition</strong> - Clear the entire sequence before the countdown empties</li>
                    <li><strong>Loss conditions</strong> - One wrong SEEN/NEW call, or the timer running out — whichever comes first</li>
                    <li><strong>No partial credit systems</strong> - There are no points-per-word values, streak multipliers, or speed bonuses; a run either succeeds or fails, and the counter is your score</li>
                </ul>
                <p className="mt-2">
                    <strong>What this means in practice:</strong> accuracy is everything. A cautious run that ends on a timeout at
                    20/25 still beats a reckless run that dies on word three — but only a full clear counts as a win.
                </p>
            </InstructionSection>

            <InstructionSection id="tips" title="Advanced Memory and Recall Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Strong Word Memory players lean on a few practical techniques:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Rehearse once, then move on</strong> - Say each NEW word to yourself a single time; light rehearsal sticks far better than passively reading</li>
                    <li><strong>Trust your first instinct</strong> - Your initial familiar/unfamiliar feeling is usually right, and hesitation burns the shared timer</li>
                    <li><strong>Answer at a steady tempo</strong> - The default pace is about one second per word, so build a click rhythm instead of stopping to deliberate</li>
                    <li><strong>Chunk by theme</strong> - Group words you have seen by category (animals, foods, places) so they reinforce each other</li>
                    <li><strong>Expect repeats early</strong> - The unique pool is small, so a word can legitimately repeat within a few rounds — do not dismiss the SEEN feeling just because it feels too soon</li>
                    <li><strong>Vivid visualization</strong> - Attach a quick mental image to each new word to strengthen encoding</li>
                    <li><strong>Read the whole word</strong> - The bank contains lookalike pairs such as &quot;fountain&quot;/&quot;mountain&quot; and &quot;sunrise&quot;/&quot;sunset&quot;; skimming the first letters gets runs killed</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Settings and Game Modes" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Difficulty in Word Memory comes from the two sliders in the practice settings:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Number of Words (20-100)</strong> - Longer runs mean more decisions and a larger unique pool to track (the pool is always half the word count, so a 100-word run juggles about 50 unique words)</li>
                    <li><strong>Timer (20-50 seconds)</strong> - One countdown for the whole run; raising the word count without raising the timer squeezes your time per decision</li>
                    <li><strong>Default</strong> - 25 words in 25 seconds</li>
                </ul>
                <p className="mt-2">
                    <strong>Other modes:</strong> the daily challenge and competitive runs use preset word counts and timers
                    (settings are locked), and 1v1 matches pit both players against the same fixed 25-word sequence. All modes
                    use the same fixed bank of common, distinct words — there are no separate vocabulary tiers or trap-word modes.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes and Cognitive Traps" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Similar word confusion</strong> - Mistaking &quot;fountain&quot; for &quot;mountain&quot; or &quot;sunrise&quot; for &quot;sunset&quot; when skimming</li>
                    <li><strong>False familiarity</strong> - Calling a new word SEEN because it resembles one you actually saw earlier</li>
                    <li><strong>Doubting early repeats</strong> - Answering NEW on a genuine repeat because &quot;it can&apos;t come back that fast&quot; — with a small pool, it can</li>
                    <li><strong>Deliberating too long</strong> - Every second you spend agonizing over one word is stolen from all the words after it</li>
                    <li><strong>Second-guessing</strong> - Overriding a correct first instinct; in a sudden-death format one flipped answer ends everything</li>
                    <li><strong>Recency bias</strong> - Remembering the last few words clearly while the opening words fade</li>
                    <li><strong>Speed-accuracy tradeoff</strong> - Clicking before fully reading the word; a fast wrong answer fails harder than a slow right one</li>
                    <li><strong>Memory overload on long runs</strong> - Trying to hold a raw 40-50 word pool without chunking on high word-count settings</li>
                    <li><strong>Context interference</strong> - Outside thoughts polluting your mental list with words that were never shown</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="nopixel" title="NoPixel Roleplay Context" icon={<Briefcase className="w-5 h-5" />}>
                <p>
                    In NoPixel 4.0, superior memory skills provide crucial advantages:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Police investigations</strong> - Detectives must recall witness statements, evidence details, and suspect information</li>
                    <li><strong>Criminal intelligence</strong> - Remembering gang member names, territory boundaries, and operation details</li>
                    <li><strong>Vehicle tracking</strong> - Recalling license plates during chases without writing them down</li>
                    <li><strong>Business negotiations</strong> - Remembering complex deal terms and client preferences</li>
                    <li><strong>Witness interrogation</strong> - Catching inconsistencies in testimony by recalling earlier statements</li>
                    <li><strong>Code/password retention</strong> - Memorizing safe codes, radio frequencies, and access sequences</li>
                    <li><strong>Evidence correlation</strong> - Linking clues from different crime scenes through memory</li>
                </ul>
                <p className="mt-2">
                    In roleplay scenarios, characters with strong memory become invaluable intelligence assets. Criminal organizations
                    prize members who can remember complex heist plans without written notes (which could be evidence). Police detectives
                    with exceptional memory can connect cases spanning months by recalling details other officers forget.
                </p>
            </InstructionSection>

            <InstructionSection id="techniques" title="Scientific Memory Enhancement Methods" icon={<Brain className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Neuroscience-backed techniques to improve Word Memory performance:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Spaced repetition</strong> - Mentally review word list at increasing intervals (10 words ago, 20 words ago)</li>
                    <li><strong>Active recall practice</strong> - Periodically quiz yourself on recent words without looking</li>
                    <li><strong>Method of Loci</strong> - Place each word in specific location of familiar mental environment</li>
                    <li><strong>Peg system</strong> - Associate numbers with objects, link words to numbered pegs</li>
                    <li><strong>Dual encoding theory</strong> - Process words both verbally (sound) and visually (appearance)</li>
                    <li><strong>Elaborative rehearsal</strong> - Create meaningful connections between words and existing knowledge</li>
                    <li><strong>Phonological loop training</strong> - Strengthen verbal working memory through subvocalization practice</li>
                    <li><strong>Interference reduction</strong> - Clear mind of distractions, create mental &quot;clean slate&quot; before rounds</li>
                </ul>
                <p className="mt-2">
                    <strong>Research insight:</strong> Studies show that combining visual and verbal encoding increases recall
                    compared to using only one encoding method.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Training Regimen for Memory Mastery" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build elite Word Memory skills through structured practice:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Week 1-2: Foundation building</strong> - Practice with 20-30 word runs and a generous timer, focus on accuracy over speed</li>
                    <li><strong>Week 3-4: Chunking mastery</strong> - Develop consistent categorization system for the word bank&apos;s common themes</li>
                    <li><strong>Week 5-6: Capacity expansion</strong> - Gradually increase to 50-70 word runs</li>
                    <li><strong>Week 7-8: Speed development</strong> - Shorten the timer setting to force quicker decisions while maintaining accuracy</li>
                    <li><strong>Week 9-10: Distraction resistance</strong> - Practice with background noise and tight time pressure</li>
                    <li><strong>Week 11-12: Advanced techniques</strong> - Master memory palace or peg systems for 100-word runs (the maximum setting)</li>
                </ol>
                <p className="mt-2">
                    <strong>Daily drill:</strong> 3 runs of Word Memory upon waking (fresh mind) + 2 runs before bed (consolidation during sleep).
                </p>
            </InstructionSection>

            <InstructionSection id="cognition" title="Cognitive Science Behind Word Memory" icon={<BookOpen className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Understanding the brain science improves your approach:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Working memory capacity</strong> - Average person holds 7±2 items, chunking expands this to 20+</li>
                    <li><strong>Serial position effect</strong> - First words (primacy) and recent words (recency) are easiest to recall</li>
                    <li><strong>Encoding specificity</strong> - Words encoded with context/emotion are recalled far better</li>
                    <li><strong>Proactive interference</strong> - Earlier words interfere with recalling later similar words</li>
                    <li><strong>Retroactive interference</strong> - New words can overwrite memory of earlier similar words</li>
                    <li><strong>Depth of processing</strong> - Semantic (meaning) processing beats shallow (appearance) processing</li>
                    <li><strong>Cognitive load theory</strong> - Mental fatigue accumulates over long high word-count runs, so rest between attempts</li>
                </ul>
                <p className="mt-2">
                    <strong>Application:</strong> By understanding these principles, you can strategically organize information to work with
                    your brain&apos;s natural strengths rather than against its limitations.
                </p>
            </InstructionSection>
        </>
    );
}
