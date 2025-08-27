interface ItemAmountProps {
   amount: number;
   duration: string | null;
   title: string | null;
}

const ItemAmount = ({ amount, duration, title }: ItemAmountProps) => {
   return <>{title ? title : duration ? duration : amount}</>;
};

export default ItemAmount;
