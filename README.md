# Money Manager – Frontend

A modern, responsive web application for managing personal and business finances with real-time analytics, transaction tracking, and comprehensive filtering capabilities.

## 🔗 Links

- **Live Application**: [https://money-manager-frontend-six.vercel.app](https://money-manager-frontend-six.vercel.app)
- **Backend Repository**: [https://github.com/Harshit-Patle/money-manager-backend](https://github.com/Harshit-Patle/money-manager-backend)

## 📝 Description

The Money Manager frontend provides an intuitive user interface for tracking income and expenses with powerful analytics and visualization features. Built with React and styled with Tailwind CSS, it offers seamless interaction with financial data through interactive dashboards, smart filtering, and responsive design.

**Key Capabilities:**
- Visual dashboard with income/expense analytics
- Real-time transaction management with modal-based forms
- Advanced filtering by date range, categories, and divisions
- Historical transaction views with edit capabilities
- Category-wise spending summaries with charts
- Fully responsive design for mobile and desktop

## ✨ Features

### Dashboard & Analytics
- **Interactive Dashboard**: View financial overview with month-wise, weekly, and yearly income/expense breakdowns
- **Visual Charts**: Dynamic charts powered by Recharts for income vs expense trends
- **Category Summary**: Pie charts and statistics showing spending distribution across categories
- **Quick Stats**: Real-time cards displaying total income, expenses, and balance

### Transaction Management
- **Add Transaction Modal**: Two-tab interface for adding income and expenses with date, time, description, and category
- **Transaction History**: Comprehensive list of all transactions with sorting and filtering
- **Edit Capability**: Modify transactions within 12 hours of creation (auto-locked after)
- **Category Organization**: Predefined categories (Food, Fuel, Medical, Movie, Loan, etc.) with Office/Personal divisions

### Filtering & Search
- **Date Range Filter**: Filter transactions between any two dates
- **Category Filter**: Filter by specific spending categories
- **Division Filter**: Separate Office and Personal transactions
- **Combined Filters**: Apply multiple filters simultaneously for precise data views

### User Experience
- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop
- **Dark/Light Theme**: Defaults to the device/system theme on first visit, then persists the user’s selected preference
- **Loading States**: Smooth loaders and transitions for better UX
- **Form Validation**: Client-side validation with helpful error messages

### Account Management
- **User Authentication**: Secure login and registration system
- **Transfer Feature**: Transfer funds between accounts (tracked as Transfer records)
- **Protected Routes**: Automatic redirection for authenticated/unauthenticated users

## 🛠️ Tech Stack

- **Framework**: React
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Heroicons
- **UI Components**: Headless UI
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## 🔐 Environment Variables

The application requires the following environment variable:

```
VITE_API_URL
```

**Format**: The variable should contain the full base URL of the backend API including `/api` path.

**Example structure**:
```
VITE_API_URL=https://your-backend-domain.com/api
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harshit-Patle/money-manager-frontend.git
   cd money-manager-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory and add:
   ```
   VITE_API_URL=your_backend_api_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`


## 🚀 Final Commit Hash

**Frontend Final Implementation Commit**: `2f4607a1d27a39cdd971d6abf2913828bc37465d`

> **Note**: Any commits after the above hash are documentation-only updates and do not affect the application's functionality. These commits may include README updates, comment additions, or other non-code documentation improvements.

## 📋 Submission Details

Complete submission information including the project description, live deployed URLs,
GitHub repository links, demo video link, and final commit hashes is provided in
`submission-details.txt` located in the root of this repository.
