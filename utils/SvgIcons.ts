/**
 * SVG Icons Utilities
 * Centralized imports for commonly used SVG icons
 * 
 * This file provides easy access to frequently used icons
 * and serves as a reference for all available SVG assets.
 */

// Navigation & UI Icons
export { default as ArrowLeft } from '../assets/icons/arrow-left-blue.svg';
export { default as ArrowLeftGray } from '../assets/icons/arrow-left-grey.svg';
export { default as ArrowLeftWhite } from '../assets/icons/arrow-left-white.svg';
export { default as ChevronDown } from '../assets/icons/icon-chevron-down.svg';
export { default as ChevronLeft } from '../assets/icons/icon-chevron-left.svg';
export { default as ChevronRight } from '../assets/icons/icon-chevron-right.svg';
export { default as ChevronUp } from '../assets/icons/icon-chevron-up.svg';

// Form & Input Icons
export { default as CalendarBlack } from '../assets/icons/calendar-black.svg';
export { default as CalendarGray } from '../assets/icons/calendar-gray.svg';
export { default as Calendar } from '../assets/icons/calendar.svg';
export { default as SearchBlack } from '../assets/icons/feather-search-black.svg';
export { default as Search } from '../assets/icons/feather-search.svg';
export { default as Filter } from '../assets/icons/filter-blue.svg';
export { default as FilterGray } from '../assets/icons/filter-gray.svg';

// Status & Feedback Icons
export { default as AlertCircleOrange } from '../assets/icons/alert-circle-orange.svg';
export { default as AlertCircleRed } from '../assets/icons/alert-circle-red.svg';
export { default as AlertCircle } from '../assets/icons/alert-circle.svg';
export { default as AlertTriangleBlue } from '../assets/icons/alert-triangle-blue.svg';
export { default as CheckCircleSuccess } from '../assets/icons/check-circle-success.svg';
export { default as CheckCircle } from '../assets/icons/check-circle.svg';
export { default as CheckWhite } from '../assets/icons/check-white.svg';
export { default as Check } from '../assets/icons/check.svg';
export { default as Exclamation } from '../assets/icons/exclamation-circle.svg';

// Form Controls
export { default as CheckboxBlue } from '../assets/icons/checbox-blue-lleno.svg';
export { default as CheckboxChecked } from '../assets/icons/checkbox-checked-icon.svg';
export { default as CheckboxUnchecked } from '../assets/icons/checkbox-unchecked-icon.svg';
export { default as CheckboxEmpty } from '../assets/icons/checkbox-vacio.svg';
export { default as RadioChecked } from '../assets/icons/radiobutton-checked-icon.svg';
export { default as RadioUnchecked } from '../assets/icons/radiobutton-unchecked-icon.svg';

// Actions & Operations
export { default as Download } from '../assets/icons/download-blue.svg';
export { default as DownloadGray } from '../assets/icons/download-gray.svg';
export { default as Edit } from '../assets/icons/pencil-blue.svg';
export { default as EditDisabled } from '../assets/icons/pencil-gray-disabled.svg';
export { default as Send } from '../assets/icons/send-blue.svg';
export { default as SendWhite } from '../assets/icons/send-white.svg';
export { default as Share } from '../assets/icons/share-dark-gray.svg';
export { default as DeleteGray } from '../assets/icons/trash-grey.svg';
export { default as Delete } from '../assets/icons/trash-red.svg';
export { default as Upload } from '../assets/icons/upload-blue.svg';

// Business & Financial
export { default as Bank } from '../assets/icons/bank.svg';
export { default as CreditCard } from '../assets/icons/credit-card-black.svg';
export { default as CreditCardGreen } from '../assets/icons/credit-card-green.svg';
export { default as CreditCardWhite } from '../assets/icons/credit-card-white.svg';
export { default as GiftBlack } from '../assets/icons/gift-black.svg';
export { default as Gift } from '../assets/icons/gift.svg';
export { default as MoneySymbol } from '../assets/icons/icon-simbolo-dinero.svg';
export { default as MoneyBlue } from '../assets/icons/moneda-blue.svg';

