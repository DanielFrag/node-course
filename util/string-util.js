const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const charsLen = chars.length;
module.exports = {
    generateSessionString(length) {
        let s = "";
        for (let i = 0; i < length; i++) {
            s += chars.charAt(Math.floor(Math.random() * charsLen));
        }
        return s;
    }
};