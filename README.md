## 🚀 AI Career Mentor

AI Career Mentor is a comprehensive, AI-powered platform designed to guide professionals through every stage of their job search journey. By leveraging **Google's Gemini AI**, the application provides personalized career insights, resume optimization, and interview preparation tailored to the user's specific industry and skills.

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/ff510f93-6731-46df-8b05-0d9ae1c2711e" />

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/ffe1dbaf-89e9-470e-877e-548af9f4b002" />

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/9d880e20-a9d8-4840-84f8-4dbc6ece617f" />

---

### ✨ Key Features

#### 1. 📈 AI Industry Insights

- **Real-time Market Data**  
  Analyze industry-specific salary trends, growth rates, and demand levels.

- **Visual Analytics**  
  Interactive charts for salary ranges and industry growth.

- **Skill Recommendations**  
  AI-driven insights on in-demand skills and emerging trends.

---

#### 2. 📝 Intelligent Resume Builder

- **Markdown Editor**  
  Create professional resumes using a clean, distraction-free editor.

- **AI Auto-Improve**  
  Rewrite resume bullet points to be more impactful, professional, and quantifiable using Gemini AI.

- **PDF Download**  
  Export resumes as perfectly formatted, application-ready PDFs.

---

#### 3. 🔍 Resume Analyzer

- **ATS Scanner**  
  Upload your existing PDF resume and receive an instant ATS compatibility score (0–100).

- **Detailed Feedback**  
  Actionable insights highlighting strengths, weaknesses, and improvement areas.

---

#### 4. ✉️ Cover Letter Generator

- **Tailored Content**  
  Generates personalized cover letters by analyzing your resume and the job description.

- **Smart Editor**  
  Edit and refine the generated content before downloading.

---

#### 5. 🎯 Interview Preparation Suite

- **AI Mock Exams (Quiz Mode)**  
  Industry-specific multiple-choice questions to assess technical knowledge.

- **Video Interview (Mock Interview)**  
  - Real-time AI-powered interview simulation  
  - Audio-based questions  
  - Speech-to-text answer recording via microphone/webcam  

- **AI Feedback**  
  Instant ratings, detailed feedback, and suggested “Better Answers” for every response.

- **Performance Tracking**  
  Visual progress tracking with separate trend lines for quizzes and mock interviews.

---

### 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS  
- **UI Components:** Shadcn UI, Lucide React  
- **Backend:** Next.js Server Actions  
- **Database:** PostgreSQL (Neon DB) + Prisma ORM  
- **AI Engine:** Google Gemini API (`gemini-2.5-flash`)  
- **Authentication:** Clerk  
- **Charts:** Recharts  
- **Forms & Validation:** React Hook Form + Zod  

---

### 🚀 Getting Started

#### Prerequisites

- Node.js **v18+**
- PostgreSQL Database (**Neon recommended**)
- Clerk Account
- Google Gemini API Key

---

#### Installation

##### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-career-mentor.git
cd ai-career-mentor
```
##### 2. Install dependencies

```bash
npm install
```
##### 3. Set up environment variables

Create a .env file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Gemini AI
GEMINI_API_KEY="AIzaSy..."
```

##### 4. Push Prisma schema to database

```bash
npx prisma db push
```

##### 5. Run the development server

```bash
npm run dev
```
Open http://localhost:3000 in your browser.

#### 📸 Screenshots

##### Dashboard

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/7962c4b8-99c1-46d8-b70e-756bf16908ff" />

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/a95b743c-4181-4928-a5a0-1e3c4106eec1" />

##### Resume Builder

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/a8bcab03-b6d1-4d68-b75c-be4e05c71a47" />

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/d5cbebfb-59d0-438e-a240-fd7ecf81a342" />

##### Video Interview

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/40484c95-8d14-43de-851b-5fb9f9fa4902" />

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/d4ea7e9d-7cee-4e21-a408-aab0aacce617" />

##### Performance Analytics

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/9fe7d1a8-483d-4f47-a59d-126787007cd8" />

#### 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a **Pull Request**.

#### 📄 License

This project is licensed under the **MIT License**.
See the LICENSE file for details.

#### 🙏 Acknowledgements

- **Google Gemini** – AI-powered intelligence
- **Neon** – Serverless PostgreSQL
- **Clerk** – Seamless authentication
