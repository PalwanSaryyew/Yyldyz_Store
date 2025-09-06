"use client";

import { webApp } from "@/lib/webApp";

const TopUpButton = () => {
    async function handleTopUp() {
        // Telegram Web App nesnesini alalım
        const tg = await webApp();

        // Önce Telegram linkini açalım
        tg.openTelegramLink("https://t.me/yyldyzbot?start=calladmin");

        // Ardından web uygulamasını kapatalım
        tg.close();
    }

    return (
        <button
            className="w-full rounded-lg border p-2 text-gray-200 hover:bg-slate-200 hover:text-slate-800"
            onClick={handleTopUp}
        >
            Doldur
        </button>
    );
};

export default TopUpButton;