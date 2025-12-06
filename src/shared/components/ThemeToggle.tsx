import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/context/ThemeContext";
import { Button } from "@/shared/components/ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={toggleTheme} className="rounded-full">
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
};

export default ThemeToggle;
