# TutorTom - Free Online Brain Games & Cognitive Tests

A comprehensive cognitive testing platform featuring 6 brain tests to measure memory, visual processing, and reaction speed.

**Live at**: [play.tutortom.ai](https://play.tutortom.ai)

## Brand Colors

All UI components use the official TutorTom color palette:

- **Primary Blue**: `#4F7BFE`
- **Accent Purple**: `#A855F7`
- **Dark Background**: `#0F172A`
- **Card Background**: `#1E293B`
- **Border Grey**: `#334155`
- **Text White**: `#FFFFFF`
- **Text Light Grey**: `#CBD5E1`

## Features

### 1. Word Memory Test
- Display 5 random words for 5 seconds
- Test recall by showing 10 words (5 original + 5 confusing)
- Score based on correct identification
- **Score**: 0-100 based on accuracy

### 2. Number Memory Test
- Display a random 6-digit number for 5 seconds
- User recalls and types the number
- Partial credit for correct digits in correct positions
- **Score**: 0-100 based on accuracy

### 3. Chimp Test
- Display 5 numbered squares (1-5) for 5 seconds
- Numbers disappear, user clicks squares in sequence
- Up to 3 mistakes allowed
- **Score**: 0-100 based on correct clicks and mistakes

### 4. Catch the Fish
- 10-second reaction time test
- Click fish as they appear
- Track hits, misses, and reaction time
- **Score**: 0-100 based on accuracy, speed, and total hits

### 5. Math Speed
- Solve 5 addition problems in 10 seconds each
- **Score**: 0-100 based on correct answers

### 6. Speed Match
- Visual memory and pattern recognition test
- 15 rounds of shape matching
- **Score**: 0-100 based on accuracy and reaction time

### Final Results
- Overall brain score (average of all 6 tests)
- Individual test breakdown
- Performance categories (Memory, Visual Processing, Reaction Speed)
- Retake functionality

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Design**: Custom components with TutorTom brand colors
- **State Management**: React hooks with localStorage
- **API**: Next.js API routes
- **Analytics**: Google Analytics (gtag.js)

## Project Structure

```
play.tutortom.ai/
├── app/
│   ├── api/
│   │   ├── scores/route.ts          # Score tracking API
│   │   └── leaderboard/route.ts     # Leaderboard API
│   ├── brain-test/
│   │   ├── word-memory/page.tsx     # Word Memory Test
│   │   ├── number-memory/page.tsx   # Number Memory Test
│   │   ├── chimp-test/page.tsx      # Chimp Test
│   │   ├── aim-trainer/page.tsx     # Catch the Fish
│   │   ├── math-speed/page.tsx      # Math Speed Test
│   │   ├── speed-match/page.tsx     # Speed Match Test
│   │   ├── speed-tapper/page.tsx    # Speed Tapper Test
│   │   ├── results/page.tsx         # Final Results
│   │   └── page.tsx                 # Brain Test Hub
│   ├── layout.tsx                   # Root layout with SEO & Analytics
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

## Getting Started

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

## Responsive Design

All components are fully responsive with mobile-first design:
- Adaptive grid layouts (1 column on mobile, 2+ on desktop)
- Touch-friendly targets for mobile users
- Optimized text sizes for all screen sizes
- Flexible containers with proper spacing

## Design System

### Components
- **Card**: `.card-tutortom` - Dark card with border and rounded corners
- **Glow Effects**: `.glow-blue`, `.glow-purple` - Soft shadow effects
- **Buttons**: Gradient transitions with hover effects
- **Progress Bars**: Animated fill with brand colors

### Typography
- Headings: Bold, gradient text (blue to purple)
- Body: Light grey text on dark background
- Emphasis: White text for important information

## License

This project is part of the TutorTom platform.

---

Built with Next.js and the TutorTom design system
