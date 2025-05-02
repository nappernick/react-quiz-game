Intermediate and Advanced React Concepts (Functional Components)

This guide assumes React 18+ and focuses on functional components (no classes or frameworks like Next.js). It covers core hooks, advanced hooks, design patterns, performance techniques, concurrency, error handling, composition best practices, debugging/testing tools, and TypeScript usage. Code examples and official documentation links (React docs and reputable sources) illustrate each topic.

Core Hooks: useState and useEffect
	•	useState lets function components have state. It returns a state value and setter. For example: const [count, setCount] = useState(0). Calling setCount schedules a re-render with the new state. React docs explain: “useState is a Hook that lets you add React state to function components” ￼.
	•	useEffect manages side effects (data fetching, subscriptions, DOM updates). It runs after render (and re-runs when dependencies change). Example:

import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [userId]); // Effect runs when userId changes
  return profile ? <div>{profile.name}</div> : <div>Loading...</div>;
}

The effect’s cleanup (if returned) runs on unmount or before re-running. The official docs note: “useEffect is a React Hook that lets you synchronize a component with an external system” ￼. Put hooks at the top level of your component and list all reactive values in the dependency array to avoid stale closures and unnecessary re-renders.

Advanced Hooks: useReducer, useMemo, useCallback, useRef, and Custom Hooks
	•	useReducer provides Redux-like state management inside a component. It takes a reducer function and initial state, returning [state, dispatch]. Example:

import { useReducer } from 'react';
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: throw Error('Unknown action');
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>–</button>
    </>
  );
}

This moves state logic out of handlers. React docs say: “useReducer is very similar to useState, but it lets you move the state update logic … into a single function outside of your component” ￼. Use it for complex or interrelated state transitions.

	•	useMemo memoizes expensive values between renders. Call it as useMemo(() => compute(), [deps]); it returns the cached value unless dependencies change. Example:

const sorted = useMemo(() => expensiveSort(items), [items]);

The React docs define: “useMemo is a React Hook that lets you cache the result of a calculation between re-renders” ￼. Use it to avoid recomputing derived data unnecessarily.

	•	useCallback memoizes a function instance. Syntax: useCallback(fn, [deps]). This is useful when passing callbacks to optimized child components. For example:

const handleClick = useCallback(() => { 
  doSomething(value);
}, [value]);

The function reference remains the same unless deps change. As React docs put it: “useCallback is a React Hook that lets you cache a function definition between re-renders” ￼. It prevents needless re-creations and helps prevent child re-renders (with React.memo).

	•	useRef creates a persistent, mutable ref object (ref.current) that doesn’t trigger re-renders. You can store DOM nodes or any mutable value. Example for accessing a DOM element:

const inputRef = useRef(null);
function focusInput() {
  if (inputRef.current) inputRef.current.focus();
}
return <input ref={inputRef} />;

Or for a mutable counter: const countRef = useRef(0);. The API docs say: “useRef is a React Hook that lets you reference a value that’s not needed for rendering” ￼. Use it to hold values or DOM elements across renders without causing re-render.

	•	Custom Hooks let you extract reusable logic into functions prefixed with use. For instance, a useFetch hook could encapsulate data fetching. Hooks can use other hooks. Example (simplified):

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
function Component() {
  const width = useWindowWidth();
  return <div>Width: {width}</div>;
}

The custom hook useWindowWidth shares logic across components. React docs advise: “You can create your own Hooks for your application’s needs” ￼. Name custom hooks starting with use, and they must follow hook rules (call at top level, etc.).

Component Design Patterns
	•	Compound Components (React Labs): A pattern where related components share implicit state via context or props. The parent component manages state and passes it to child components through context or cloning. For example:

function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabContext.Provider>
  );
}
function TabList({ children }) { return <div>{children}</div>; }
function Tab({ children, index }) {
  const { activeTab, setActiveTab } = useContext(TabContext);
  return <button onClick={() => setActiveTab(index)}>{children}</button>;
}
function TabPanels({ children }) {
  const { activeTab } = useContext(TabContext);
  return <div>{children[activeTab]}</div>;
}
// Usage:
<Tabs>
  <TabList>
    <Tab index={0}>One</Tab>
    <Tab index={1}>Two</Tab>
  </TabList>
  <TabPanels>
    <div>Content One</div>
    <div>Content Two</div>
  </TabPanels>
</Tabs>

