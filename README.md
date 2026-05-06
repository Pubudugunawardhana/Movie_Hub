# Movie Hub 🎬

Movie Hub is a premium, full-stack (MERN) movie streaming and management platform. It features a stunning user interface, a robust admin dashboard, AI-powered assistance, and secure payment integrations.

## 🚀 Features

### Frontend (User & Admin)
- **Modern UI/UX**: Premium dark-mode aesthetic with glassmorphism and smooth animations.
- **Movie & Series Library**: Browse movies by category, language, and type.
- **Dynamic Search & Filtering**: Real-time search with advanced filtering options.
- **AI Chatbot Assistant**: Gemini-powered AI to help users find movies and answer questions.
- **Subscription System**: Secure payment integration via Stripe for premium content.
- **User Reviews**: Detailed review and rating system for every movie.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.

### Backend (API & Logic)
- **Robust Authentication**: Secure JWT-based login and registration system with Admin/User roles.
- **Advanced Admin Dashboard**:
  - **Overview Analytics**: Live stats for total movies, users, revenue, and recent activity.
  - **Content Management**: Full CRUD operations for Movies, Actors, and Categories.
  - **User Management**: Activate/Deactivate users and manage roles.
  - **Enquiry System**: Handle customer messages and replies.
  - **Transaction Tracking**: Detailed logs with CSV export functionality.
- **AI Integration**: Custom implementation of Google Gemini API for context-aware assistance.
- **File Uploads**: Image handling for posters and actor photos using Multer.
- **Automated Emails**: Password resets and enquiry notifications via Nodemailer.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React, Recharts, Swiper.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **AI**: Google Gemini Pro API.
- **Payments**: Stripe API.
- **Tools**: Axios, JWT, Multer, Nodemailer.

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Movie_Hub.git
cd Movie_Hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```
Run the server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Run the development server:
```bash
npm run dev
```

## 📸 Screenshots

| Admin Overview | Movie Details |
| :---: | :---: |
| ![Admin Dashboard](https://via.placeholder.com/400x250?text=Admin+Overview) | ![Movie Details](https://via.placeholder.com/400x250?text=Movie+Details) |

| AI Chatbot | Transactions |
| :---: | :---: |
| ![AI Chat](https://via.placeholder.com/400x250?text=AI+Assistant) | ![Transactions](https://via.placeholder.com/400x250?text=Transaction+History) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
