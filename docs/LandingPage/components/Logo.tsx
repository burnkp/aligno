import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/Aligno Icon.png" alt="Aligno" className="w-8 h-8" />
      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        Aligno
      </span>
    </div>
  );
}