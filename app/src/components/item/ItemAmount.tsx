interface ItemAmountProps {
   amount: number;
   duration: string | null;
}

const ItemAmount = ({ amount, duration }: ItemAmountProps) => {
   return <>{duration ? duration : amount}</>;
};

export default ItemAmount;