Compound components “manage their own internal state, which they share among the several child components” ￼. This allows using <Tabs.Tab> and <Tabs.Panel> without passing state explicitly. Libraries like Reach UI and Radix use this pattern extensively.

	•	Controlled vs Uncontrolled Components: This primarily applies to form inputs. A controlled component has its value driven by React state (with value and onChange props). An uncontrolled component lets the DOM hold its state, and you use a ref to read the value when needed. For example:
	•	Controlled: <input value={name} onChange={e => setName(e.target.value)} /> where name is state.
	•	Uncontrolled: <input defaultValue="John" ref={inputRef} />, then inputRef.current.value reads the value.
The React docs recommend controlled forms for most cases: “In a controlled component, form data is handled by a React component. The alternative is uncontrolled components, where form data is handled by the DOM itself” ￼. Controlled components give you full React-driven control and validation, while uncontrolled can be useful for simple or third-party form elements.
	•	Render Props: A technique where a component’s prop is a render function that returns JSX, allowing sharing of behavior. The term “render prop” means a prop whose value is a function; for example:

function DataProvider({ url, children }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(url).then(r => r.json()).then(setData); }, [url]);
  return children(data);
}
// Usage:
<DataProvider url="/api/info">{data => (
  data ? <div>{data.name}</div> : <div>Loading...</div>
)}</DataProvider>

Here, children is a function. Libraries like React Router (via children or render props) and formik use render-prop patterns. The (legacy) React docs define: “The term ‘render prop’ refers to a technique for sharing code between React components using a prop whose value is a function” ￼. Note: In modern React, many render-prop use cases are replaced by custom hooks (see next).

Context API and useContext (Global State)

React’s Context API lets components share values (like global state or theme) without prop drilling. Create a context with createContext, wrap components with its Provider, and consume with useContext. Example:

const ThemeContext = createContext('light');  // default 'light'
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
function Toolbar() {
  return <ThemedButton />;
}
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#ccc' }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}

Inside ThemedButton, useContext(ThemeContext) reads the nearest Provider’s value. As React documentation states: the context object’s Provider is used “to specify the context value, and call useContext(SomeContext) in components below to read it” ￼. Use context for truly global or cross-cutting state (themes, auth, locale, etc.), but beware that context updates re-render all consumers by default.

Performance Optimization Techniques
	•	Memoization (React.memo, useMemo, useCallback): Wrap pure function components with React.memo to skip re-renders when props are unchanged. For example: const Button = memo(function Button({ onClick, label }) { ... });. The React API says: “memo lets you skip re-rendering a component when its props are unchanged” ￼. Combined with useCallback (for callback props) and useMemo (for expensive values), this avoids unnecessary work.
	•	Code-Splitting and Lazy Loading: Use dynamic imports and React.lazy to split code into chunks that load on demand. For instance: const Other = lazy(() => import('./Other')), then render inside <Suspense fallback={<Spinner/>}><Other/></Suspense>. This “lazy component… will automatically load the bundle containing it when this component is first rendered” ￼, and Suspense shows a fallback (loading UI) until ready. The React docs explain that wrapping lazy components in <Suspense> enables showing a placeholder: “The lazy component should then be rendered inside a Suspense component, which allows us to show some fallback content while we’re waiting for the lazy component to load.” ￼. Use this to reduce initial bundle size and defer non-critical code.
	•	Avoid Unnecessary Re-renders: Besides memoization, ensure stable prop references (avoid creating new objects/functions in render without need), give lists a proper key prop, and lift state up only as needed. The Profiler (in React DevTools) can help identify slow areas. Using {} or inline objects/functions in JSX will defeat memo, so prefer useCallback/useMemo or move such definitions outside the render path.
	•	Lazy Component Rendering: In addition to code-splitting, you can render heavy components only when needed (e.g. via conditional rendering or React’s Suspense with <Lazy> as above).

Together, these techniques improve performance by skipping work on unchanged renders and loading code on demand.

Concurrent Rendering and Suspense

React 18 introduced concurrency features (often opt-in). Key APIs in functional components include:
	•	useTransition and startTransition: These mark updates as low-priority transitions. For example, on a tab click you might do:

const [isPending, startTransition] = useTransition();
function handleChange(nextTab) {
  startTransition(() => {
    setTab(nextTab);
  });
}

