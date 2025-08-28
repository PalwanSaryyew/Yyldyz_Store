import React, { useState } from "react";

// Props için bir tip tanımlayalım
interface PercentageCalculatorProps {
   percentage: number;
}

// Bileşeni güncellenmiş props ile tanımlayalım
const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({
   percentage,
}) => {
   const [input1Value, setInput1Value] = useState<string>("");
   const [input2Value, setInput2Value] = useState<string>("");

   // Prop'tan gelen yüzde değerini çarpan(multiplier)a dönüştürelim
   // Örneğin, %10 için multiplier 1.10 olacaktır.
   const multiplier = 1 + percentage / 100;

   const handleInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput1Value(value);

      if (value === "") {
         setInput2Value("");
         return;
      }

      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
         // Çarpanı (multiplier) kullanarak dinamik hesaplama
         const calculatedValue = numValue * multiplier;
         setInput2Value(calculatedValue.toFixed(2));
      } else {
         setInput2Value("");
      }
   };

   const handleInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput2Value(value);

      if (value === "") {
         setInput1Value("");
         return;
      }

      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
         // Çarpanı (multiplier) kullanarak dinamik hesaplama
         const calculatedValue = numValue / multiplier;
         setInput1Value(calculatedValue.toFixed(2));
      } else {
         setInput1Value("");
      }
   };

   return (
      <div className="flex gap-2 w-full">
         <div className="flex flex-col flex-1">
            <label htmlFor="input2" className="text-sm text-gray-200">
               Berýäň:
            </label>
            <input
               className="p-1 rounded-lg flex-1 w-full text-gray-800 bg-stone-300 border border-stone-400"
               id="input2"
               type="number"
               value={input2Value}
               onChange={handleInput2Change}
               placeholder="Möçber"
            />
         </div>
         <div className="flex flex-col flex-1">
            <label htmlFor="input1" className="text-sm text-gray-200">
               Alýaň:
            </label>
            <input
               className="p-1 rounded-lg flex-1 w-full text-gray-800 bg-stone-300 border border-stone-400"
               id="input1"
               type="number"
               value={input1Value}
               onChange={handleInput1Change}
               placeholder="Möçber"
            />
         </div>
      </div>
   );
};

export default PercentageCalculator;
