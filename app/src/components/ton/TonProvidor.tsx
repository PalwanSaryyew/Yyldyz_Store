'use client'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { domain } from 'bot/src/settings';
import { ReactNode } from 'react';
const url = domain+"/oth/tonconnect-manifest.json"

const TonProvider = ({ children }: { children: ReactNode }) => {
   return (
      <TonConnectUIProvider manifestUrl={url}>
         {children}
      </TonConnectUIProvider>
   );
};

export default TonProvider;