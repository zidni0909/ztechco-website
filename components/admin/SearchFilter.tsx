'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  filters?: { label: string; key: string; options: { label: string; value: any }[] }[];
  filterDefinitions?: { label: string; key: string; options: { label: string; value: any }[] }[];
  placeholder?: string;
}

export default function SearchFilter({
  onSearch,
  onFilter,
  filters = [],
  filterDefinitions = [],
  placeholder = 'Search...'
}: SearchFilterProps) {
  const filterDefs = filterDefinitions.length > 0 ? filterDefinitions : filters;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilter = (key: string, value: any) => {
    const newFilters = { ...activeFilters };
    if (newFilters[key] === value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters({});
    onSearch('');
    onFilter({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        {filterDefs.length > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
              activeFilterCount > 0
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            {activeFilterCount > 0 && <span className="text-sm font-semibold">{activeFilterCount}</span>}
          </button>
        )}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && filterDefs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          {filterDefs.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{filter.label}</label>
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeFilters[filter.key] === option.value}
                      onChange={() => handleFilter(filter.key, option.value)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
