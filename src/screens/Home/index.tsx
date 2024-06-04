import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Swap } from "@phosphor-icons/react";

function Home(){
    return(
        <div className="bg-slate-900 text-slate-50">
                <div className="min-h-screen text-center flex flex-col items-center justify-center">
                    <Swap size={100} />
                    <h1 className="text-5xl font-bold mb-4">Bem vindo ao Currency Sync</h1>
                    <h2 className="text-2xl mb-6">Todas as taxas de câmbio publicado pelo BCE, centralizadas e atualizadas em um só lugar.</h2>
                    <div className="flex flex-row items-center justify-center space-x-5">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-7 rounded-lg shadow-md transition duration-300 ease-in-out">
                            <Link to="/converter">Iniciar a Conversão</Link>
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-7 rounded-lg shadow-md transition duration-300 ease-in-out">
                                <Link to="/converterflag">Cambio Mundial</Link>
                        </Button>
                    </div>
                </div>
      </div>
    )
}

export default Home;