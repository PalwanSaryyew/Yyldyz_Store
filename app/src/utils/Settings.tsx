import { ProductType } from "@prisma/client";

export const ProductDescription = ({ name }: { name: ProductType }) => {
   switch (name) {
      case "exit":
         return (
            <>
               Exitlag bul online oýunlary açmak üçin niýetlenen programmadyr.
               <br />
               Exitlag diňe bir online oýunlary oýnamaga mümkinçilik bermän
               eýsem bulary ýokary tizlikde we pes pingde oynamaga-da
               mümkünçilik döretýär.
               <br /> <br />
               Elbetde PUBG Mobile üçin hem işleýär.
               <br /> Häzirki abuna diňe mobil ulgamlar üçin niyetlenendir!
            </>
         );
      case "star":
         return (
            <div className="z-20 overflow-auto">
               Telegram ýyldyzlarynyň esasy ulanylýan ýerleri:
               <br />
               <b>• Sanly harytlary we hyzmatlary satyn almak: </b>
               Botlar we mini-programmalar arkaly elektron kitaplary, onlaýn
               kurslary, oýunlaryň içindäki zatlary we beýleki sanly mazmunlary
               satyn almak.
               <br />
               <b>• Sanly mazmun döredijilerini goldamak: </b>
               Halaýan kanallaryňyza we döredijileriňize ýyldyz reaksiýalaryny
               ibermek ýa-da tölegli abunalar üçin (aýratyn mazmun ýa-da VIP
               göni ýaýlymlar üçin) ýyldyzlary bermek arkaly gönüden-göni goldaw
               berip bilersiňiz.
               <br />
               <b>• Tölegli mediýa elýeterliligi: </b>
               Kanallardaky tölegli suratlary ýa-da wideolary ýyldyzlar bilen
               açyp bilersiňiz.
               <br />
               <b>• Telegram mahabatlary: </b>
               Kanal eýeleri, telegramda gazanan ýyldyzlaryny öz
               kanallaryny tanatmak üçin telegram mahabatlarynda ulanyp bilerler. Bu esasanam kiçi kanallaryň abonentlerini artdyrmak üçin peýdalydyr.
               <br />
               <b>• Sowgat: </b>
               Ulanyjylar dostlaryna ýyldyzlar arkaly sowgat berip biler we bu sowgatlar ýyldyzlara öwrülip ýa-da profil sahypalarynda görkezilip biliner.
               <br />
               <b>• Premium sowgat etmek: </b>
               Telegram Premium abunasyny ýyldyzlaryňyzy ulanyp başgalara sowgat edip bilersiňiz.
               <br />
            </div>
         );
      case "tgprem":
         return null
      case "uc":
         return null
      case "jtn":
         return null
      case "pubg":
         return null
      case "psp":
         return null
      default:
         return "";
   }
};
