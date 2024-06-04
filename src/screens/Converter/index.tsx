import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import axiosInstance from '../../api/axiosFrankfurterConfig';

interface CurrencyResponse {
    amount: number;
    base: string;
    date: string;
    rates: {
        [key: string]: number;
    };
}

interface Currencies {
    [key: string]: string;
}

function Converter(){
    const [currencies, setCurrencies] = useState<Currencies>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fromCurrency, setFromCurrency] = useState("BRL");
    const [toCurrency, setToCurrency] = useState("USD");
    const [amount, setAmount] = useState("");
    const [conversionResult, setConversionResult] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    useEffect(() => {
        const fetchCurrencies = async () => {
          try {
            const response = await axiosInstance.get('currencies');
            setCurrencies(response.data);
          } catch (err) {
            setError('Erro ao buscar moedas');
          } finally {
            setLoading(false);
          }
        };
      
        fetchCurrencies();
    }, []);

    const filteredOptionsFrom = Object.entries(currencies).filter(([code, name]) => {
        return (toCurrency !== code);
    });

    const filteredOptionsTo = Object.entries(currencies).filter(([code, name]) => {
        return (fromCurrency !== code);
    });

    const convertCurrency = async () => {
        try {
            const formattedAmount = amount.replace(',', '.');
            if (parseFloat(formattedAmount) === 0) {
                setErrorMessage('O valor inserido é zero. Não é possível converter.');
                setConversionResult(null);
                return;
            }
            const response = await axiosInstance.get<CurrencyResponse>(`latest?amount=${formattedAmount}&from=${fromCurrency}&to=${toCurrency}`);
            setConversionResult(response.data);
            setErrorMessage(null);
        } catch (err) {
            console.error('Erro ao converter moeda:', err);
            setConversionResult(null);
        }
    };
    

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        value = value.replace(/[^\d,.]/g, '');
        value = value.replace(/,(?=.*?)/g, '.');
        value = value.replace(/,/g, '');
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
        }
    };
    
    
    
    return(
        <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center">
            <Link to="/" className="self-start py-5 px-4 flex items-center font-bold mb-6">
                <ArrowCircleLeft className="mr-2" size={24} weight="bold" />
                Voltar
            </Link>
            <div className="w-full max-w-5xl px-4">
                <div id="inputContainer" className="mt-5 flex flex-col items-center justify-center">
                    <div className="mb-6 w-full">
                        <h2 className="text-2xl mb-6 text-center">Informe o valor e qual conversão vai ser usada.</h2>
                        <div className="flex flex-wrap justify-center">
                            <div className="mb-4 w-full flex flex-row justify-center items-center">
                                <div className="flex flex-col items-center mr-12">
                                    <label htmlFor="valor" className="text-lg mb-2">Digite o valor:</label>
                                    <input id="valor" type="text" value={amount} onChange={handleAmountChange} placeholder="Digite algum valor..." className="p-2 border border-gray-400 rounded-md text-neutral-900" />                                </div>
                                <div className="flex flex-col items-center mr-12">
                                    <label htmlFor="opcao1" className="text-lg mb-2">Converter de:</label>
                                    <select id="opcao1" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="p-2 bg-slate-900 text-slate-50 rounded-md">
                                        {filteredOptionsFrom.map(([code, name]) => (
                                            <option key={code} value={code}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col items-center">
                                    <label htmlFor="opcao2" className="text-lg mb-2">Para:</label>
                                    <select id="opcao2" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="p-2 bg-slate-900 text-slate-50 rounded-md">
                                        {filteredOptionsTo.map(([code, name]) => (
                                            <option key={code} value={code}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={convertCurrency} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-7 rounded-lg shadow-md transition duration-300 ease-in-out">
                        Converter
                    </Button>
                </div>
            </div>

            {conversionResult && (
                <div className="container mx-auto mt-10 px-4">
                    <h2 className="text-2xl mb-6 text-left ml-4">Resultado da conversão</h2>
                    <div className="flex justify-between bg-slate-900 text-slate-50 p-4">
                        <div className="w-1/2 p-4">
                            <p className="font-bold">Conversão de:</p>
                            <p>{currencies[fromCurrency]}/{fromCurrency}</p>
                            <p>Valor a converter: {amount}</p>
                        </div>
                        <div className="w-1/2 p-4">
                            <p className="font-bold">Para:</p>
                            <p>{currencies[toCurrency]}/{toCurrency}</p>
                            <p>Resultado da conversão: {conversionResult.rates[toCurrency]}</p>
                        </div>
                    </div>
                    <span>Data da cotação realizada: {formatDate(conversionResult.date)}</span>
                </div>
            )}


            {errorMessage && (
                <>
                    <div className="container mx-auto mt-10">
                        <h2 className="text-2xl mb-6 text-left text-red-500">Erro na conversão</h2>
                        <span>{errorMessage}</span>
                    </div>

                </>
            )}
        </div>  
    )
}

export default Converter;