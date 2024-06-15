import React, { useEffect, useState } from "react";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosFrankfurterConfig";
import CountryFlag from "@/components/CountryFlag";

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


function ConverterFlag(){
    const [currencies, setCurrencies] = useState<Currencies>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fromCurrency, setFromCurrency] = useState('');
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

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        value = value.replace(/[^\d,.]/g, '');
        value = value.replace(/,(?=.*?)/g, '.');
        value = value.replace(/,/g, '');
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
        }
    };

    const convertCurrency = async () => {
        try {
            const formattedAmount = amount.replace(',', '.');
            if (parseFloat(formattedAmount) === 0) {
                setErrorMessage('O valor inserido é zero. Não é possível converter.');
                setConversionResult(null);
                return;
            }
            const response = await axiosInstance.get<CurrencyResponse>(`latest?amount=${formattedAmount}&from=${fromCurrency}`);
            setConversionResult(response.data);
            setErrorMessage(null);
        } catch (error) {
            console.error('Erro ao converter moeda:', error);
            setConversionResult(null);
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
                        <h2 className="text-2xl mb-6 text-center">Informe o valor e a moeda que deseja converter.</h2>
                        <div className="flex flex-wrap justify-center">
                            <div className="mb-4 w-full flex flex-row justify-center items-center">
                                <div className="flex flex-row items-center space-x-5">
                                    <input id="valor" type="text" value={amount} onChange={handleAmountChange} placeholder="Digite algum valor..." className="p-2 border border-gray-400 rounded-md text-neutral-900" /> 
                                    <select id="opcao1" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="p-2 bg-slate-900 text-slate-50 rounded-md">
                                        <option value="">Selecione uma moeda</option>
                                        {Object.entries(currencies).map(([code, name]) => (
                                            <option key={code} value={code}>
                                                {name} ({code})
                                            </option>
                                        ))}
                                    </select>
                                    <Button onClick={convertCurrency} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-7 rounded-lg shadow-md transition duration-300 ease-in-out">
                                        Converter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-10 px-4">
                <h2 className="text-2xl mb-6 text-left ml-4">Resultados</h2>
                {conversionResult && (
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(conversionResult.rates).map(([currencyCode, rate]) => (
                            <CountryFlag key={currencyCode} currencyCode={currencyCode} rate={rate} currencyName={currencies[currencyCode]} />
                        ))}
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


        </div>
    )
}


export default ConverterFlag;