import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PHYSICIANS, WARDS, NURSING_LEVELS } from '../constants';
import type { Patient } from '../types/index';

interface AddPatientModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
        medical_id: '',
        name: '',
        ward: WARDS[0],
        bed_number: '',
        gender: 'Male',
        age: 0,
        admission_date: new Date().toISOString().split('T')[0],
        attending_physician: PHYSICIANS[0],
        nursing_level: NURSING_LEVELS[0]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.medical_id || !formData.name || !formData.bed_number) {
            alert('請填寫所有必填欄位');
            return;
        }

        const { error } = await supabase
            .from('patients')
            .insert([formData]);

        if (error) {
            console.error('Error adding patient:', error);
            alert('新增病患失敗: ' + error.message);
        } else {
            alert('新增成功！');
            onSuccess();
            onClose();
        }
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
                padding: '20px',
                borderRadius: '8px',
                width: '500px',
                maxWidth: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>新增病患</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>病歷號 *</label>
                        <input
                            type="text"
                            name="medical_id"
                            value={formData.medical_id}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>姓名 *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>病房</label>
                            <select
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>床號 *</label>
                            <input
                                type="text"
                                name="bed_number"
                                value={formData.bed_number}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>性別</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>年齡</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>主治醫師</label>
                        <select
                            name="attending_physician"
                            value={formData.attending_physician}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {PHYSICIANS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>入院日期</label>
                        <input
                            type="date"
                            name="admission_date"
                            value={formData.admission_date}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>護理等級</label>
                        <select
                            name="nursing_level"
                            value={formData.nursing_level}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {NURSING_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                background: '#2196f3',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            確認新增
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
