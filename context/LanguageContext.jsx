"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import ar from "@/locales/ar";
import en from "@/locales/en";

const dictionaries = { ar, en };

const LANGS = {
  ar: { dir: "rtl", code: "ar" },
  en: { dir: "ltr", code: "en" },
};

const STORAGE_KEY = "site-lang";

const LanguageContext = createContext(null);

// بياخد key بصيغة "nav.home" ويرجع القيمة من الديكشنري
function resolveKey(dict, key) {
  return key.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
}

export function LanguageProvider({ children, defaultLang = "ar" }) {
  const [lang, setLangState] = useState(defaultLang);
  const [isReady, setIsReady] = useState(false);

  // أول ما الصفحة تفتح، هات اللغة المحفوظة (لو موجودة)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved && dictionaries[saved]) {
      setLangState(saved);
    }
    setIsReady(true);
  }, []);

  // كل مرة اللغة تتغير، حدّث html[lang] و html[dir] وخزّن الاختيار
  useEffect(() => {
    if (!isReady) return;
    const html = document.documentElement;
    html.setAttribute("lang", LANGS[lang].code);
    html.setAttribute("dir", LANGS[lang].dir);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, isReady]);

  const setLang = useCallback((newLang) => {
    if (dictionaries[newLang]) setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(
    (key) => {
      const value = resolveKey(dictionaries[lang], key);
      return value !== undefined ? value : key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      dir: LANGS[lang].dir,
      isRTL: LANGS[lang].dir === "rtl",
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage لازم يتستخدم جوه LanguageProvider");
  return ctx;
}