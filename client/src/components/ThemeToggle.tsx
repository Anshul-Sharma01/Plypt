import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <label className="flex items-center hover:cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        checked={isDarkMode}
        onChange={toggleTheme}
        readOnly
      />
      <div className="relative flex items-center justify-center w-10 h-10">
        <div className="transition-all duration-300 absolute">
          <Moon
            size={24}
            className={`${
              isDarkMode ? "opacity-0" : "opacity-100"
            } text-gray-800 dark:text-gray-200`}
          />
        </div>
        <div className="transition-all duration-300 absolute">
          <Sun
            size={24}
            className={`${
              isDarkMode ? "opacity-100" : "opacity-0"
            } text-yellow-400`}
          />
        </div>
      </div>
    </label>
  );
}

export default ThemeToggle;
