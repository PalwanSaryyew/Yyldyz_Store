'use client'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';
const url = "https://yyldyz.store/oth/tonconnect-manifest.json"

const TonProvider = ({ children }: { children: ReactNode }) => {
   return (
      <TonConnectUIProvider manifestUrl={url}>
         {children}
      </TonConnectUIProvider>
   );
};

export default TonProvider;