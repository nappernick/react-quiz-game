# React Quiz Game

## Overview

React Quiz Game is an interactive educational application built with React, TypeScript, and Vite. The application offers multiple learning modes including quizzes, coding challenges, and sequence ordering exercises, all designed to enhance knowledge retention through evidence-based learning techniques.

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Domain Models](#domain-models)
- [Data Flow](#data-flow)
- [Learning Principles](#learning-principles)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## Architecture

The application follows a **Hexagonal Architecture** (also known as Ports and Adapters) with principles from Domain-Driven Design (DDD). This architecture separates the core business logic from external concerns, making the codebase more maintainable and testable.

### Key Architectural Components:

1. **Core Domain Layer** (`/src/core/domain`)
   - Contains all domain models and business rules
   - Independent of any external frameworks or libraries
   - Represents the heart of the application

2. **Application Layer** (`/src/core/application`)
   - Contains services that orchestrate the use cases
   - Implements business logic using domain models
   - Defines interfaces for external dependencies

3. **Adapters Layer** (`/src/adapters`)
   - Implements interfaces defined by the application layer
   - Connects the application to external systems (APIs, storage, etc.)

4. **UI Layer** (`/src/components`, `/src/containers`)
   - React components that render the UI
   - Containers that connect components to the application layer
   - Follows the Dependency Inversion Principle by importing from the domain layer

5. **Infrastructure** (`/src/hooks`, `/src/data`)
   - Custom hooks for state management
   - Data sources and repositories

## Project Structure

```
src/
├── adapters/          # Adapters for external systems
├── components/        # Reusable UI components
├── containers/        # Container components that connect to services
├── core/             # Core business logic
│   ├── application/  # Application services and use cases
│   └── domain/       # Domain models and business rules
├── data/             # Data sources (JSON files, mock data)
├── docs/             # Documentation files
├── hooks/            # Custom React hooks
├── styles/           # CSS and styling files
├── tests/            # Test files
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Domain Models

The application is built around these core domain models:

### Quiz

- `QuizQuestion`: Represents a single quiz question with options
- `QuizOption`: Represents an answer option for a question
- `QuizResult`: Represents the result of answering a question
- `QuizSet`: Represents a collection of related questions

### Coding Challenge

- `CodingChallenge`: Represents a programming challenge
- `TestCase`: Represents a test case for validating solutions

### Sequence

- `Sequence`: Represents a sequence of steps to be ordered
- `SequenceStep`: Represents a single step in a sequence
- `SequenceResult`: Represents the result of a sequence ordering attempt

## Data Flow

1. **User Interaction**
   - User interacts with UI components
   - Components dispatch actions to services

2. **Service Processing**
   - Services process actions using domain models
   - Services update their internal state

3. **State Updates**
   - Services notify presenters of state changes
   - Presenters update the UI state

4. **UI Rendering**
   - React components re-render based on the updated state
   - User sees the results of their actions

### Example Flow: Quiz Question Submission

1. User selects an answer and clicks submit
2. QuizContainer calls `submitAnswer()` on QuizService
3. QuizService validates the answer using domain models
4. QuizService creates a QuizResult and updates state
5. QuizPresenter receives state update and updates UI state
6. UI components re-render to show the result

## Learning Principles

The application implements several evidence-based learning principles:

1. **Spaced Repetition**
   - Questions reappear based on difficulty and past performance
   - Intervals between repetitions increase with correct answers

2. **Immediate Feedback**
   - Users receive instant feedback on their answers
   - Explanations are provided for both correct and incorrect answers

3. **Confidence-Based Assessment**
   - Users rate their confidence in answers
   - Scoring adjusts based on confidence level

4. **Interleaving**
   - Different topics are mixed within question sets
   - Enhances retention through varied practice

5. **Active Recall**
   - Coding challenges require active problem-solving
   - Sequence exercises test recall of procedural knowledge

## Features

### Quiz Mode

- Multiple-choice questions with confidence rating
- Detailed explanations for answers
- Spaced repetition algorithm for optimal learning
- Progress tracking and scoring

### Coding Challenges

- Interactive code editor with syntax highlighting
- Real-time code execution and testing
- Multiple test cases for each challenge
- Immediate feedback on solution correctness

### Sequence Ordering

- Drag-and-drop interface for ordering steps
- Verification of correct sequence
- Visual feedback on correctness
- Multiple sequence types (algorithms, processes, etc.)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (preferred) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/react-quiz-game.git
cd react-quiz-game

# Install dependencies with Bun
bun install

# Start the development server
bun run dev
```

## Development

### Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run tests
bun test
```

### Adding New Content

#### Adding Quiz Questions

Add new questions to the appropriate JSON file in `/src/data/`:

```json
{
  "question": "What is React?",
  "options": [
    "A JavaScript library for building user interfaces",
    "A programming language",
    "A database system",
    "An operating system"
  ],
  "correctIndex": 0,
  "explanation": "React is a JavaScript library developed by Facebook for building user interfaces.",
  "difficulty": 1,
  "topic": "React"
}
```

#### Adding Coding Challenges

Add new challenges to `/src/data/advanced_coding_challenges.json`:

```json
{
  "id": "challenge-id",
  "title": "Challenge Title",
  "description": "Description of the challenge",
  "starterCode": "function solve() {\n  // Your code here\n}",
  "testCases": [
    { "input": [1, 2], "expectedOutput": 3 }
  ]
}
```

#### Adding Sequences

Add new sequences to the appropriate repository implementation:

```typescript
const sequences: Sequence[] = [
  {
    id: 'seq-id',
    title: 'Sequence Title',
    description: 'Description of the sequence',
    steps: [
      { id: 's1', text: 'Step 1', order: 0 },
      { id: 's2', text: 'Step 2', order: 1 }
    ]
  }
];
```

## Testing

The application uses Bun's built-in test runner for unit and integration tests. Tests are located in the `/src/tests/` directory.

```bash
# Run all tests
bun test

# Run specific test file
bun test src/tests/quiz.test.ts
```

## Deployment

The application can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

```bash
# Build for production
bun run build

# The output will be in the 'dist' directory
```

## Tools

The project includes several utility tools to help with development and maintenance:

### File Management

- **add-path-comments.ts**: Adds file path comments to the top of all TypeScript, TSX, and CSS files
  ```bash
  # Run with bun
  bun run tools/add-path-comments.ts
  ```

### Data Management

- **deduplicate_questions.js**: Removes duplicate questions from the question bank while preserving the best version
  ```bash
  # Run with bun
  bun run tools/deduplicate_questions.js
  ```
  
  This tool identifies duplicate questions by matching question text and keeps the version with the most detailed explanation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
