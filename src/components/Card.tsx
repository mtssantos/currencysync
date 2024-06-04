import React, { useState, useEffect } from 'react';
import restcountriesAxios from '../api/axiosRestcountriesConfig';
import { Card } from "@/components/ui/card";

interface CountryFlagProps {
  currencyCode: string;
  rate: number;
  currencyName: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ currencyCode, rate, currencyName }) => {
    const [flagUrl, setFlagUrl] = useState('');
    const [error, setError] = useState('');

    const isImageUrlValid = async (url: string) => {
      return new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(true);
        };
        img.onerror = () => {
          resolve(false);
        };
        img.src = url;
      });
    };


    useEffect(() => {
      const getCountryFlag = async (currencyCode: string) => {
        try {
            const response = await restcountriesAxios.get(`currency/${currencyCode}`);
            const url = `https://flagsapi.com/${response.data[0].cca2}/flat/64.png`;
            const flagUrl = response.data[0].flags.svg;
            
            if (url) {
              const isValid = await isImageUrlValid(url);
              if (isValid) {
                setFlagUrl(url);
                return;
              }
            }

            if (flagUrl) {
              const isValid = await isImageUrlValid(flagUrl);
              if (isValid) {
                setFlagUrl(flagUrl);
                return;
              }
            }

            setFlagUrl('');          
        } catch (error) {
            console.error('Erro ao receber informações:', error);
            setError(`Erro ao receber informações: ${error}`);
            setFlagUrl('');
        }
      } 
      getCountryFlag(currencyCode);
    }, []);

    return (
          <Card className="bg-slate-900 text-slate-50 border-none">
            {error && <p>{error}</p>}

            {flagUrl && (
              <div className="flex items-center">
                <img src={flagUrl} alt={`Flag for currency ${currencyCode}`} className="w-auto h-20 mr-4" />
                <div className="flex flex-col">
                  <span className="align-middle">{currencyName}</span>
                  <span className="align-middle">{currencyCode} : {rate}</span>
                </div>
              </div>
            )}
          </Card>
    );
};
  
export default CountryFlag;
