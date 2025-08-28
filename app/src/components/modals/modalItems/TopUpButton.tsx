"use client";

const TopUpButton = () => {
   function handleTopUp() {
      // Pencereyi kapatmayı dener. Çoğu modern tarayıcıda güvenlik nedeniyle çalışmaz.
      window.close(); // Yeni bir sekmede belirtilen linki açar.
      window.open("https://t.me/yyldyzbot?start=calladmin");
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
