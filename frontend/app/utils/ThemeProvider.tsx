"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children, ...props }: ExtendedThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
