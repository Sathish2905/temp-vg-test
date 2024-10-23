import React from 'react';
import { Layout, LayoutGrid } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelect,
}) => {
  const templates = [
    { id: 'template1', icon: LayoutGrid, name: 'Grid Layout' },
    { id: 'template2', icon: Layout, name: 'Feature Layout' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
      <div className="grid grid-cols-2 gap-4">
        {templates.map(({ id, icon: Icon, name }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition ${
              selectedTemplate === id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <Icon className={`w-8 h-8 mb-2 ${
              selectedTemplate === id ? 'text-indigo-500' : 'text-gray-500'
            }`} />
            <span className={`text-sm ${
              selectedTemplate === id ? 'text-indigo-700' : 'text-gray-700'
            }`}>
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};