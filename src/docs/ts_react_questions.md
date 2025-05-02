Summary

This batch covers the first 20 questions, grouped into three domains: Node.js runtime and profiling, TypeScript utility types and tsconfig options, and core JavaScript/ECMAScript features. For Node.js, we explore built-in profiling via Chrome DevTools, V8 heap-size flags, default heap sizing, libuv’s thread pool, and the modern worker_threads module. In the TypeScript section, we review utility types like Readonly<T>, ReturnType<T>, and Awaited<T>, strict mode, project references, and key tsconfig.json options (outDir, rootDir, baseUrl/paths). Finally, we cover ES6 arrow functions, object destructuring, and the JavaScript event loop’s microtask vs. macrotask behavior. Each explanation is grounded in official docs and community sources.

⸻

Node.js Profiling and Runtime Options

1. Profiling CPU and Memory Usage

Question: What built-in tool can you use to profile CPU and memory usage of a running Node.js process?
Answer: Chrome DevTools (Performance panel via console.profile()).
Explanation: Node.js integrates with Chrome DevTools, allowing you to start and stop CPU and memory profiling directly from your script or REPL using console.profile('label') and console.profileEnd('label'). The collected profile appears in the DevTools Performance panel, showing call stacks, memory snapshots, and flame charts without any external dependencies.  ￼

2. Increasing V8’s Old-Space (Heap) Memory Limit

Question: Which command-line flag increases V8’s old-space (heap) memory limit?
Answer: --max-old-space-size
Explanation: The --max-old-space-size=<SIZE> flag (where <SIZE> is in MiB) configures V8’s Old Space heap limit for Node.js. For example, node --max-old-space-size=2048 index.js sets a 2 GB heap limit, helping memory-intensive applications avoid “out of memory” errors at the cost of increased RAM usage.  ￼

3. Default V8 Heap Size Determination

Question: How is the default maximum V8 heap size typically determined in modern (v14+) 64-bit Node.js processes?
Answer: It scales based on available system memory.
Explanation: In Node.js v14 and later, V8’s default heap limit is computed by V8’s internal heuristics at startup, using the host’s physical memory to choose an appropriate maximum Old Space size. This dynamic sizing eliminates the need for manual heap-size configuration in many environments.  ￼

4. Scheduling Work on the Libuv Thread Pool

Question: Which libuv function schedules work to run on its thread pool?
Answer: uv_queue_work
Explanation: uv_queue_work(loop, req, work_cb, after_work_cb) submits a work_cb callback to a libuv thread-pool thread and then invokes after_work_cb on the event loop once the work completes. This mechanism offloads CPU-bound or blocking C/C++ tasks without blocking the main JavaScript thread.  ￼

18. Offloading CPU-Bound Work to Multiple Threads

Question: Which Node.js module provides an API for offloading CPU-bound work to multiple threads?
Answer: worker_threads
Explanation: The built-in worker_threads module lets you spawn Worker instances, each with its own event loop, enabling parallel JavaScript execution. Unlike libuv’s C++ thread pool, worker_threads supports sharing memory (e.g., SharedArrayBuffer) and passing messages via MessageChannel, ideal for distributing heavy computations across threads.  ￼

19. Experimental ESM Support Flag

Question: Which command-line flag enabled experimental ESM support in older Node.js versions?
Answer: --experimental-modules
Explanation: Prior to stabilized ES module support, Node.js required the --experimental-modules flag (and the .mjs extension) to load modules via import/export syntax. This flag triggered V8’s ES module loader until ES modules became unflagged in Node.js v14+.  ￼

⸻

TypeScript Utility Types and tsconfig.json Options

5. Readonly Utility Type

Question: Which TypeScript utility type makes all properties of T readonly?
Answer: Readonly<T>
Explanation: The Readonly<Type> utility constructs a type where every property of Type is marked readonly, preventing assignments to those properties during type checking (though nested object fields remain mutable unless recursively made readonly).  ￼

6. Enabling All Strict Type Checks

