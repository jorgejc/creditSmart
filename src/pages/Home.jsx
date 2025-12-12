import react, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { CreditCard } from '../components/CreditCard';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';


export const Home = () => {

  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchCredits = async () => {
    try {
      setLoading(true);
      
      const creditsCollection = collection(db, 'credits');
      const creditsSnapshot = await getDocs(creditsCollection);
      const creditsList = creditsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCredits(creditsList);
      setError(null);
    } catch (err) {
      console.error("Error al obtener créditos:", err);
      setError("No se pudieron cargar los créditos");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <>
      <Hero 
        title="Encuentra el Crédito Perfecto para Ti"
        subtitle="Tasas competitivas, aprobación rápida y sin trámites complicados"
      />

      <main className="container">
        <section className="credits-section">
          <h3>Nuestros Productos</h3>      
          {loading && (
            <div className="loading">
              <p>Cargando créditos...</p>
            </div>
          )}        
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="credits-grid">
              {credits.map((credit) => (
                <CreditCard key={credit.id} credit={credit} />
              ))}
            </div>
          )}
          {!loading && !error && credits.length === 0 && (
            <div className="no-results">
              <p>No hay créditos disponibles</p>
            </div>
          )}
          
        </section>
      </main>
    </>
  );
};