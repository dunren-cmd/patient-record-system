import { useState, useEffect } from 'react';
import type { Patient } from '../types/index';
import { QuickAccessBlock } from '../components/QuickAccessBlock';
import { MultiSearchBlock } from '../components/MultiSearchBlock';

interface HomeProps {
    patients: Patient[];
    onPatientSelect: (patient: Patient) => void;
}

export const Home: React.FC<HomeProps> = ({ patients, onPatientSelect }) => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWard, setSelectedWard] = useState<string | null>(null);

    useEffect(() => {
        filterPatients();
    }, [searchTerm, selectedWard, patients]);

    const filterPatients = () => {
        let results = patients;

        // 病房篩選
        if (selectedWard) {
            results = results.filter(p => p.ward === selectedWard);
        }

        // 關鍵字搜尋
        if (searchTerm.trim()) {
            const q = searchTerm.trim().toLowerCase();
            results = results.filter((p) => {
                return (
                    p.name.toLowerCase().includes(q) ||
                    p.medical_id.toLowerCase().includes(q) ||
                    p.bed_number.toLowerCase().includes(q) ||
                    p.ward.toLowerCase().includes(q)
                );
            });
        }

        setFilteredPatients(results);
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>護理整合紀錄入口系統</h1>

            <QuickAccessBlock
                patients={patients}
                selectedWard={selectedWard}
                onWardSelect={setSelectedWard}
            />

            <MultiSearchBlock
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedWard={selectedWard}
                onWardChange={setSelectedWard}
                totalResults={filteredPatients.length}
            />

            {/* 病患列表 */}
            {filteredPatients.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                    {filteredPatients.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => onPatientSelect(p)}
                            style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'transform 0.1s',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                backgroundColor: p.nursing_level === '重症' ? '#ffebee' : '#e8f5e9',
                                color: p.nursing_level === '重症' ? '#c62828' : '#2e7d32'
                            }}>
                                {p.nursing_level}
                            </div>
                            <h3 style={{ marginBottom: '10px', fontSize: '18px', color: '#333' }}>{p.name}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '14px', color: '#555' }}>
                                <div>病歷號: {p.medical_id}</div>
                                <div>病房: {p.ward}-{p.bed_number}</div>
                                <div>性別: {p.gender}</div>
                                <div>年齡: {p.age}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    沒有找到符合條件的病患資料
                </div>
            )}
        </div>
    );
};

