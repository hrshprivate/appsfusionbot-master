class StringUtil {
  static isEmpty(value) {
    return !value || !value.trim()
  }

  static capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }
}

module.exports = StringUtil
