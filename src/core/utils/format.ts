/**
 * Formatea un valor numérico a un string con formato de moneda.
 * Por defecto usa formato de peso local ($) con dos decimales.
 */
export const formatCurrency = (value: number, currencyCode: string = 'USD', locale: string = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    // Fallback básico si Intl falla (por ejemplo, en ciertos entornos JS antiguos de Android sin JSC completo)
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Formatea un string de fecha ISO a un formato amigable para el usuario.
 * Ejemplo: "2026-06-26T12:00:00Z" -> "June 26, 2026" o "26 de junio de 2026"
 */
export const formatDate = (dateString: string, locale: string = 'es-ES'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString.split('T')[0] || dateString;
  }
};

/**
 * Formatea un porcentaje.
 * Ejemplo: 0.9118 -> "91.18%" o 91.18 -> "91.18%"
 */
export const formatPercentage = (value: number, isFraction: boolean = false): string => {
  const percentage = isFraction ? value * 100 : value;
  return `${percentage.toFixed(1)}%`;
};
