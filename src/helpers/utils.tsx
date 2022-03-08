import React from "react";

const assignExistingProperties = (target: any, additional: any) => {
    const targetCopy = Object.assign({}, target);
    for (let i in additional) {
        if (Array.isArray(targetCopy)) {
            targetCopy.forEach(arr => {
                arr.hasOwnProperty(i) && (arr[i] = additional[i]);
            })
        } else
            targetCopy.hasOwnProperty(i) && (targetCopy[i] = additional[i]);
    }

    return targetCopy;
}

const removeEmpty = (obj: any) => {
    let clone = {...obj};
    Object.entries(clone).forEach(([key, val])  =>
        (val && typeof val === 'object') && removeEmpty(val) ||
        (val === null || val === "") && delete clone[key]
    );
    return clone;
};

const formatCurrency = (curr?: any) => {
    const currencies = {
        'rub': '₽',
        'usd': '$',
        'eur': '€',
        'kzt': 'T',
        'byn': 'BYN',
        'uah': '₴',
    } as any;

    return curr ? currencies[curr] : currencies;
}

const getCSRFToken = () => {
    const csrfTokenMeta = document.head.querySelector("meta[name=csrf-token]");
    return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : false;
}

const editDate = function (daysDiff: number, dt?: Date) {
    return new Date((dt?.getTime() || Date.now()) + (daysDiff * 60 * 60 * 24 * 1000))
}

const formatMoney = (x: number) => {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : 0;
}

const trailingZero = (num: any) => {
    return ((parseInt(num) || 0) < 9 ? '0' : '') + (parseInt(num) || 0);
}

const formatDateCustomFormat = (payload: Date | string, format = 'dd.mm.yyyy') => {
    if (
        !payload ||
        !format ||
        typeof format !== 'string'
    ) return '';

    if (!(payload instanceof Date))
        payload = new Date(payload);

    const [dayFormat, monthFormat, yearFormat] = [format.match(/d+/)[0], format.match(/m+/)[0], format.match(/y+/)[0]];
    const day = trailingZero(payload.getDate());
    const month = trailingZero(payload.getMonth() + 1);
    const year = payload.getFullYear() + '';

    return format.replace(/d+/, day.substr(-dayFormat.length)).replace(/m+/, month.substr(-monthFormat.length)).replace(/y+/, year.substr(-yearFormat.length))
}

const nl2br = (str: string) => {
    const splittedString = (str || '').split("\n");
    return splittedString.map((item, idx) => {
        return (
            <React.Fragment key={idx}>
                {item}
                {idx < splittedString.length - 1 && <br />}
            </React.Fragment>
        );
    })
};

const truncateText = (text: string, limit: number, ellipsis = '...') => {
    return text.substr(0, limit) + (text.length > limit ? ellipsis : '');
}


export {
    formatCurrency, getCSRFToken, assignExistingProperties,
    removeEmpty, editDate, formatMoney, formatDateCustomFormat,
    trailingZero, nl2br, truncateText
}