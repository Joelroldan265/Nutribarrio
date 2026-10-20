import React from 'react';
import { Calendar, TrendingUp, ShoppingBag, UserCheck } from 'lucide-react';

export type NavTab = 'hoy' | 'semanal' | 'canasta' | 'perfil';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingProtein: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingProtein,
}) => {
  const tabs = [
    {
      id: 'hoy' as NavTab,
      label: 'Hoy',
      icon: Calendar,
      badge: pendingProtein > 0 ? `${pendingProtein}g` : '✓',
      badgeColor: pendingProtein > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'semanal' as NavTab,
      label: 'Semanal',
      icon: TrendingUp,
    },
    {
      id: 'canasta' as NavTab,
      label: 'Canasta',
      icon: ShoppingBag,
    },
    {
      id: 'perfil' as NavTab,
      label: 'Perfil',
      icon: UserCheck,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/90 backdrop-blur-xl border-t border-stone-800/80 pb-safe shadow-2xl shadow-black">
      <div className="max-w-xl mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-stone-400 hover:text-stone-200 font-medium'
              }`}
            >
              {/* Background pill glow when active */}
              {isActive && (
                <span className="absolute inset-0 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl -z-10 shadow-inner" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-emerald-400' : 'text-stone-400'
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />

                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-bold px-1 py-0.2 rounded-full border ${tab.badgeColor} leading-tight`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
