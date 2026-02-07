// SEO Page Data for TutorTom Brain Games
// Each page is optimized for specific keywords and search intent

export interface GameInfo {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  benefits: string[];
  improves: string[];
  howToPlay: string[];
  keywords: string[];
  metaDescription: string;
}

export interface SEOPage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  keywords: string[];
  content: string;
  games: string[]; // which games to feature
}

// Game data with full SEO content
export const games: GameInfo[] = [
  {
    slug: "word-memory",
    name: "Word Memory Test",
    emoji: "🧠",
    tagline: "Challenge Your Verbal Memory",
    description: "The Word Memory Test measures your ability to remember and recall words. You'll see 5 words briefly, then identify them from a larger set. This test evaluates your verbal memory, a key cognitive function used daily in reading, conversations, and learning.",
    benefits: [
      "Strengthens verbal memory and recall",
      "Improves vocabulary retention",
      "Enhances reading comprehension",
      "Boosts learning and studying efficiency",
      "Helps with name and information recall"
    ],
    improves: [
      "Short-term memory",
      "Verbal recall",
      "Word recognition",
      "Language processing",
      "Cognitive flexibility"
    ],
    howToPlay: [
      "Memorize 5 words shown for 5 seconds",
      "Identify the original words from 10 options",
      "Click on words you remember seeing",
      "Score based on correct identifications"
    ],
    keywords: ["word memory test", "verbal memory", "vocabulary test", "word recall", "memory game words"],
    metaDescription: "Test and improve your verbal memory with TutorTom's Word Memory Test. Memorize words, challenge your recall, and track your cognitive performance. Free online brain game."
  },
  {
    slug: "number-memory",
    name: "Number Memory Test",
    emoji: "🔢",
    tagline: "Test Your Numerical Recall",
    description: "The Number Memory Test challenges your ability to remember sequences of numbers. You'll memorize a 6-digit number and recall it accurately. This tests your numerical memory, essential for remembering phone numbers, codes, and mathematical operations.",
    benefits: [
      "Improves number retention",
      "Strengthens working memory",
      "Helps with PIN and password recall",
      "Enhances mathematical thinking",
      "Boosts sequential memory"
    ],
    improves: [
      "Numerical memory",
      "Working memory capacity",
      "Attention to detail",
      "Sequential processing",
      "Mental arithmetic"
    ],
    howToPlay: [
      "View a 6-digit number for 5 seconds",
      "Type the number from memory",
      "Partial credit for correct digits",
      "Score based on accuracy"
    ],
    keywords: ["number memory test", "digit span test", "numerical memory", "remember numbers", "sequence memory"],
    metaDescription: "Challenge your numerical memory with TutorTom's Number Memory Test. Memorize digit sequences and improve your working memory. Free online cognitive test."
  },
  {
    slug: "chimp-test",
    name: "Chimp Test",
    emoji: "🐵",
    tagline: "Beat the Chimpanzee Challenge",
    description: "The Chimp Test is based on research showing chimpanzees can outperform humans in short-term memory tasks. Memorize the positions of numbered squares and click them in order after they disappear. Can you match a chimp's memory?",
    benefits: [
      "Tests visual-spatial memory",
      "Improves pattern recognition",
      "Enhances quick memorization",
      "Builds concentration skills",
      "Challenges your memory limits"
    ],
    improves: [
      "Visual memory",
      "Spatial awareness",
      "Quick thinking",
      "Pattern recognition",
      "Focus and concentration"
    ],
    howToPlay: [
      "View numbered squares (1-5) for 5 seconds",
      "Numbers disappear but squares remain",
      "Click squares in numerical order",
      "Up to 3 mistakes allowed"
    ],
    keywords: ["chimp test", "chimpanzee memory test", "visual memory test", "spatial memory", "sequence memory game"],
    metaDescription: "Take the famous Chimp Test and challenge your visual memory. Can you beat a chimpanzee at this memory game? Free online brain test at TutorTom."
  },
  {
    slug: "catch-the-fish",
    name: "Catch the Fish",
    emoji: "🐟",
    tagline: "Test Your Reaction Speed",
    description: "Catch the Fish is a fun reaction time test that measures how quickly you can respond to visual stimuli. Click on fish as they appear to test your reflexes, hand-eye coordination, and processing speed.",
    benefits: [
      "Measures reaction time accurately",
      "Improves hand-eye coordination",
      "Enhances visual processing speed",
      "Builds quick decision making",
      "Fun way to test reflexes"
    ],
    improves: [
      "Reaction time",
      "Hand-eye coordination",
      "Visual processing",
      "Motor skills",
      "Alertness"
    ],
    howToPlay: [
      "Fish appear randomly on screen",
      "Click each fish as fast as possible",
      "Avoid clicking empty areas",
      "10 seconds to catch as many as you can"
    ],
    keywords: ["reaction time test", "reflex test", "click speed test", "hand eye coordination", "reaction game"],
    metaDescription: "Test your reaction time with Catch the Fish! Measure your reflexes and hand-eye coordination with this fun brain game. Free at TutorTom."
  },
  {
    slug: "math-speed",
    name: "Math Speed Test",
    emoji: "➕",
    tagline: "Calculate Under Pressure",
    description: "The Math Speed Test challenges your mental arithmetic abilities under time pressure. Solve addition problems quickly to measure your numerical processing speed and mathematical fluency.",
    benefits: [
      "Improves mental math speed",
      "Strengthens numerical fluency",
      "Builds calculation confidence",
      "Enhances cognitive processing",
      "Great for daily brain exercise"
    ],
    improves: [
      "Mental arithmetic",
      "Processing speed",
      "Numerical reasoning",
      "Focus under pressure",
      "Mathematical confidence"
    ],
    howToPlay: [
      "Solve 5 addition problems",
      "10 seconds per problem",
      "Type your answer quickly",
      "Score based on correct answers"
    ],
    keywords: ["math speed test", "mental math", "arithmetic test", "quick math", "math brain game"],
    metaDescription: "Test your mental math speed with TutorTom's Math Speed Test. Solve problems under pressure and improve your numerical processing. Free brain training."
  },
  {
    slug: "speed-match",
    name: "Speed Match",
    emoji: "🔷",
    tagline: "Match Shapes at Lightning Speed",
    description: "Speed Match tests your visual memory and pattern recognition. Determine if the current shape matches the previous one. This n-back style test measures working memory and processing speed.",
    benefits: [
      "Trains working memory",
      "Improves pattern recognition",
      "Enhances visual processing",
      "Builds quick decision making",
      "Tests cognitive flexibility"
    ],
    improves: [
      "Working memory",
      "Visual recognition",
      "Processing speed",
      "Decision making",
      "Attention span"
    ],
    howToPlay: [
      "Watch shapes appear one by one",
      "Decide if current shape matches previous",
      "Click Yes or No quickly",
      "15 rounds total"
    ],
    keywords: ["speed match", "pattern matching", "n-back test", "visual memory game", "shape memory"],
    metaDescription: "Play Speed Match and test your pattern recognition skills. Match shapes quickly to train your working memory. Free brain game at TutorTom."
  }
];

