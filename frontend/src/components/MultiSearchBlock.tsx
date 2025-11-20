import React from 'react';

interface MultiSearchBlockProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedWard: string | null;
    onWardChange: (ward: string | null) => void;
    totalResults: number;
}

export const MultiSearchBlock: React.FC<MultiSearchBlockProps> = ({
    searchTerm,
    onSearchChange,
    selectedWard,
    onWardChange,
    totalResults
}) => {
    const wards = ['1A', '2A', '2B', '3A', '3B'];

    return (
        <div style={{
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd'
        }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="搜尋姓名、病歷號..."
                    style={{
                        flex: '1',
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
                <select
                    value={selectedWard || ''}
                    onChange={(e) => onWardChange(e.target.value || null)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        minWidth: '120px'
                    }}
                >
                    <option value="">所有病房</option>
                    {wards.map(w => (
                        <option key={w} value={w}>{w}病房</option>
                    ))}
                </select>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
                {selectedWard ? `已篩選: ${selectedWard} 病房` : '顯示所有病房'}
                {searchTerm && ` | 搜尋: "${searchTerm}"`}
                <span style={{ float: 'right' }}>共 {totalResults} 筆資料</span>
            </div>
        </div>
    );
};
