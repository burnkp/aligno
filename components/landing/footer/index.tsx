import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-8 md:mb-0">
            <Image 
              src="/assets/icons/Aligno Icon.png" 
              alt="Aligno Icon" 
              width={24} 
              height={24} 
              className="h-6 w-auto" 
            />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-purple-600 to-blue-600 bg-clip-text text-transparent">
              Aligno
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-gray-600">
            <Link 
              href="/privacy-policy" 
              className="hover:text-brand-purple-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-brand-purple-600 transition-colors"
            >
              Terms & Conditions
            </Link>
            <span>© {new Date().getFullYear()} Aligno. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 