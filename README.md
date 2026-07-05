# StreamVista

> A premium YouTube-inspired video streaming platform built with Next.js 15

StreamVista is a modern, feature-rich video streaming application that leverages the official YouTube Embedded Player API and YouTube Data API v3 to provide an enhanced video-watching experience.

## Features

- **YouTube Integration**: Paste any YouTube URL or search for videos
- **Premium Video Player**: Official YouTube IFrame Player with custom controls
- **Smart Features**: Watch history, favorites, watch later, continue watching
- **Modern UI**: Glassmorphism design, dark/light themes, smooth animations
- **Video Controls**: Playback speed, theater mode, picture-in-picture, keyboard shortcuts
- **Sharing**: Share links, QR codes, download thumbnails, copy embed codes
- **PWA Ready**: Install as a progressive web app for offline access
- **Responsive**: Optimized for mobile, tablet, and desktop

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling & design system |
| Framer Motion | Animations |
| shadcn/ui | UI component primitives |
| Lucide React | Icons |
| YouTube IFrame Player API | Video playback |
| YouTube Data API v3 | Video search & metadata |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd streamvista
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your YouTube API key to `.env.local`:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```
   > **Note**: Set `NEXT_PUBLIC_USE_MOCK_DATA=true` for development without an API key.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## YouTube API Key

To get a YouTube Data API v3 key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the key and add it to your `.env.local` file

> **Note**: The app works with mock data when `NEXT_PUBLIC_USE_MOCK_DATA=true`, so you can develop without an API key.

## Deployment (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### One-Click Deploy

Click the "Deploy with Vercel" button above, or follow these steps:

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add the environment variables:
   - `NEXT_PUBLIC_YOUTUBE_API_KEY` - Your YouTube API key
   - `NEXT_PUBLIC_SITE_URL` - Your production URL
   - `NEXT_PUBLIC_USE_MOCK_DATA` - Set to `false` in production
4. Click **Deploy**

### Manual Deploy

```bash
npm run build
npx vercel --prod
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── search/            # Search page
│   ├── trending/          # Trending page
│   ├── categories/        # Categories & category detail
│   ├── watch/[id]/        # Video watch page
│   ├── history/           # Watch history
│   ├── watch-later/       # Watch later list
│   ├── favorites/         # Favorites
│   ├── settings/          # App settings
│   ├── about/             # About page
│   └── offline/           # Offline fallback
├── components/
│   ├── layout/            # Navbar, Sidebar
│   ├── video/             # VideoCard, VideoGrid, VideoPlayer
│   ├── search/            # SearchResults
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, API clients, constants
├── types/                 # TypeScript types
└── public/                # Static assets, PWA icons, SW
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |
| `T` | Toggle theater mode |
| `←` | Rewind 5 seconds |
| `→` | Forward 5 seconds |
| `↑` | Volume up |
| `↓` | Volume down |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Performance

- Lighthouse Score: 95+
- SEO optimized with dynamic metadata
- Lazy-loaded components and images
- Code splitting and tree shaking
- Optimized font loading with next/font
- Responsive images with next/image

## License

MIT

---

Built with ❤️ using Next.js, React, and TypeScript
