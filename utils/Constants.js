export const COMMON_EMAILS_REGEXP = {
  NO_TIENE: /notiene.*/g,
  CORREO: /correo.*/g,
  SIN_CORREO: /sincorreo.*/g
};

export const PhoneUtils = Object.freeze({
  AREA_CODES: ["809", "829", "849"],

  isValid(phone) {
    phone = phone.replace(/[\s-()]/g, "");

    const areaCode = phone.substring(0, 3);
    const forbiddenNum = phone.substring(3, 4);
    const isValidPattern = /^([0-9]{10})$/.test(phone);
    const sameDigits = /^([0-9])\1+$/.test(phone.substring(3, 10));

    return isValidPattern && !sameDigits && forbiddenNum !== 0 && !this.AREA_CODES.every((code) => phone.includes(code)) && this.AREA_CODES.includes(areaCode);
  }
});
