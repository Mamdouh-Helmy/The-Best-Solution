"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const STORAGE_KEY = "site-theme";

const ThemeContext = createContext(null);

function getSystemPreference() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [isReady, setIsReady] = useState(false);

  // أول ما الصفحة تفتح، هات الثيم المحفوظ، أو لو مفيش خد تفضيل النظام
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      setThemeState(saved);
    } else {
      setThemeState(getSystemPreference());
    }
    setIsReady(true);
  }, []);

  // كل مرة الثيم يتغير، حدّث كلاس dark على html وخزّن الاختيار
  useEffect(() => {
    if (!isReady) return;
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, isReady]);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === "dark" || newTheme === "light") setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme لازم يتستخدم جوه ThemeProvider");
  return ctx;
}