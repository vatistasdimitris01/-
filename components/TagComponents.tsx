
import React, { useState, useRef, useEffect } from 'react';
import type { Tag } from '../types';
// FIX: Removed unused import for TAG_COLORS which was causing an error because it's not exported from constants.ts.

// Individual Tag Pill
interface TagPillProps {
  tag: Tag;
  onRemove?: () => void;
}

export const TagPill: React.FC<TagPillProps> = ({ tag, onRemove }) => {
  return (
    <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${tag.color.bg} ${tag.color.text}`}>
      {tag.label}
      {onRemove && (
        <button onClick={onRemove} className="ml-1.5 -mr-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-300 hover:text-gray-600 focus:outline-none focus:bg-gray-400 focus:text-white transition-colors duration-150">
          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </span>
  );
};

// Tag Selector Popover
interface TagSelectorProps {
  allTags: Tag[];
  assignedTagIds: string[];
  onAddTag: (tagId: string) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ allTags, assignedTagIds, onAddTag }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableTags = allTags.filter(tag => !assignedTagIds.includes(tag.id));

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {availableTags.length > 0 ? (
              availableTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => { onAddTag(tag.id); setIsOpen(false); }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                   <span className={`w-3 h-3 rounded-full mr-3 ${tag.color.bg}`}></span>
                   {tag.label}
                </button>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">No available tags</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// Tag Manager Form
interface TagManagerProps {
  onCreateTag: (label: string) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ onCreateTag }) => {
  const [newTagLabel, setNewTagLabel] = useState('');

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagLabel.trim()) {
      onCreateTag(newTagLabel.trim());
      setNewTagLabel('');
    }
  };

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Manage Tags</h2>
        <form onSubmit={handleCreateTag} className="flex items-center gap-3">
          <input
            type="text"
            value={newTagLabel}
            onChange={(e) => setNewTagLabel(e.target.value)}
            placeholder="Create a new tag..."
            className="flex-grow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={!newTagLabel.trim()}
          >
            Create
          </button>
        </form>
    </div>
  );
};