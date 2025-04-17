import type { Config } from "tailwindcss";

const config: Config = {
   content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: {
         colors: {
            background: "var(--background)",
            foreground: "var(--foreground)",
            tmtColor: "#BC686A",
            usdtColor: "#4FAC92",
            tonColor: "#009BED",
            mainColor: "#60A5FA",
            tgColor: "#0084C6",
         },
      },
   },
   plugins: [],
};
export default config;