This tells React that updating the tab content can be interrupted if more urgent updates (like typing) happen. React docs explain that useTransition returns [isPending, startTransition] and “startTransition lets you mark an update as a Transition” ￼. While a transition is pending, you can show a spinner using isPending. This keeps the UI responsive during heavy renders.

	•	useDeferredValue: Returns a deferred version of a value. E.g. const deferredQuery = useDeferredValue(query). This allows React to render one version (old or new) while deferring a slower update. Docs say: “useDeferredValue is a React Hook that lets you defer updating a part of the UI.” ￼. Use it when you want to show stale content temporarily while an expensive update finishes.
	•	Suspense for Data Fetching: Beyond code splitting, React’s Suspense (currently experimental for data) lets you suspend rendering while waiting for data. In practice, you can use libraries like Relay or React Query with Suspense. The common pattern is to wrap parts of the tree in <Suspense fallback={<Loading/>}>…</Suspense>. When a component “suspends” (throws a Promise while loading), React shows the fallback. Once ready, it resumes rendering. For code splits, the docs show: “React will display your loading fallback until all the code and data needed by the children has been loaded.” ￼.
	•	Concurrent Features: React’s concurrent rendering re-orders, pauses, or resumes tasks to keep interactions fluid. Automatic batching of state updates across events is now default (so multiple setState calls in one event become one render). Many APIs leverage concurrency, but core advice is to use useTransition/startTransition for non-urgent updates and <Suspense> for asynchronous rendering.

Error Handling (Error Boundaries)

React’s official Error Boundary mechanism still requires class components. Error boundaries catch render-time errors in child trees and show a fallback UI. The docs emphasize: “Only class components can be error boundaries.” ￼. For example, a class-based boundary is:

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() {
    return this.state.hasError
      ? <h1>Something went wrong.</h1>
      : this.props.children;
  }
}

To use it, wrap parts of the app: <ErrorBoundary><MyWidget/></ErrorBoundary>.

In purely functional codebases, common approaches include:
	•	Using an Error Boundary Component: Simply define the above class and wrap your functional components with it.
	•	Libraries: For example, react-error-boundary provides a reusable boundary component you can wrap around functional components.
	•	Try/Catch: You cannot catch render errors with try/catch; they occur asynchronously during reconciliation. Error boundaries are the idiomatic solution.
	•	Upcoming Hooks (Future): There is an experimental “useErrorHandler” hook (in React Router or community libraries) and proposals, but as of React 18, only class-based boundaries are built-in.

Always handle errors gracefully and provide fallback UI. Use boundaries at high-level components (e.g. per route or layout) to prevent entire app crashes. Remember boundaries only catch errors in descendants (not inside themselves).

Best Practices: Composition, Separation of Concerns, and Avoiding Prop Drilling
	•	Composition over Inheritance: React encourages composing components via props/children rather than inheritance. Official docs say: “React has a powerful composition model, and we recommend using composition instead of inheritance to reuse code between components.” ￼. For example, use children or props to create generic “container” components (as in the FancyBorder example). Break big components into small, focused ones. Keep presentation and logic separate by using hooks or container components for stateful logic and child components for UI.
	•	Separation of Concerns: Keep components focused on a single purpose. Extract reusable logic into hooks or utility functions. For instance, manage form state with custom hooks (e.g. useForm), or isolate data fetching in hooks. This makes components more testable and maintainable. Avoid mixing unrelated responsibilities (e.g. complex business logic and rendering in one function).
	•	Avoiding Prop Drilling: “Prop drilling” is passing props through many layers to reach a deeply-nested component. To avoid it, use:
	•	Context for shared state (see above).
	•	Composition: Render child functions or use the compound component pattern to implicitly pass data.
	•	Hooks in intermediary components: If only a few steps apart, you can have an intermediate component access context/hook instead of passing props down or use custom hooks in the final component.
	•	State Management Libraries: For large apps, libraries like Redux, Zustand, or Jotai can serve as alternatives, though context is often sufficient for moderate needs.
	•	Prevent Over-Rendering: Be mindful of unnecessary re-renders when using context. Only split context values if needed. E.g., use multiple contexts for independent pieces of state.

Overall, design components that are reusable and loosely coupled. Pass the minimal props needed. Use children and render props to allow flexibility. Prefer lifting state up only as high as necessary, and fetch or compute data as close to where it’s needed as makes sense.

