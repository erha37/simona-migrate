// SIMONA Design System - Ant Design Theme Config
export const simonaTheme = {
  // Primary Colors
  primary: {
    50: '#EEF4FF',
    100: '#DCE8FF',
    200: '#B9D1FF',
    300: '#8FAFFF',
    400: '#5C88FF',
    500: '#3A66E8',   // Main primary
    600: '#2D4FC4',
    700: '#233CA0',
    800: '#1B2D7C',
    900: '#14205B',
  },
  
  // Success
  success: {
    50: '#E8F8EF',
    100: '#D1F1DF',
    200: '#A3E3BF',
    300: '#6FD197',
    400: '#48BB78',   // Main success
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
  },
  
  // Warning
  warning: {
    50: '#FFF8E1',
    100: '#FFEFB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#ED8936',   // Main warning
    500: '#DD6B20',
    600: '#C05621',
  },
  
  // Danger/Error
  danger: {
    50: '#FFF0F0',
    100: '#FFE0E0',
    200: '#FFC0C0',
    300: '#FF9999',
    400: '#E53E3E',   // Main danger
    500: '#C53030',
    600: '#9B2C2C',
  },
  
  // Neutral/Gray
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E8E8E8',
    300: '#D0D0D0',
    400: '#A0A0A0',
    500: '#757575',
    600: '#616161',
    700: '#424242',
    800: '#212121',
    900: '#141414',
  },
  
  // Background
  background: {
    primary: '#F5F7FA',
    secondary: '#FFFFFF',
    card: '#FFFFFF',
  },
  
  // Border
  border: {
    light: '#E8E8E8',
    medium: '#D0D0D0',
    dark: '#A0A0A0',
  },
  
  // Spacing (8px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.16)',
  },
  
  // Transitions
  transition: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
  },
  
  // Typography
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '32px', fontWeight: 700, lineHeight: '40px' },
    h2: { fontSize: '24px', fontWeight: 600, lineHeight: '32px' },
    h3: { fontSize: '20px', fontWeight: 600, lineHeight: '28px' },
    h4: { fontSize: '16px', fontWeight: 600, lineHeight: '24px' },
    body1: { fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
    body2: { fontSize: '12px', fontWeight: 400, lineHeight: '16px' },
    caption: { fontSize: '11px', fontWeight: 400, lineHeight: '16px' },
  },
  
  // Chart Colors
  chart: {
    primary: '#3A66E8',
    success: '#48BB78',
    warning: '#ED8936',
    danger: '#E53E3E',
    info: '#38B2AC',
    purple: '#9F7AEA',
    pink: '#ED64A6',
    gradient1: ['#3A66E8', '#667eea'],
    gradient2: ['#48BB78', '#68D391'],
    gradient3: ['#ED8936', '#F6AD55'],
  },
};

export default simonaTheme;