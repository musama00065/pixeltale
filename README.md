# PixelTale — AI-Powered Image-to-Story Generator

PixelTale is a modern, premium web application that transforms user-uploaded images into beautiful, personalized short stories.

A user uploads an image, previews it instantly, chooses a storytelling style, and receives a unique AI-written narrative inspired by the scene, colors, atmosphere, and objects detected within the image.

## 🚀 Key Features

- **Cozy Premium UI**: Built with a custom Tailwind CSS v4 design system featuring a warm coral and soft amber color palette, elegant typography (Inter and Merriweather), custom scrollbars, glassmorphism, and spring-based Framer Motion card animations.
- **Client-Side Image Compression**: High-resolution user images (up to 8MB) are automatically resized to a maximum dimension of 1200px and compressed to lightweight WebPs/JPEGs before upload. This ensures fast uploads, preserves Vercel payload limits, and reduces token consumption.
- **Gemini 2.5 Flash Integration**: Secure, server-side API communication using the official `@google/genai` SDK.
- **Structured JSON Outputs**: Employs OpenAPI schemas directly on the Gemini API configuration to guarantee valid JSON formatting consisting of a title, story content, and exactly three mood tags.
- **Storybook-Style Formatting**: The generated story displays inside a modern paper book-style card, featuring a classic serif typeface, responsive line heights, and an elegant stylized **Drop Cap** (first-letter decoration).
- **Interactive UX Polish**:
  - Rotating status messages (e.g. *Looking closely...*, *Adding a little magic...*) cycle every 2.5 seconds to keep the user engaged.
  - Confetti explosion upon successful story generation.
  - One-click copy-to-clipboard button with visual feedback.
  - Client-side session history keeping track of the last 10 generated stories.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **File Upload**: React Dropzone
- **AI Model**: Google Gemini 2.5 Flash Vision (via `@google/genai`)

## ⚙️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/pixeltale.git
   cd pixeltale
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and insert your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Build for Production**:
   ```bash
   npm run build
   ```
