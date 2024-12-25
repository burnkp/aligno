import Image from 'next/image';

export function Logo() {
  return (
    <Image 
      src="/Aligno Icon.png" 
      alt="Aligno" 
      width={32} 
      height={32} 
      className="w-8 h-8"
    />
  );
}