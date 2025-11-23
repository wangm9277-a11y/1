import React from 'react';
import { TcmCase } from '../types';
import { PixelCard } from './PixelCard';

interface PatientViewProps {
  patientData: TcmCase;
}

const PatientAvatar: React.FC<{ faceDesc: string }> = ({ faceDesc }) => {
  // Determine color tone based on description keyword
  let faceColor = 'bg-[#eec0b0]'; // Default flesh
  if (faceDesc.includes('红') || faceDesc.includes('赤')) faceColor = 'bg-[#ff9999]';
  if (faceDesc.includes('白') || faceDesc.includes('萎')) faceColor = 'bg-[#f0f0e0]';
  if (faceDesc.includes('黄')) faceColor = 'bg-[#eadcae]';
  if (faceDesc.includes('黑') || faceDesc.includes('暗')) faceColor = 'bg-[#a09090]';
  if (faceDesc.includes('紫')) faceColor = 'bg-[#c0a0c0]';

  return (
    <div className="w-32 h-32 mx-auto relative mb-4 animate-[bounce_3s_infinite]">
        {/* Head */}
        <div className={`w-24 h-24 absolute top-4 left-4 ${faceColor} shadow-[4px_0_0_0_#000,-4px_0_0_0_#000,0_-4px_0_0_#000,0_4px_0_0_#000]`}>
           {/* Eyes */}
           <div className="absolute top-8 left-4 w-4 h-2 bg-black"></div>
           <div className="absolute top-8 right-4 w-4 h-2 bg-black"></div>
           {/* Nose */}
           <div className="absolute top-12 left-10 w-4 h-4 bg-black/20"></div>
           {/* Mouth */}
           <div className="absolute bottom-6 left-8 w-8 h-2 bg-black/60"></div>
        </div>
        {/* Shoulders */}
        <div className="absolute bottom-0 left-0 w-32 h-6 bg-blue-800 rounded-t-lg"></div>
    </div>
  );
};

export const PatientView: React.FC<PatientViewProps> = ({ patientData }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto">
      {/* Left: Avatar & Name */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <PixelCard className="w-full" title={`患者: ${patientData.patientName}`}>
          <PatientAvatar faceDesc={patientData.appearance.face} />
          <div className="text-center mt-2 font-bold text-gray-800">
            "大夫，请帮帮我..."
          </div>
        </PixelCard>
      </div>

      {/* Right: TCM Observations (The "RPG Stats") */}
      <div className="w-full md:w-2/3">
        <PixelCard className="h-full bg-amber-50" title="四诊信息 (Observation)">
          <div className="space-y-4 font-serif text-lg text-gray-900">
            <div className="flex items-start">
              <span className="bg-red-800 text-white px-2 py-0.5 mr-3 text-sm font-bold pixel-border">望诊 (面)</span>
              <span>{patientData.appearance.face}</span>
            </div>
            <div className="flex items-start">
              <span className="bg-red-800 text-white px-2 py-0.5 mr-3 text-sm font-bold pixel-border">望诊 (舌)</span>
              <span>{patientData.appearance.tongue}</span>
            </div>
            <div className="flex items-start">
               <span className="bg-blue-800 text-white px-2 py-0.5 mr-3 text-sm font-bold pixel-border">切诊 (脉)</span>
              <span>{patientData.appearance.pulse}</span>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};
