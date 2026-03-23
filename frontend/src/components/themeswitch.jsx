import React, { useState, useEffect } from "react";
import useStore from "../store";

const ThemeSwitch = () => {
  const { theme, setTheme } = useStore();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  useEffect(() => {
    setIsDarkMode(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
  };

  return (
    <div
      className={`switch ${isDarkMode ? "dark" : "light"}`}
      onClick={toggleTheme}
    >
      <div className={`ball ${isDarkMode ? "dark" : "light"}`}></div>
    </div>
  );
};

export default ThemeSwitch;


