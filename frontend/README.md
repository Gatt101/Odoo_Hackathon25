# StackIt - Developer Q&A Community

Welcome to StackIt, a modern Q&A platform designed for developers and tech enthusiasts.

## Features

- **Ask Questions**: Post detailed questions with rich text formatting
- **Rich Text Editor**: Bold, italic, strikethrough, lists, links, images, text alignment, and emoji support
- **User Mentions**: @mention other users with autocomplete
- **Answer & Vote**: Provide answers and vote on the best solutions
- **Tagging System**: Organize questions with relevant tags
- **Notifications**: Get notified when someone answers your question or mentions you
- **User Profiles**: View user statistics, badges, and activity
- **Admin Dashboard**: Comprehensive moderation and user management tools

## User Roles

- **Guest**: Browse and view questions/answers
- **User**: Register, ask questions, provide answers, vote, and interact
- **Admin**: Moderate content, manage users, and platform oversight

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   bun install
   ```

### Development

Start the development server:
```bash
npm run dev
```
or
```bash
bun dev
```

The application will be available at `http://localhost:8080`

### Build

To build the project for production:
```bash
npm run build
```
or
```bash
bun run build
```

### Preview

To preview the production build:
```bash
npm run preview
```
or
```bash
bun run preview
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Routing**: React Router
- **State Management**: React Query
- **Rich Text**: Custom editor with emoji and mentions support
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── dist/             # Production build output
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
