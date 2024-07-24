# Aurelius

Aurelius is a privacy-focused, local-first writing application designed to nurture consistent writing habits. It offers
a distraction-free environment with essential features like timed writing sessions, multiple project types, and a clean,
intuitive interface. Aurelius prioritizes user control and data portability, with end-to-end encrypted syncing between
devices. It's crafted for writers who value simplicity, privacy, and ownership of their work.

## Features

-   Great writing experience
-   Markdown shortcuts
-   Timed writing sessions
-   Writing goals for building a habit
-   Tons of keyboard shortcuts
-   Local-first: all data is stored on your device
-   Sync data between devices with a unique sync code
-   Focus mode
-   Music player with multiple genres of focus music or play a youtube video or playlist

## Development

Clone the project

```bash
  git clone https://github.com/i4o-oss/aurelius
```

Go to the project directory

```bash
  cd aurelius
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Known Issues

-   `showSplashDialog` in synced device(s) is `false` on load so dialog doesn't show. Works fine in primary device.
-   Changing toolbar mode from `floating` to `fixed` crashes the app.
