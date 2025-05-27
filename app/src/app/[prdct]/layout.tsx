import InfoBox from "@/components/mains/InfoBox";
import ItemMenu from "@/components/mains/ItemMenu";
import CurrencyBox from "@/components/mains/content/CurrencyBox";
import MainboxColor from "@/components/mains/content/MainboxColor";

export default async function layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <>
         <InfoBox />
         <ItemMenu />
         <CurrencyBox />
         <MainboxColor>{children}</MainboxColor>
      </>
   );
}
