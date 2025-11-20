import React from 'react';
import type { Patient } from '../types/index';

interface StatisticsReportProps {
    patients: Patient[];
    onBack: () => void;
}

export const StatisticsReport: React.FC<StatisticsReportProps> = ({ patients, onBack }) => {
    const totalPatients = patients.length;

    const wardCounts = patients.reduce((acc, curr) => {
        acc[curr.ward] = (acc[curr.ward] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const nursingLevelCounts = patients.reduce((acc, curr) => {
        acc[curr.nursing_level] = (acc[curr.nursing_level] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', color: '#333', margin: 0 }}>統計報表</h1>
                <button
                    onClick={onBack}
                    style={{
                        backgroundColor: '#757575',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    返回
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* 總覽卡片 */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', gridColumn: '1 / -1' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#555' }}>總覽</h2>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196f3' }}>
                        {totalPatients} <span style={{ fontSize: '16px', color: '#666', fontWeight: 'normal' }}>位病患</span>
                    </div>
                </div>

                {/* 病房分佈 */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>病房分佈</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {Object.entries(wardCounts).map(([ward, count]) => (
                            <li key={ward} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                                <span>{ward} 病房</span>
                                <span style={{ fontWeight: 'bold' }}>{count} 人</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 護理等級分佈 */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>護理等級分佈</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {Object.entries(nursingLevelCounts).map(([level, count]) => (
                            <li key={level} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                                <span>{level}</span>
                                <span style={{ fontWeight: 'bold' }}>{count} 人</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
