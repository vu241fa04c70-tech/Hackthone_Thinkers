import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, MapPin, Check } from 'lucide-react';
import { getDistrictsForState, ALL_INDIAN_DISTRICTS } from '../utils/indianDistricts';

export default function SearchableDistrictSelect({
  value,
  onChange,
  selectedState = 'Andhra Pradesh',
  placeholder = 'Select or search district...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  const availableDistricts = getDistrictsForState(selectedState);

  // Filter districts based on search query
  const filteredDistricts = (searchQuery.trim() ? ALL_INDIAN_DISTRICTS : availableDistricts).filter(d =>
    d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (districtName) => {
    onChange(districtName);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full font-['Plus_Jakarta_Sans',sans-serif]" ref={containerRef}>
      {/* Trigger Button Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border border-slate-300 hover:border-[#2D6A4F] rounded-2xl px-4 py-3 text-xs sm:text-sm font-black text-[#2C3333] flex items-center justify-between cursor-pointer shadow-sm transition-all ${
          isOpen ? 'ring-2 ring-[#2D6A4F]/20 border-[#2D6A4F] bg-white' : ''
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <MapPin className="w-4 h-4 text-[#2D6A4F] shrink-0" />
          <span className="truncate">
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#2D6A4F]' : ''}`} />
      </div>

      {/* Searchable Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border-2 border-emerald-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-72 flex flex-col">
          {/* Live Search Input Bar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2 sticky top-0 z-10">
            <Search className="w-4 h-4 text-[#2D6A4F] shrink-0 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${selectedState || 'all India'} districts...`}
              className="w-full bg-transparent px-2 py-1.5 text-xs font-bold text-[#2C3333] placeholder-slate-400 focus:outline-none"
              autoFocus
            />
          </div>

          {/* List of Districts */}
          <div className="overflow-y-auto max-h-56 p-1 space-y-0.5 no-scrollbar">
            {filteredDistricts.length > 0 ? (
              filteredDistricts.map((dist) => {
                const isSelected = value === dist;
                return (
                  <div
                    key={dist}
                    onClick={() => handleSelect(dist)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-[#2D6A4F] font-extrabold border border-emerald-200'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#2C3333]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{dist}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#2D6A4F]" />}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 font-semibold">
                No matching districts found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
