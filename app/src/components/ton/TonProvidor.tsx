'use client'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';
const url = 'https://coffee-impressed-bird-829.mypinata.cloud/ipfs/bafkreiepmlafjliapweqfp2sygyhe2tqfegas46ysh4wducscqkaykhwte'

const TonProvider = ({ children }: { children: ReactNode }) => {
   return (
      <TonConnectUIProvider manifestUrl={url}>
         {children}
      </TonConnectUIProvider>
   );
};

export default TonProvider;