Question: Which tsconfig.json option enables all strict type-checking flags (including strictNullChecks)?
Answer: strict
Explanation: The top-level "strict": true compiler option turns on the entire family of strict type-checking checks—noImplicitAny, strictNullChecks, strictFunctionTypes, and others—providing the strongest guarantees of type safety.  ￼

7. Output Directory for Compiled Files

Question: In tsconfig.json, which option specifies the directory where compiled JavaScript files are emitted?
Answer: outDir
Explanation: "outDir": "./dist" tells the TypeScript compiler to place all .js, .d.ts, and source-map files into the specified directory, preserving the input folder structure under rootDir.  ￼

8. Root Folder of TypeScript Sources

Question: Which tsconfig.json setting defines the root folder of your TypeScript source files?
Answer: rootDir
Explanation: By default, rootDir is inferred as the common path of all non-declaration inputs; setting "rootDir": "./src" overrides this, ensuring the compiled output mirrors the source layout relative to that folder.  ￼

9. Project References

Question: Project References in TypeScript primarily help with what?
Answer: Incremental builds across multiple projects
Explanation: Project References enable structuring large codebases into smaller subprojects, improving build times and enforcing separation. Using tsc --build, TypeScript can build only changed projects and their dependents.  ￼

10. Generic Type Constraints

Question: Which keyword constrains a generic type parameter in TypeScript?
Answer: extends
Explanation: In function identity<T extends string>(arg: T) { … }, the extends keyword restricts T to types that are assignable to string, enabling safe property access and inference.  ￼

11. ReturnType Utility Type

Question: Which TypeScript utility type extracts the return type of a function type?
Answer: ReturnType<T>
Explanation: ReturnType<() => number> evaluates to number, letting you derive types from function signatures for higher-order utilities or dynamic type transformations.  ￼

12. Awaited Utility Type

Question: Which TypeScript utility type unwraps the type inside a Promise?
Answer: Awaited<T>
Explanation: Awaited<Promise<string>> resolves to string, modeling the behavior of the await operator; it also handles nested promises and conditional union types.  ￼

13. Cleaner Import Paths

Question: Which pair of tsconfig settings lets you create cleaner import paths (e.g., @/components)?
Answer: baseUrl & paths
Explanation: Setting "baseUrl": "./" and configuring "paths": { "@/*": ["src/*"] } allows absolute imports from the project root, avoiding long relative paths.  ￼  ￼

14. Declaration Merging

Question: Declaration Merging in TypeScript allows you to do what?
Answer: Augment existing interfaces or namespaces
Explanation: When two declarations share the same name (e.g., interface Foo { a: number } and later interface Foo { b: string }), the compiler merges them into a single Foo type containing both a and b.  ￼

15. Runtime Metadata Reflection

Question: Which experimental TypeScript feature enables runtime metadata reflection?
Answer: Decorators (with emitDecoratorMetadata)
Explanation: Enabling "experimentalDecorators": true and "emitDecoratorMetadata": true in tsconfig lets tools like reflect-metadata capture design-time types (e.g., constructor parameter types) at runtime for dependency injection or validation frameworks.  ￼

20. Pick Utility Type

Question: Which TypeScript utility type constructs a subtype by selecting a set of properties K from T?
Answer: Pick<T, K>
Explanation: Pick<Todo, "title" | "completed"> creates a new type with only the title and completed properties from Todo, useful for shaping API responses or form data.  ￼

⸻

JavaScript and ECMAScript Basics

16. Arrow Functions & Object Destructuring

Question: Which ECMAScript edition introduced arrow functions and object destructuring?
Answer: ES6 (also known as ECMAScript 2015)
Explanation: ES6 added concise arrow function syntax (() => {}) and destructuring assignment (let { a, b } = obj), greatly improving code brevity and readability.  ￼

17. Microtask vs. Macrotask

Question: What distinguishes a microtask from a macrotask in JavaScript’s event loop?
Answer: Microtasks run before the next macrotask.
Explanation: After the call stack empties, the event loop drains the microtask queue (e.g., promise callbacks, process.nextTick) completely before scheduling the next macrotask (e.g., setTimeout, I/O callbacks). This ordering ensures promise-based work executes promptly within the same tick.  ￼ ￼