import React, { useState, useEffect } from 'react';
import type { Patient } from '../types/index';

interface PatientFormProps {
    initialData?: Patient;
    onSubmit: (data: Omit<Patient, 'id' | 'created_at'>) => Promise<void>;
    onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Patient, 'id' | 'created_at'>>({
        medical_id: '',
        name: '',
        ward: '1A',
        bed_number: '',
        gender: '男',
        age: 0,
        admission_date: new Date().toISOString().split('T')[0],
        attending_physician: '',
        nursing_level: '一般',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                medical_id: initialData.medical_id,
                name: initialData.name,
                ward: initialData.ward,
                bed_number: initialData.bed_number,
                gender: initialData.gender,
                age: initialData.age,
                admission_date: initialData.admission_date,
                attending_physician: initialData.attending_physician,
                nursing_level: initialData.nursing_level,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
                    {initialData ? '修改病患資料' : '新增病患'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>姓名</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>病歷號</label>
                            <input
                                type="text"
                                name="medical_id"
                                value={formData.medical_id}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>主治醫師</label>
                            <input
                                type="text"
                                name="attending_physician"
                                value={formData.attending_physician}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>病房</label>
                            <select
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                {['1A', '2A', '2B', '3A', '3B'].map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>床號</label>
                            <input
                                type="text"
                                name="bed_number"
                                value={formData.bed_number}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>性別</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>年齡</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                min="0"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>入院日期</label>
                            <input
                                type="date"
                                name="admission_date"
                                value={formData.admission_date}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>護理等級</label>
                            <select
                                name="nursing_level"
                                value={formData.nursing_level}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="一般">一般</option>
                                <option value="重症">重症</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                padding: '10px 20px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            {initialData ? '儲存修改' : '新增病患'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
