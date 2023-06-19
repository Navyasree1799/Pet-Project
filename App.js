import React from "react";
import RootNavigation from "./src/navigation";
import { ThemeProvider, createTheme } from "@rneui/themed";



export default function App() {
  
  return (
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>
  );
}
