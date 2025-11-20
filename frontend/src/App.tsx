import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { PatientDetail } from './pages/PatientDetail';
import { StatisticsReport } from './pages/StatisticsReport';
import { supabase } from './lib/supabase';
import type { Patient } from './types/index';

function App() {
    const [currentPage, setCurrentPage] = useState<'home' | 'detail' | 'stats'>('home');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const { data, error } = await supabase.from('patients').select('*').order('ward', { ascending: true }).order('bed_number', { ascending: true });
        if (error) {
            console.error('Error fetching patients:', error);
        } else {
            setPatients(data || []);
        }
    };

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        setCurrentPage('detail');
    };

    const handleBack = () => {
        setSelectedPatient(null);
        setCurrentPage('home');
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {currentPage === 'home' && (
                <Home patients={patients} onPatientSelect={handlePatientSelect} />
            )}

            {currentPage === 'detail' && selectedPatient && (
                <PatientDetail
                    patient={selectedPatient}
                    allPatients={patients}
                    onBack={handleBack}
                    onPatientChange={setSelectedPatient}
                    onShowStats={() => setCurrentPage('stats')}
                />
            )}

            {currentPage === 'stats' && (
                <StatisticsReport
                    patients={patients}
                    onBack={() => setCurrentPage('detail')}
                />
            )}
        </div>
    );
}

export default App;
