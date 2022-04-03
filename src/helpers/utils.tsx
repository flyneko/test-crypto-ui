const formatDateFromUnix = function(timestamp) {
    return (new Date(timestamp * (String(timestamp).length === 10 ? 1000 : 1))).toLocaleString("en-US");
}

const formatNum = function (num, precision = 6) {
    const precisionNum = parseInt('1' + '0'.repeat(precision));
    return (Math.round(num * precisionNum) / precisionNum) || 0;
}

export {
    formatDateFromUnix, formatNum
}