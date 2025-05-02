// src/data/quizQuestions.ts
import { QuizQuestion } from '../core/domain/Quiz';
import { v4 as uuidv4 } from 'uuid';

export const initialQuizQuestions: QuizQuestion[] = [

  {
    id: uuidv4(),
    questionText: 'What is the primary purpose of Conditional Types in TypeScript?',
    options: [
      { id: 'A', text: 'To create types based on conditions applied to other types.' },
      { id: 'B', text: 'To define types that only exist during compile time.' },
      { id: 'C', text: 'To enforce specific runtime checks on types.' },
      { id: 'D', text: 'To map existing types to new types.' },
    ],
    correctAnswerId: 'A',
    explanation: 'Conditional Types (e.g., `T extends U ? X : Y`) allow type definitions that depend on a condition involving other types.',
    topic: 'TypeScript',
  },
  {
    id: uuidv4(),
    questionText: 'Which utility type constructs a type consisting of all properties of `Type` set to optional?',
    options: [
      { id: 'A', text: 'Required<Type>' },
      { id: 'B', text: 'Readonly<Type>' },
      { id: 'C', text: 'Partial<Type>' },
      { id: 'D', text: 'Pick<Type, Keys>' },
    ],
    correctAnswerId: 'C',
    explanation: '`Partial<Type>` makes all properties of `Type` optional.',
    topic: 'TypeScript',
  },
  {
    id: uuidv4(),
    questionText: 'What does the `infer` keyword allow within a Conditional Type?',
    options: [
      { id: 'A', text: 'To infer the type of a generic parameter automatically.' },
      { id: 'B', text: 'To declare a new type variable within the `true` branch of a conditional type.' },
      { id: 'C', text: 'To force a type assertion at compile time.' },
      { id: 'D', text: 'To infer runtime values based on types.' },
    ],
    correctAnswerId: 'B',
    explanation: '`infer R` allows capturing a type inferred within the `extends` clause for use in the `true` branch.',
    topic: 'TypeScript',
  },
  {
    id: uuidv4(),
    questionText: 'Mapped Types in TypeScript are primarily used for:',
    options: [
      { id: 'A', text: 'Transforming properties of an existing type into a new type.' },
      { id: 'B', text: 'Defining functions that operate on specific types.' },
      { id: 'C', text: 'Creating unions of multiple types.' },
      { id: 'D', text: 'Handling asynchronous operations with types.' },
    ],
    correctAnswerId: 'A',
    explanation: 'Mapped types iterate over the keys of a type to create a new type with transformed properties (e.g., making properties readonly or optional).',
    topic: 'TypeScript',
  },
  {
    id: uuidv4(),
    questionText: 'Which TypeScript feature helps in creating types that represent the shape of an object, ensuring specific keys are present?',
    options: [
      { id: 'A', text: 'Enums' },
      { id: 'B', text: 'Interfaces or Type Aliases' },
      { id: 'C', text: 'Generics' },
      { id: 'D', text: 'Decorators' },
    ],
    correctAnswerId: 'B',
    explanation: 'Interfaces and Type Aliases are the primary ways to define the structure (shape) of objects in TypeScript.',
    topic: 'TypeScript',
  },


  {
    id: uuidv4(),
    questionText: 'What is the main benefit of using `React.memo`?',
    options: [
      { id: 'A', text: 'To optimize functional components by memoizing the component based on props changes.' },
      { id: 'B', text: 'To manage component state more effectively.' },
      { id: 'C', text: 'To create context providers for global state.' },
      { id: 'D', text: 'To handle side effects in functional components.' },
    ],
    correctAnswerId: 'A',
    explanation: '`React.memo` is a higher-order component that prevents re-rendering if props haven\'t changed, similar to `PureComponent` for class components.',
    topic: 'React',
  },
  {
    id: uuidv4(),
    questionText: 'When should you use `useCallback`?',
    options: [
      { id: 'A', text: 'To memoize the result of an expensive calculation.' },
      { id: 'B', text: 'To memoize a callback function, preventing unnecessary re-creation between renders.' },
      { id: 'C', text: 'To fetch data asynchronously within a component.' },
      { id: 'D', text: 'To manage component lifecycle events.' },
    ],
    correctAnswerId: 'B',
    explanation: '`useCallback` returns a memoized version of the callback function that only changes if one of its dependencies has changed. This is useful when passing callbacks to optimized child components.',
    topic: 'React',
  },
  {
    id: uuidv4(),
    questionText: 'What problem does the Context API in React primarily solve?',
    options: [
      { id: 'A', text: 'Optimizing component rendering performance.' },
      { id: 'B', text: 'Simplifying asynchronous data fetching.' },
      { id: 'C', text: 'Avoiding "prop drilling" by passing data through the component tree without explicit props.' },
      { id: 'D', text: 'Managing local component state.' },
    ],
    correctAnswerId: 'C',
    explanation: 'Context provides a way to share values like themes or user authentication status between components without having to pass props down manually at every level.',
    topic: 'React',
  },
  {
    id: uuidv4(),
    questionText: 'Which hook is used to perform side effects in functional components?',
    options: [
      { id: 'A', text: 'useState' },
      { id: 'B', text: 'useReducer' },
      { id: 'C', text: 'useEffect' },
      { id: 'D', text: 'useContext' },
    ],
    correctAnswerId: 'C',
    explanation: '`useEffect` is used for side effects like data fetching, subscriptions, or manually changing the DOM.',
    topic: 'React',
  },
  {
    id: uuidv4(),
    questionText: 'In React with TypeScript, how can you define the type for component props?',
    options: [
      { id: 'A', text: 'Using `PropTypes` library.' },
      { id: 'B', text: 'Defining an `interface` or `type` alias and using it with `React.FC<PropsType>` or directly.' },
      { id: 'C', text: 'Relying on implicit `any` types.' },
      { id: 'D', text: 'Using JSDoc comments.' },
    ],
    correctAnswerId: 'B',
    explanation: 'TypeScript interfaces or type aliases provide compile-time type checking for React component props, enhancing code safety and maintainability.',
    topic: 'React',
  },
];
