export type ProductDetails = {
   title: string | null;
   image: string | null;
   items: {
      text: string;
      image: string;
   }[] | [];
} | null;
