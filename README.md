# 🧠 TestMate - Daily Brain Check

A comprehensive cognitive testing platform featuring 4 brain tests to measure memory, visual processing, and reaction speed.

## 🎨 Brand Colors

All UI components use the official TestMate color palette:

- **Primary Blue**: `#4F7BFE`
- **Accent Purple**: `#A855F7`
- **Dark Background**: `#0F172A`
- **Card Background**: `#1E293B`
- **Border Grey**: `#334155`
- **Text White**: `#FFFFFF`
- **Text Light Grey**: `#CBD5E1`

## 🎯 Features

### 1️⃣ Word Memory Test
- Display 5 random words for 5 seconds
- Test recall by showing 10 words (5 original + 5 confusing)
- Score based on correct identification
- **Score**: 0-100 based on accuracy

### 2️⃣ Number Memory Test
- Display a random 6-digit number for 5 seconds
- User recalls and types the number
- Partial credit for correct digits in correct positions
- **Score**: 0-100 based on accuracy

### 3️⃣ Chimp Test
- Display 5 numbered squares (1-5) for 5 seconds
- Numbers disappear, user clicks squares in sequence
- Up to 3 mistakes allowed
- **Score**: 0-100 based on correct clicks and mistakes

### 4️⃣ Aim Trainer
- 10-second reaction time test
- Click circles as they appear
- Track hits, misses, and reaction time
- **Score**: 0-100 based on accuracy, speed, and total hits

### Final Results
- Overall brain score (average of all 4 tests)
- Individual test breakdown
- Performance categories (Memory, Visual Processing, Reaction Speed)
- Retake functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Design**: Custom components with TestMate brand colors
- **State Management**: React hooks with localStorage
- **API**: Next.js API routes

## 📁 Project Structure

```
testmate.games/
├── app/
│   ├── api/
│   │   ├── scores/route.ts          # Score tracking API
│   │   └── leaderboard/route.ts     # Leaderboard API
│   ├── brain-test/
│   │   ├── word-memory/page.tsx     # Word Memory Test
│   │   ├── number-memory/page.tsx   # Number Memory Test
│   │   ├── chimp-test/page.tsx      # Chimp Test
│   │   ├── aim-trainer/page.tsx     # Aim Trainer
│   │   ├── results/page.tsx         # Final Results
│   │   └── page.tsx                 # Brain Test Hub
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── lib/
│   ├── constants/colors.ts          # Color palette
│   └── data/words.ts                # Word pool for memory test
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── next.config.js                   # Next.js configuration
└── package.json                     # Dependencies
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 Responsive Design

All components are fully responsive with mobile-first design:
- Adaptive grid layouts (1 column on mobile, 2+ on desktop)
- Touch-friendly targets for mobile users
- Optimized text sizes for all screen sizes
- Flexible containers with proper spacing

## 🎮 How to Use

1. **Start from Home**: Choose individual tests or full brain test
2. **Complete Each Test**: Follow on-screen instructions
3. **View Results**: See individual and overall scores
4. **Track Progress**: Retake tests to improve scores

## 🔌 API Endpoints

### POST `/api/scores`
Save individual test scores
```json
{
  "testName": "Word Memory",
  "score": 85
}
```

### GET `/api/scores`
Retrieve scores and statistics
```json
{
  "success": true,
  "scores": [...],
  "stats": {
    "totalTests": 10,
    "averageScore": 78.5,
    "highestScore": 95,
    "lowestScore": 60
  }
}
```

### POST `/api/leaderboard`
Submit complete brain test results
```json
{
  "username": "player1",
  "wordMemory": 85,
  "numberMemory": 90,
  "chimpTest": 75,
  "aimTrainer": 80
}
```

### GET `/api/leaderboard?limit=10`
Get top scores

## 🎨 Design System

### Components
- **Card**: `.card-testmate` - Dark card with border and rounded corners
- **Glow Effects**: `.glow-blue`, `.glow-purple` - Soft shadow effects
- **Buttons**: Gradient transitions with hover effects
- **Progress Bars**: Animated fill with brand colors

### Typography
- Headings: Bold, gradient text (blue to purple)
- Body: Light grey text on dark background
- Emphasis: White text for important information

## 📊 Scoring System

### Word Memory
- Perfect recall: 100 points
- Partial credit: 20 points per correct word

### Number Memory
- Exact match: 100 points
- Partial credit: ~16.67 points per correct digit in correct position

### Chimp Test
- Perfect sequence: 100 points
- Penalty: -10 points per mistake

### Aim Trainer
- 50% accuracy score
- 30% reaction time score
- 20% total hits score

## 🔮 Future Enhancements

- User authentication
- Persistent score tracking
- Daily challenges
- Social sharing
- Global leaderboards
- More brain tests
- Achievement system
- Progress charts

## 📄 License

This project is part of the TestMate platform.

---

Built with ❤️ using Next.js and the TestMate design system
