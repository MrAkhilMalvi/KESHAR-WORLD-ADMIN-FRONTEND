// ✅ Only numbers (no decimals)
export const ONLY_NUMBERS = /^\d*$/;


// ✅ Decimal numbers (e.g. 01.0005, 123.45, 0.5, .5 allowed)
export const DECIMAL_NUMBERS = /^[0-9.]*$/;

// ✅ Decimal numbers (strict — at least one digit before decimal)
export const DECIMAL_STRICT = /^\d+(\.\d+)?$/;

// ✅ Decimal with up to 2 places (e.g. 123.45, 01.05, but not 01.0005)
export const DECIMAL_TWO_PLACES = /^\d+(\.\d{1,2})?$/;

// ✅ Alphabets only
export const ONLY_ALPHABETS = /^[A-Za-z]+$/;

// ✅ Alphanumeric
export const ALPHANUMERIC = /^[A-Za-z0-9]+$/;

// ✅ Email
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SCHOOL_CODE = /^\d{0,3}\.?\d{0,4}$/;

// ✅ Mobile Number (10 digits, India style)
export const MOBILE_NUMBER = /^[0-9]{0,10}$/;


// ✅ Strong Password (min 8 chars, uppercase, lowercase, number, special char)
export const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ✅ URL
export const URL =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

// ✅ Hex Color (e.g. #fff, #ffffff)
export const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

// ✅ Date (YYYY-MM-DD)
export const DATE = /^\d{4}-\d{2}-\d{2}$/;

// ✅ Time (HH:MM 24-hour format)
export const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/;

// ✅ Pincode (6-digit India)
export const PINCODE = /^[1-9][0-9]{5}$/;
