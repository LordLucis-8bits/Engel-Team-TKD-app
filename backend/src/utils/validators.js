function validateEmail(email) {
    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Regex.test(email);
}

module.exports = { validateEmail };