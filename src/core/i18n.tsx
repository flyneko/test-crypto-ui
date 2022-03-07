import React from "react";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {I18N_DOMAIN_LANG_MAPPER, I18N_FALLBACK_LANG, LANGUAGES_LIST} from "./constants";
import resourcesToBackend from 'i18next-resources-to-backend';
import {initialState} from "../helpers/initialState";
import {getDomainZone} from "../helpers/utils";

const getLangFromDomain = () => I18N_DOMAIN_LANG_MAPPER[getDomainZone()];

const getLangFromQueryParam = () => (new URLSearchParams(location.search)).get('lang');

const changeLanguage = (lang: string) => {
    return i18n.changeLanguage(lang);
};

const changeUserLanguage = (lang: string) => {
    return changeLanguage(lang).then(() => {
        localStorage.setItem('lng', lang);
    })
}

const onLanguageChange = (callback: any) => {
    (i18n.resolvedLanguage || []).includes(i18n.language) && callback();
    i18n.on('languageChanged', callback);
    return () => i18n.off('languageChanged', callback);
};

const onLanguageLoaded = (callback: any) => {
    (i18n.resolvedLanguage || []).includes(i18n.language) && callback();
    i18n.on('loaded', callback);
    return () => i18n.off('loaded', callback);
};

const getLocaleFromSuggested = () => {
    const custom = {
        'en': ['us', 'gb']
    };
    const suggested = initialState.suggested_locale;
    let customSelected = null;

    if (!suggested) return null;

    if (LANGUAGES_LIST[suggested])
        return suggested;

    Object.entries(custom).map(([locale, list]) => {
        if (list.includes(suggested))
            customSelected = locale;
    });

    return LANGUAGES_LIST[suggested] ? suggested : customSelected;
}

i18n
    .use(initReactI18next)
    .use(resourcesToBackend((lng, namespace, callback) => {
        import(`../locales/${lng}.json`)
            .then(resources => callback(null, resources))
            .catch(error => callback(error, null))
    }))
    .init({
        lng: getLangFromQueryParam() || (initialState.user ? initialState.user.locale : null) || localStorage.getItem('lng') || getLocaleFromSuggested() || getLangFromDomain(),
        fallbackLng: I18N_FALLBACK_LANG,
        interpolation: {
            escapeValue: false,
            format: function(value, format, lng) {
                if (format === 'formatdate') {
                    const months = i18n.t('months_genitive', { returnObjects: true });
                    const dt = typeof value == 'object' ? value : new Date(value);
                    return dt.getDate() + ' ' + months[dt.getMonth()];
                }
                return value;
            }
        },
        parseMissingKeyHandler(key: string): any {
            return /(_meta_title|_placeholder)$/i.test(key) ? ' ' : <span style={{ display: 'inline-block', verticalAlign: 'top' }} className="ph-text">{key}</span>;
        }
    });


export { getLangFromDomain, getLangFromQueryParam, changeLanguage, changeUserLanguage, onLanguageChange, onLanguageLoaded }

export default i18n



