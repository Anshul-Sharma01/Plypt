# Plypt - AI Prompt Marketplace & Bidding Platform

A full-stack web application that enables users to buy, sell, and bid on AI prompts. Built with React, TypeScript, Node.js, and MongoDB, featuring real-time bidding, secure payments, and a comprehensive review system.

## 🚀 Features

### Core Functionality
- **Prompt Marketplace**: Browse, search, and purchase AI prompts across multiple categories (Marketing, Writing, Coding, Design, Business)
- **Real-time Bidding**: Participate in live auctions with Socket.IO-powered real-time updates
- **Secure Payments**: Integrated Razorpay payment gateway with proper currency handling
- **User Roles**: Dual role system (Users & Craftors) with role-specific features
- **Review System**: Rate and review purchased prompts with instant UI updates
- **Social Features**: Like, bookmark, and comment on prompts

### User Features
- Google OAuth & Email/Password authentication
- Purchase history tracking
- Liked and bookmarked prompts management
- Real-time notifications for bid updates
- Responsive dark/light mode UI

### Craftor (Seller) Features
- Create and manage AI prompts
- Set prompts as fixed-price or biddable
- Upload multiple preview images
- Track sales and earnings
- Manage prompt visibility (Public/Private/Draft)
- View and respond to reviews

### Technical Features
- Real-time bidding with Redis caching
- Socket.IO for live updates
- JWT-based authentication
- Secure payment verification
- Image upload with Cloudinary
- Responsive design with Tailwind CSS
- TypeScript for type safety

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time features
- **Razorpay** for payment integration
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **Socket.IO** for WebSocket connections
- **Redis** for caching and auction management
- **Passport.js** for authentication (Google OAuth)
- **Razorpay** for payment processing
- **Cloudinary** for image storage
- **JWT** for token-based auth

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Redis server
- Razorpay account
- Cloudinary account
- Google OAuth credentials

### Clone Repository
```bash
git clone https://github.com/yourusername/plypt.git
cd plypt
```

### Server Setup
```bash
cd server
npm install

# Create .env file with the following variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIS_HOST=localhost
REDIS_PORT=6379
FRONTEND_URL=http://localhost:5173

# Start server
npm run dev
```

### Client Setup
```bash
cd client
npm install

# Create .env file with:
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_razorpay_key_id
VITE_SOCKET_URL=http://localhost:5000

# Start client
npm run dev
```

## 🏗️ Project Structure

```
plypt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Redux slices
│   │   ├── helpers/       # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── store.ts       # Redux store
│   │   └── App.tsx        # Main app component
│   └── package.json
│
└── server/                # Node.js backend
    ├── src/
    │   ├── config/        # Configuration files
    │   ├── controllers/   # Route controllers
    │   ├── middlewares/   # Custom middlewares
    │   ├── models/        # Mongoose models
    │   ├── routes/        # API routes
    │   ├── socket/        # Socket.IO handlers
    │   └── utils/         # Utility functions
    └── package.json
```

## 🔑 Key Features Explained

### Real-time Bidding System
- Auctions start with the first bid and run for 20 minutes
- Redis manages auction state and prevents race conditions
- Socket.IO broadcasts bid updates to all participants
- Automatic auction closure with winner determination

### Payment Flow
1. User initiates purchase
2. Server creates Razorpay order (amount converted to paise)
3. Client opens Razorpay payment gateway
4. Payment verification with signature validation
5. Prompt access granted upon successful payment

### Review System
- Only buyers can review purchased prompts
- Real-time UI updates using Redux state
- Automatic rating calculation for prompts
- One review per user per prompt

## 🔐 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Payment signature verification
- Protected routes with auth middleware
- Socket authentication for real-time features
- Input validation and sanitization

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Dark/light mode support
- Skeleton loaders for better UX
- Toast notifications for user feedback
- Image fallbacks for broken images
- Smooth animations and transitions

## 📝 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/auth/google` - Google OAuth

### Prompts
- `GET /api/prompt/explore` - Browse prompts
- `GET /api/prompt/:slug` - Get prompt details
- `POST /api/prompt/create` - Create prompt (Craftor)
- `PUT /api/prompt/update/:id` - Update prompt

### Purchases
- `POST /api/purchase/buy/:promptId` - Initiate purchase
- `POST /api/purchase/complete` - Complete payment
- `GET /api/purchase/my-purchases` - Purchase history

### Reviews
- `POST /api/review/add/:craftorId/:promptId` - Add review
- `DELETE /api/review/delete/:reviewId` - Delete review
- `GET /api/review/prompt/:promptId` - Get reviews

### Bidding (Socket Events)
- `joinAuctionRoom` - Join auction
- `placeBid` - Place a bid
- `newBid` - Receive bid updates
- `auctionEnded` - Auction completion

## 🐛 Recent Fixes

### Review System Fix
- Fixed instant review updates using Redux state management
- Reviews now appear immediately without page refresh

### Payment Amount Fix
- Corrected currency conversion (455 now shows as ₹455.00, not ₹4.55)
- Server-side conversion to paise for Razorpay
- Consistent amount handling across purchase and bidding flows

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway/Render)
```bash
cd server
# Set environment variables
# Deploy with your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.


## 🙏 Acknowledgments

- Razorpay for payment integration
- Socket.IO for real-time features
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
