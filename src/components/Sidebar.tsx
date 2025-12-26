
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'pokedex', label: '図鑑検索', icon: '🔍' },
    { id: 'party', label: 'パーティー診断', icon: '📋' },
    { id: 'gym', label: 'ジムリーダー攻略', icon: '🏆' },
    { id: 'camera', label: 'AIカメラ診断', icon: '📸' },
  ];

  return (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
        <h1 className="text-xl font-bold text-gray-800">ポケナビ Pro</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-4 text-white">
          <p className="text-sm font-medium opacity-90">AI Advisor Active</p>
          <p className="text-xs mt-1 opacity-75">戦略をリアルタイムに生成中</p>
        </div>
        <p className="text-xs text-center mt-4 text-gray-400">© 2025 PokeNavi Pro</p>
      </div>
    </div>
  );
};

export default Sidebar;