// Documents & Files
export { default as DocumentCheck } from '../assets/icons/document-check.svg';
export { default as DocumentChecked } from '../assets/icons/document-checked-icon.svg';
export { default as Document } from '../assets/icons/Icon-Document-text.svg';
export { default as PdfIcon } from '../assets/icons/icon-pdf.svg';
export { default as FileBlue } from '../assets/icons/mini-file-blue.svg';
export { default as FileRed } from '../assets/icons/mini-file-red.svg';
export { default as Paperclip } from '../assets/icons/paperclip.svg';

// User & Profile
export { default as Phone } from '../assets/icons/feather-phone.svg';
export { default as UserBlack } from '../assets/icons/Icon-User-Black.svg';
export { default as UserWhite } from '../assets/icons/Icon-User-White.svg';
export { default as User } from '../assets/icons/usuario-icon.svg';

// Utility & System
export { default as Home } from '../assets/icons/home-blue.svg';
export { default as HomeGray } from '../assets/icons/home-gray.svg';
export { default as Lock } from '../assets/icons/icon-candado.svg';
export { default as Plus } from '../assets/icons/plus.svg';
export { default as Retry } from '../assets/icons/retry-icon.svg';
export { default as Shield } from '../assets/icons/shield-icon.svg';
export { default as CloseGreen } from '../assets/icons/x-close-green-vida.svg';
export { default as Close } from '../assets/icons/x-close.svg';

// Special & Category
export { default as ErrorData } from '../assets/icons/error-obtener-datos.svg';
export { default as Statistics } from '../assets/icons/estadistica-icon.svg';
export { default as NoData } from '../assets/icons/no-hay-datos.svg';
export { default as Notification } from '../assets/icons/siniestro-notificar-bell-blue-icon.svg';

// Country Flags
export { default as FlagDR } from '../assets/icons/flag-rd.svg';
export { default as FlagUSA } from '../assets/icons/flag-usa.svg';

/**
 * Icon size presets for consistent usage
 */
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
} as const;

/**
 * Common icon colors for consistent theming
 */
export const IconColors = {
  primary: '#007AFF',
  secondary: '#6B758C',
  success: '#28A745',
  warning: '#FFC107',
  danger: '#DC3545',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  gray: '#6C757D',
} as const;

/**
 * Helper function to get icon component by name
 * 
 * @example
 * const IconComponent = getIconByName('check');
 * <IconComponent width={20} height={20} />
 */
export const getIconByName = (iconName: string) => {
  const iconMap: Record<string, any> = {
    // Navigation
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'chevron-down': ChevronDown,
    'chevron-up': ChevronUp,
    'arrow-left': ArrowLeft,
    
    // Form
    'calendar': Calendar,
    'search': Search,
    'filter': Filter,
    
    // Status
    'check': Check,
    'check-circle': CheckCircle,
    'alert-circle': AlertCircle,
    'exclamation': Exclamation,
    
    // Actions
    'download': Download,
    'upload': Upload,
    'edit': Edit,
    'delete': Delete,
    'send': Send,
    'share': Share,
    
    // Business
    'bank': Bank,
    'credit-card': CreditCard,
    'money': MoneyBlue,
    'gift': Gift,
    
    // Documents
    'document': Document,
    'file': FileBlue,
    'pdf': PdfIcon,
    
    // User
    'user': User,
    'phone': Phone,
    
    // Utility
    'home': Home,
    'plus': Plus,
    'close': Close,
    'lock': Lock,
    'shield': Shield,
  };
  
  return iconMap[iconName] || null;
};

export default {
  // All exports
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Calendar, Search, Filter,
  Check, CheckCircle, AlertCircle,
  Download, Upload, Edit, Delete,
  Bank, CreditCard, MoneyBlue,
  Document, User, Home,
  IconSizes,
  IconColors,
  getIconByName,
};
