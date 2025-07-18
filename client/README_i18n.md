# Internationalization (i18n) Setup

This project now supports both English and Arabic languages with a language toggle feature.

## Features

- **Language Toggle**: A button in the navbar allows users to switch between English and Arabic
- **RTL Support**: Full right-to-left text direction support for Arabic
- **Automatic Language Detection**: The app detects the user's preferred language from browser settings
- **Persistent Language Selection**: Language choice is saved in localStorage

## How to Use

### For Users
1. Click the language toggle buttons in the navbar (English/العربية)
2. The entire website will switch to the selected language
3. Your language preference will be remembered for future visits

### For Developers

#### Adding New Translations

1. **Add English text** in `src/locales/en/translation.json`:
```json
{
  "newSection": {
    "title": "New Section Title",
    "description": "New section description"
  }
}
```

2. **Add Arabic translation** in `src/locales/ar/translation.json`:
```json
{
  "newSection": {
    "title": "عنوان القسم الجديد",
    "description": "وصف القسم الجديد"
  }
}
```

3. **Use in React components**:
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  );
};
```

#### RTL Styling

When adding new CSS, consider RTL support:

```css
/* Default LTR styles */
.my-element {
  margin-left: 20px;
  text-align: left;
}

/* RTL override */
[dir="rtl"] .my-element {
  margin-left: 0;
  margin-right: 20px;
  text-align: right;
}
```

## File Structure

```
src/
├── i18n.js                    # i18n configuration
├── locales/
│   ├── en/
│   │   └── translation.json   # English translations
│   └── ar/
│       └── translation.json   # Arabic translations
└── components/
    ├── LanguageToggle.js      # Language toggle component
    └── LanguageToggle.css     # Language toggle styles
```

## Technical Details

- **Library**: react-i18next with i18next
- **Language Detection**: i18next-browser-languagedetector
- **Storage**: localStorage for language persistence
- **RTL Support**: CSS [dir="rtl"] selectors and document.documentElement.dir

## Adding New Languages

To add a new language (e.g., French):

1. Create `src/locales/fr/translation.json`
2. Add French translations
3. Update `src/i18n.js` to include the new language
4. Update the LanguageToggle component to include the new language option