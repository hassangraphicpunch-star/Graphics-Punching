import React from 'react';

interface ServiceIconProps {
  type: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ type, className = "w-16 h-16" }) => {
  switch (type) {
    case 'screen-printing':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* T-Shirt Base */}
          <path d="M28 24L38 18L50 24L62 18L72 24L82 38L70 45L66 38V84H34V38L30 45L18 38L28 24Z" fill="#18181B" stroke="#09090B" strokeWidth="2.5" strokeLinejoin="round"/>
          {/* Squeegee / Ink Bar */}
          <rect x="24" y="44" width="52" height="14" rx="2" fill="#FFC400" stroke="#09090B" strokeWidth="2.5" />
          <line x1="28" y1="51" x2="72" y2="51" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />
          {/* Ink Splatter / Fresh Print Accent */}
          <path d="M42 64H58V74H42V64Z" fill="#FFFFFF" rx="1" />
          <circle cx="50" cy="69" r="2.5" fill="#09090B" />
        </svg>
      );

    case 'embroidery':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Embroidery Machine Top Head */}
          <rect x="25" y="18" width="50" height="28" rx="4" fill="#18181B" stroke="#09090B" strokeWidth="2.5" />
          {/* Machine Needle Spools */}
          <rect x="32" y="24" width="5" height="14" fill="#FFC400" rx="1" />
          <rect x="41" y="24" width="5" height="14" fill="#FFFFFF" rx="1" />
          <rect x="50" y="24" width="5" height="14" fill="#FFC400" rx="1" />
          <rect x="59" y="24" width="5" height="14" fill="#FFFFFF" rx="1" />
          {/* Machine Arm & Needle */}
          <path d="M38 46V64L48 64V76L50 82L52 76V64H62V46" fill="#27272A" stroke="#09090B" strokeWidth="2.5" />
          {/* Embroidery Hoop / Ring */}
          <ellipse cx="50" cy="80" rx="28" ry="10" stroke="#FFC400" strokeWidth="3" strokeDasharray="3 3" />
        </svg>
      );

    case 'vector':
    case 'vector-artwork':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Bezier Vector Curve Line */}
          <path d="M22 68C22 36 78 36 78 68" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" />
          {/* Handle Lines */}
          <line x1="22" y1="68" x2="38" y2="34" stroke="#A1A1AA" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="78" y1="68" x2="62" y2="34" stroke="#A1A1AA" strokeWidth="2" strokeDasharray="2 2" />
          {/* Handle Points */}
          <circle cx="38" cy="34" r="4" fill="#FFC400" stroke="#09090B" strokeWidth="2" />
          <circle cx="62" cy="34" r="4" fill="#FFC400" stroke="#09090B" strokeWidth="2" />
          {/* Vector Pen Tool / Anchor */}
          <path d="M48 20L56 28L44 68L36 68L36 60L48 20Z" fill="#18181B" stroke="#09090B" strokeWidth="2" />
          <circle cx="48" cy="32" r="2" fill="#FFC400" />
          {/* Anchor Node Boxes */}
          <rect x="17" y="63" width="10" height="10" fill="#FFC400" stroke="#09090B" strokeWidth="2" />
          <rect x="73" y="63" width="10" height="10" fill="#FFC400" stroke="#09090B" strokeWidth="2" />
        </svg>
      );

    case 'spool':
    case 'logo-digitizing':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Spool Top Rim */}
          <ellipse cx="50" cy="24" rx="20" ry="6" fill="#18181B" stroke="#09090B" strokeWidth="2.5" />
          {/* Thread Body with Grooves */}
          <path d="M30 24V68C30 71.3 39 74 50 74C61 74 70 71.3 70 68V24" fill="#FFC400" stroke="#09090B" strokeWidth="2.5" />
          {/* Thread Lines */}
          <line x1="30" y1="34" x2="70" y2="34" stroke="#E5A700" strokeWidth="2" />
          <line x1="30" y1="44" x2="70" y2="44" stroke="#E5A700" strokeWidth="2" />
          <line x1="30" y1="54" x2="70" y2="54" stroke="#E5A700" strokeWidth="2" />
          <line x1="30" y1="64" x2="70" y2="64" stroke="#E5A700" strokeWidth="2" />
          {/* Spool Bottom Rim */}
          <ellipse cx="50" cy="68" rx="24" ry="8" fill="#18181B" stroke="#09090B" strokeWidth="2.5" />
          {/* Thread Needle Loop */}
          <path d="M68 54C80 54 84 72 68 82" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'apparel':
    case 'custom-apparel':
    default:
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Hoodie Body */}
          <path d="M26 34L36 28C40 38 60 38 64 28L74 34L82 48L72 54L68 46V84H32V46L28 54L18 48L26 34Z" fill="#18181B" stroke="#09090B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Hoodie Pouch Pocket */}
          <path d="M38 64H62L66 76H34L38 64Z" fill="#27272A" stroke="#09090B" strokeWidth="2" />
          {/* Cap Visual Overlaid */}
          <path d="M54 18C54 14 62 10 74 12C84 14 86 20 86 24H54V18Z" fill="#FFC400" stroke="#09090B" strokeWidth="2" />
          <path d="M64 24C74 24 88 24 92 28C92 30 84 31 74 31H54" fill="#09090B" />
        </svg>
      );
  }
};
