# Aurelius

Writing app for modern writers

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

-   `displaySplashDialog` in synced device(s) is `false` on load so dialog doesn't show. Works fine in primary device.
