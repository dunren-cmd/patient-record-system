import { UserCircle } from 'lucide-react';
import type { Patient } from '../types';

interface PatientCardProps {
    patient: Patient;
    onClick: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
    return (
        <div
            onClick={() => onClick(patient)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
        >
            <div className="flex items-center space-x-3">
                <UserCircle className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-500">
                            {patient.ward} - {patient.bed_number}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-200 text-green-800">
                            {patient.nursing_level}
                        </span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{patient.name}</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">病歷號: {patient.medical_id}</p>
            <p className="text-xs text-gray-500">主治醫師: {patient.attending_physician}</p>
        </div>
    );
};
