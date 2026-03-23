'use client';

import { Trash2, CheckSquare, Square, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface BulkAction {
  label: string;
  key: string;
  className?: string;
  icon?: React.ReactNode;
}

interface BulkSelectCheckboxProps {
  id?: number;
  selected: boolean;
  onSelect: (id: number | undefined, selected: boolean) => void;
  indeterminate?: boolean;
}

export function BulkSelectCheckbox({
  id,
  selected,
  onSelect,
  indeterminate = false,
}: BulkSelectCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={selected}
      ref={(el) => {
        if (el) {
          (el as HTMLInputElement).indeterminate = indeterminate;
        }
      }}
      onChange={(e) => onSelect(id, e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
    />
  );
}

interface BulkActionsProps {
  selectedItems: number[];
  totalItems: number;
  onSelectAll: (selected: boolean) => void;
  onSelect: (id: number, selected: boolean) => void;
  onAction: (action: string, items: number[]) => void;
  actions: BulkAction[];
  isLoading?: boolean;
}

export default function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onSelect,
  onAction,
  actions,
  isLoading = false,
}: BulkActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const allSelected = selectedItems.length === totalItems && totalItems > 0;
  const someSelected = selectedItems.length > 0;

  return (
    <div className="space-y-4">
      {/* Selection bar at top */}
      <div className="sticky top-0 bg-blue-50 border-l-4 border-blue-500 p-4 rounded flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectAll(!allSelected)}
            className="p-1 hover:bg-blue-100 rounded"
            title={allSelected ? 'Deselect all' : 'Select all'}
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <span className="text-sm text-gray-700">
            <strong>{selectedItems.length}</strong> of <strong>{totalItems}</strong> selected
          </span>
        </div>

        {someSelected && (
          <div className="flex gap-2 items-center">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
                disabled={isLoading}
              >
                <MoreVertical className="w-4 h-4" />
                Actions
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                  {actions.map((action) => (
                    <button
                      key={action.key}
                      onClick={() => {
                        onAction(action.key, selectedItems);
                        setShowMenu(false);
                      }}
                      disabled={isLoading}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                        action.className || ''
                      }`}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onSelectAll(false)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Checkboxes integrated into table */}
    </div>
  );
}
