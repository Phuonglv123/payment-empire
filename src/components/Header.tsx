'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white rounded-lg px-3 py-2 font-bold text-xl">
                PE
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">
                Payment Empire
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium hidden sm:block"
            >
              Trang chủ
            </Link>
            <Link 
              href="/demo-payment" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium hidden sm:block"
            >
              Demo
            </Link>
            <a 
              href="mailto:support@paymentempire.com" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              Hỗ trợ
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
