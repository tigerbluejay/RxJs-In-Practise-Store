# RxJS Course – Part 2 (Angular University)

This repository is the second part of an advanced RxJS course by Angular University. It focuses on practical, real-world applications of RxJS in Angular development. The material expands upon the fundamentals by demonstrating how to manage application state reactively, coordinate asynchronous tasks, and use advanced Subject types for data broadcasting and caching.

## 🧠 Overview
This codebase explores how to build reactive Angular applications using RxJS as the backbone for both asynchronous logic and state management. It showcases advanced Subject types (Subject, BehaviorSubject, ReplaySubject, AsyncSubject) and demonstrates how and when to use each. The repository also introduces a centralized in-memory store, illustrating a clean way to manage and share data across components without relying on external state management libraries.

### 🔄 Understanding RxJS Subjects

The about.component.ts file walks through several types of RxJS Subjects:
- Subject: Acts both as an Observable and an Observer. Useful for multicasting to multiple subscribers. However, late subscribers will miss previously emitted values.
- BehaviorSubject: A Subject with memory. It emits the latest value to new subscribers even if they subscribe late. Ideal for keeping components in sync with the most recent state.
- ReplaySubject: Replays a defined number of past emissions to new subscribers. Helpful when late subscribers need access to the full emitted history, not just the latest value.
- AsyncSubject: Emits only the last value upon completion. Suitable for use cases where only the final result matters, such as long-running calculations.
- Each Subject is demonstrated with actual code examples, showing how they emit values, how subscriptions behave depending on timing, and their appropriate use cases in Angular apps.

### 🏪 Centralized Store with RxJS
A major feature of this repository is the implementation of a centralized data store using BehaviorSubject in the store.service.ts file. This store:
- Initializes by fetching data via an HTTP request and caching it in memory.
- Exposes the data as an Observable so components can subscribe reactively.
- Allows filtering and selecting specific slices of the data (e.g., beginner or advanced courses).
- Enables updates to the data through a saveCourse() method that synchronizes changes across all subscribers and persists them via an HTTP PUT request.
- This pattern ensures that components don’t make redundant HTTP calls and always operate on up-to-date, in-memory data.

🧩 Component Examples
- HomeComponent: Uses the store to display filtered course lists (beginner and advanced). Instead of hitting the API directly, it reacts to the store’s data stream.
- CourseDialogComponent: Demonstrates editing and saving course data through the store. When a course is updated, the store pushes the new data to all subscribers.
- CourseComponent: Uses withLatestFrom to combine the result of an HTTP call with the latest course data. This shows how to coordinate multiple observables, especially when one is long-lived (course data) and another short-lived (user action like searching).

🚀 Running the App
Install dependencies:

```bash
npm install
```

Start the Angular app:

```bash
npm start
```

Start the mock backend server:

```bash
npm run server
```
The Angular app will be available at http://localhost:4200 and the mock API typically at http://localhost:9000.
