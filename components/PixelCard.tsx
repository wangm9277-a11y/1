import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'dark';
}

export const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  className = '', 
  title,
  variant = 'default' 
}) => {
  
  const getBorderColor = () => {
    switch (variant) {
      case 'primary': return 'border-amber-900 bg-amber-100 text-gray-900';
      case 'danger': return 'border-red-900 bg-red-50 text-gray-900';
      case 'success': return 'border-green-900 bg-green-50 text-gray-900';
      case 'dark': return 'border-gray-600 bg-black text-white';
      default: return 'border-gray-800 bg-[#dfdcd6] text-gray-900';
    }
  };

  const getTitleStyle = () => {
    if (variant === 'default' || variant === 'dark') {
      return 'bg-gray-800 text-white';
    }
    return 'bg-inherit text-black font-bold';
  };

  return (
    <div className={`relative p-1 ${className}`}>
      {/* Outer black border simulation */}
      <div className={`border-4 ${getBorderColor()} shadow-[6px_6px_0_0_rgba(0,0,0,0.4)] relative transition-colors duration-300`}>
        {/* Title Bar */}
        {title && (
          <div className={`px-2 py-1 border-b-4 border-inherit ${getTitleStyle()}`}>
             <h3 className="font-bold tracking-wider text-sm md:text-base font-serif">{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
        
        {/* Corner Decors */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-black"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-black"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black"></div>
      </div>
    </div>
  );
};