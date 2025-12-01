import React from 'react'
import { Hero } from '../components/Hero';
import { CreditCard } from '../components/CreditCard';
import { creditsData } from '../data/creditsData';

export const Home = () => {

  console.log('Datos de créditos', creditsData);
  

  return (
    <>

      <Hero 
        title="Encuentra el Crédito Perfecto para Ti"
        subtitle="Tasas competitivas, aprobación rápida y sin trámites complicados"
      />


      <main className="container">
        <section className="credits-section">
          
          <h3>Nuestros Productos</h3>

          
          <div className="credits-grid">
            
            {creditsData.map((credit) => {
  
              return (
                <CreditCard 
                  key={credit.id}    // KEY ES OBLIGATORIA - Identifica cada Elemento de forma única
                  credit={credit}     // Pasamos el objeto completo como prop
                />
              );
            })}

            
          </div>
        </section>
      </main>
    </>
  );
};
