import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    onToggleFilter: () => void;
    isFilterExpanded: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearch,
    onToggleFilter,
    isFilterExpanded,
}) => {
    const [localTerm, setLocalTerm] = useState(searchTerm);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        setLocalTerm(searchTerm);
    }, [searchTerm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalTerm(val);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            onSearch(val);
        }, 300);
    };

    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        onSearch(e.currentTarget.value);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-3/5">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="智能搜尋：病歷號、姓名、床號、病房 (如: 1A, 王小明, A001001)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-inner"
                        value={localTerm}
                        onChange={handleChange}
                        onCompositionEnd={handleCompositionEnd}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-2/5">
                    <button
                        onClick={onToggleFilter}
                        className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full md:w-auto flex-grow"
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        <span>{isFilterExpanded ? '收合篩選器' : '進階搜尋/篩選'}</span>
                    </button>
                    {searchTerm && (
                        <button
                            onClick={() => onSearch('')}
                            className="px-4 py-3 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors shadow-sm w-auto"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
