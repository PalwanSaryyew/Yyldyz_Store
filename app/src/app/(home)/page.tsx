import ClientRedirectHandler from '@/components/telegram/ClientRedirectHandler';
import Image from 'next/image';


export default function HomePage() {
    return (
        <div className="text-white flex items-center justify-center h-[75vh] text-lg">
            {/* Yönlendirme mantığını yöneten istemci bileşenini çağırıyoruz */}
            <ClientRedirectHandler />

            {/* Bu kısım hala sunucu tarafından render edilebilir */}
            <Image
                src={"/svg/star.svg"}
                width={75}
                height={75}
                alt="Loading"
                className="animate-ping"
                rel="preload"
                priority
            />
        </div>
    );
}