# Inno Brritto Web - Landing Page

## Project Structure

```
app/
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header component
│   ├── ContactSection.tsx  # Contact form and info component
│   └── Footer.tsx      # Footer with links and info
├── lib/                # Utility functions and business logic
│   ├── validation.ts   # Form validation utilities
│   ├── contact.ts      # Contact form submission logic
│   └── navigation.ts   # Navigation data and utilities
├── types/              # TypeScript type definitions
│   ├── contact.ts      # Contact form interfaces
│   ├── navigation.ts   # Navigation and component props interfaces
│   └── pwa.ts          # PWA-related interfaces
├── layout.tsx          # Root layout with PWA metadata
├── page.tsx            # Landing page composition
└── globals.css         # Global styles

public/
├── manifest.json       # PWA manifest configuration
├── icons/              # App icons for PWA (various sizes)
└── images/             # Static images (logo, etc.)
```

## TypeScript Interfaces

### Contact Types (`app/types/contact.ts`)

- `ContactFormData`: Form data structure
- `ContactFormState`: Form state management
- `ContactInfo`: Contact information structure
- `FormErrors`: Validation error structure

### Navigation Types (`app/types/navigation.ts`)

- `NavigationItem`: Navigation link structure
- `HeaderProps`: Header component props
- `FooterProps`: Footer component props
- `ContactSectionProps`: Contact section props

### PWA Types (`app/types/pwa.ts`)

- `PWAManifest`: Web app manifest structure
- `CacheConfig`: Service worker cache configuration

## PWA Configuration

The application is configured as a Progressive Web App with:

- Web app manifest (`/manifest.json`)
- Service worker for offline functionality
- App icons in multiple sizes (72x72 to 512x512)
- Installability support
- Offline caching strategy

### PWA Features

- **Installable**: Users can install the app on their devices
- **Offline Support**: Cached content available when offline
- **App-like Experience**: Standalone mode without browser UI
- **Theme Color**: Purple (#852DFE) brand color

## Validation Rules

### Contact Form Validation

- **Name**: 2-100 characters, required
- **Subject**: 3-200 characters, required
- **Email**: Valid email format (RFC 5322), required
- **Message**: 10-2000 characters, required

## Next Steps

1. Implement Header component
2. Implement ContactSection component
3. Implement Footer component
4. Apply responsive design and styling
5. Test PWA functionality
6. Integrate components in main page
