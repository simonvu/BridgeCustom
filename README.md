# BridgeCustom Theme

A custom Shopify theme for the BridgeCustom store with enhanced menu functionality and featured content support.

## Project Structure

```
bc/
├── assets/          # JavaScript and CSS files
├── blocks/          # Block template files (Liquid)
├── config/          # Theme configuration
├── layout/          # Layout template files
├── locales/         # Translation files
├── sections/        # Section template files
├── snippets/        # Reusable snippet components
├── templates/       # Page template files
└── .shopifyignore   # Files to exclude from Shopify pushes
```

## Recent Changes

### Header Menu Fixes (2026-08-17)
- **Desktop Dropdown Menu**: Added `.is-active` class fallback for `:has()` selector compatibility
- **Mobile Menu**: Enhanced submenu navigation with smooth scrolling
- **Featured Content**: Force eager loading of featured products/collections
- **Default Style**: Changed default menu style to text-only (no featured images)

### Modified Files
- `assets/header-menu.js` - Added active state management
- `blocks/_header-menu.liquid` - Updated CSS and default settings
- `assets/header-drawer.js` - Enhanced submenu handling
- `snippets/mega-menu-list.liquid` - Force eager content loading

## Deployment

### Push to Shopify LIVE
```bash
npx shopify theme push --theme="185206800684" --allow-live
```

### Push to Development
```bash
npx shopify theme push --development
```

## Shopify Store
- **Store**: bridgecustom.myshopify.com
- **LIVE Theme ID**: 185206800684 (BridgeCustom V2)
- **Dev Theme ID**: 185202278700 (Development)

## Development Guidelines

### Ignore Rules
The following files are excluded from version control:
- `config/settings_data.json` - Shopify store settings
- `templates/*.json` - Store layout configurations
- `Admin/` - Admin-specific files

These files should not be committed to avoid overwriting store-specific configurations.

### Best Practices
1. Always test changes on development theme first
2. Use descriptive commit messages
3. Keep sensitive configuration out of git
4. Sync with Shopify CLI before making changes
5. Review changes in theme editor before pushing to LIVE

## Dependencies

- Node.js 24.19.0+
- Shopify CLI 4.6.1+

### Installation
```bash
npm install -g @shopify/cli
```

## License

Internal use only
