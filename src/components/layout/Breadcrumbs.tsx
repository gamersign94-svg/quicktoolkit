import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (url: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-slate-600">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer py-1"
            title="Go to QuickToolKit Homepage"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={item.url + index}>
              <li aria-hidden="true" className="text-slate-400">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-slate-900 line-clamp-1 py-1"
                  >
                    {item.name}
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate(item.url)}
                    className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer py-1"
                  >
                    {item.name}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
