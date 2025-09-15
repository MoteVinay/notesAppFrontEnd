import { useContext, useDebugValue } from "react";
import ThemeContext from "../context/ThemeProvider";

const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  useDebugValue(theme, (theme) => (theme ? "light" : "dark"));
  return { theme, setTheme };
};

export default useTheme;
