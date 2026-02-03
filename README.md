# eepy

A mobile-first sleep cycle calculator built with Vue 3.

## Features

- **Sleep Now**: Calculate the best wake-up times if you go to sleep right now.
- **Select Wake Up Time**: Find the best time to go to sleep to wake up at a specific time.
- **Select Bed Time**: Find out when you should wake up if you go to bed at a specific time.

## Logic

The app calculates sleep cycles based on 90-minute intervals. The goal is to wake up at the end of a sleep cycle (light sleep) rather than in the middle of deep sleep, to reduce grogginess. It suggests times for 4, 5, or 6 full cycles.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Tech Stack

- Vue 3
- Vue Router
- CSS (Mobile-first, Dark Mode)
