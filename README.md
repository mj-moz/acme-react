# ACME E-commerce React App with Cookie Integration

A modern React e-commerce application that demonstrates comprehensive cookie usage for enhanced user experience and analytics.

## Features

### 🛒 E-commerce Functionality
- Product catalog with category filtering
- Shopping cart with persistence
- Responsive product grid
- Featured products section

### 🍪 Cookie Management System

#### Essential Cookies (Always Active)
- **Shopping Cart Persistence**: Saves cart contents across sessions (30 days)
- **User Session**: Maintains user session state
- **Core Functionality**: Required for basic site operations

#### Preference Cookies (User Controlled)
- **Theme Selection**: Light/dark mode preferences
- **Layout Options**: Grid/list view preferences
- **Language Settings**: User's preferred language
- **Display Preferences**: Product display options

#### Analytics Cookies (User Controlled)
- **Page View Tracking**: Records pages visited
- **Category Analytics**: Tracks popular categories
- **Product Views**: Monitors product interaction
- **User Journey**: Maps navigation patterns

#### Advertising Cookies (User Controlled)
- **Personalized Recommendations**: Suggests relevant products
- **Ad Interaction Tracking**: Monitors ad performance
- **Behavioral Targeting**: Improves ad relevance
- **Conversion Analytics**: Tracks purchase funnels

#### Performance Cookies (User Controlled)
- **Load Time Monitoring**: Tracks page performance
- **Error Tracking**: Records JavaScript errors
- **Feature Usage**: Monitors feature utilization
- **A/B Testing**: Supports experiment tracking

## Cookie System

- **Automatic Cookie Setting**: All cookies are automatically set for enhanced user experience
- **No Consent Required**: Cookies are set immediately upon site interaction
- **Comprehensive Tracking**: All cookie types are always active

## Technical Implementation

### Architecture
- **React 18** with TypeScript
- **Custom Hooks** for cookie management
- **Component-based** architecture
- **Responsive Design** with CSS modules

### Cookie Hooks
```typescript
useEssentialCookies()     // Shopping cart, session
usePreferenceCookies()    // Theme, layout, language
useAnalyticsCookies()     // Usage tracking
useAdvertisingCookies()   // Ad personalization
usePerformanceCookies()   // Performance monitoring
useCookieConsent()        // Consent management
```

### Key Components
- `App`: Main application with cookie integration
- `Header`: Navigation with cart counter
- `ProductGrid`: Product display with analytics
- `CookieConsent`: Privacy controls banner
- `Footer`: Site footer

## Usage

### Starting the Application
```bash
npm start
```

### Cookie Testing
1. **Open Browser DevTools** → Application → Cookies
2. **Interact with the app**:
   - Browse products (analytics cookies)
   - Add items to cart (essential cookies)
   - Change preferences (preference cookies)
   - Accept/reject cookies (consent management)
3. **Monitor cookie creation** and data storage

### Privacy Features
- **Essential cookies** cannot be disabled
- **All other cookies** require user consent
- **Cookie banner** appears on first visit
- **Granular controls** for each category

## Development

### Project Structure
```
src/
├── components/     # React components
├── hooks/         # Custom cookie hooks
├── types/         # TypeScript interfaces
├── data/          # Product data
├── assets/        # Images and media
└── styles.css     # Global styles
```

### Cookie Types
- **Essential**: Required for functionality
- **Preferences**: User customization
- **Analytics**: Usage tracking
- **Advertising**: Personalized content
- **Performance**: Site optimization

## Cookie Implementation

This implementation demonstrates:
- **Comprehensive cookie usage** across all major categories
- **Automatic data collection** for enhanced user experience
- **Real-time analytics** and performance tracking
- **Shopping behavior analysis** and personalization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

Built with React, TypeScript, and comprehensive cookie management for modern e-commerce experiences.