import { db } from './firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const creditsData = [
    {
        name: "Crédito de libre inversión",
        description: "Dinero más rápido",
        minAmount: 1000000,
        maxAmount: 30000000,
        interestRate: 1.8,
        maxTerm: 60,
        requirements: "Mayor de 18 años, ingresos mínimos de $1.200.000",
        icon: "💰"
    },
    {
        name: "Crédito de Vehículo",
        description: "Dinero más rápido",
        minAmount: 10000000,
        maxAmount: 80000000,
        interestRate: 1.5,
        maxTerm: 84,
        requirements: "Mayor de 18 años, ingresos mínimos de $1.200.000",
        icon: "🚗"
    },
    {
        name: "Crédito Vivienda",
        description: "Dinero más rápido",
        minAmount: 20000000,
        maxAmount: 5000000000,
        interestRate: 0.9,
        maxTerm: 240,
        requirements: "Mayor de 18 años, ingresos mínimos de $1.200.000",
        icon: "🏠"
    },
    {
        name: "Crédito Educativo",
        description: "Dinero más rápido",
        minAmount: 2000000,
        maxAmount: 40000000,
        interestRate: 1.2,
        maxTerm: 72,
        requirements: "Mayor de 18 años, ingresos mínimos de $1.200.000",
        icon: "🎓"
    },
    {
        name: "Crédito Empresarial",
        description: "Dinero más rápido",
        minAmount: 500000,
        maxAmount: 30000000,
        interestRate: 1.6,
        maxTerm: 120,
        requirements: "Mayor de 18 años, ingresos mínimos de $1.200.000",
        icon: "💼"
    },
    {
        name: "Crédito de consumo",
        description: "Dinero más rápido",
        minAmount: 500000,
        maxAmount: 15000000,
        interestRate: 2.1,
        maxTerm: 60,
        requirements: "Mayor de 18 años, ingresos mínimos de $1.200.000",
        icon: "💳"
    }
];

const seedFirestore = async () => {
    try {
        console.log('Iniciando carga de datos a Firestore');

        for (const credit of creditsData) {
            const docRef = await addDoc(collection(db, 'credits'), credit);
            console.log(`${credit.name} agregado con ID: ${docRef.id}`);
        }

        console.log('Todos los créditos fueron agregados exitosamente');
        console.log('En cuanto se persistan los registros, borrar este archivo');
        
        
        

    } catch (error) {
        console.error('Error al cargar datos: ', error);
        
    }
}

seedFirestore();