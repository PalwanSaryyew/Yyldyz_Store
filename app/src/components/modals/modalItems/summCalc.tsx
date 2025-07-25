import React, { useState } from 'react';

const PercentageCalculator: React.FC = () => {
  const [input1Value, setInput1Value] = useState<string>('');
  const [input2Value, setInput2Value] = useState<string>('');

  const handleInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput1Value(value);

    // Eğer input1 boşsa, input2'yi de boşalt
    if (value === '') {
      setInput2Value('');
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const calculatedValue = numValue * 1.10; // %10 ekle
      setInput2Value(calculatedValue.toFixed(2)); // İki ondalık basamağa yuvarla
    } else {
      setInput2Value(''); // Geçersiz giriş durumunda input2'yi temizle
    }
  };

  const handleInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput2Value(value);

    // Eğer input2 boşsa, input1'i de boşalt
    if (value === '') {
      setInput1Value('');
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const calculatedValue = numValue / 1.10; // %10 çıkar (x * 1.10 = y ise, x = y / 1.10)
      setInput1Value(calculatedValue.toFixed(2)); // İki ondalık basamağa yuvarla
    } else {
      setInput1Value(''); // Geçersiz giriş durumunda input1'i temizle
    }
  };

  return (
    <div>
      <h2>Yüzde Hesaplayıcı</h2>
      <div>
        <label htmlFor="input1">Değer 1 (Üzerine %10 Eklenecek):</label>
        <input
          id="input1"
          type="number"
          value={input1Value}
          onChange={handleInput1Change}
          placeholder="Sayı girin"
        />
      </div>
      <br />
      <div>
        <label htmlFor="input2">Değer 2 (Üzerinden %10 Çıkarılacak):</label>
        <input
          id="input2"
          type="number"
          value={input2Value}
          onChange={handleInput2Change}
          placeholder="Sayı girin"
        />
      </div>
    </div>
  );
};

export default PercentageCalculator;