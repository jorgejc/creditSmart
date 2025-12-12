import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { formatCurrency, calculateMonthlyPayment } from '../utils/formatters';

import { db } from '../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export const Apply = () => {
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    email: '',
    phone: '',
    creditType: '',
    requestedAmount: '',
    term: '',
    purpose: '',
    company: '',
    position: '',
    monthlyIncome: ''
  });
  
  const [credits, setCredits] = useState([]);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const {
    fullName, idCard, email, phone, creditType, requestedAmount,
    term, purpose, company, position, monthlyIncome
  } = formData;
  
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const creditsCollection = collection(db, 'credits');
        const creditsSnapshot = await getDocs(creditsCollection);
        const creditsList = creditsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCredits(creditsList);
      } catch (error) {
        console.error("Error al cargar créditos:", error);
      }
    };
    
    fetchCredits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  useEffect(() => {
    if (creditType) {
      const credit = credits.find(c => c.id === creditType);
      setSelectedCredit(credit);
    }
  }, [creditType, credits]);
  
  useEffect(() => {
    if (requestedAmount && term && selectedCredit) {
      const payment = calculateMonthlyPayment(
        parseFloat(requestedAmount),
        parseInt(term),
        selectedCredit.interestRate
      );
      setMonthlyPayment(payment);
    }
  }, [requestedAmount, term, selectedCredit]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) newErrors.fullName = 'El nombre es obligatorio';
    if (!idCard || idCard.length < 7) newErrors.idCard = 'Cédula debe tener mínimo 7 dígitos';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) newErrors.email = 'Email inválido';
    
    if (!phone || phone.length < 10) newErrors.phone = 'Teléfono debe tener 10 dígitos';
    if (!creditType) newErrors.creditType = 'Selecciona un tipo de crédito';
    
    if (!requestedAmount) {
      newErrors.requestedAmount = 'El monto es obligatorio';
    } else if (selectedCredit) {
      const amount = parseFloat(requestedAmount);
      if (amount < selectedCredit.minAmount || amount > selectedCredit.maxAmount) {
        newErrors.requestedAmount = `El monto debe estar entre ${formatCurrency(selectedCredit.minAmount)} y ${formatCurrency(selectedCredit.maxAmount)}`;
      }
    }
    
    if (!term) newErrors.term = 'Selecciona un plazo';
    if (!purpose.trim()) newErrors.purpose = 'Describe el destino del crédito';
    if (!company.trim()) newErrors.company = 'La empresa es obligatoria';
    if (!monthlyIncome || parseFloat(monthlyIncome) < 1200000) {
      newErrors.monthlyIncome = 'Ingresos mínimos: $1.200.000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const request = {
        ...formData,
        creditName: selectedCredit.name,
        estimatedMonthlyPayment: monthlyPayment,
        status: 'Pendiente',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'credit_requests'), request);
      
      console.log('Solicitud guardada con ID:', docRef.id);
      setSuccess(true);
      setLoading(false);
      setFormData({
        fullName: '', idCard: '', email: '', phone: '',
        creditType: '', requestedAmount: '', term: '',
        purpose: '', company: '', position: '', monthlyIncome: ''
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error("Error al guardar solicitud:", error);
      setErrors({ submit: 'Error al enviar la solicitud. Intenta de nuevo.' });
      setLoading(false);
    }
  };
  
  return (
    <>
      <Hero 
        title="Solicitar Crédito"
        subtitle="Completa el formulario y recibe respuesta en menos de 24 horas"
      />

      <main className="container">
        <section className="form-section">

          {success && (
            <div className="success-message">
              Solicitud enviada exitosamente Redirigiendo...
            </div>
          )}
          
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <form className="credit-form" onSubmit={handleSubmit}>
            <div className="form-block">
              <h3>Datos Personales</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={handleChange}
                    placeholder="Juan Pérez García"
                  />
                  {errors.fullName && <span className="error">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Cédula *</label>
                  <input
                    type="number"
                    name="idCard"
                    value={idCard}
                    onChange={handleChange}
                    placeholder="1234567890"
                  />
                  {errors.idCard && <span className="error">{errors.idCard}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    placeholder="3001234567"
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
              </div>
            </div>

            <div className="form-block">
              <h3>Datos del Crédito</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Crédito *</label>
                  <select
                    name="creditType"
                    value={creditType}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una opción</option>
                    {credits.map((credit) => (
                      <option key={credit.id} value={credit.id}>
                        {credit.name}
                      </option>
                    ))}
                  </select>
                  {errors.creditType && <span className="error">{errors.creditType}</span>}
                </div>

                <div className="form-group">
                  <label>Monto Solicitado *</label>
                  <input
                    type="number"
                    name="requestedAmount"
                    value={requestedAmount}
                    onChange={handleChange}
                    placeholder="5000000"
                  />
                  {selectedCredit && (
                    <small>
                      Rango: {formatCurrency(selectedCredit.minAmount)} - {formatCurrency(selectedCredit.maxAmount)}
                    </small>
                  )}
                  {errors.requestedAmount && <span className="error">{errors.requestedAmount}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Plazo (meses) *</label>
                  <select
                    name="term"
                    value={term}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione el plazo</option>
                    <option value="12">12 meses</option>
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                    <option value="48">48 meses</option>
                    <option value="60">60 meses</option>
                    <option value="72">72 meses</option>
                  </select>
                  {errors.term && <span className="error">{errors.term}</span>}
                </div>

                <div className="form-group">
                  <label>Cuota Mensual Estimada</label>
                  <input
                    type="text"
                    value={monthlyPayment > 0 ? formatCurrency(monthlyPayment) : 'Calculando...'}
                    disabled
                    className="payment-display"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Destino del Crédito *</label>
                  <textarea
                    name="purpose"
                    value={purpose}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describa brevemente para qué utilizará el dinero"
                  ></textarea>
                  {errors.purpose && <span className="error">{errors.purpose}</span>}
                </div>
              </div>
            </div>
            <div className="form-block">
              <h3>Datos Laborales</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Empresa donde Trabaja *</label>
                  <input
                    type="text"
                    name="company"
                    value={company}
                    onChange={handleChange}
                    placeholder="Nombre de la empresa"
                  />
                  {errors.company && <span className="error">{errors.company}</span>}
                </div>

                <div className="form-group">
                  <label>Cargo *</label>
                  <input
                    type="text"
                    name="position"
                    value={position}
                    onChange={handleChange}
                    placeholder="Desarrollador de Software"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ingresos Mensuales *</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={monthlyIncome}
                    onChange={handleChange}
                    placeholder="3000000"
                  />
                  {errors.monthlyIncome && <span className="error">{errors.monthlyIncome}</span>}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
              
              <button 
                type="reset" 
                className="btn-secondary"
                onClick={() => setFormData({
                  fullName: '', idCard: '', email: '', phone: '',
                  creditType: '', requestedAmount: '', term: '',
                  purpose: '', company: '', position: '', monthlyIncome: ''
                })}
              >
                Limpiar Formulario
              </button>
            </div>

          </form>

          <div className="info-card">
            <h4>Información Importante</h4>
            <ul>
              <li>Todos los campos con (*) son obligatorios</li>
              <li>La respuesta llegará en menos de 24 horas</li>
              <li>Ingresos mínimos: $1.200.000 mensuales</li>
              <li>Edad: entre 18 y 70 años</li>
              <li>Tus datos están protegidos</li>
            </ul>
          </div>

        </section>
      </main>
    </>
  );
};