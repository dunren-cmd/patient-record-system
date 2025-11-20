import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Patient, NursingRecord } from '../types/index';
import { PHYSICIANS } from '../constants';

interface PatientDetailProps {
    patient: Patient;
    allPatients: Patient[];
    onBack: () => void;
    onPatientChange: (patient: Patient) => void;
    onShowStats: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, allPatients, onBack, onPatientChange, onShowStats }) => {
    const [records, setRecords] = useState<NursingRecord[]>([]);
    const [newRecordContent, setNewRecordContent] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    // 病患資料編輯狀態
    const [isEditingPatient, setIsEditingPatient] = useState(false);
    const [editFormData, setEditFormData] = useState<Patient>(patient);

    useEffect(() => {
        fetchRecords();
        setEditFormData(patient); // 當病患切換時重置表單數據
        setIsEditingPatient(false); // 切換病患時關閉編輯模式
    }, [patient.id]);

    const fetchRecords = async () => {
        const { data, error } = await supabase
            .from('nursing_records')
            .select('*')
            .eq('patient_id', patient.id)
            .order('recorded_at', { ascending: false });

        if (error) {
            console.error('Error fetching records:', error);
        } else {
            setRecords(data || []);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRecordContent.trim()) return;

        const { error } = await supabase.from('nursing_records').insert([
            {
                patient_id: patient.id,
                content: newRecordContent,
                recorder: '護理師 A007',
                recorded_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            alert('新增失敗');
            console.error(error);
        } else {
            setNewRecordContent('');
            fetchRecords();
        }
    };

    const handleUpdate = async (id: string) => {
        const { error } = await supabase
            .from('nursing_records')
            .update({ content: editContent })
            .eq('id', id);

        if (error) {
            alert('更新失敗');
        } else {
            setEditingId(null);
            fetchRecords();
        }
    };

    const startEdit = (record: NursingRecord) => {
        setEditingId(record.id);
        setEditContent(record.content);
    };

    // 病患資料編輯邏輯
    const handlePatientEditClick = () => {
        setEditFormData(patient);
        setIsEditingPatient(true);
    };

    const handlePatientCancelEdit = () => {
        setIsEditingPatient(false);
        setEditFormData(patient);
    };

    const handlePatientSave = async () => {
        const { error } = await supabase
            .from('patients')
            .update({
                name: editFormData.name,
                medical_id: editFormData.medical_id,
                ward: editFormData.ward,
                bed_number: editFormData.bed_number,
                gender: editFormData.gender,
                age: editFormData.age,
                attending_physician: editFormData.attending_physician,
                admission_date: editFormData.admission_date,
                nursing_level: editFormData.nursing_level
            })
            .eq('id', patient.id);

        if (error) {
            alert('更新病患資料失敗');
            console.error(error);
        } else {
            // 更新成功後，通知父組件更新資料 (這裡簡單處理，重新整理頁面或透過 callback 更新)
            // 為了簡單起見，我們假設父組件會重新 fetch 或我們直接更新當前顯示
            // 理想情況下應該有一個 onUpdate callback
            alert('更新成功');
            setIsEditingPatient(false);
            // 這裡我們呼叫 onPatientChange 來觸發父層可能的更新，但因為我們沒有重新 fetch allPatients，
            // 所以這裡最好是重新整理網頁，或者我們修改一下 App.tsx 讓它知道要更新。
            // 暫時先手動更新本地顯示的 patient (雖然 props 沒變，但我們可以用 editFormData 繼續顯示)
            // 更好的做法是 reload 頁面
            window.location.reload();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    // 導航邏輯
    const currentIndex = allPatients.findIndex(p => p.id === patient.id);
    const prevPatient = currentIndex > 0 ? allPatients[currentIndex - 1] : null;
    const nextPatient = currentIndex < allPatients.length - 1 ? allPatients[currentIndex + 1] : null;

    return (
        <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', margin: 0 }}>病患詳細資訊</h1>
                <div>
                    <button onClick={onShowStats} style={{ marginRight: '10px', backgroundColor: '#673ab7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                        查看統計
                    </button>
                    <button onClick={onBack} style={{ backgroundColor: '#757575', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                        返回列表
                    </button>
                </div>
            </div>

            {/* 導航列 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                <button
                    onClick={() => prevPatient && onPatientChange(prevPatient)}
                    disabled={!prevPatient}
                    style={{
                        visibility: prevPatient ? 'visible' : 'hidden',
                        padding: '8px 16px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white'
                    }}
                >
                    &lt; 上一位: {prevPatient?.name}
                </button>
                <span style={{ lineHeight: '35px', fontWeight: 'bold' }}>{patient.name} ({patient.ward}-{patient.bed_number})</span>
                <button
                    onClick={() => nextPatient && onPatientChange(nextPatient)}
                    disabled={!nextPatient}
                    style={{
                        visibility: nextPatient ? 'visible' : 'hidden',
                        padding: '8px 16px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white'
                    }}
                >
                    下一位: {nextPatient?.name} &gt;
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* 左側：基本資訊 */}
                <div style={{ backgroundColor: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '4px', height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                        <h2 style={{ fontSize: '18px', margin: 0 }}>基本資訊</h2>
                        {!isEditingPatient ? (
                            <button onClick={handlePatientEditClick} style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                編輯
                            </button>
                        ) : (
                            <div>
                                <button onClick={handlePatientSave} style={{ color: 'green', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}>
                                    儲存
                                </button>
                                <button onClick={handlePatientCancelEdit} style={{ color: 'gray', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    取消
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditingPatient ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label>
                                姓名:
                                <input type="text" name="name" value={editFormData.name} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
                            </label>
                            <label>
                                病歷號:
                                <input type="text" name="medical_id" value={editFormData.medical_id} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label style={{ flex: 1 }}>
                                    病房:
                                    <select name="ward" value={editFormData.ward} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }}>
                                        {['1A', '2A', '2B', '3A', '3B'].map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </label>
                                <label style={{ flex: 1 }}>
                                    床號:
                                    <input type="text" name="bed_number" value={editFormData.bed_number} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label style={{ flex: 1 }}>
                                    性別:
                                    <select name="gender" value={editFormData.gender} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </label>
                                <label style={{ flex: 1 }}>
                                    年齡:
                                    <input type="number" name="age" value={editFormData.age} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
                                </label>
                            </div>
                            <label>
                                主治醫師:
                                <select
                                    name="attending_physician"
                                    value={editFormData.attending_physician}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                >
                                    {PHYSICIANS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </label>
                            <label>
                                入院日期:
                                <input type="date" name="admission_date" value={editFormData.admission_date} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
                            </label>
                            <label>
                                護理等級:
                                <select name="nursing_level" value={editFormData.nursing_level} onChange={handleInputChange} style={{ width: '100%', padding: '5px', marginTop: '5px' }}>
                                    <option value="Level 1">Level 1</option>
                                    <option value="Level 2">Level 2</option>
                                    <option value="Level 3">Level 3</option>
                                    <option value="重症">重症</option>
                                </select>
                            </label>
                        </div>
                    ) : (
                        <div style={{ lineHeight: '1.8' }}>
                            <p><strong>姓名:</strong> {patient.name}</p>
                            <p><strong>病歷號:</strong> {patient.medical_id}</p>
                            <p><strong>病房:</strong> {patient.ward}</p>
                            <p><strong>床號:</strong> {patient.bed_number}</p>
                            <p><strong>性別:</strong> {patient.gender}</p>
                            <p><strong>年齡:</strong> {patient.age} 歲</p>
                            <p><strong>主治醫師:</strong> {patient.attending_physician}</p>
                            <p><strong>入院日期:</strong> {patient.admission_date}</p>
                            <p><strong>護理等級:</strong> <span style={{ color: patient.nursing_level === '重症' ? 'red' : 'green', fontWeight: 'bold' }}>{patient.nursing_level}</span></p>
                        </div>
                    )}
                </div>

                {/* 右側：護理紀錄 */}
                <div>
                    <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>新增護理紀錄</h2>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={newRecordContent}
                                onChange={(e) => setNewRecordContent(e.target.value)}
                                rows={3}
                                placeholder="請輸入護理紀錄內容..."
                                style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                required
                            />
                            <button type="submit" style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                                新增紀錄
                            </button>
                        </form>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>歷史紀錄</h2>
                        {records.length > 0 ? (
                            <div>
                                {records.map((record) => (
                                    <div key={record.id} style={{ padding: '15px', borderLeft: '4px solid #2196f3', backgroundColor: '#f9f9f9', marginBottom: '15px', borderRadius: '0 4px 4px 0' }}>
                                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{new Date(record.recorded_at).toLocaleString()} - {record.recorder}</span>
                                            {editingId !== record.id && (
                                                <button onClick={() => startEdit(record)} style={{ border: 'none', background: 'none', color: '#2196f3', cursor: 'pointer', textDecoration: 'underline' }}>
                                                    修改
                                                </button>
                                            )}
                                        </div>

                                        {editingId === record.id ? (
                                            <div>
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={3}
                                                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                                                />
                                                <div style={{ textAlign: 'right' }}>
                                                    <button onClick={() => setEditingId(null)} style={{ marginRight: '10px', padding: '5px 10px' }}>取消</button>
                                                    <button onClick={() => handleUpdate(record.id)} style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>儲存</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{record.content}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>目前沒有紀錄</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
