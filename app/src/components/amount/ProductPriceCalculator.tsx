"use client";
import { ProductAmount } from "@prisma/client";
import React, { useEffect } from "react";

interface ProductPriceCalculatorProps {
    setTotalPriceTMT: (price: number) => void;
    setTotalPriceUSDT: (price: number) => void;
    setQuantity: (quantity: string) => void;
    amountPriceTMT: number;
    amountPriceUSDT: number;
    quantity: string;
    item: ProductAmount;
}

const ProductPriceCalculator: React.FC<ProductPriceCalculatorProps> = ({
    setTotalPriceTMT,
    setTotalPriceUSDT,
    setQuantity,
    quantity,
    amountPriceTMT,
    amountPriceUSDT,
    item,
}) => {
    const handleQuantityChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        // Sadece sayısal girişlere izin ver ve boşlukları kaldır
        let value = event.target.value.replace(/[^0-9]/g, "");

        // Sayısal değeri kontrol et
        const numValue = Number(value);

        // Eğer değer boşsa veya 0 ise, 50 olarak ayarla veya boş bırak
        if (value === "") {
            setQuantity(""); // Miktar boşsa boş bırak
            setTotalPriceTMT(0);
            setTotalPriceUSDT(0);
            return;
        }

        // Eğer sayı 7000'den büyükse, 7000 olarak sınırla
        if (numValue > item.max) {
            value = item.max.toString();
        }
        
        // Miktarı güncelle
        setQuantity(value);

        // Fiyatı hesapla
        calculatePrice(Number(value));
    };

    const calculatePrice = React.useCallback((amount: number) => {
        // Eğer miktar 50'den küçükse, fiyatı sıfırla ve fonksiyonu durdur
        if (amount < item.min && amount !== 0) { // amount === 0 kontrolü, input boşken 0 olmasını ve sıfırlanmamasını sağlar
            setTotalPriceTMT(0);
            setTotalPriceUSDT(0);
            return;
        }

        if (amountPriceTMT == null || amountPriceUSDT == null) {
            setTotalPriceTMT(0);
            setTotalPriceUSDT(0);
            return;
        }
        const calculatedPriceTMT = amount * amountPriceTMT;
        const calculatedPriceUSDT = amount * amountPriceUSDT;
        setTotalPriceTMT(Number(calculatedPriceTMT.toFixed(2)));
        setTotalPriceUSDT(Number(calculatedPriceUSDT.toFixed(2)));
    }, [item.min, amountPriceTMT, amountPriceUSDT, setTotalPriceTMT, setTotalPriceUSDT]);

    useEffect(() => {
        // Bileşen yüklendiğinde veya miktar değiştiğinde fiyatı hesapla
        // Eğer başlangıçta miktar boşsa veya 0 ise 50 olarak varsayalım
        const initialQuantity = Number(quantity);
        if (initialQuantity < item.min && initialQuantity !== 0) {
             setTotalPriceTMT(0);
             setTotalPriceUSDT(0);
        } else {
             calculatePrice(initialQuantity === 0 ? item.min : initialQuantity);
        }
    }, [calculatePrice, item.min, quantity, setTotalPriceTMT, setTotalPriceUSDT]); // Bağımlılıkları ekledik

    return (
        <input
            className={
                "max-w-[120px] p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400 text-gray-900 bg-white"
            }
            type="text" // type "text" olarak kalmalı, çünkü regex ile kontrol ediyoruz
            id="quantityInput"
            autoComplete="off"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder={`${item.min}-${item.max}`} // Kullanıcıya ipucu verelim
            onBlur={() => { // Inputtan çıkıldığında minimum değeri kontrol et
                if (Number(quantity) < item.min && Number(quantity) !== 0) {
                    setQuantity(item.min.toString());
                    calculatePrice(item.min);
                } else if (Number(quantity) === 0) { // Eğer 0 girilip çıkılırsa 50 yap
                    setQuantity(item.min.toString());
                    calculatePrice(item.min);
                }
            }}
        />
    );
};

export default ProductPriceCalculator;