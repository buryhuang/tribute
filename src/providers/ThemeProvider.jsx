import React, { useContext, useEffect, useState } from 'react';

const ThemeContext = React.createContext();
const ThemeToggleContext = React.createContext();

export const useThemeToggle = (customTheme = '') => {
    return useContext(ThemeToggleContext);
}

export const getCurrentTheme = _ => {
    const isSystemThemeDark = window.localStorage.getItem('theme') === 'dark' || (!('theme' in window.localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return isSystemThemeDark ? 'dark' : 'light' || 'light';
}

export const isSystemDefaultTheme = _ => {
    return window.localStorage.getItem('theme') === null ? true : false;
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState();

    const toggleTheme = (customTheme = '') => {
        if(customTheme !== '') {

            // Set defined theme
            if(customTheme !== 'auto') {

                // Set custom theme
                setTheme(() =>  customTheme);

                // Set theme on local storage
                localStorage.setItem('theme', customTheme);
            } else {

                // Remove custom theme from local storage if mode is auto
                localStorage.removeItem('theme');

                // Get current system theme
                setTheme(() =>  getCurrentTheme());
            }
        } else {

            // Toggle theme if property is not defined
            setTheme(() =>  theme === 'dark' ? 'light' : 'dark');

            // Set theme on local storage
            localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
        }
    }

    const updateSystemDefaultTheme = _ => {
        const isSystemThemeDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        setTheme(() =>  isSystemThemeDark ? 'dark' : 'light');
    }

    useEffect(() => {
        updateSystemDefaultTheme();

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
            updateSystemDefaultTheme();
        });
    }, []);

    // Update theme
    useEffect(() => {
        // HTML
        const htmlNode = window.document.documentElement;

        // Toggle theme
        if(theme === 'dark') {
            htmlNode.classList.add('dark');
        } else {
            htmlNode.classList.remove('dark');
        }
    }, [theme]);

    return(
        <ThemeContext.Provider value={theme}>
            <ThemeToggleContext.Provider value={toggleTheme}>
                {children}
            </ThemeToggleContext.Provider>
        </ThemeContext.Provider>
    );
}
