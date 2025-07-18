# HireWise Co-pilot

A highly polished, single-page application to help users filter, sort, score, and select the top 5 candidates from a large JSON dataset. Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/UI.

## 🚀 Features

- **Advanced Filtering**: Filter candidates by skills, experience range, salary expectations, and education
- **Smart Sorting**: Sort by match score, date applied, experience, salary, or name
- **Infinite Scroll**: Seamless pagination with intersection observer API
- **Real-time Analytics**: Team analytics with average salary, experience, and skill distribution
- **Shortlist Management**: Select up to 5 candidates with drag-and-drop functionality
- **Match Scoring**: AI-powered scoring algorithm based on skills, experience, and education
- **Responsive Design**: Beautiful dark theme with smooth animations
- **Type Safety**: Full TypeScript implementation with strict type checking

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hirewise
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
hirewise/
├── app/
│   ├── api/candidates/route.ts    # API endpoint for candidate data
│   ├── globals.css               # Global styles and theme
│   ├── layout.tsx                # Root layout with Inter font
│   ├── loading.tsx               # Loading skeleton component
│   └── page.tsx                  # Main application page
├── components/
│   ├── dashboard/
│   │   ├── CandidateCard.tsx     # Individual candidate display
│   │   ├── CandidateGrid.tsx     # Infinite scroll candidate list
│   │   ├── FilterPanel.tsx       # Filter controls
│   │   ├── ShortlistPanel.tsx    # Selected candidates panel
│   │   └── TeamAnalytics.tsx     # Team statistics
│   └── ui/                       # Shadcn/UI components
├── lib/
│   ├── store.ts                  # Zustand state management
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # Utility functions
└── public/
    └── form-submissions.json     # Sample candidate data
```

## 🎨 Design System

### Color Palette (Dark Theme)
- **Background**: #0D1117 (Near-black)
- **Foreground**: #E6EDF3 (Off-white for text)
- **Card**: #161B22 (Dark grey)
- **Primary**: #3FB950 (Vibrant green)
- **Border**: #30363D (Subtle grey)
- **Muted**: #8B949E (Dimmer grey)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

## 🔧 API Endpoints

### GET /api/candidates

Fetches and filters candidate data with computed properties.

**Query Parameters:**
- `skills` (string): Comma-separated skills to filter by
- `minExp` (number): Minimum years of experience
- `maxExp` (number): Maximum years of experience
- `minSalary` (number): Minimum salary expectation
- `maxSalary` (number): Maximum salary expectation
- `topSchool` (boolean): Filter for top 50 schools only
- `sortBy` (string): Sort field (matchScore, date, experience, salary, name)
- `page` (number): Page number for pagination
- `limit` (number): Number of results per page

**Response:**
```json
{
  "candidates": [...],
  "hasMore": boolean
}
```

## 🧮 Match Scoring Algorithm

The match score is calculated based on:
- **Skills Match (50%)**: Percentage of required skills found in candidate's skillset
- **Experience Score (25%)**: Years of experience (capped at 10 years)
- **Education Score (15%)**: Bonus for top 50/25 schools
- **Salary Competitiveness (10%)**: Proximity to average market salary

## 🎯 Key Features

### Filter Panel
- Skills input with comma-separated values
- Experience range slider (0-20 years)
- Salary range slider ($0-$500k)
- Top school filter toggle
- Sort options dropdown

### Candidate Grid
- Infinite scroll with intersection observer
- Real-time filtering and sorting
- Loading states and error handling
- Responsive card layout

### Shortlist Panel
- Maximum 5 candidates selection
- Real-time team analytics
- Individual candidate removal
- Clear all functionality

### Team Analytics
- Average salary calculation
- Experience distribution
- Top school percentage
- Skills frequency analysis
- Match score visualization

## 🚀 Deployment

The application is ready for deployment on Vercel, Netlify, or any other Next.js-compatible platform.

```bash
npm run build
npm start
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using Next.js 15 and modern web technologies.
