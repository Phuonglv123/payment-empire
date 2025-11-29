import { useState, useEffect, useRef } from 'react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Option {
  code: string;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  loading = false,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    onChange(option.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div
        className={`relative w-full cursor-default overflow-hidden rounded-xl border border-gray-200 bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F5A623] focus-within:border-transparent'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className={`w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 min-h-[46px] flex items-center`}>
            {selectedOption ? selectedOption.name : <span className="text-gray-500">{loading ? 'Đang tải...' : placeholder}</span>}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            <div className="sticky top-0 z-10 bg-white px-2 py-2 border-b border-gray-100">
                <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-[#F5A623] focus:outline-none focus:ring-1 focus:ring-[#F5A623] text-black"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
          {filteredOptions.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Không tìm thấy kết quả.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.code}
                className={`relative cursor-default select-none py-2 pl-10 pr-4 ${
                  option.code === value ? 'bg-orange-50 text-orange-900' : 'text-gray-900 hover:bg-orange-50'
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                }}
              >
                <span
                  className={`block truncate ${
                    option.code === value ? 'font-medium' : 'font-normal'
                  }`}
                >
                  {option.name}
                </span>
                {option.code === value ? (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
