function validateCreditCard(cardNumber) {
    // Remove all non-numeric characters (spaces, dashes, etc.)
    cardNumber = cardNumber.replace(/\D/g, "");
  
    // Check if it passes Luhn Algorithm
    if (!luhnCheck(cardNumber)) return { valid: false, reason: "Invalid card number" };
  
    // Detect card type
    const cardType = getCardType(cardNumber);
    if (!cardType) return { valid: false, reason: "Unknown card type" };
  
    return { valid: true, cardType };
  }
  
  // Luhn Algorithm Check
  function luhnCheck(number) {
    let sum = 0;
    let shouldDouble = false;
  
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i]);
  
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9; // Subtract 9 if result is > 9
      }
  
      sum += digit;
      shouldDouble = !shouldDouble;
    }
  
    return sum % 10 === 0;
  }
  
  // Detect Card Type (Visa, MasterCard, etc.)
  function getCardType(number) {
    const cardPatterns = {
      Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MasterCard: /^5[1-5][0-9]{14}$/,
      AmericanExpress: /^3[47][0-9]{13}$/,
      Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    };
  
    for (const [card, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(number)) return card;
    }
  
    return null;
  }

function validateExpirationDate(month, year) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
  
    year = parseInt(year);
    month = parseInt(month);
  
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { valid: false, reason: "Expired card" };
    }
  
    return { valid: true };
  }

function validateCVV(cvv, cardType) {
    const cvvPattern = {
      Visa: /^[0-9]{3}$/,
      MasterCard: /^[0-9]{3}$/,
      AmericanExpress: /^[0-9]{4}$/,
    };
  
    if (!cvvPattern[cardType]) return { valid: false, reason: "Unknown card type" };
    if (!cvvPattern[cardType].test(cvv)) return { valid: false, reason: "Invalid CVV" };
  
    return { valid: true };
  }

export function validateFullCard(cardNumber, month, year, cvv) {
    const cardValidation = validateCreditCard(cardNumber);
    year = 2000 + year;
    if (!cardValidation.valid) return cardValidation;
  
    const expirationValidation = validateExpirationDate(month, year);
    if (!expirationValidation.valid) return expirationValidation;
  
    const cvvValidation = validateCVV(cvv, cardValidation.cardType);
    if (!cvvValidation.valid) return cvvValidation;
  
    return { valid: true, cardType: cardValidation.cardType };
  }
  
  