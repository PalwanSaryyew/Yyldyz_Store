'use client'; // Bu bileşen sadece istemci tarafında çalışacak

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductType } from '@prisma/client'; // Eğer ProductType farklı bir yerden geliyorsa, yolunu kontrol et
import { paths, STORAGE_KEY } from 'bot/src/settings'; // Bu yolların doğru olduğundan emin ol

export default function ClientRedirectHandler() {
    const router = useRouter();

    useEffect(() => {
        const prepare = async () => {
            // prepare WAPAPP
            const WebApp = (await import('@twa-dev/sdk')).default;
            await WebApp.ready();
            let lastVisited = null;
            try {
                // get the last visited page from local storage
                lastVisited = localStorage.getItem(STORAGE_KEY);
            } catch (error) {
                console.error(
                    'Failed to read last visited page from localStorage:',
                    error
                );
                localStorage.setItem(STORAGE_KEY, '/star');
                router.refresh();
            }

            if (
                lastVisited &&
                paths.includes(lastVisited.slice(1) as ProductType)
            ) {
                router.replace(lastVisited);
            } else {
                localStorage.setItem(STORAGE_KEY, '/star');
                router.refresh();
            }
        };
        prepare();
    }, [router]);

    // Bu bileşen görsel olarak bir şey render etmeyecek, sadece yönlendirme mantığını yönetecek.
    // Eğer bir yükleme animasyonu göstermek istersen, bu bileşenin içine koyabilirsin.
    return null;
}