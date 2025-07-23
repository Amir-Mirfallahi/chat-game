import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, History, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/history', label: 'History', icon: History },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/agent', label: 'Agent', icon: Bot },
];

export const BottomNavigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t-4 border-primary rounded-t-3xl px-2 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center p-3 rounded-2xl min-touch transition-all duration-200',
                  'hover:bg-primary/10 active:scale-95',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-foreground/70 hover:text-foreground'
                )
              }
              aria-label={item.label}
            >
              <Icon className="nav-icon mb-1" />
              <span className="text-xs font-semibold">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};