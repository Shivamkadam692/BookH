# BookH 🏨

**Stay where memories start** - full-featured accommodation booking platform built with Node.js and Express.

BookH is a modern, responsive web application that connects travelers with unique stays around the world. Hosts can list their properties, and guests can discover, book, and review accommodations seamlessly.

## ✨ Features

### 🏠 For Guests
- **Explore Stays** - Browse through categorized listings (Trending, Rooms, Iconic Cities, Castles, Pools, Mountains, Camping, Farms)
- **Advanced Search** - Search by location, title, description, or category with real-time filtering
- **Book Accommodations** - Easy booking system with date selection, guest count, and optional notes
- **Reviews & Ratings** - Leave and read detailed reviews with 5-star ratings
- **Trip Management** - View and manage your bookings in the personalized dashboard
- **Category Filtering** - Filter listings by travel categories with intuitive UI

### 👨‍💼 For Hosts
- **Listing Management** - Create, edit, and delete your property listings
- **Image Upload** - Cloudinary integration for seamless image hosting
- **Booking Dashboard** - Monitor upcoming guest arrivals and manage reservations
- **Revenue Tracking** - View booking statistics and earnings
- **Owner Dashboard** - Comprehensive dashboard to manage all your listings and bookings

### 🎨 User Experience
- **Responsive Design** - Beautiful, mobile-first interface that works on all devices
- **Modern UI** - Clean, intuitive design with smooth animations and transitions
- **Real-time Search** - Instant filtering and search results
- **Flash Messages** - User-friendly notifications for all actions
- **Protected Routes** - Secure authentication with Passport.js

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Cloudinary** - Image storage and management
- **Multer** - File upload handling
- **Joi** - Schema validation
- **EJS** - Template engine

### Frontend
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **Custom CSS** - Enhanced styling and animations
- **JavaScript** - Client-side interactivity

### Additional Libraries
- **express-session** - Session management
- **connect-flash** - Flash messaging
- **method-override** - RESTful routing support
- **ejs-mate** - Layout support for EJS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shivamkadam692/BookH.git
   cd BookH
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   ```

4. **Set up MongoDB**
   - Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017/BookH`
   - Or update the `MONGO_URL` in `app.js` with your MongoDB connection string

5. **Initialize sample data (optional)**
   ```bash
   node init/index.js
   ```

6. **Start the server**
   ```bash
   node app.js
   ```
   The application will run on `http://localhost:8080`

## 📁 Project Structure

```
BookH/
├── app.js                 # Main application entry point
├── cloudConfig.js         # Cloudinary configuration
├── schema.js              # Joi validation schemas
├── middleware.js          # Custom middleware (auth, validation)
├── models/                # Database models
│   ├── listing.js        # Listing schema
│   ├── booking.js        # Booking schema
│   ├── review.js         # Review schema
│   └── user.js           # User schema
├── controllers/           # Route controllers
│   ├── listings.js       # Listing operations
│   ├── bookings.js       # Booking operations
│   ├── reviews.js        # Review operations
│   ├── users.js          # User authentication
│   └── dashboard.js      # Dashboard data
├── routes/                # Route definitions
│   ├── listing.js        # Listing routes
│   ├── review.js         # Review routes
│   └── user.js           # User routes
├── views/                 # EJS templates
│   ├── layouts/          # Layout templates
│   ├── includes/         # Partial templates
│   ├── listings/         # Listing views
│   ├── users/            # User views
│   └── dashboard/        # Dashboard views
├── public/                # Static assets
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript files
├── utils/                 # Utility functions
│   └── categoryOptions.js # Category definitions
└── init/                  # Database initialization
    ├── data.js           # Sample data
    └── index.js          # Init script
```

## 🚀 Key Features Implementation

### Authentication System
- User registration and login with password hashing
- Session-based authentication
- Protected routes for authenticated users only
- Owner verification for listing management

### Booking System
- Date-based availability checking
- Price calculation based on nights and rate
- Guest count management
- Booking cancellation for both guests and hosts
- Status tracking (confirmed/cancelled)

### Search & Filtering
- Full-text search across titles, descriptions, locations
- Category-based filtering
- Combined search and filter functionality
- URL query parameter support

### Review System
- 5-star rating system with visual stars
- Comment-based reviews
- Review management (view, create, delete)
- Author verification

## 📝 API Routes

### Listings
- `GET /listings` - View all listings (supports search & category filters)
- `GET /listings/new` - Create new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View listing details
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Bookings
- `POST /listings/:id/bookings` - Create booking
- `DELETE /listings/:id/bookings/:bookingId` - Cancel booking

### Reviews
- `POST /listings/:id/reviews` - Create review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Registration page
- `POST /signup` - Register new user
- `GET /login` - Login page
- `POST /login` - User login
- `GET /logout` - User logout

### Dashboard
- `GET /dashboard` - User dashboard (listings, bookings)

## 🎯 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced booking calendar
- [ ] Multiple image upload
- [ ] Map integration for locations
- [ ] Messaging system between hosts and guests
- [ ] Wishlist functionality
- [ ] Social media sharing
- [ ] Advanced analytics dashboard
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Shivam Kadam**
- GitHub: [@Shivamkadam692](https://github.com/Shivamkadam692)

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- Font Awesome for icons
- Cloudinary for image hosting
- All contributors and users of BookH

---

Made with ❤️ for travelers and hosts worldwide