Debugging and Testing Tools
	•	React Developer Tools: The official browser extension (for Chrome/Firefox) lets you inspect the component tree, props, state, and hooks. It also includes a Profiler for performance. As React docs note: “Use React Developer Tools to inspect React components, edit props and state, and identify performance problems.” ￼. This is invaluable for debugging component behavior and performance.
	•	Console and Browser DevTools: Standard debugging (breakpoints, console.log) still helps, especially to inspect network calls, DOM, and JS behavior.
	•	Linting and Static Analysis: Use ESLint with React plugins (e.g. eslint-plugin-react-hooks) to catch common mistakes (like missing hook deps).
	•	Testing Libraries:
	•	Jest: A popular test runner for JavaScript. Often used with React for unit testing. It supports snapshot testing of components.
	•	React Testing Library (RTL): Encouraged by the React community for testing components by simulating user interactions. It is “a very light-weight solution for testing React components” ￼, emphasizing testing behavior over implementation details. Example:

import { render, screen, fireEvent } from '@testing-library/react';
test('increments counter', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('+'));
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});

RTL works well with Jest or alternative runners.

	•	Vitest: A newer, fast test runner (with first-class ESM support) that works similarly to Jest. Many projects are adopting Vitest for speed.
	•	End-to-End (E2E) Testing: Tools like Cypress or Playwright test whole user flows in a real browser. They complement unit tests.

	•	TypeScript for Debugging: Using TypeScript (see below) can catch many errors at compile time. It also aids IntelliSense while coding.
	•	Error Monitoring: In production, services like Sentry or LogRocket can capture errors and performance issues (useful for larger applications).

Using these tools and practices helps you catch bugs early and ensure your app works as intended across updates.

TypeScript in React (Functional Components)

Using TypeScript with React enhances reliability. Key points:
	•	Typing Props: Define an interface for props and annotate your component. Example:

interface ButtonProps { onClick: () => void; label: string; }
const Button: React.FC<ButtonProps> = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);

Or simply: function Button({ onClick, label }: ButtonProps) { ... }. React.FC includes an implicit children prop (optional) and some type checking, but usage is a style choice.

	•	Typing State: useState is generic. For example, for a user object or nullable state:

interface User { name: string; age: number; }
const [user, setUser] = useState<User | null>(null);

TypeScript infers simple types (e.g. useState(false) infers boolean) ￼. If initial value is null, explicitly provide the type as above. You can also use type assertions (e.g. useState<User>({} as User)) if you’re certain it will be set immediately.

	•	Typing Reducer: With useReducer, define state and action types. Example from the cheatsheet:

type State = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' };
function reducer(state: State, action: Action): State { ... }
const [state, dispatch] = useReducer(reducer, { count: 0 });

Ensure the reducer return type matches state. (You can use Redux’s Reducer<State, Action> type if integrating with Redux utilities.) ￼.

	•	Typing Refs: useRef is also generic. For DOM refs, you can specify element types, e.g. const inputRef = useRef<HTMLInputElement>(null). For mutable values, if you want a writable ref, specify the type including null if initially null. Example: const countRef = useRef<number>(0);. The cheatsheet notes that if the ref’s type fully covers the initial value, current is read-only or mutable accordingly ￼.
	•	Typing Context: When creating context, you can specify the value type: const MyContext = createContext<MyType | null>(null);. When using useContext, TypeScript infers the type: const value = useContext(MyContext);. Be careful with default null (it may require non-null checks).
	•	Typing Custom Hooks: Annotate the return types and arguments of hooks. For example, a hook returning [state, setState] can be typed like a function returning a tuple. Generics can make custom hooks flexible.
	•	JSX and Type Checking: Ensure your tsconfig.json has "jsx": "react-jsx" (for React 17+ new JSX transform). Install type definitions (@types/react, @types/react-dom) for full type support.

Using TypeScript encourages early error catching (e.g. mismatched props) and better editor support. The React TypeScript Cheatsheet is an excellent resource with examples. For instance, it confirms that useState<User | null>(null) is the pattern to type an initially null state ￼.

⸻

Sources: Official React documentation and credible resources on React hooks and patterns are referenced throughout (e.g. React docs for hooks ￼ ￼ ￼ ￼, React docs on code splitting ￼ ￼, React docs on error boundaries ￼, and more). Additional guidance comes from community-maintained docs like the React TypeScript Cheatsheet ￼ and design pattern references ￼ ￼. These reflect best practices in React 18 and beyond.