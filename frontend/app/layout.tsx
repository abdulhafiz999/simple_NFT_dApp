import "@rainbow-me/rainbowkit/styles.css";
import { HackerBoostAppWithProviders } from "./utils/HackerBoostApp";
import { ThemeProvider } from "./utils/ThemeProvider";
import "./globals.css";
import { getMetadata } from "./utils/getMetadata";

export const metadata = getMetadata({
  title: "Build NFT APP Challenge | HackerBoost",
  description: "Built with HackerBoost",
});

const HackerBoostNFTAppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <HackerBoostAppWithProviders>{children}</HackerBoostAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default HackerBoostNFTAppLayout;
