import InstructionSection from "@/app/components/InstructionSection";
import { Info, Gamepad, Trophy, Lightbulb, TrendingUp, AlertTriangle, Briefcase, GraduationCap, Brain, BookOpen } from "lucide-react";

export default function WordMemoryInstructions() {
    return (
        <>
            <InstructionSection id="overview" title="What is Word Memory?" icon={<Info className="w-5 h-5" />}>
                <p>
                    Word Memory is a cognitive challenge that tests your short-term memory retention, recall accuracy, 
                    and decision-making speed under pressure. Players are presented with individual words one at a time 
                    and must correctly identify whether each word is appearing for the first time (NEW) or has been shown 
                    previously in the current round (SEEN). This minigame simulates the mental acuity and information 
                    retention crucial for intelligence gathering, witness interrogation, and evidence tracking in NoPixel 4.0.
                </p>
                <p>
                    Unlike reflex-based minigames or pattern puzzles, Word Memory is a pure test of cognitive function. 
                    As the word list grows longer, your working memory becomes increasingly taxed, forcing you to develop 
                    sophisticated mental organization strategies to maintain accuracy while racing against time pressure 
                    and the limited mistake allowance.
                </p>
            </InstructionSection>

            <InstructionSection id="howtoplay" title="How to Play - Complete Rules" icon={<Gamepad className="w-5 h-5" />}>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Round begins</strong> - A word appears on screen</li>
                    <li><strong>Make your judgment</strong> - Determine if this word is NEW or has been SEEN before</li>
                    <li><strong>Click your answer</strong> - Press the NEW button (first appearance) or SEEN button (repeat)</li>
                    <li><strong>Receive feedback</strong> - Correct answer awards points, wrong answer counts as strike</li>
                    <li><strong>Next word appears</strong> - Continue identifying words as they appear sequentially</li>
                    <li><strong>Track your strikes</strong> - You have limited mistakes (usually 3) before game over</li>
                    <li><strong>Build your streak</strong> - Consecutive correct answers multiply score</li>
                    <li><strong>Survive as long as possible</strong> - The round continues until you run out of allowed mistakes</li>
                    <li><strong>Final score calculated</strong> - Based on correct identifications, streak multipliers, and survival time</li>
                </ol>
                <p className="mt-2">
                    <strong>Key challenge:</strong> As you see more words, your mental list grows. Early rounds may have 20-30 
                    unique words, while advanced players track 100+ words simultaneously in their memory.
                </p>
            </InstructionSection>

            <InstructionSection id="scoring" title="Scoring System and Performance Metrics" icon={<Trophy className="w-5 h-5" />}>
                <p>
                    Word Memory scoring rewards accuracy and endurance:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Correct identification</strong> - Each right answer awards base points (10-20 pts)</li>
                    <li><strong>Streak multipliers</strong> - Consecutive correct answers build 2x, 3x, 4x+ multipliers</li>
                    <li><strong>Survival time bonus</strong> - Longer rounds award completion bonuses per word survived</li>
                    <li><strong>Perfect rounds</strong> - Zero mistakes grants 3-5x final score multiplier</li>
                    <li><strong>High word count achievements</strong> - Tracking 50+, 75+, 100+ unique words gives bonus points</li>
                    <li><strong>Speed bonuses</strong> - Quick correct answers (under 2 seconds) award reaction bonuses</li>
                    <li><strong>Recovery bonus</strong> - Bouncing back with long streak after a mistake gives resilience points</li>
                </ul>
                <p className="mt-2">
                    <strong>Penalty system:</strong> Each mistake breaks your streak multiplier and uses one strike. 
                    Three strikes ends the round immediately.
                </p>
            </InstructionSection>

            <InstructionSection id="tips" title="Advanced Memory and Recall Strategies" icon={<Lightbulb className="w-5 h-5" />}>
                <p>
                    Expert Word Memory players use sophisticated cognitive techniques:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Categorical chunking</strong> - Mentally group words by category (animals, foods, actions, objects)</li>
                    <li><strong>Alphabetical organization</strong> - Sort words alphabetically in your mind for faster recall</li>
                    <li><strong>Vivid visualization</strong> - Create mental images for each word to enhance encoding</li>
                    <li><strong>Story method</strong> - Link words together in an absurd narrative for better retention</li>
                    <li><strong>First-letter mnemonics</strong> - Remember word initial letters to trigger full recall</li>
                    <li><strong>Rhyme association</strong> - Connect words through rhyming patterns</li>
                    <li><strong>Spatial memory palace</strong> - Place words in imaginary room locations</li>
                    <li><strong>Emotion tagging</strong> - Assign emotional associations to make words memorable</li>
                    <li><strong>Repetition timing</strong> - Mentally rehearse recent words during brief pauses</li>
                    <li><strong>Dual encoding</strong> - Use both verbal (word sound) and visual (word appearance) memory</li>
                </ul>
            </InstructionSection>

            <InstructionSection id="difficulty" title="Difficulty Levels and Progression" icon={<TrendingUp className="w-5 h-5" />}>
                <p>
                    Word Memory difficulty scales through multiple dimensions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Beginner (common short words)</strong> - Cat, dog, run, tree - distinct, easy to remember</li>
                    <li><strong>Intermediate (mixed vocabulary)</strong> - Combination of common and uncommon words, longer words</li>
                    <li><strong>Advanced (similar word traps)</strong> - Cat/cap, run/ran, house/horse - easily confused pairs</li>
                    <li><strong>Expert (complex vocabulary)</strong> - Abstract concepts, scientific terms, multi-syllable words</li>
                    <li><strong>Master (hostile conditions)</strong> - Fast presentation, visual distractions, time pressure</li>
                </ul>
                <p className="mt-2">
                    <strong>Additional difficulty modifiers:</strong> Some modes reduce time per decision, add visual noise, 
                    use homonyms (two/too/to), or intentionally repeat words quickly to catch hasty players.
                </p>
            </InstructionSection>

            <InstructionSection id="mistakes" title="Common Mistakes and Cognitive Traps" icon={<AlertTriangle className="w-5 h-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Similar word confusion</strong> - Mistaking &quot;cat&quot; for &quot;cap&quot; or &quot;run&quot; for &quot;ran&quot;</li>
                    <li><strong>False familiarity</strong> - Thinking a new word seems familiar due to similar words seen earlier</li>
                    <li><strong>Speed-accuracy tradeoff</strong> - Clicking too fast without fully reading the word</li>
                    <li><strong>Recency bias</strong> - Better remembering recent words while forgetting early ones</li>
                    <li><strong>Memory overload</strong> - Not using chunking, trying to remember raw list of 50+ words</li>
                    <li><strong>Second-guessing</strong> - Changing correct initial instinct leads to wrong answer</li>
                    <li><strong>Fatigue accumulation</strong> - Mental exhaustion reduces accuracy as round progresses</li>
                    <li><strong>Panic after mistakes</strong> - One error causes cascade of subsequent mistakes</li>
                    <li><strong>Vowel confusion</strong> - Not carefully reading vowels (bet/bat/bit/but all look similar quickly)</li>
                    <li><strong>Context interference</strong> - Outside thoughts pollute memory with words not in the game</li>
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
                    <li><strong>Peg system</strong> - Associate numbers 1-100 with objects, link words to numbered pegs</li>
                    <li><strong>Dual encoding theory</strong> - Process words both verbally (sound) and visually (appearance)</li>
                    <li><strong>Elaborative rehearsal</strong> - Create meaningful connections between words and existing knowledge</li>
                    <li><strong>Phonological loop training</strong> - Strengthen verbal working memory through subvocalization practice</li>
                    <li><strong>Interference reduction</strong> - Clear mind of distractions, create mental &quot;clean slate&quot; before rounds</li>
                </ul>
                <p className="mt-2">
                    <strong>Research insight:</strong> Studies show that combining visual and verbal encoding increases recall by 40-60% 
                    compared to using only one encoding method.
                </p>
            </InstructionSection>

            <InstructionSection id="training" title="Training Regimen for Memory Mastery" icon={<GraduationCap className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Build elite Word Memory skills through structured practice:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Week 1-2: Foundation building</strong> - Practice with 20-30 word rounds, focus on accuracy over speed</li>
                    <li><strong>Week 3-4: Chunking mastery</strong> - Develop consistent categorization system for all word types</li>
                    <li><strong>Week 5-6: Capacity expansion</strong> - Gradually increase to 50-70 word rounds</li>
                    <li><strong>Week 7-8: Speed development</strong> - Reduce decision time while maintaining accuracy</li>
                    <li><strong>Week 9-10: Distraction resistance</strong> - Practice with background noise, time pressure</li>
                    <li><strong>Week 11-12: Advanced techniques</strong> - Master memory palace or peg systems for 100+ words</li>
                </ol>
                <p className="mt-2">
                    <strong>Daily drill:</strong> 3 rounds of Word Memory upon waking (fresh mind) + 2 rounds before bed (consolidation during sleep).
                </p>
            </InstructionSection>

            <InstructionSection id="cognition" title="Cognitive Science Behind Word Memory" icon={<BookOpen className="w-5 h-5" />} defaultOpen={false}>
                <p>
                    Understanding the brain science improves your approach:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Working memory capacity</strong> - Average person holds 7±2 items, chunking expands this to 20+</li>
                    <li><strong>Serial position effect</strong> - First words (primacy) and recent words (recency) are easiest to recall</li>
                    <li><strong>Encoding specificity</strong> - Words encoded with context/emotion are recalled 3x better</li>
                    <li><strong>Proactive interference</strong> - Earlier words interfere with recalling later similar words</li>
                    <li><strong>Retroactive interference</strong> - New words can overwrite memory of earlier similar words</li>
                    <li><strong>Depth of processing</strong> - Semantic (meaning) processing beats shallow (appearance) processing</li>
                    <li><strong>Cognitive load theory</strong> - Mental exhaustion accumulates, take micro-breaks between words</li>
                </ul>
                <p className="mt-2">
                    <strong>Application:</strong> By understanding these principles, you can strategically organize information to work with 
                    your brain&apos;s natural strengths rather than against its limitations.
                </p>
            </InstructionSection>
        </>
    );
}
