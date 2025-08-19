# The Bake Bar - Homemade Bakery Website

A responsive, mobile-friendly website for The Bake Bar homemade bakery, built with React, Vite, and TailwindCSS.

## 🌐 Live Website

**Visit the live site:** [https://seesamjagan.github.io/the-bake-bar/](https://seesamjagan.github.io/the-bake-bar/)

The website is deployed using GitHub Pages with automated deployment via GitHub Actions.

## 🌟 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Multilingual Support**: English and Tamil languages
- **Dark/Light Theme**: Toggle between themes
- **Product Management**: Dynamic product rendering from JSON
- **Shopping Cart**: Add/remove items with quantity management
- **Order Submission**: WhatsApp and Email integration
- **Contact Forms**: Multiple contact methods
- **Smooth Animations**: Framer Motion animations throughout
- **Modern UI**: TailwindCSS styling with custom bakery theme

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom theme
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Internationalization**: React i18next
- **Icons**: Lucide React
- **State Management**: React Context API
- **Deployment**: GitHub Pages with GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd the-bake-bar
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Pages

### Home Page
- Hero section with animations
- Featured products showcase
- About section
- Statistics display

### Products Page
- Dynamic product listing from JSON
- Category filtering
- Search functionality
- Add to cart functionality
- Product details with ingredients and allergens

### Cart Page
- Shopping cart management
- Quantity editing
- Order summary
- Customer information form
- WhatsApp/Email order submission

### Contact Page
- Contact form
- Multiple contact methods
- Social media links
- FAQ section

## 🌍 Internationalization

The website supports both English and Tamil languages. Language can be switched using the globe icon in the navigation bar.

Translation files are located in:
- `src/locales/en.json` - English translations
- `src/locales/ta.json` - Tamil translations

## 🎨 Theming

### Custom Colors
- **Brown**: `#8B4513` - Primary bakery color
- **Cream**: `#F5F5DC` - Warm background
- **Pink**: `#FFB6C1` - Accent color
- **Gold**: `#FFD700` - Highlights
- **Warm**: `#FFF8DC` - Light background

### Dark Mode
Toggle between light and dark themes using the sun/moon icon in the navigation.

## 🛒 Cart & Orders

### Shopping Cart Features
- Persistent cart (localStorage)
- Quantity management
- Real-time total calculation
- Remove items functionality

### Order Submission
Orders can be submitted via:
- **WhatsApp**: Direct message to bakery
- **Email**: Formatted email with order details

## 📦 Product Management

Products are managed through `src/data/products.json`. Each product includes:
- Basic information (name, description, price, quantity)
- Category classification
- Featured status
- Ingredients list
- Allergen information

## 🔧 Configuration Files

- `tailwind.config.js` - TailwindCSS configuration with custom theme
- `postcss.config.js` - PostCSS configuration
- `vite.config.js` - Vite build configuration
- `firebase.json` - Firebase hosting configuration

## 🚀 Deployment

### GitHub Pages with GitHub Actions

The website is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow is triggered on every push to the `master` branch.

#### Deployment Process:
1. **Automated Build**: GitHub Actions workflow builds the project using `npm run build`
2. **Deploy to Pages**: Built files are automatically deployed to GitHub Pages
3. **Live Site**: Available at [https://seesamjagan.github.io/the-bake-bar/](https://seesamjagan.github.io/the-bake-bar/)

#### Manual Deployment:
1. Push changes to the `master` branch:
```bash
git add .
git commit -m "Your commit message"
git push origin master
```

2. GitHub Actions will automatically:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

### Build Configuration

The project is configured for GitHub Pages with:
- Build output: `dist/` directory
- Base path: `/the-bake-bar/` for GitHub Pages subdirectory
- SPA routing support with React Router basename
- Automated deployment via GitHub Actions workflow

### GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy.yml`) includes:
- Node.js 18 setup
- Dependency installation with npm cache
- Build process
- Automated GitHub Pages deployment

### Deployment Checklist

- [x] ✅ GitHub Pages deployment configured
- [x] ✅ GitHub Actions workflow setup
- [x] ✅ SEO metadata and structured data added
- [x] ✅ React Router basename configured for GitHub Pages
- [ ] Update contact information (phone, email, address)
- [ ] Add real product images to `src/assets/images/`
- [ ] Replace logo placeholders with actual logos
- [ ] Test all functionality before deployment
- [ ] Update social media links
- [ ] Set up custom domain (optional)

## 📂 Project Structure

```
the-bake-bar/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and static files
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/           # React contexts
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/              # Static data
│   │   └── products.json
│   ├── hooks/             # Custom hooks
│   ├── locales/           # Translation files
│   │   ├── en.json
│   │   └── ta.json
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   └── Contact.jsx
│   ├── utils/             # Utilities
│   │   └── i18n.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── firebase.json          # Firebase configuration
├── tailwind.config.js     # TailwindCSS config
└── package.json           # Dependencies
```

## 🎯 Key Features Implementation

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized images

### Performance Optimizations
- Lazy loading
- Code splitting
- Optimized images
- Minimal bundle size

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## 🐛 Troubleshooting

### Common Issues

1. **TailwindCSS not working**
   - Check PostCSS configuration
   - Verify content paths in tailwind.config.js

2. **Firebase deployment fails**
   - Ensure `npm run build` completes successfully
   - Check firebase.json configuration
   - Verify Firebase project settings

3. **Cart not persisting**
   - Check localStorage permissions
   - Verify CartContext implementation

## 📞 Support

For support or questions about this project:
- Email: Jaganvinothini1993@gmail.com
- Phone: +91 95518 62527

## 📄 License

This project is created for The Bake Bar bakery. All rights reserved.

---

Built with ❤️ for The Bake Bar
