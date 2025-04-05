import React, { useState } from 'react';

interface PaymentFormProps {
  cardNumber: number;
  MM: number;
  YY: number;
  CVV: number;
}

interface FixedLengthInputHandler {
  (value: string, maxLength: number): string;
}

interface ChangeEventHandler {
  (e: React.ChangeEvent<HTMLInputElement>): void;
}

export default function PaymentForm({ props, setProps }: { props:PaymentFormProps, setProps: (props: PaymentFormProps) => void }) {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleFixedLengthInput: FixedLengthInputHandler = (value, maxLength) => {
    if (!/^[0-9]*$/.test(value)) return value.slice(0, maxLength);
    return value.length <= maxLength ? value : value.slice(0, maxLength);
  };

  const handleMonthChange: ChangeEventHandler = (e) => {
    setMonth(handleFixedLengthInput(e.target.value, 2));
    if (e.target.value.length === 2) {
      setProps({ ...props, MM: parseInt(e.target.value) });
    }
  };

  const handleYearChange: ChangeEventHandler = (e) => {
    setYear(handleFixedLengthInput(e.target.value, 2));
    if (e.target.value.length === 2) {
      setProps({ ...props, YY: parseInt(e.target.value) });
    }
  };

  const handleCvvChange: ChangeEventHandler = (e) => {
    setCvv(handleFixedLengthInput(e.target.value, 4));
    if (e.target.value.length === 4 || e.target.value.length === 3) {
      setProps({ ...props, CVV: parseInt(e.target.value) });
    }
  };

  const handleCardNumberChange: ChangeEventHandler = (e) => {
    setCardNumber(e.target.value);
    setProps({ ...props, cardNumber: parseInt(e.target.value) });
  };

  const handleSubmit = () => {
    if (!cardNumber || !month || !year || !cvv || !cardHolder) {
      setPaymentStatus('Please fill in all the fields.');
      return;
    }

    setPaymentStatus(`Payment completed for ${cardHolder} using the card ending in ${cardNumber.slice(-4)}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg my-4 text-black">
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Card Holder Name</label>
        <input
          type="text"
          placeholder="Enter card holder's name"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          className="p-3 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-gray-700 mb-2">Card Number</label>
        <input
          type="number"
          placeholder="Enter your card number"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="p-3 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <div className="flex space-x-4">
          <div className="w-1/3">
            <label className="block text-gray-700 mb-2">MM</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="MM"
              value={month}
              onChange={handleMonthChange}
              maxLength={2}
              className="p-3 w-full border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ appearance: 'textfield' }}
            />
          </div>

          <div className="w-1/3">
            <label className="block text-gray-700 mb-2">YY</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="YY"
              value={year}
              onChange={handleYearChange}
              maxLength={2}
              className="p-3 w-full border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ appearance: 'textfield' }}
            />
          </div>

          <div className="w-1/3">
            <label className="block text-gray-700 mb-2">CVV</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Enter CVV"
              value={cvv}
              onChange={handleCvvChange}
              maxLength={4}
              className="p-3 w-full border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 -webkit-appearance-none margin-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ appearance: 'textfield' }}
            />
          </div>
        </div>

        {/* <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition duration-200"
        >
          Submit Card
        </button> */}

        {paymentStatus && (
          <p className="mt-4 text-center text-green-600">{paymentStatus}</p>
        )}
      </div>
    </div>
  );
};