// Category and keyword-targeted SEO pages
export const seoPages: SEOPage[] = [
  // Main category pages
  {
    slug: "brain-games",
    title: "Free Brain Games Online | TutorTom",
    h1: "Free Brain Games to Sharpen Your Mind",
    metaDescription: "Play free brain games online at TutorTom. Test memory, reaction time, and cognitive skills with fun daily challenges. No signup required.",
    keywords: ["brain games", "free brain games", "online brain games", "brain training games", "mind games"],
    content: "Challenge your mind with our collection of scientifically-designed brain games. Each game targets different cognitive abilities including memory, processing speed, and problem-solving. Play daily to track your improvement and keep your brain sharp.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "memory-games",
    title: "Memory Games Online Free | Test Your Memory | TutorTom",
    h1: "Memory Games to Boost Your Recall",
    metaDescription: "Play free memory games online. Test and improve your short-term memory, verbal recall, and visual memory with TutorTom's brain training games.",
    keywords: ["memory games", "memory test", "memory training", "improve memory", "memory games online"],
    content: "Train your memory with games designed to challenge different types of recall. From verbal memory to numerical sequences and visual patterns, our memory games help strengthen the neural pathways responsible for storing and retrieving information.",
    games: ["word-memory", "number-memory", "chimp-test", "speed-match"]
  },
  {
    slug: "cognitive-tests",
    title: "Free Cognitive Tests Online | Brain Assessment | TutorTom",
    h1: "Free Cognitive Tests to Measure Your Brain Power",
    metaDescription: "Take free cognitive tests online. Assess your memory, reaction time, processing speed, and mental agility with TutorTom's brain assessment tools.",
    keywords: ["cognitive test", "cognitive assessment", "brain test", "mental assessment", "cognitive ability test"],
    content: "Our cognitive tests measure key mental abilities that affect daily life. From memory capacity to processing speed, these assessments give you insights into your cognitive strengths and areas for improvement.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "reaction-time-test",
    title: "Reaction Time Test Online Free | Test Your Reflexes | TutorTom",
    h1: "Test Your Reaction Time",
    metaDescription: "Measure your reaction time with our free online reflex test. See how fast your reflexes are compared to average. Quick, fun, and accurate.",
    keywords: ["reaction time test", "reflex test", "reaction test", "how fast are my reflexes", "reaction speed test"],
    content: "How fast are your reflexes? Our reaction time test measures how quickly you respond to visual stimuli. The average human reaction time is around 250ms. Test yours and see where you rank!",
    games: ["catch-the-fish"]
  },
  {
    slug: "brain-training",
    title: "Brain Training Games Free | Daily Mental Exercise | TutorTom",
    h1: "Daily Brain Training for a Sharper Mind",
    metaDescription: "Free brain training games to exercise your mind daily. Improve memory, focus, and cognitive skills with scientifically-designed challenges.",
    keywords: ["brain training", "brain exercises", "mental training", "cognitive training", "brain workout"],
    content: "Keep your brain fit with daily training exercises. Just like physical fitness, mental fitness requires regular exercise. Our brain training games target memory, attention, processing speed, and problem-solving skills.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "iq-test",
    title: "Free IQ Test Online | Quick Intelligence Test | TutorTom",
    h1: "Quick Intelligence Assessment",
    metaDescription: "Take a free quick IQ test online. Test your cognitive abilities including memory, processing speed, and problem-solving. Instant results.",
    keywords: ["iq test", "intelligence test", "iq test free", "quick iq test", "online iq test"],
    content: "While not a formal IQ test, our cognitive assessments measure key components of intelligence including working memory, processing speed, and pattern recognition. Complete all tests to get a comprehensive brain score.",
    games: ["word-memory", "number-memory", "chimp-test", "math-speed", "speed-match"]
  },
  {
    slug: "mental-fitness",
    title: "Mental Fitness Games | Keep Your Brain Healthy | TutorTom",
    h1: "Mental Fitness for Brain Health",
    metaDescription: "Improve your mental fitness with brain games. Keep your mind sharp and healthy with daily cognitive exercises. Free to play at TutorTom.",
    keywords: ["mental fitness", "brain health", "mind fitness", "cognitive health", "brain wellness"],
    content: "Mental fitness is as important as physical fitness. Regular cognitive exercise helps maintain brain health, improves memory, and may help prevent cognitive decline. Play our games daily for best results.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-exercises",
    title: "Brain Exercises Online Free | Mental Workouts | TutorTom",
    h1: "Brain Exercises for Mental Fitness",
    metaDescription: "Free brain exercises to workout your mind. Strengthen memory, improve focus, and boost cognitive performance with TutorTom's mental workouts.",
    keywords: ["brain exercises", "mental exercises", "brain workout", "mind exercises", "cognitive exercises"],
    content: "Exercise your brain with targeted mental workouts. Each exercise focuses on different cognitive skills, providing a complete mental fitness routine. Regular practice leads to measurable improvements.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "mind-games",
    title: "Mind Games Online Free | Fun Brain Challenges | TutorTom",
    h1: "Mind Games to Challenge Your Brain",
    metaDescription: "Play free mind games online. Fun and challenging games that test your mental abilities. Exercise your brain with TutorTom's mind games.",
    keywords: ["mind games", "brain challenges", "mental games", "thinking games", "puzzle games mind"],
    content: "Challenge your mind with our collection of engaging brain games. These aren't just fun - they're designed to test and improve different cognitive abilities while keeping you entertained.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-health",
    title: "Brain Health Games | Cognitive Wellness | TutorTom",
    h1: "Games for Brain Health",
    metaDescription: "Support your brain health with cognitive games. Exercise your mind daily to maintain mental sharpness and cognitive wellness.",
    keywords: ["brain health", "cognitive wellness", "brain health games", "mental wellness", "healthy brain"],
    content: "Taking care of your brain health is essential at every age. Our games provide enjoyable mental stimulation that supports cognitive wellness. Make brain exercise part of your daily routine.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  // Keyword-targeted pages
  {
    slug: "free-brain-games",
    title: "Free Brain Games | No Download No Signup | TutorTom",
    h1: "100% Free Brain Games - Play Instantly",
    metaDescription: "Play free brain games instantly. No download, no signup required. Test memory, reaction time, and cognitive skills. Start playing now!",
    keywords: ["free brain games", "brain games free", "free mind games", "free cognitive games", "play brain games free"],
    content: "All our brain games are completely free to play. No downloads, no signups, no hidden costs. Just click and start training your brain immediately. Access from any device with a web browser.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "online-brain-games",
    title: "Online Brain Games | Play in Browser | TutorTom",
    h1: "Play Brain Games Online",
    metaDescription: "Play brain games online in your browser. No app needed. Test and train your cognitive abilities with fun online challenges.",
    keywords: ["online brain games", "brain games online", "browser brain games", "play brain games online", "web brain games"],
    content: "Play brain games directly in your browser. Our online platform works on desktop, tablet, and mobile devices. Train your brain anywhere, anytime without downloading any apps.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "best-brain-games",
    title: "Best Brain Games 2024 | Top Cognitive Games | TutorTom",
    h1: "Best Brain Games for Cognitive Training",
    metaDescription: "Discover the best brain games for memory, focus, and mental fitness. Play top-rated cognitive games free at TutorTom.",
    keywords: ["best brain games", "top brain games", "best mind games", "best cognitive games", "top memory games"],
    content: "Our brain games are designed based on cognitive science research. Each game targets specific mental abilities and provides meaningful challenges that adapt to your skill level.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-games-for-adults",
    title: "Brain Games for Adults | Mental Exercise | TutorTom",
    h1: "Brain Games Designed for Adults",
    metaDescription: "Brain games specifically designed for adult cognitive training. Keep your mind sharp with challenging memory and thinking games.",
    keywords: ["brain games for adults", "adult brain games", "brain training adults", "mental games adults", "cognitive games adults"],
    content: "These brain games are designed with adult cognitive needs in mind. Whether you're looking to maintain mental sharpness, improve work performance, or just enjoy challenging yourself, our games provide the right level of difficulty.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-games-for-seniors",
    title: "Brain Games for Seniors | Memory Games Elderly | TutorTom",
    h1: "Brain Games for Seniors and Elderly",
    metaDescription: "Brain games designed for seniors. Easy-to-play memory and cognitive games that help maintain mental sharpness in older adults.",
    keywords: ["brain games for seniors", "senior brain games", "memory games elderly", "cognitive games seniors", "brain exercises seniors"],
    content: "Cognitive exercise is especially important as we age. Our games provide gentle but effective mental stimulation. The simple interfaces and clear instructions make them accessible for all ages.",
    games: ["word-memory", "number-memory", "speed-match"]
  },
  {
    slug: "daily-brain-games",
    title: "Daily Brain Games | Daily Mental Exercise | TutorTom",
    h1: "Daily Brain Games for Mental Fitness",
    metaDescription: "Play daily brain games to keep your mind sharp. Quick cognitive exercises you can do every day. Build a brain training habit.",
    keywords: ["daily brain games", "daily brain training", "daily mental exercise", "everyday brain games", "brain games daily"],
    content: "Make brain training a daily habit. Our quick games can be completed in just a few minutes, making it easy to fit cognitive exercise into your daily routine. Consistency is key to improvement.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "quick-brain-games",
    title: "Quick Brain Games | Fast Mental Exercises | TutorTom",
    h1: "Quick Brain Games You Can Play Anytime",
    metaDescription: "Play quick brain games that take just minutes. Perfect for a mental break. Fast cognitive exercises for busy schedules.",
    keywords: ["quick brain games", "fast brain games", "short brain games", "quick mind games", "brain games short"],
    content: "Don't have much time? Our quick brain games take just 1-2 minutes each. Perfect for a mental break during work, commuting, or whenever you have a few spare moments.",
    games: ["catch-the-fish", "speed-match", "math-speed"]
  },
  {
    slug: "fun-brain-games",
    title: "Fun Brain Games | Enjoyable Mental Challenges | TutorTom",
    h1: "Fun Brain Games That Don't Feel Like Work",
    metaDescription: "Play fun brain games that are actually enjoyable. Challenging but entertaining cognitive games that make brain training fun.",
    keywords: ["fun brain games", "entertaining brain games", "enjoyable mind games", "fun cognitive games", "brain games fun"],
    content: "Brain training doesn't have to be boring. Our games are designed to be genuinely fun and engaging while still providing meaningful cognitive challenges. Enjoy yourself while getting smarter!",
    games: ["catch-the-fish", "chimp-test", "speed-match", "word-memory"]
  },
  {
    slug: "memory-test-online",
    title: "Memory Test Online Free | Check Your Memory | TutorTom",
    h1: "Free Online Memory Test",
    metaDescription: "Take a free memory test online. Check your short-term memory, working memory, and recall abilities. Instant results.",
    keywords: ["memory test online", "online memory test", "free memory test", "memory test free", "test my memory"],
    content: "How good is your memory? Take our comprehensive memory tests to assess different aspects of your memory including verbal recall, numerical memory, and visual-spatial memory.",
    games: ["word-memory", "number-memory", "chimp-test", "speed-match"]
  },
  {
    slug: "short-term-memory-test",
    title: "Short Term Memory Test Free | STM Assessment | TutorTom",
    h1: "Short Term Memory Test",
    metaDescription: "Test your short-term memory with our free assessment. See how well you can remember information briefly. Quick online test.",
    keywords: ["short term memory test", "stm test", "short memory test", "immediate memory test", "brief memory test"],
    content: "Short-term memory holds information for seconds to minutes. Our tests measure how well you can briefly store and recall words, numbers, and visual patterns - essential for daily cognitive function.",
    games: ["word-memory", "number-memory", "chimp-test"]
  },
  {
    slug: "visual-memory-test",
    title: "Visual Memory Test Online Free | Picture Memory | TutorTom",
    h1: "Visual Memory Test",
    metaDescription: "Test your visual memory online. See how well you remember positions, patterns, and visual information. Free visual memory assessment.",
    keywords: ["visual memory test", "picture memory test", "spatial memory test", "visual recall test", "image memory test"],
    content: "Visual memory is your ability to remember what you see. Our visual memory tests assess how well you can remember positions, patterns, and shapes - skills important for navigation, face recognition, and more.",
    games: ["chimp-test", "speed-match"]
  },
  {
    slug: "working-memory-test",
    title: "Working Memory Test Free | Cognitive Assessment | TutorTom",
    h1: "Working Memory Assessment",
    metaDescription: "Test your working memory capacity with our free assessment. Measure how much information you can hold and manipulate mentally.",
    keywords: ["working memory test", "working memory assessment", "cognitive memory test", "mental workspace test", "memory capacity test"],
    content: "Working memory is your mental workspace - the ability to hold and manipulate information in your mind. It's crucial for reasoning, learning, and comprehension. Test yours with our assessments.",
    games: ["number-memory", "speed-match", "chimp-test"]
  },
  {
    slug: "improve-memory",
    title: "Improve Memory | Memory Enhancement Games | TutorTom",
    h1: "Games to Improve Your Memory",
    metaDescription: "Improve your memory with targeted brain games. Practice memory skills and build stronger recall. Free memory improvement exercises.",
    keywords: ["improve memory", "memory improvement", "better memory", "enhance memory", "strengthen memory"],
    content: "Memory can be improved with practice. Our games challenge different memory systems, helping you build stronger recall through regular exercise. Track your progress and see improvement over time.",
    games: ["word-memory", "number-memory", "chimp-test", "speed-match"]
  },
  {
    slug: "memory-training",
    title: "Memory Training Games Free | Train Your Recall | TutorTom",
    h1: "Memory Training Exercises",
    metaDescription: "Train your memory with free exercises designed to improve recall. Build stronger memory skills with daily practice.",
    keywords: ["memory training", "memory exercises", "train memory", "memory practice", "memory drills"],
    content: "Like any skill, memory improves with training. Our memory exercises provide structured practice to strengthen your recall abilities. Regular training leads to measurable improvements.",
    games: ["word-memory", "number-memory", "chimp-test", "speed-match"]
  },
  {
    slug: "reaction-time-test-online",
    title: "Reaction Time Test Online | Measure Your Reflexes | TutorTom",
    h1: "Online Reaction Time Test",
    metaDescription: "Measure your reaction time online for free. See your reflex speed in milliseconds and compare to average. Quick and accurate test.",
    keywords: ["reaction time test online", "online reflex test", "reaction speed test", "measure reaction time", "reflexes test online"],
    content: "Your reaction time is how quickly you respond to stimuli. The average human reaction time is about 250 milliseconds. Our test measures your reaction time accurately and shows how you compare.",
    games: ["catch-the-fish"]
  },
  {
    slug: "test-your-reflexes",
    title: "Test Your Reflexes Online Free | Reflex Speed Test | TutorTom",
    h1: "Test Your Reflexes",
    metaDescription: "How fast are your reflexes? Take our free reflex test to find out. Measure your reaction speed with our fun click test.",
    keywords: ["test reflexes", "reflex test", "how fast are my reflexes", "check reflexes", "reflex speed"],
    content: "Curious about your reflexes? Our reflex test measures how quickly you can respond to visual stimuli. Great for gamers, athletes, or anyone interested in their reaction speed.",
    games: ["catch-the-fish"]
  },
  {
    slug: "click-speed-test",
    title: "Click Speed Test | CPS Test Online | TutorTom",
    h1: "Click Speed Test",
    metaDescription: "Test your click speed and reaction time. See how fast you can click with our CPS test. Fun way to measure hand-eye coordination.",
    keywords: ["click speed test", "cps test", "clicking speed", "click test", "how fast can i click"],
    content: "Test how fast and accurately you can click. Our click speed test measures both your reaction time and hand-eye coordination. Perfect for gamers wanting to improve their clicking skills.",
    games: ["catch-the-fish"]
  },
  {
    slug: "cognitive-assessment-free",
    title: "Free Cognitive Assessment Online | Brain Evaluation | TutorTom",
    h1: "Free Cognitive Assessment",
    metaDescription: "Take a free cognitive assessment online. Evaluate your memory, processing speed, and mental abilities. Comprehensive brain evaluation.",
    keywords: ["cognitive assessment free", "free cognitive test", "brain assessment", "mental evaluation", "cognitive evaluation"],
    content: "Get a comprehensive view of your cognitive abilities. Our assessment covers memory, processing speed, reaction time, and more. Complete all tests for a full brain score.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-age-test",
    title: "Brain Age Test Free | How Old Is Your Brain | TutorTom",
    h1: "Brain Age Test",
    metaDescription: "Discover your brain age with our free test. See how your cognitive abilities compare. Is your brain younger or older than you?",
    keywords: ["brain age test", "how old is my brain", "brain age", "mental age test", "cognitive age"],
    content: "Is your brain age younger or older than your actual age? Our tests measure cognitive abilities that typically change with age. Complete all tests to estimate your brain age.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "mental-agility-test",
    title: "Mental Agility Test Free | Quick Thinking Assessment | TutorTom",
    h1: "Mental Agility Test",
    metaDescription: "Test your mental agility and quick thinking. See how fast your brain processes information. Free mental speed assessment.",
    keywords: ["mental agility test", "quick thinking test", "mental speed", "brain agility", "cognitive agility"],
    content: "Mental agility is how quickly and flexibly your brain works. Our tests measure processing speed, quick decision making, and cognitive flexibility. See how agile your mind is.",
    games: ["catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-fitness-test",
    title: "Brain Fitness Test | Mental Health Check | TutorTom",
    h1: "Brain Fitness Test",
    metaDescription: "Check your brain fitness with our comprehensive test. Assess multiple cognitive abilities and see your overall mental fitness score.",
    keywords: ["brain fitness test", "mental fitness test", "brain health test", "cognitive fitness", "brain check"],
    content: "How fit is your brain? Take our comprehensive brain fitness test to assess memory, speed, and cognitive abilities. Get a complete picture of your mental fitness level.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "concentration-games",
    title: "Concentration Games Online Free | Focus Training | TutorTom",
    h1: "Concentration Games",
    metaDescription: "Play free concentration games online. Improve your focus and attention with challenging games that require sustained concentration.",
    keywords: ["concentration games", "focus games", "attention games", "concentration training", "focus training"],
    content: "Improve your concentration with games that demand sustained attention. These games help train your ability to focus, filter distractions, and maintain attention over time.",
    games: ["chimp-test", "math-speed", "speed-match", "number-memory"]
  },
  {
    slug: "focus-games",
    title: "Focus Games Online | Attention Training Games | TutorTom",
    h1: "Focus Games for Better Attention",
    metaDescription: "Train your focus with attention games. Improve concentration and reduce distractibility with our focus training games.",
    keywords: ["focus games", "attention games", "focus training", "attention training", "improve focus"],
    content: "Struggling to focus? Our focus games require sustained attention and help train your brain to maintain concentration. Regular practice can improve your ability to focus in daily life.",
    games: ["chimp-test", "math-speed", "speed-match", "catch-the-fish"]
  },
  {
    slug: "attention-games",
    title: "Attention Games Free | Attention Span Training | TutorTom",
    h1: "Attention Games",
    metaDescription: "Play free attention games to improve your attention span. Train your brain to focus better with engaging attention training games.",
    keywords: ["attention games", "attention span games", "attention training", "focus attention", "concentration attention"],
    content: "Attention is the foundation of all cognitive function. Our attention games help you practice sustained focus and selective attention - skills essential for learning and productivity.",
    games: ["chimp-test", "speed-match", "number-memory", "catch-the-fish"]
  },
  {
    slug: "pattern-recognition-test",
    title: "Pattern Recognition Test Free | Visual Patterns | TutorTom",
    h1: "Pattern Recognition Test",
    metaDescription: "Test your pattern recognition skills with our free assessment. See how quickly you can identify and match patterns.",
    keywords: ["pattern recognition test", "pattern matching", "visual patterns", "pattern test", "pattern recognition skills"],
    content: "Pattern recognition is a fundamental cognitive ability. Our tests measure how quickly and accurately you can identify patterns - a skill linked to intelligence and problem-solving.",
    games: ["speed-match", "chimp-test"]
  },
  {
    slug: "math-brain-games",
    title: "Math Brain Games Free | Mental Math Training | TutorTom",
    h1: "Math Brain Games",
    metaDescription: "Play free math brain games. Improve mental arithmetic and numerical thinking with fun math challenges. Quick math training.",
    keywords: ["math brain games", "math games brain", "mental math games", "arithmetic games", "number brain games"],
    content: "Sharpen your mental math skills with our math brain games. Practice quick calculations and improve your numerical processing speed. Great for students and adults alike.",
    games: ["math-speed", "number-memory"]
  },
  {
    slug: "number-games",
    title: "Number Games Online Free | Numerical Brain Training | TutorTom",
    h1: "Number Games for Brain Training",
    metaDescription: "Play free number games online. Train your numerical memory and mental math with engaging number-based brain games.",
    keywords: ["number games", "numerical games", "number brain games", "digit games", "number memory games"],
    content: "Numbers are everywhere in daily life. Our number games help improve numerical memory and mental math skills. Practice with our engaging number-based challenges.",
    games: ["number-memory", "math-speed"]
  },
  {
    slug: "logic-games",
    title: "Logic Games Free | Logical Thinking Games | TutorTom",
    h1: "Logic Games for Sharp Thinking",
    metaDescription: "Play free logic games online. Train logical thinking and reasoning with challenging brain games that test your logic skills.",
    keywords: ["logic games", "logical thinking games", "reasoning games", "logic puzzles", "brain logic games"],
    content: "Develop your logical thinking with games that require reasoning and problem-solving. Our logic games challenge you to think systematically and make smart decisions.",
    games: ["math-speed", "speed-match", "chimp-test"]
  },
  {
    slug: "puzzle-games-online",
    title: "Puzzle Games Online Free | Brain Puzzles | TutorTom",
    h1: "Online Puzzle Games",
    metaDescription: "Play free puzzle games online. Challenge your brain with fun puzzles that test memory, pattern recognition, and problem-solving.",
    keywords: ["puzzle games online", "brain puzzles", "online puzzles", "puzzle games free", "mental puzzles"],
    content: "Love puzzles? Our brain puzzle games offer engaging challenges that test various cognitive skills. Solve puzzles to exercise your memory, pattern recognition, and logical thinking.",
    games: ["chimp-test", "speed-match", "word-memory"]
  },
  {
    slug: "brain-teasers",
    title: "Brain Teasers Online Free | Mental Challenges | TutorTom",
    h1: "Brain Teasers to Challenge Your Mind",
    metaDescription: "Play free brain teasers online. Challenge yourself with mental puzzles that test your thinking skills. Fun brain challenges.",
    keywords: ["brain teasers", "brain teasers online", "mental challenges", "brain challenges", "mind teasers"],
    content: "Enjoy a good mental challenge? Our brain teasers will test your cognitive abilities and keep your mind engaged. Great for anyone who loves a good brain workout.",
    games: ["chimp-test", "word-memory", "speed-match", "math-speed"]
  },
  {
    slug: "brain-quiz",
    title: "Brain Quiz Online Free | Test Your Brain Power | TutorTom",
    h1: "Brain Quiz",
    metaDescription: "Take our free brain quiz to test your cognitive abilities. See how your memory, speed, and thinking skills measure up.",
    keywords: ["brain quiz", "brain test quiz", "cognitive quiz", "mind quiz", "brain power quiz"],
    content: "Ready to test your brain? Take our brain quiz to assess your cognitive abilities. Complete multiple tests to get a comprehensive view of your mental capabilities.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "intelligence-test",
    title: "Free Intelligence Test Online | Measure Your IQ | TutorTom",
    h1: "Intelligence Test",
    metaDescription: "Take a free intelligence test online. Measure cognitive abilities that correlate with intelligence. Quick and informative results.",
    keywords: ["intelligence test", "iq test free", "measure intelligence", "intelligence assessment", "smart test"],
    content: "Our intelligence test measures cognitive abilities that are components of overall intelligence. While not a formal IQ test, it assesses memory, processing speed, and pattern recognition.",
    games: ["word-memory", "number-memory", "chimp-test", "math-speed", "speed-match"]
  },
  {
    slug: "brain-power-test",
    title: "Brain Power Test Free | Mental Strength Assessment | TutorTom",
    h1: "Test Your Brain Power",
    metaDescription: "Test your brain power with our free assessment. See how powerful your cognitive abilities are. Measure memory, speed, and more.",
    keywords: ["brain power test", "brain power", "mental power", "brain strength", "cognitive power"],
    content: "How powerful is your brain? Our brain power test measures multiple cognitive abilities to give you an overall brain score. Challenge yourself and see your mental strength.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "processing-speed-test",
    title: "Processing Speed Test Free | Cognitive Speed | TutorTom",
    h1: "Processing Speed Test",
    metaDescription: "Test your cognitive processing speed. See how quickly your brain processes information and makes decisions. Free online test.",
    keywords: ["processing speed test", "cognitive speed", "mental speed test", "brain speed", "thinking speed test"],
    content: "Processing speed is how quickly you can take in, understand, and respond to information. Our tests measure this crucial cognitive ability. A faster processing speed means quicker thinking.",
    games: ["catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "hand-eye-coordination-test",
    title: "Hand Eye Coordination Test Free | Reflexes Test | TutorTom",
    h1: "Hand-Eye Coordination Test",
    metaDescription: "Test your hand-eye coordination with our free game. Measure how well your hands respond to what your eyes see. Fun reflex test.",
    keywords: ["hand eye coordination test", "coordination test", "eye hand coordination", "motor skills test", "reflexes coordination"],
    content: "Hand-eye coordination is crucial for many daily activities and sports. Our test measures how quickly and accurately you can respond to visual targets. Great for gamers and athletes.",
    games: ["catch-the-fish"]
  },
  {
    slug: "verbal-memory-test",
    title: "Verbal Memory Test Free | Word Recall Test | TutorTom",
    h1: "Verbal Memory Test",
    metaDescription: "Test your verbal memory and word recall abilities. See how well you remember words with our free verbal memory assessment.",
    keywords: ["verbal memory test", "word recall test", "verbal recall", "word memory test", "language memory test"],
    content: "Verbal memory is your ability to remember words and language. This skill is essential for reading, learning, and communication. Test your verbal memory with our word recall challenge.",
    games: ["word-memory"]
  },
  {
    slug: "digit-span-test",
    title: "Digit Span Test Free | Number Memory Assessment | TutorTom",
    h1: "Digit Span Test",
    metaDescription: "Take the digit span test to measure your numerical memory. See how many digits you can remember in sequence. Free online test.",
    keywords: ["digit span test", "digit memory", "number span test", "numerical span", "digit recall test"],
    content: "The digit span test measures how many numbers you can hold in working memory. This classic test is used by psychologists to assess short-term memory capacity. Test yours now.",
    games: ["number-memory"]
  },
  {
    slug: "speed-games",
    title: "Speed Games Online Free | Fast Reaction Games | TutorTom",
    h1: "Speed Games for Quick Thinking",
    metaDescription: "Play free speed games that test your quick thinking and fast reactions. Challenge your processing speed with time-based games.",
    keywords: ["speed games", "fast games", "quick games", "reaction games", "speed brain games"],
    content: "How fast can you think and react? Our speed games challenge your processing speed and reaction time. Race against the clock and see how quick your mind really is.",
    games: ["catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "memory-games-free",
    title: "Memory Games Free Online | No Download | TutorTom",
    h1: "Free Memory Games - Play Now",
    metaDescription: "Play free memory games online with no download needed. Test and improve your memory with instant-play brain games.",
    keywords: ["memory games free", "free memory games", "memory games online free", "memory games no download", "play memory games"],
    content: "All our memory games are completely free to play. No downloads, no signups - just click and start training your memory. Works on any device with a web browser.",
    games: ["word-memory", "number-memory", "chimp-test", "speed-match"]
  },
  {
    slug: "brain-games-no-download",
    title: "Brain Games No Download | Play Instantly | TutorTom",
    h1: "Brain Games - No Download Needed",
    metaDescription: "Play brain games instantly with no download required. Browser-based cognitive games you can play right now. Free and fast.",
    keywords: ["brain games no download", "no download brain games", "instant brain games", "browser brain games", "play without download"],
    content: "No app store, no downloads, no waiting. Our brain games run directly in your browser and are ready to play instantly. Start training your brain in seconds.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-test-free",
    title: "Brain Test Free Online | Quick Cognitive Test | TutorTom",
    h1: "Free Brain Test",
    metaDescription: "Take a free brain test online. Quick cognitive assessment that measures memory, speed, and mental abilities. Instant results.",
    keywords: ["brain test free", "free brain test", "brain test online", "cognitive test free", "test brain free"],
    content: "Take our free brain test to get a quick snapshot of your cognitive abilities. Measures memory, processing speed, reaction time, and more. Complete in just a few minutes.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "neuroplasticity-games",
    title: "Neuroplasticity Games | Brain Training for Growth | TutorTom",
    h1: "Games for Neuroplasticity",
    metaDescription: "Train your brain's neuroplasticity with cognitive games. Exercise your mind to promote brain growth and adaptation.",
    keywords: ["neuroplasticity games", "brain plasticity", "brain growth games", "cognitive plasticity", "train neuroplasticity"],
    content: "Neuroplasticity is your brain's ability to grow and change. Regular mental challenges help promote this adaptation. Our games provide the cognitive stimulation your brain needs to stay flexible.",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish", "math-speed", "speed-match"]
  },
  {
    slug: "brain-games-for-kids",
    title: "Brain Games for Kids Free | Fun Learning Games | TutorTom",
    h1: "Brain Games for Kids",
    metaDescription: "Fun brain games for kids that help develop cognitive skills. Free educational games that make learning fun. Safe for children.",
    keywords: ["brain games for kids", "kids brain games", "children brain games", "kids memory games", "educational brain games"],
    content: "Help kids develop their cognitive abilities with fun brain games. Our games challenge memory, attention, and problem-solving in an engaging way. Great for young minds!",
    games: ["word-memory", "number-memory", "chimp-test", "catch-the-fish"]
  }
];

// Get all slugs for sitemap
export function getAllSlugs(): string[] {
  const gameSlugs = games.map(g => `games/${g.slug}`);
  const pageSlugs = seoPages.map(p => p.slug);
  return [...gameSlugs, ...pageSlugs];
}

// Get game by slug
export function getGameBySlug(slug: string): GameInfo | undefined {
  return games.find(g => g.slug === slug);
}

// Get SEO page by slug
export function getSEOPageBySlug(slug: string): SEOPage | undefined {
  return seoPages.find(p => p.slug === slug);
}

// Get games for a page
export function getGamesForPage(gamesSlugs: string[]): GameInfo[] {
  return gamesSlugs.map(slug => getGameBySlug(slug)).filter((g): g is GameInfo => g !== undefined);
}
