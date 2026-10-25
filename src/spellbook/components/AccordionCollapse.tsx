import React from 'react';

interface AccordionCollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: string;
}

/**
 * High-performance smooth accordion collapse using CSS grid-template-rows.
 * Animates from 0fr to 1fr seamlessly with opacity transitions and zero layout jank.
 */
export const AccordionCollapse: React.FC<AccordionCollapseProps> = ({
  isOpen,
  children,
  className = '',
  duration = 'duration-300',
}) => {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] ${duration} ease-in-out ${
        isOpen
          ? 'grid-rows-[1fr] opacity-100'
          : 'grid-rows-[0fr] opacity-0 pointer-events-none'
      } ${className}`}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  );
};
