import React from 'react';
import './Lotus.css';

interface LotusProps {
  className?: string;
}

export const Lotus: React.FC<LotusProps> = ({ className = '' }) => {
  // Stamens clusters
  const stamens = Array.from({ length: 24 }); // Dense core

  // Petal layers
  const layer1 = Array.from({ length: 6 }); // Inner
  const layer2 = Array.from({ length: 8 }); // Mid
  const layer3 = Array.from({ length: 12 }); // Outer
  const layer4 = Array.from({ length: 6 }); // Sepals

  return (
    <div className={`lotus-container ${className}`}>
      <div className="lotus-flower">
        
        {/* Core: Stamens */}
        <div className="stamen-cluster">
          {stamens.map((_, i) => (
             <div 
               key={`stamen-${i}`} 
               className="stamen" 
               style={{ transform: `rotate(${i * (360/24)}deg) translateX(25px) rotateX(-20deg)` }} 
             />
          ))}
        </div>

        {/* Layer 1: Inner Petals */}
        <div className="layer-group layer-1-group">
          {layer1.map((_, i) => (
            <div key={`l1-${i}`} className="petal layer-1" />
          ))}
        </div>

        {/* Layer 2: Mid Petals */}
         <div className="layer-group layer-2-group">
          {layer2.map((_, i) => (
            <div key={`l2-${i}`} className="petal layer-2" />
          ))}
        </div>

        {/* Layer 3: Outer Petals */}
         <div className="layer-group layer-3-group">
          {layer3.map((_, i) => (
            <div key={`l3-${i}`} className="petal layer-3" />
          ))}
        </div>
        
        {/* Layer 4: Sepals (Green base) */}
         <div className="layer-group layer-4-group">
          {layer4.map((_, i) => (
            <div key={`l4-${i}`} className="petal layer-4" />
          ))}
        </div>

      </div>
    </div>
  );
};
