# **App Name**: BudgetWise

## Core Features:

- User Onboarding: On first launch, collect user's name, monthly budget, and school/college name and store in local storage. Welcome the user by name on subsequent visits.
- Dashboard: Display current balance, total spend, and total credit. Include an animated progress bar to visualize budget status. Provide animated cards for key metrics.
- Transaction System: Allow users to add transactions (spend or credit) with amount, category (Food, Books, Transport, etc.), optional notes, and auto-filled date & time. Save all transactions to local storage.
- Transaction History: Display a list of all transactions with icons based on category and date. Allow deletion of entries with confirmation.
- Settings: Include settings to reset all data, update budget/user info, and toggle dark mode with animated switch.

## Style Guidelines:

- Primary color: Soft teal (#4DB6AC) for a calm and trustworthy feel.
- Secondary color: Light gray (#ECEFF1) for backgrounds and neutral elements.
- Accent: Coral (#FF8A65) for interactive elements and highlights.
- Use a clean, card-based layout with rounded corners for a modern look.
- Employ flat, outline-style icons for categories and actions. Consider using emojis for a fun touch.
- Use subtle fade-in and slide animations for transitions between sections. Add smooth transitions for hover effects on cards and buttons.

## Original User Request:
Prompt:

Create a full-featured web app using only HTML, CSS, and JavaScript (no backend or frameworks). The app should be a “Student Budget Manager” with a clean, animated UI and use Local Storage to save all user data.

Features:

1. User Onboarding:

Ask for user's name, monthly budget, and school/college name on first launch.

Save user data in local storage.

Welcome the user with their name each time they visit.



2. Dashboard Home Page:

Show current balance, total spend, and total credit received.

Use beautiful animated cards with hover effects and transitions.

Include a progress bar or pie chart showing budget status.



3. Transaction System:

Allow user to add transactions in two types:

Spend (money used, e.g., snacks, books)

Credit (money received, e.g., from parents)


Ask for:

Amount

Category (dropdown: Food, Books, Transport, etc.)

Notes (optional)

Date & Time (auto-filled)


Save all transactions to local storage.



4. Daily & Monthly Analytics:

Show:

Daily spend graph

Monthly income vs expense chart

Category-wise expense breakdown (pie chart or bar)


Use smooth animation effects (like fade-in, slide, bounce) when switching between tabs.



5. Transaction History Page:

List all transactions with icons based on category.

Allow deletion of entries with confirmation.



6. Settings:

Reset all data

Update budget or user info

Dark mode toggle (animated switch)




Technical Requirements:

Use only vanilla HTML, CSS, and JavaScript.

Use localStorage to store user data persistently.

Responsive and mobile-friendly layout.

Use CSS transitions and animations for a smooth interface.

Charts and graphs should be created with JS using <canvas> or pure CSS/HTML if possible.

Minimal external libraries (avoid if not needed).


Bonus:

Use emojis or icons for categories.

Show a congratulatory animation when user stays under budget at month end.



---
  