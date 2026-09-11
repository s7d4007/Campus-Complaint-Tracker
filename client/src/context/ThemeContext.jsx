import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else if (theme === 'light') {
        root.classList.remove('dark');
    } else {
        // system — follow OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) root.classList.add('dark');
        else root.classList.remove('dark');
    }
};

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState('system');
    const [userId, setUserId] = useState(null);

    // Apply theme + listen for OS changes when system is selected
    useEffect(() => {
        applyTheme(theme);
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => applyTheme('system');
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    /**
     * Called by AuthContext after login or session restore.
     * Loads this user's saved theme preference (keyed by their ID).
     */
    const initTheme = useCallback((uid) => {
        setUserId(uid);
        const saved = localStorage.getItem(`theme_${uid}`) || 'system';
        setThemeState(saved);
    }, []);

    /**
     * Called by AuthContext on logout.
     * Resets to system default and forgets the user.
     */
    const resetTheme = useCallback(() => {
        setUserId(null);
        setThemeState('system');
    }, []);

    /**
     * Called from Settings page when user picks a theme.
     * Saves it under their own localStorage key.
     */
    const setTheme = useCallback((value) => {
        setThemeState(value);
        if (userId) {
            localStorage.setItem(`theme_${userId}`, value);
        }
    }, [userId]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, initTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
};
