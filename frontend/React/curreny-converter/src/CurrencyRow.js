import React from 'react'

export default function CurrencyRow(props) {
    const { currencies, selectCurrency, onChangeCurrency, amount, onChangeAmount } = props;
    return (
        <div>
            <input type="number" className='input' value={amount} onChange={onChangeAmount}/>
            <select value={selectCurrency} onChange={onChangeCurrency}>
                {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                ))}
            </select>
        </div>
    )
}
