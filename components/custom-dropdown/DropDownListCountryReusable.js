import React, { useCallback, useMemo, useState } from "react";

import IconSearch from "../../assets/icons/feather-search-black.svg";
// Importando el icono de búsqueda
import { ActivityIndicator, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import IconXClose from "../../assets/icons/x-close.svg";

import AlertRedSVG from "../../assets/icons/alert-circle-red.svg";
import ChevronDownSVG from "../../assets/icons/chevron-down-mascota.svg";
import iconFlagRD from "../../assets/icons/flag-rd.svg";
import iconFlagUS from "../../assets/icons/flag-usa.svg";
// Importando el icono de cierre
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";

/**
 * Componente de lista desplegable reutilizable para países con búsqueda, estados de error, deshabilitado, cargando y personalización.
 * Permite configurar qué elementos mostrar mediante itemListToShow para la lista e itemDisplay para el input.
 *
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {string} props.label - Etiqueta que se muestra sobre el campo
 * @param {Array} props.data - Array de objetos con los datos de países
 * @param {string|number} props.valueSelected - Valor seleccionado
 * @param {Array} [props.itemListToShow=['flag', 'countryName']] - Array de keys que determinan qué elementos mostrar y en qué orden en la lista
 * @param {Array} [props.itemDisplay=['flag', 'countryName']] - Array de keys que determinan qué elementos mostrar en el input (máximo 4, con salto de línea si hay 4)
 * @param {string} [props.placeholder] - Texto que se muestra cuando no hay valor seleccionado
 * @param {string} [props.searchPlaceholder] - Texto del placeholder para el campo de búsqueda
 * @param {Function} props.onChange - Función que se ejecuta al seleccionar un item
 * @param {boolean} [props.disabled=false] - Indica si el campo está deshabilitado
 * @param {boolean} [props.loading=false] - Indica si el campo está en estado de carga
 * @param {string} [props.colorLoading="#4A9ED4"] - Color del ActivityIndicator cuando loading es true
 * @param {string} [props.errorMessage] - Mensaje de error a mostrar
 * @param {Object} [props.customStyles] - Estilos personalizados para los componentes
 * @param {string} [props.labelKey='countryName'] - Key para mostrar el texto principal en búsqueda
 * @param {string} [props.valueKey='idCountry'] - Key para el valor de cada item
 * @param {React.Element} [props.iconCustom] - Componente de ícono personalizado
 * @param {number} [props.iconSize] - Tamaño del ícono
 * @param {string} [props.iconColor='#B3B9C6'] - Color del ícono
 * @param {boolean} [props.required=false] - Indica si el campo es requerido
 * @param {boolean} [props.showRequired=true] - Controla la visibilidad del indicador de campo requerido
 * @param {number} [props.maxLength] - Longitud máxima del texto mostrado para el valor seleccionado
 */

const COUNTRY_LIST = [
  { code: "DO", isocode: "DOM", name: "REPUBLICA_DOMINICANA", flag: "🇩🇴", flagSVG: iconFlagRD },
  { code: "US", isocode: "USA", name: "ESTADOS_UNIDOS", flag: "🇺🇸", flagSVG: iconFlagUS },
  { code: "AF", isocode: "AFG", name: "AFGANISTAN", flag: "🇦🇫", flagSVG: "AfFlag" },
  { code: "AL", isocode: "ALB", name: "ALBANIA", flag: "🇦🇱", flagSVG: "AlFlag" },
  { code: "DE", isocode: "DEU", name: "ALEMANIA", flag: "🇩🇪", flagSVG: "DeFlag" },
  { code: "AD", isocode: "AND", name: "ANDORRA", flag: "🇦🇩", flagSVG: "AdFlag" },
  { code: "AO", isocode: "AGO", name: "ANGOLA", flag: "🇦🇴", flagSVG: "AoFlag" },
  { code: "AG", isocode: "ATG", name: "ANTIGUA_Y_BARBUDA", flag: "🇦🇬", flagSVG: "AgFlag" },
  { code: "SA", isocode: "SAU", name: "ARABIA_SAUDITA", flag: "🇸🇦", flagSVG: "SaFlag" },
  { code: "DZ", isocode: "DZA", name: "ARGELIA", flag: "🇩🇿", flagSVG: "DzFlag" },
  { code: "AR", isocode: "ARG", name: "ARGENTINA", flag: "🇦🇷", flagSVG: "ArFlag" },
  { code: "AM", isocode: "ARM", name: "ARMENIA", flag: "🇦🇲", flagSVG: "AmFlag" },
  { code: "AU", isocode: "AUS", name: "AUSTRALIA", flag: "🇦🇺", flagSVG: "AuFlag" },
  { code: "AT", isocode: "AUT", name: "AUSTRIA", flag: "🇦🇹", flagSVG: "AtFlag" },
  { code: "AZ", isocode: "AZE", name: "AZERBAIYAN", flag: "🇦🇿", flagSVG: "AzFlag" },
  { code: "BS", isocode: "BHS", name: "BAHAMAS", flag: "🇧🇸", flagSVG: "BsFlag" },
  { code: "BD", isocode: "BGD", name: "BANGLADESH", flag: "🇧🇩", flagSVG: "BdFlag" },
  { code: "BB", isocode: "BRB", name: "BARBADOS", flag: "🇧🇧", flagSVG: "BbFlag" },
  { code: "BH", isocode: "BHR", name: "BAHREIN", flag: "🇧🇭", flagSVG: "BhFlag" },
  { code: "BE", isocode: "BEL", name: "BELGICA", flag: "🇧🇪", flagSVG: "BeFlag" },
  { code: "BZ", isocode: "BLZ", name: "BELICE", flag: "🇧🇿", flagSVG: "BzFlag" },
  { code: "BJ", isocode: "BEN", name: "BENIN", flag: "🇧🇯", flagSVG: "BjFlag" },
  { code: "BY", isocode: "BLR", name: "BIELORRUSIA", flag: "🇧🇾", flagSVG: "ByFlag" },
  { code: "BO", isocode: "BOL", name: "BOLIVIA", flag: "🇧🇴", flagSVG: "BoFlag" },
  { code: "BA", isocode: "BIH", name: "BOSNIA_HERZEGOVINA", flag: "🇧🇦", flagSVG: "BaFlag" },
  { code: "BW", isocode: "BWA", name: "BOTSUANA", flag: "🇧🇼", flagSVG: "BwFlag" },
  { code: "BR", isocode: "BRA", name: "BRASIL", flag: "🇧🇷", flagSVG: "BrFlag" },
  { code: "BN", isocode: "BRN", name: "BRUNEI", flag: "🇧🇳", flagSVG: "BnFlag" },
  { code: "BG", isocode: "BGR", name: "BULGARIA", flag: "🇧🇬", flagSVG: "BgFlag" },
  { code: "BF", isocode: "BFA", name: "BURKINA_FASO", flag: "🇧🇫", flagSVG: "BfFlag" },
  { code: "BI", isocode: "BDI", name: "BURUNDI", flag: "🇧🇮", flagSVG: "BiFlag" },
  { code: "BT", isocode: "BTN", name: "BUTAN", flag: "🇧🇹", flagSVG: "BtFlag" },
  { code: "CV", isocode: "CPV", name: "CABO_VERDE", flag: "🇨🇻", flagSVG: "CvFlag" },
  { code: "KH", isocode: "KHM", name: "CAMBOYA", flag: "🇰🇭", flagSVG: "KhFlag" },
  { code: "CM", isocode: "CMR", name: "CAMERUN", flag: "🇨🇲", flagSVG: "CmFlag" },
  { code: "CA", isocode: "CAN", name: "CANADA", flag: "🇨🇦", flagSVG: "CaFlag" },
  { code: "QA", isocode: "QAT", name: "CATAR", flag: "🇶🇦", flagSVG: "QaFlag" },
  { code: "TD", isocode: "TCD", name: "CHAD", flag: "🇹🇩", flagSVG: "TdFlag" },
  { code: "CL", isocode: "CHL", name: "CHILE", flag: "🇨🇱", flagSVG: "ClFlag" },
  { code: "CN", isocode: "CHN", name: "CHINA", flag: "🇨🇳", flagSVG: "CnFlag" },
  { code: "CY", isocode: "CYP", name: "CHIPRE", flag: "🇨🇾", flagSVG: "CyFlag" },
  { code: "VA", isocode: "VAT", name: "CIUDAD_DEL_VATICANO", flag: "🇻🇦", flagSVG: "VaFlag" },
  { code: "CO", isocode: "COL", name: "COLOMBIA", flag: "🇨🇴", flagSVG: "CoFlag" },
  { code: "KM", isocode: "COM", name: "COMORAS", flag: "🇰🇲", flagSVG: "KmFlag" },
  { code: "KP", isocode: "PRK", name: "COREA_DEL_NORTE", flag: "🇰🇵", flagSVG: "KpFlag" },
  { code: "KR", isocode: "KOR", name: "COREA_DEL_SUR", flag: "🇰🇷", flagSVG: "KrFlag" },
  { code: "CR", isocode: "CRI", name: "COSTA_RICA", flag: "🇨🇷", flagSVG: "CrFlag" },
  { code: "CI", isocode: "CIV", name: "COSTA_DE_MARFIL", flag: "🇨🇮", flagSVG: "CiFlag" },
  { code: "HR", isocode: "HRV", name: "CROACIA", flag: "🇭🇷", flagSVG: "HrFlag" },
  { code: "CU", isocode: "CUB", name: "CUBA", flag: "🇨🇺", flagSVG: "CuFlag" },
  { code: "DK", isocode: "DNK", name: "DINAMARCA", flag: "🇩🇰", flagSVG: "DkFlag" },
  { code: "DM", isocode: "DMA", name: "DOMINICA", flag: "🇩🇲", flagSVG: "DmFlag" },
  { code: "EC", isocode: "ECU", name: "ECUADOR", flag: "🇪🇨", flagSVG: "EcFlag" },
  { code: "EG", isocode: "EGY", name: "EGIPTO", flag: "🇪🇬", flagSVG: "EgFlag" },
  { code: "SV", isocode: "SLV", name: "EL_SALVADOR", flag: "🇸🇻", flagSVG: "SvFlag" },
  { code: "AE", isocode: "ARE", name: "EMIRATOS_ARABES_UNIDOS", flag: "🇦🇪", flagSVG: "AeFlag" },
  { code: "ER", isocode: "ERI", name: "ERITREA", flag: "🇪🇷", flagSVG: "ErFlag" },
  { code: "SK", isocode: "SVK", name: "ESLOVAQUIA", flag: "🇸🇰", flagSVG: "SkFlag" },
  { code: "SI", isocode: "SVN", name: "ESLOVENIA", flag: "🇸🇮", flagSVG: "SiFlag" },
  { code: "ES", isocode: "ESP", name: "ESPANA", flag: "🇪🇸", flagSVG: "EsFlag" },
  { code: "EE", isocode: "EST", name: "ESTONIA", flag: "🇪🇪", flagSVG: "EeFlag" },
  { code: "SZ", isocode: "SWZ", name: "ESUATINI", flag: "🇸🇿", flagSVG: "SzFlag" },
  { code: "ET", isocode: "ETH", name: "ETIOPIA", flag: "🇪🇹", flagSVG: "EtFlag" },
  { code: "FJ", isocode: "FJI", name: "FIYI", flag: "🇫🇯", flagSVG: "FjFlag" },
  { code: "PH", isocode: "PHL", name: "FILIPINAS", flag: "🇵🇭", flagSVG: "PhFlag" },
  { code: "FI", isocode: "FIN", name: "FINLANDIA", flag: "🇫🇮", flagSVG: "FiFlag" },
  { code: "FR", isocode: "FRA", name: "FRANCIA", flag: "🇫🇷", flagSVG: "FrFlag" },
  { code: "GA", isocode: "GAB", name: "GABON", flag: "🇬🇦", flagSVG: "GaFlag" },
  { code: "GM", isocode: "GMB", name: "GAMBIA", flag: "🇬🇲", flagSVG: "GmFlag" },
  { code: "GE", isocode: "GEO", name: "GEORGIA", flag: "🇬🇪", flagSVG: "GeFlag" },
  { code: "GH", isocode: "GHA", name: "GHANA", flag: "🇬🇭", flagSVG: "GhFlag" },
  { code: "GD", isocode: "GRD", name: "GRANADA", flag: "🇬🇩", flagSVG: "GdFlag" },
  { code: "GR", isocode: "GRC", name: "GRECIA", flag: "🇬🇷", flagSVG: "GrFlag" },
  { code: "GT", isocode: "GTM", name: "GUATEMALA", flag: "🇬🇹", flagSVG: "GtFlag" },
  { code: "GN", isocode: "GIN", name: "GUINEA", flag: "🇬🇳", flagSVG: "GnFlag" },
  { code: "GQ", isocode: "GNQ", name: "GUINEA_ECUATORIAL", flag: "🇬🇶", flagSVG: "GqFlag" },
  { code: "GW", isocode: "GNB", name: "GUINEA_BISSAU", flag: "🇬🇼", flagSVG: "GwFlag" },
  { code: "GY", isocode: "GUY", name: "GUYANA", flag: "🇬🇾", flagSVG: "GyFlag" },
  { code: "HT", isocode: "HTI", name: "HAITI", flag: "🇭🇹", flagSVG: "HtFlag" },
  { code: "HN", isocode: "HND", name: "HONDURAS", flag: "🇭🇳", flagSVG: "HnFlag" },
  { code: "HU", isocode: "HUN", name: "HUNGRIA", flag: "🇭🇺", flagSVG: "HuFlag" },
  { code: "IN", isocode: "IND", name: "INDIA", flag: "🇮🇳", flagSVG: "InFlag" },
  { code: "ID", isocode: "IDN", name: "INDONESIA", flag: "🇮🇩", flagSVG: "IdFlag" },
  { code: "IQ", isocode: "IRQ", name: "IRAK", flag: "🇮🇶", flagSVG: "IqFlag" },
  { code: "IR", isocode: "IRN", name: "IRAN", flag: "🇮🇷", flagSVG: "IrFlag" },
  { code: "IE", isocode: "IRL", name: "IRLANDA", flag: "🇮🇪", flagSVG: "IeFlag" },
  { code: "IS", isocode: "ISL", name: "ISLANDIA", flag: "🇮🇸", flagSVG: "IsFlag" },
  { code: "MH", isocode: "MHL", name: "ISLAS_MARSHALL", flag: "🇲🇭", flagSVG: "MhFlag" },
  { code: "SB", isocode: "SLB", name: "ISLAS_SOLOMON", flag: "🇸🇧", flagSVG: "SbFlag" },
  { code: "IL", isocode: "ISR", name: "ISRAEL", flag: "🇮🇱", flagSVG: "IlFlag" },
  { code: "IT", isocode: "ITA", name: "ITALIA", flag: "🇮🇹", flagSVG: "ItFlag" },
  { code: "JM", isocode: "JAM", name: "JAMAICA", flag: "🇯🇲", flagSVG: "JmFlag" },
  { code: "JP", isocode: "JPN", name: "JAPON", flag: "🇯🇵", flagSVG: "JpFlag" },
  { code: "JO", isocode: "JOR", name: "JORDANIA", flag: "🇯🇴", flagSVG: "JoFlag" },
  { code: "KZ", isocode: "KAZ", name: "KAZAJISTAN", flag: "🇰🇿", flagSVG: "KzFlag" },
  { code: "KE", isocode: "KEN", name: "KENIA", flag: "🇰🇪", flagSVG: "KeFlag" },
  { code: "KG", isocode: "KGZ", name: "KIRGUISTAN", flag: "🇰🇬", flagSVG: "KgFlag" },
  { code: "KI", isocode: "KIR", name: "KIRIBATI", flag: "🇰🇮", flagSVG: "KiFlag" },
  { code: "KW", isocode: "KWT", name: "KUWAIT", flag: "🇰🇼", flagSVG: "KwFlag" },
  { code: "LA", isocode: "LAO", name: "LAOS", flag: "🇱🇦", flagSVG: "LaFlag" },
  { code: "LS", isocode: "LSO", name: "LESOTO", flag: "🇱🇸", flagSVG: "LsFlag" },
  { code: "LV", isocode: "LVA", name: "LETONIA", flag: "🇱🇻", flagSVG: "LvFlag" },
  { code: "LB", isocode: "LBN", name: "LIBANO", flag: "🇱🇧", flagSVG: "LbFlag" },
  { code: "LR", isocode: "LBR", name: "LIBERIA", flag: "🇱🇷", flagSVG: "LrFlag" },
  { code: "LY", isocode: "LBY", name: "LIBIA", flag: "🇱🇾", flagSVG: "LyFlag" },
  { code: "LI", isocode: "LIE", name: "LIECHTENSTEIN", flag: "🇱🇮", flagSVG: "LiFlag" },
  { code: "LT", isocode: "LTU", name: "LITUANIA", flag: "🇱🇹", flagSVG: "LtFlag" },
  { code: "LU", isocode: "LUX", name: "LUXEMBURGO", flag: "🇱🇺", flagSVG: "LuFlag" },
  { code: "MK", isocode: "MKD", name: "MACEDONIA_DEL_NORTE", flag: "🇲🇰", flagSVG: "MkFlag" },
  { code: "MG", isocode: "MDG", name: "MADAGASCAR", flag: "🇲🇬", flagSVG: "MgFlag" },
  { code: "MY", isocode: "MYS", name: "MALASIA", flag: "🇲🇾", flagSVG: "MyFlag" },
  { code: "MW", isocode: "MWI", name: "MALAWI", flag: "🇲🇼", flagSVG: "MwFlag" },
  { code: "MV", isocode: "MDV", name: "MALDIVAS", flag: "🇲🇻", flagSVG: "MvFlag" },
  { code: "ML", isocode: "MLI", name: "MALI", flag: "🇲🇱", flagSVG: "MlFlag" },
  { code: "MT", isocode: "MLT", name: "MALTA", flag: "🇲🇹", flagSVG: "MtFlag" },
  { code: "MA", isocode: "MAR", name: "MARRUECOS", flag: "🇲🇦", flagSVG: "MaFlag" },
  { code: "MU", isocode: "MUS", name: "MAURICIO", flag: "🇲🇺", flagSVG: "MuFlag" },
  { code: "MR", isocode: "MRT", name: "MAURITANIA", flag: "🇲🇷", flagSVG: "MrFlag" },
  { code: "MX", isocode: "MEX", name: "MEXICO", flag: "🇲🇽", flagSVG: "MxFlag" },
  { code: "FM", isocode: "FSM", name: "MICRONESIA", flag: "🇫🇲", flagSVG: "FmFlag" },
  { code: "MD", isocode: "MDA", name: "MOLDAVIA", flag: "🇲🇩", flagSVG: "MdFlag" },
  { code: "MC", isocode: "MCO", name: "MONACO", flag: "🇲🇨", flagSVG: "McFlag" },
  { code: "MN", isocode: "MNG", name: "MONGOLIA", flag: "🇲🇳", flagSVG: "MnFlag" },
  { code: "ME", isocode: "MNE", name: "MONTENEGRO", flag: "🇲🇪", flagSVG: "MeFlag" },
  { code: "MZ", isocode: "MOZ", name: "MOZAMBIQUE", flag: "🇲🇿", flagSVG: "MzFlag" },
  { code: "MM", isocode: "MMR", name: "MYANMAR", flag: "🇲🇲", flagSVG: "MmFlag" },
  { code: "NA", isocode: "NAM", name: "NAMIBIA", flag: "🇳🇦", flagSVG: "NaFlag" },
  { code: "NR", isocode: "NRU", name: "NAURU", flag: "🇳🇷", flagSVG: "NrFlag" },
  { code: "NP", isocode: "NPL", name: "NEPAL", flag: "🇳🇵", flagSVG: "NpFlag" },
  { code: "NI", isocode: "NIC", name: "NICARAGUA", flag: "🇳🇮", flagSVG: "NiFlag" },
  { code: "NE", isocode: "NER", name: "NIGER", flag: "🇳🇪", flagSVG: "NeFlag" },
  { code: "NG", isocode: "NGA", name: "NIGERIA", flag: "🇳🇬", flagSVG: "NgFlag" },
  { code: "NO", isocode: "NOR", name: "NORUEGA", flag: "🇳🇴", flagSVG: "NoFlag" },
  { code: "NZ", isocode: "NZL", name: "NUEVA_ZELANDA", flag: "🇳🇿", flagSVG: "NzFlag" },
  { code: "OM", isocode: "OMN", name: "OMAN", flag: "🇴🇲", flagSVG: "OmFlag" },
  { code: "NL", isocode: "NLD", name: "PAISES_BAJOS", flag: "🇳🇱", flagSVG: "NlFlag" },
  { code: "PK", isocode: "PAK", name: "PAKISTAN", flag: "🇵🇰", flagSVG: "PkFlag" },
  { code: "PW", isocode: "PLW", name: "PALAOS", flag: "🇵🇼", flagSVG: "PwFlag" },
  { code: "PS", isocode: "PSE", name: "PALESTINA", flag: "🇵🇸", flagSVG: "PsFlag" },
  { code: "PA", isocode: "PAN", name: "PANAMA", flag: "🇵🇦", flagSVG: "PaFlag" },
  { code: "PG", isocode: "PNG", name: "PAPUA_NUEVA_GUINEA", flag: "🇵🇬", flagSVG: "PgFlag" },
  { code: "PY", isocode: "PRY", name: "PARAGUAY", flag: "🇵🇾", flagSVG: "PyFlag" },
  { code: "PE", isocode: "PER", name: "PERU", flag: "🇵🇪", flagSVG: "PeFlag" },
  { code: "PL", isocode: "POL", name: "POLONIA", flag: "🇵🇱", flagSVG: "PlFlag" },
  { code: "PT", isocode: "PRT", name: "PORTUGAL", flag: "🇵🇹", flagSVG: "PtFlag" },
  { code: "GB", isocode: "GBR", name: "REINO_UNIDO", flag: "🇬🇧", flagSVG: "GbFlag" },
  { code: "CF", isocode: "CAF", name: "REPUBLICA_CENTROAFRICANA", flag: "🇨🇫", flagSVG: "CfFlag" },
  { code: "CZ", isocode: "CZE", name: "REPUBLICA_CHECA", flag: "🇨🇿", flagSVG: "CzFlag" },
  { code: "CD", isocode: "COD", name: "REPUBLICA_DEMOCRATICA_DEL_CONGO", flag: "🇨🇩", flagSVG: "CdFlag" },
  { code: "CG", isocode: "COG", name: "REPUBLICA_DEL_CONGO", flag: "🇨🇬", flagSVG: "CgFlag" },
  { code: "RO", isocode: "ROU", name: "RUMANIA", flag: "🇷🇴", flagSVG: "RoFlag" },
  { code: "RU", isocode: "RUS", name: "RUSIA", flag: "🇷🇺", flagSVG: "RuFlag" },
  { code: "RW", isocode: "RWA", name: "RUANDA", flag: "🇷🇼", flagSVG: "RwFlag" },
  { code: "WS", isocode: "WSM", name: "SAMOA", flag: "🇼🇸", flagSVG: "WsFlag" },
  { code: "KN", isocode: "KNA", name: "SAN_CRISTOBAL_Y_NIEVES", flag: "🇰🇳", flagSVG: "KnFlag" },
  { code: "SM", isocode: "SMR", name: "SAN_MARINO", flag: "🇸🇲", flagSVG: "SmFlag" },
  { code: "VC", isocode: "VCT", name: "SAN_VICENTE_Y_LAS_GRANADINAS", flag: "🇻🇨", flagSVG: "VcFlag" },
  { code: "LC", isocode: "LCA", name: "SANTA_LUCIA", flag: "🇱🇨", flagSVG: "LcFlag" },
  { code: "ST", isocode: "STP", name: "SANTO_TOME_Y_PRINCIPE", flag: "🇸🇹", flagSVG: "StFlag" },
  { code: "SN", isocode: "SEN", name: "SENEGAL", flag: "🇸🇳", flagSVG: "SnFlag" },
  { code: "RS", isocode: "SRB", name: "SERBIA", flag: "🇷🇸", flagSVG: "RsFlag" },
  { code: "SC", isocode: "SYC", name: "SEYCHELLES", flag: "🇸🇨", flagSVG: "ScFlag" },
  { code: "SL", isocode: "SLE", name: "SIERRA_LEONA", flag: "🇸🇱", flagSVG: "SlFlag" },
  { code: "SG", isocode: "SGP", name: "SINGAPUR", flag: "🇸🇬", flagSVG: "SgFlag" },
  { code: "SY", isocode: "SYR", name: "SIRIA", flag: "🇸🇾", flagSVG: "SyFlag" },
  { code: "SO", isocode: "SOM", name: "SOMALIA", flag: "🇸🇴", flagSVG: "SoFlag" },
  { code: "LK", isocode: "LKA", name: "SRI_LANKA", flag: "🇱🇰", flagSVG: "LkFlag" },
  { code: "ZA", isocode: "ZAF", name: "SUDAFRICA", flag: "🇿🇦", flagSVG: "ZaFlag" },
  { code: "SD", isocode: "SDN", name: "SUDAN", flag: "🇸🇩", flagSVG: "SdFlag" },
  { code: "SS", isocode: "SSD", name: "SUDAN_DEL_SUR", flag: "🇸🇸", flagSVG: "SsFlag" },
  { code: "SE", isocode: "SWE", name: "SUECIA", flag: "🇸🇪", flagSVG: "SeFlag" },
  { code: "CH", isocode: "CHE", name: "SUIZA", flag: "🇨🇭", flagSVG: "ChFlag" },
  { code: "SR", isocode: "SUR", name: "SURINAM", flag: "🇸🇷", flagSVG: "SrFlag" },
  { code: "TH", isocode: "THA", name: "TAILANDIA", flag: "🇹🇭", flagSVG: "ThFlag" },
  { code: "TW", isocode: "TWN", name: "TAIWAN", flag: "🇹🇼", flagSVG: "TwFlag" },
  { code: "TZ", isocode: "TZA", name: "TANZANIA", flag: "🇹🇿", flagSVG: "TzFlag" },
  { code: "TJ", isocode: "TJK", name: "TAYIKISTAN", flag: "🇹🇯", flagSVG: "TjFlag" },
  { code: "TL", isocode: "TLS", name: "TIMOR_ORIENTAL", flag: "🇹🇱", flagSVG: "TlFlag" },
  { code: "TG", isocode: "TGO", name: "TOGO", flag: "🇹🇬", flagSVG: "TgFlag" },
  { code: "TO", isocode: "TON", name: "TONGA", flag: "🇹🇴", flagSVG: "ToFlag" },
  { code: "TT", isocode: "TTO", name: "TRINIDAD_Y_TOBAGO", flag: "🇹🇹", flagSVG: "TtFlag" },
  { code: "TN", isocode: "TUN", name: "TUNEZ", flag: "🇹🇳", flagSVG: "TnFlag" },
  { code: "TM", isocode: "TKM", name: "TURKMENISTAN", flag: "🇹🇲", flagSVG: "TmFlag" },
  { code: "TR", isocode: "TUR", name: "TURQUIA", flag: "🇹🇷", flagSVG: "TrFlag" },
  { code: "TV", isocode: "TUV", name: "TUVALU", flag: "🇹🇻", flagSVG: "TvFlag" },
  { code: "UA", isocode: "UKR", name: "UCRANIA", flag: "🇺🇦", flagSVG: "UaFlag" },
  { code: "UG", isocode: "UGA", name: "UGANDA", flag: "🇺🇬", flagSVG: "UgFlag" },
  { code: "UY", isocode: "URY", name: "URUGUAY", flag: "🇺🇾", flagSVG: "UyFlag" },
  { code: "UZ", isocode: "UZB", name: "UZBEKISTAN", flag: "🇺🇿", flagSVG: "UzFlag" },
  { code: "VU", isocode: "VUT", name: "VANUATU", flag: "🇻🇺", flagSVG: "VuFlag" },
  { code: "VE", isocode: "VEN", name: "VENEZUELA", flag: "🇻🇪", flagSVG: "VeFlag" },
  { code: "VN", isocode: "VNM", name: "VIETNAM", flag: "🇻🇳", flagSVG: "VnFlag" },
  { code: "YE", isocode: "YEM", name: "YEMEN", flag: "🇾🇪", flagSVG: "YeFlag" },
  { code: "DJ", isocode: "DJI", name: "YIBUTI", flag: "🇩🇯", flagSVG: "DjFlag" },
  { code: "ZM", isocode: "ZMB", name: "ZAMBIA", flag: "🇿🇲", flagSVG: "ZmFlag" },
  { code: "ZW", isocode: "ZWE", name: "ZIMBABUE", flag: "🇿🇼", flagSVG: "ZwFlag" }
];

// ejemplo de uso:
// const [nombreMascota, setNombreMascota] = useState("");

// <DropDownListCountryReusable
// label="País donde se dará el servicio"
// data={countriesData}
// valueSelected={selectedCountryId}
// onChange={setSelectedCountryId}
// placeholder="Seleccionar país"
// labelKey="countryName"
// valueKey="idCountry"
// flagKey="flag"
// errorMessage={validacionCompleta.errorsValidation?.pais}
// itemToShow={[
//   "flag",
//   "countryName"
//   // "currency"
//   // "gentilicio",
//   // "code",
//   // "phoneCode"
//   // "language"
//   // "region",
//   // "timezone",
//   // "population",
//   // "coordinates",
//   // "domain"
// ]}
// showsHorizontalScrollIndicator={true}
// />

const DropDownListCountryReusable = ({
  label,
  data,
  valueSelected,
  itemListToShow = ["flag", "countryName"],
  itemDisplay = ["flag", "countryName"],
  placeholder = "",
  searchPlaceholder = "Buscar...",
  onChange,
  disabled = false,
  loading = false,
  colorLoading = "#4A9ED4",
  errorMessage,
  customStyles = {},
  labelKey = "countryName",
  valueKey = "idCountry",
  iconCustom = null,
  iconSize = 22,
  iconColor = "#B3B9C6",
  required = false,
  showRequired = true,
  maxLength = null
}) => {
  // Estados
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Encuentra el item seleccionado
  const selectedItem = useMemo(() => data?.find((item) => item[valueKey] === valueSelected), [data, valueKey, valueSelected]);

  // Función para renderizar elementos según itemListToShow para la lista
  const renderItemElements = useCallback(
    (item, isForSelection = false) => {
      // Para la lista usamos itemListToShow, para el input usamos itemDisplay
      const elementsToShow = isForSelection ? itemDisplay.slice(0, 4) : itemListToShow;

      return elementsToShow.map((key, index) => {
        const value = item[key];

        if (!value) return null;

        // Si es flag (bandera), aplicar estilo especial
        if (key === "flag") {
          return (
            <Text
              key={`${key}-${index}`}
              style={[isForSelection ? styles.selectedFlag : styles.flagText, isForSelection ? customStyles.selectedFlag : customStyles.flagText]}>
              {value}
            </Text>
          );
        }

        // Para otros elementos de texto - MEJORADO con anchos fijos para alineación
        let displayValue = value;

        if (typeof value === "object" && value !== null) {
          if (key === "coordinates") {
            displayValue = `lat: ${value.lat || ""}, lng: ${value.lng || ""}`;
          } else if (key === "phoneCode" && Array.isArray(value)) {
            displayValue = value.join(", ");
          } else {
            try {
              displayValue = JSON.stringify(value);
            } catch (e) {
              displayValue = String(value);
            }
          }
        } else if (key === "phoneCode" && Array.isArray(value)) {
          displayValue = value.join(", ");
        }

        // NUEVO: Recortar texto a 18 caracteres si hay más de 3 elementos visibles y es para selección
        if (isForSelection && elementsToShow.length > 3 && typeof displayValue === "string" && displayValue.length > 18) {
          displayValue = `${displayValue.substring(0, 18)}...`;
        }

        return (
          <View
            key={`${key}-${index}`}
            style={[
              isForSelection ? styles.selectedTextContainer : styles.textElementContainer,
              // Aplicar anchos específicos según el tipo de elemento para mejor alineación
              !isForSelection && getColumnStyle(key)
            ]}>
            <Text
              style={[
                isForSelection ? [styles.valueSelectedStyle, customStyles.valueSelected] : [styles.itemText, customStyles.itemText],
                index > 0 && styles.marginLeft // Agregar margen si no es el primer elemento
              ]}
              numberOfLines={isForSelection ? 1 : undefined}
              ellipsizeMode={isForSelection ? "tail" : undefined}>
              {displayValue}
            </Text>
          </View>
        );
      });
    },
    [itemListToShow, itemDisplay, customStyles]
  );

  // Función para renderizar elementos del input con layout de 2x2 si hay 4 elementos
  const renderDisplayElements = useCallback(
    (item) => {
      const elementsToShow = itemDisplay.slice(0, 4);

      if (elementsToShow.length === 4) {
        // Si hay 4 elementos, mostrar en formato 2x2
        const firstRow = elementsToShow.slice(0, 2);
        const secondRow = elementsToShow.slice(2, 4);

        return (
          <View style={styles.twoRowContainer}>
            <View style={[styles.displayRow, { marginBottom: 3 }]}>{firstRow.map((key, index) => renderSingleDisplayElement(item, key, index))}</View>
            <View style={[styles.displayRow, { marginBottom: 0, marginRight: 120 }]}>
              {secondRow.map((key, index) => renderSingleDisplayElement(item, key, index + 2))}
            </View>
          </View>
        );
      }

      // Si hay menos de 4 elementos, mostrar en una sola fila
      return <View style={styles.singleRowContainer}>{elementsToShow.map((key, index) => renderSingleDisplayElement(item, key, index))}</View>;
    },
    [itemDisplay, customStyles]
  );

  // Función auxiliar para renderizar un elemento individual del display
  const renderSingleDisplayElement = useCallback(
    (item, key, index) => {
      const value = item[key];

      if (!value) return null;

      // Si es flag (bandera), aplicar estilo especial
      if (key === "flag") {
        return (
          <Text key={`${key}-${index}`} style={[styles.selectedFlag, customStyles.selectedFlag]}>
            {value}
          </Text>
        );
      }

      // Para otros elementos de texto
      let displayValue = value;

      if (typeof value === "object" && value !== null) {
        if (key === "coordinates") {
          displayValue = `lat: ${value.lat || ""}, lng: ${value.lng || ""}`;
        } else if (key === "phoneCode" && Array.isArray(value)) {
          displayValue = value.join(", ");
        } else {
          try {
            displayValue = JSON.stringify(value);
          } catch (e) {
            displayValue = String(value);
          }
        }
      } else if (key === "phoneCode" && Array.isArray(value)) {
        displayValue = value.join(", ");
      }

      // Recortar texto para elementos del display (excepto countryName)
      if (key !== "countryName" && typeof displayValue === "string" && displayValue.length > 15) {
        displayValue = `${displayValue.substring(0, 15)}...`;
      }

      return (
        <View key={`${key}-${index}`} style={styles.selectedTextContainer}>
          <Text style={[styles.valueSelectedStyle, customStyles.valueSelected, index > 0 && styles.marginLeft]} numberOfLines={1} ellipsizeMode="tail">
            {displayValue}
          </Text>
        </View>
      );
    },
    [customStyles]
  );

  // Calcular ancho dinámico basado en itemListToShow
  const calculateDynamicWidth = useMemo(() => {
    let totalWidth = 60; // Padding base

    itemListToShow.forEach((key) => {
      switch (key) {
        case "flag":
          totalWidth += 40;

          break;
        case "countryName":
          totalWidth += 188; // 180 + 8 margin

          break;
        case "currency":
          totalWidth += 78; // 70 + 8 margin

          break;
        case "gentilicio":
          totalWidth += 128; // 120 + 8 margin

          break;
        case "code":
          totalWidth += 58; // 50 + 8 margin

          break;
        case "phoneCode":
          totalWidth += 108; // 100 + 8 margin

          break;
        case "language":
          totalWidth += 128; // 120 + 8 margin

          break;
        case "region":
          totalWidth += 108; // 100 + 8 margin

          break;
        case "timezone":
          totalWidth += 98; // 90 + 8 margin

          break;
        case "population":
          totalWidth += 108; // 100 + 8 margin

          break;
        case "coordinates":
          totalWidth += 128; // 120 + 8 margin

          break;
        case "domain":
          totalWidth += 68; // 60 + 8 margin

          break;
        default:
          totalWidth += 108; // 100 + 8 margin (defaultColumn)

          break;
      }
    });

    return totalWidth;
  }, [itemListToShow]);

  const getColumnStyle = useCallback((key) => {
    switch (key) {
      case "countryName":
        return styles.countryNameColumn;
      case "currency":
        return styles.currencyColumn;
      case "gentilicio":
        return styles.gentilicioColumn;
      case "code":
        return styles.codeColumn;
      case "phoneCode":
        return styles.phoneCodeColumn;
      case "language":
        return styles.languageColumn;
      case "region":
        return styles.regionColumn;
      case "timezone":
        return styles.timezoneColumn;
      case "population":
        return styles.populationColumn;
      case "coordinates":
        return styles.coordinatesColumn;
      case "domain":
        return styles.domainColumn;
      default:
        return styles.defaultColumn;
    }
  }, []);

  // Valor a mostrar en el campo seleccionado (solo texto, sin banderas)
  const displayValue = useMemo(() => {
    if (!selectedItem) return "";

    // Obtener solo los elementos de texto (no banderas) para el valor mostrado
    const textElements = itemDisplay
      .filter((key) => key !== "flag")
      .slice(0, 3) // Limitar a 3 elementos para el input
      .map((key) => {
        const val = selectedItem[key];

        if (!val && val !== 0) return null;

        // Convertir a string de forma segura
        if (typeof val === "string" || typeof val === "number") {
          return String(val);
        }

        if (Array.isArray(val)) {
          return val.filter((item) => item != null).join(", ");
        }

        if (typeof val === "object" && val !== null) {
          if (key === "coordinates") {
            return `${val.lat || ""}, ${val.lng || ""}`;
          }

          try {
            return JSON.stringify(val);
          } catch (e) {
            return String(val);
          }
        }

        return String(val);
      })
      .filter(Boolean)
      .join(" ");

    if (maxLength && textElements.length > maxLength) {
      return `${textElements.substring(0, maxLength)}...`;
    }

    return textElements;
  }, [selectedItem, itemDisplay, maxLength]);

  // Determinar si mostrar el asterisco según showRequired y si hay valor seleccionado
  const shouldShowAsterisk = useMemo(() => required && showRequired && !selectedItem, [required, showRequired, selectedItem]);

  // Datos filtrados por búsqueda
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!searchText) return data;

    return data.filter((item) => item[labelKey]?.toLowerCase().includes(searchText.toLowerCase()));
  }, [data, searchText, labelKey]);

  // Verificar si hay suficientes elementos para mostrar la barra de búsqueda (10 o más)
  const shouldShowSearch = useMemo(() => data && Array.isArray(data) && data.length > 10, [data]);

  // Handlers
  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsVisible(true);
      setSearchText("");
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setSearchText("");
  }, []);

  const handleSelect = useCallback(
    (item) => {
      if (item[valueKey] === valueSelected) {
        // Si el usuario selecciona el mismo elemento, deselecciona
        onChange(null);
      } else {
        onChange(item[valueKey]);
      }

      handleClose();
    },
    [onChange, valueKey, valueSelected, handleClose]
  );

  // Componentes rendericados - AJUSTADO para eliminar scroll horizontal y minWidth
  const renderItem = useCallback(
    ({ item }) => {
      // Determinar si este ítem es el seleccionado actualmente
      const isSelected = item[valueKey] === valueSelected;

      return (
        <TouchableOpacity
          style={[styles.item, customStyles.item, isSelected && [styles.selectedItem, customStyles.selectedItem]]}
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Seleccionar ${item[labelKey]}`}
          accessibilityHint="Selecciona una opción de la lista">
          <View style={styles.itemContent}>{renderItemElements(item, false)}</View>
        </TouchableOpacity>
      );
    },
    [valueKey, valueSelected, handleSelect, customStyles, renderItemElements, labelKey]
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={[styles.emptyContainer, customStyles.emptyContainer]}>
        <Text style={[styles.emptyText, customStyles.emptyText]}>No se encontraron resultados</Text>
      </View>
    ),
    [customStyles]
  );

  // Icono a mostrar (error o normal)
  const icon = useMemo(() => {
    if (errorMessage) {
      return <AlertRedSVG width={iconSize} height={iconSize} style={[styles.iconCustom, customStyles.iconCustom]} />;
    }

    return iconCustom || <ChevronDownSVG width={iconSize} height={iconSize} color={iconColor} style={[styles.iconCustom, customStyles.iconCustom]} />;
  }, [errorMessage, iconCustom, iconSize, iconColor, customStyles]);

  return (
    <View style={[styles.container, customStyles.container]}>
      {/* Etiqueta */}
      <View style={[styles.labelContainer, customStyles.labelContainer]}>
        <Text style={[styles.labelStyle, customStyles.labelStyle, errorMessage && [styles.errorLabel, customStyles.errorLabel]]}>
          {label}
          {shouldShowAsterisk && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>
      </View>

      {/* Campo seleccionable o cargando */}
      <TouchableOpacity
        style={[
          styles.input,
          customStyles.input,
          errorMessage && [styles.errorInput, customStyles.errorInput],
          (disabled || loading) && [styles.disabledInput, customStyles.disabledInput]
        ]}
        onPress={handleOpen}
        disabled={disabled || loading}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar ${label}`}
        accessibilityHint="Abre una lista de opciones">
        {loading ? (
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="small" color={colorLoading} />
          </View>
        ) : (
          <>
            <View style={styles.selectedValueContainer}>
              {/* Elementos configurables según itemDisplay */}
              {selectedItem && renderDisplayElements(selectedItem)}
              {/* Texto del país seleccionado o placeholder si no hay selección */}
              {!selectedItem && (
                <Text
                  style={[
                    styles.placeholder,
                    customStyles.placeholder,
                    errorMessage && [styles.errorText, customStyles.errorText],
                    (disabled || loading) && [styles.disabledText, customStyles.disabledText]
                  ]}>
                  {placeholder}
                </Text>
              )}
            </View>
            {icon}
          </>
        )}
      </TouchableOpacity>

      {/* Mensaje de error */}
      {errorMessage && <Text style={[styles.errorMessageStyle, customStyles.errorMessageStyle]}>{errorMessage}</Text>}

      {/* Modal con opciones */}
      {!loading && (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={handleClose} statusBarTranslucent={true}>
          <View style={[styles.modalOverlay, customStyles.modalOverlay]} onTouchEnd={(e) => e.stopPropagation()}>
            <SafeAreaView style={[styles.modalContainer, customStyles.modalContainer]}>
              <View style={[styles.modalContent, customStyles.modalContent]}>
                {/* Header */}
                <View style={[styles.modalHeader, customStyles.modalHeader]}>
                  <TouchableOpacity style={[styles.closeButton, customStyles.closeButton]} onPress={handleClose}>
                    <View style={[styles.closeButtonCircle, customStyles.closeButtonCircle]}>
                      <IconXClose width={18} height={20} style={[styles.closeButtonIcon, customStyles.closeButtonIcon]} />
                    </View>
                  </TouchableOpacity>
                  <Text style={[styles.itemCount, customStyles.itemCount]}>
                    {filteredData?.length} {filteredData?.length === 1 ? "país" : "países"}
                  </Text>
                </View>

                {/* Búsqueda - solo se muestra si hay 10 o más elementos */}
                {shouldShowSearch && (
                  <View style={[styles.searchContainer, customStyles.searchContainer]}>
                    <View style={[styles.searchInputContainer, customStyles.searchInputContainer]}>
                      <IconSearch width={18} height={18} style={[styles.searchIcon, customStyles.searchIcon]} />
                      <TextInput
                        style={[styles.searchInput, customStyles.searchInput]}
                        placeholder={searchPlaceholder}
                        value={searchText}
                        onChangeText={setSearchText}
                        clearButtonMode="while-editing"
                      />
                    </View>
                  </View>
                )}

                {/* Lista: scroll horizontal solo si hay más de 3 columnas */}
                {itemListToShow.length >= 3 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.listScrollContent, { minWidth: calculateDynamicWidth }]}
                    style={styles.listScrollContainer}>
                    <FlatList
                      data={filteredData}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => `${item[valueKey]?.toString() || ""}${index}`}
                      showsVerticalScrollIndicator={true}
                      contentContainerStyle={[styles.listContent, customStyles.listContent, { minWidth: calculateDynamicWidth }]}
                      ListEmptyComponent={ListEmptyComponent}
                      keyboardShouldPersistTaps="handled"
                      initialNumToRender={10}
                      maxToRenderPerBatch={10}
                      windowSize={10}
                      removeClippedSubviews={true}
                      scrollEnabled={true}
                    />
                  </ScrollView>
                ) : (
                  <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item[valueKey]?.toString() || ""}${index}`}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={[styles.listContent, customStyles.listContent]}
                    ListEmptyComponent={ListEmptyComponent}
                    keyboardShouldPersistTaps="handled"
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    scrollEnabled={true}
                  />
                )}
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Estilos - MEJORADOS para manejar múltiples elementos y el layout 2x2
const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  labelStyle: {
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontSize: IS_IOS ? 16.5 : 16.5,
    fontWeight: IS_IOS ? "500" : "600",
    color: Colors.textPrimary
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12, // Padding vertical específico para mejor control
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: "#FFFFFF"
    // minHeight: 52, // Reducido para un espaciado más compacto

    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    // padding: 12,
    // borderWidth: 1,
    // borderColor: Colors.border,
    // borderRadius: 8,
    // backgroundColor: "#FFFFFF"
  },
  selectedValueContainer: {
    flex: 1,
    minWidth: 0
  },
  // NUEVOS ESTILOS para el layout del display
  twoRowContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-start", // Cambiar a flex-start para controlar mejor el espaciado
    paddingVertical: 1
  },
  singleRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0, // Cambiar de 1 a 0 para que no se expanda
    minHeight: 16,
    marginBottom: 2 // Pequeño margen entre filas, consistente
  },
  selectedFlag: {
    fontSize: 16,
    marginRight: 6,
    lineHeight: 18 // Altura de línea consistente
  },
  valueSelectedStyle: {
    fontSize: 14,
    color: "#0F1929"
    // flexShrink: 1,
    // flexWrap: "wrap", // Permitir que el texto se ajuste si es necesario
    // lineHeight: 18 // Altura de línea consistente con la bandera
  },
  marginLeft: {
    marginLeft: 3 // Reducido para mejor espaciado
  },
  // NUEVOS ESTILOS para elementos de texto
  textElementContainer: {
    // marginRight: 8
  },
  // ACTUALIZADO: Contenedor para texto seleccionado (input)
  selectedTextContainer: {
    marginRight: 3, // Reducido para mejor espaciado
    flex: 1,
    minWidth: 0
    // Permitir más espacio para countryName
    // maxWidth: "70%" // Dar más espacio horizontal
  },
  placeholder: {
    color: "#94A3B8",
    fontSize: IS_IOS ? 15 : 14
  },
  // Estilos para el ítem seleccionado en la lista
  selectedItem: {
    backgroundColor: "#f0f9f0",
    borderRadius: 6
  },
  selectedItemText: {
    fontWeight: "500"
  },
  errorInput: {
    borderColor: "#FAAAA4",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorLabel: {
    color: "#F04438",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorText: {
    color: "#6B758C",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorMessageStyle: {
    color: "#F04438",
    fontSize: IS_IOS ? 14.5 : 14,
    marginTop: 4,
    textAlign: "left",
    paddingHorizontal: 6,
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  disabledInput: {
    backgroundColor: "#F5F6F8",
    borderColor: "#E1E4E8"
  },
  disabledText: {
    color: "#94A3B8",
    fontSize: IS_IOS ? 15 : 14
  },
  requiredAsterisk: {
    color: "#FF4D4F"
  },
  iconCustom: {
    marginLeft: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalContent: {
    width: IS_IOS ? "92%" : "99%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden"
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  closeButton: {
    position: "absolute",
    right: 16,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F6F8",
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonIcon: {
    color: "#464C5E"
  },
  itemCount: {
    fontSize: IS_IOS ? 16 : 15,
    color: "#6B758C"
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  searchInputContainer: {
    borderWidth: 1,
    borderColor: "#B3B9C5",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: IS_IOS ? 16 : 14,
    color: "#464C5E",
    padding: 0
  },
  // NUEVOS ESTILOS para el scroll horizontal de toda la lista
  listScrollContainer: {
    maxHeight: "100%"
  },
  listScrollContent: {
    minWidth: "100%"
  },
  listContent: {
    padding: 8
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    minHeight: 50
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  flagText: {
    fontSize: 18,
    marginRight: 12,
    minWidth: 40,
    textAlign: "center"
  },
  itemText: {
    fontSize: IS_IOS ? 14 : 13,
    color: "#464C5E",
    flexShrink: 0,
    flexWrap: "nowrap"
  },
  // ESTILOS: Columnas con anchos fijos para alineación perfecta
  countryNameColumn: {
    width: 180,
    marginRight: 8
  },
  currencyColumn: {
    width: 70,
    marginRight: 8
  },
  gentilicioColumn: {
    width: 120,
    marginRight: 8
  },
  codeColumn: {
    width: 50,
    marginRight: 8
  },
  phoneCodeColumn: {
    width: 100,
    marginRight: 8
  },
  languageColumn: {
    width: 120,
    marginRight: 8
  },
  regionColumn: {
    width: 100,
    marginRight: 8
  },
  timezoneColumn: {
    width: 90,
    marginRight: 8
  },
  populationColumn: {
    width: 100,
    marginRight: 8
  },
  coordinatesColumn: {
    width: 120,
    marginRight: 8
  },
  domainColumn: {
    width: 60,
    marginRight: 8
  },
  defaultColumn: {
    width: 100,
    marginRight: 8
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    fontSize: IS_IOS ? 16 : 14,
    color: "#B3B9C6",
    textAlign: "center"
  }
});

export default DropDownListCountryReusable;
