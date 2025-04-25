# Algorithm Visualizer

An interactive algorithm visualization tool that helps you understand various algorithms through step-by-step animations and educational content.

## Features

- Visual representation of sorting algorithms (Bubble Sort, Quick Sort, Merge Sort, etc.)
- Visual representation of searching algorithms (Binary Search, Linear Search)
- Visual representation of graph algorithms (BFS, DFS)
- Visual representation of pathfinding algorithms
- Step-by-step execution with play, pause, and reset controls
- Detailed algorithm explanations with time and space complexity
- Adjustable animation speed and array size

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- PostgreSQL database

## Installation

### Option 1: Using the Setup Script

Run the setup script which will install dependencies and set up the environment:

```bash
git clone <repository-url>
cd algorithm-visualizer
./setup.sh
```

After running the script, make sure to update the `.env` file with your PostgreSQL credentials.

### Option 2: Manual Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd algorithm-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory (you can copy from `.env.example`):
```
DATABASE_URL=postgresql://username:password@localhost:5432/algorithm_visualizer
```
Replace `username`, `password`, and `algorithm_visualizer` with your PostgreSQL credentials.

4. Initialize the database:
```bash
npm run db:push
npm run db:seed
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Technology Stack

- **Frontend**: React, TailwindCSS, shadcn/ui, D3.js for visualizations
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query
- **Routing**: wouter

## Project Structure

- `/client`: Frontend React application
  - `/src/components`: UI components
  - `/src/hooks`: Custom React hooks
  - `/src/lib`: Utility functions and algorithm implementations
  - `/src/pages`: Application pages
- `/server`: Backend Express server
- `/db`: Database configuration and seed data
- `/shared`: Shared types and schemas

## Dependencies

All dependencies are listed in the `package.json` file. The main dependencies are:

- React and React DOM
- Express
- Drizzle ORM for PostgreSQL
- D3.js for visualizations
- TailwindCSS and shadcn/ui for styling
- React Query for data fetching

## License

[MIT License](LICENSE)