/**
 * SVG Icons Utilities
 * Centralized imports for commonly used SVG icons
 * 
 * This file provides easy access to frequently used icons
 * and serves as a reference for all available SVG assets.
 */

import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

// SVG Component Type
type SvgComponent = FC<SvgProps>;

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
 * Get SVG icon component by name
 * @param iconName Icon name
 * @returns SVG Component or null
 */
export const getSvgIcon = (iconName: string): SvgComponent | null => {
  // Import SVG components with type assertions
  const ChevronLeft = require('../assets/icons/icon-chevron-left.svg').default as SvgComponent;
  const ChevronRight = require('../assets/icons/icon-chevron-right.svg').default as SvgComponent;
  const ChevronDown = require('../assets/icons/icon-chevron-down.svg').default as SvgComponent;
  const ChevronUp = require('../assets/icons/icon-chevron-up.svg').default as SvgComponent;
  const ArrowLeft = require('../assets/icons/arrow-left-blue.svg').default as SvgComponent;
  const Calendar = require('../assets/icons/calendar.svg').default as SvgComponent;
  const Search = require('../assets/icons/feather-search.svg').default as SvgComponent;
  const Filter = require('../assets/icons/filter-blue.svg').default as SvgComponent;
  const Check = require('../assets/icons/check.svg').default as SvgComponent;
  const CheckCircle = require('../assets/icons/check-circle.svg').default as SvgComponent;
  const AlertCircle = require('../assets/icons/alert-circle.svg').default as SvgComponent;
  const Exclamation = require('../assets/icons/exclamation-circle.svg').default as SvgComponent;
  const Download = require('../assets/icons/download-blue.svg').default as SvgComponent;
  const Upload = require('../assets/icons/upload-blue.svg').default as SvgComponent;
  const Edit = require('../assets/icons/pencil-blue.svg').default as SvgComponent;
  const Delete = require('../assets/icons/trash-red.svg').default as SvgComponent;
  const Send = require('../assets/icons/send-blue.svg').default as SvgComponent;
  const Share = require('../assets/icons/share-dark-gray.svg').default as SvgComponent;
  const Bank = require('../assets/icons/bank.svg').default as SvgComponent;
  const CreditCard = require('../assets/icons/credit-card-black.svg').default as SvgComponent;
  const MoneyBlue = require('../assets/icons/moneda-blue.svg').default as SvgComponent;
  const Gift = require('../assets/icons/gift.svg').default as SvgComponent;
  const Document = require('../assets/icons/Icon-Document-text.svg').default as SvgComponent;
  const FileBlue = require('../assets/icons/mini-file-blue.svg').default as SvgComponent;
  const PdfIcon = require('../assets/icons/icon-pdf.svg').default as SvgComponent;
  const User = require('../assets/icons/usuario-icon.svg').default as SvgComponent;
  const Phone = require('../assets/icons/feather-phone.svg').default as SvgComponent;
  const Home = require('../assets/icons/home-blue.svg').default as SvgComponent;
  const Plus = require('../assets/icons/plus.svg').default as SvgComponent;
  const Close = require('../assets/icons/x-close.svg').default as SvgComponent;
  const Lock = require('../assets/icons/icon-candado.svg').default as SvgComponent;
  const Shield = require('../assets/icons/shield-icon.svg').default as SvgComponent;

  const iconMap: { [key: string]: SvgComponent } = {
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

// Export all icons in a single object for easier access
export const Icons = {
  // Navigation
  ChevronLeft: require('../assets/icons/icon-chevron-left.svg').default as SvgComponent,
  ChevronRight: require('../assets/icons/icon-chevron-right.svg').default as SvgComponent,
  ChevronDown: require('../assets/icons/icon-chevron-down.svg').default as SvgComponent,
  ChevronUp: require('../assets/icons/icon-chevron-up.svg').default as SvgComponent,
  ArrowLeft: require('../assets/icons/arrow-left-blue.svg').default as SvgComponent,
  
  // Form
  Calendar: require('../assets/icons/calendar.svg').default as SvgComponent,
  Search: require('../assets/icons/feather-search.svg').default as SvgComponent,
  Filter: require('../assets/icons/filter-blue.svg').default as SvgComponent,
  
  // Status & Feedback
  Check: require('../assets/icons/check.svg').default as SvgComponent,
  CheckCircle: require('../assets/icons/check-circle.svg').default as SvgComponent,
  AlertCircle: require('../assets/icons/alert-circle.svg').default as SvgComponent,
  
  // Actions & Operations
  Download: require('../assets/icons/download-blue.svg').default as SvgComponent,
  Upload: require('../assets/icons/upload-blue.svg').default as SvgComponent,
  Edit: require('../assets/icons/pencil-blue.svg').default as SvgComponent,
  Delete: require('../assets/icons/trash-red.svg').default as SvgComponent,
  
  // Business & Financial
  Bank: require('../assets/icons/bank.svg').default as SvgComponent,
  CreditCard: require('../assets/icons/credit-card-black.svg').default as SvgComponent,
  MoneyBlue: require('../assets/icons/moneda-blue.svg').default as SvgComponent,
  
  // Documents & Files
  Document: require('../assets/icons/Icon-Document-text.svg').default as SvgComponent,
  
  // User & Profile
  User: require('../assets/icons/usuario-icon.svg').default as SvgComponent,
  
  // Utility & System
  Home: require('../assets/icons/home-blue.svg').default as SvgComponent,
};

export default Icons;