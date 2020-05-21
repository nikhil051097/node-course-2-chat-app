const isValidString = (string) => {
    if (!string) {
      return false;
    }
    return string.trim().length > 0;
  }

module.exports = {isValidString};