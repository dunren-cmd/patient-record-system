import React from 'react';
import type { Patient } from '../types/index';

interface QuickAccessBlockProps {
    patients: Patient[];
    selectedWard: string | null;
    onWardSelect: (ward: string | null) => void;
}

export const QuickAccessBlock: React.FC<QuickAccessBlockProps> = ({ patients, selectedWard, onWardSelect }) => {
    const wards = ['1A', '2A', '2B', '3A', '3B'];

    const wardCounts = patients.reduce((acc, curr) => {
        acc[curr.ward] = (acc[curr.ward] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#555' }}>病房總覽 (快速存取)</h2>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {wards.map(ward => (
                    <div
                        key={ward}
                        onClick={() => onWardSelect(selectedWard === ward ? null : ward)}
                        style={{
                            flex: '1',
                            minWidth: '120px',
                            padding: '15px',
                            backgroundColor: selectedWard === ward ? '#e3f2fd' : 'white',
                            border: `2px solid ${selectedWard === ward ? '#2196f3' : '#ddd'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>{ward}</div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                            {wardCounts[ward] || 0} 位病患
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
