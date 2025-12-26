
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TypeBadge from './components/TypeBadge';
import { AppView, PokemonType, PokemonData } from './types';
import ImagePicker from './components/ImagePicker';
import { fetchPokemon } from './services/pokeapi';
import { getAIStrategyAdvice, analyzeImage } from './services/gemini';
import { TYPE_CHART, TYPE_NAME_JP, GYM_LEADERS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('pokedex');
  const [searchQuery, setSearchQuery] = useState('pikachu');
  const [searchResult, setSearchResult] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);

  // Party State
  const [party, setParty] = useState<(PokemonType | null)[]>([null, null, null, null, null, null]);
  const [partyWeaknesses, setPartyWeaknesses] = useState<Record<PokemonType, number>>({} as any);

  // Gym Strategy State
  const [selectedGym, setSelectedGym] = useState(GYM_LEADERS[0]);
  const [aceType, setAceType] = useState<PokemonType>('fire');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  // Camera Analysis State
  const [cameraImage, setCameraImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initial Search
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    const result = await fetchPokemon(searchQuery);
    setSearchResult(result);
    setLoading(false);
  };

  // Analyze Party
  useEffect(() => {
    const counts: Record<string, number> = {};
    const activePartyTypes = party.filter(p => p !== null) as PokemonType[];

    if (activePartyTypes.length === 0) {
      setPartyWeaknesses({} as any);
      return;
    }

    const allTypes = Object.keys(TYPE_CHART) as PokemonType[];
    allTypes.forEach(attackType => {
      let weakCount = 0;
      activePartyTypes.forEach(pType => {
        if (TYPE_CHART[attackType][pType] && TYPE_CHART[attackType][pType]! >= 2.0) {
          weakCount++;
        }
      });
      if (weakCount > 0) counts[attackType] = weakCount;
    });
    setPartyWeaknesses(counts as any);
  }, [party]);

  const fetchStrategy = async () => {
    setIsAdviceLoading(true);
    const advice = await getAIStrategyAdvice(selectedGym.type, [aceType]);
    setAiAdvice(advice);
    setIsAdviceLoading(false);
  };

  const calculateWinProbability = () => {
    const atkMult = TYPE_CHART[aceType][selectedGym.type] || 1.0;
    const defMult = TYPE_CHART[selectedGym.type][aceType] || 1.0;
    const score = Math.max(0, Math.min(100, 50 + (atkMult * 20) - (defMult * 20)));
    return Math.floor(score);
  };

  const handleImageSelected = async (uri: string) => {
    setCameraImage(uri);
    setAnalysisResult('');
    setIsAnalyzing(true);

    // Auto start analysis
    const result = await analyzeImage(uri);
    setAnalysisResult(result || "解析できませんでした。");
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <Sidebar currentView={view} setView={setView} />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">

          {/* VIEW: POKEDEX */}
          {view === 'pokedex' && (
            <div className="space-y-6">
              <header>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">ポケモン図鑑</h2>
                <p className="text-gray-500 mt-1">PokeAPIを利用した最新のポケモンデータ</p>
              </header>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="名前または図鑑番号 (例: pikachu, 25)"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    {loading ? '検索中...' : '検索'}
                  </button>
                </div>
              </div>

              {searchResult && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center">
                    <img
                      src={searchResult.sprite}
                      alt={searchResult.name}
                      className="w-64 h-64 object-contain drop-shadow-2xl"
                    />
                    <div className="mt-4 text-center">
                      <p className="text-gray-400 font-medium">No. {searchResult.id}</p>
                      <h3 className="text-3xl font-black capitalize text-gray-800">{searchResult.name}</h3>
                      <div className="flex gap-2 justify-center mt-3">
                        {searchResult.types.map(t => <TypeBadge key={t} type={t} size="lg" />)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                      ベースステータス
                    </h4>
                    <div className="space-y-4">
                      {searchResult.stats.map(s => (
                        <div key={s.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="uppercase text-gray-500 font-bold">{s.name.replace('-', ' ')}</span>
                            <span className="font-black text-gray-800">{s.value}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${s.value > 100 ? 'bg-green-500' : s.value > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(100, (s.value / 255) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: PARTY DIAGNOSIS */}
          {view === 'party' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">パーティー診断</h2>
                <p className="text-gray-500 mt-1">手持ちの弱点を一括分析</p>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {party.map((slot, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-red-300 transition-colors">
                    <p className="text-[10px] text-gray-400 font-bold mb-2">POKEMON {idx + 1}</p>
                    <select
                      value={slot || ''}
                      onChange={(e) => {
                        const newParty = [...party];
                        newParty[idx] = (e.target.value as PokemonType) || null;
                        setParty(newParty);
                      }}
                      className="w-full text-sm font-semibold outline-none bg-transparent"
                    >
                      <option value="">(空きスロット)</option>
                      {Object.keys(TYPE_NAME_JP).map(t => (
                        <option key={t} value={t}>{TYPE_NAME_JP[t as PokemonType]}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6">弱点分析結果</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(partyWeaknesses).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                    <div
                      key={type}
                      className={`flex items-center justify-between p-4 rounded-2xl border-l-4 ${count >= 3 ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <TypeBadge type={type as PokemonType} />
                      <div className="text-right">
                        <span className={`text-xl font-black ${count >= 3 ? 'text-red-600' : 'text-gray-700'}`}>{count}</span>
                        <span className="text-xs text-gray-400 ml-1">匹が弱点</span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(partyWeaknesses).length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      ポケモンを選択すると分析が開始されます
                    </div>
                  )}
                </div>
                {Object.values(partyWeaknesses).some(c => c >= 3) && (
                  <div className="mt-8 p-4 bg-red-500 rounded-2xl text-white flex items-center gap-4">
                    <div className="text-3xl">⚠️</div>
                    <div>
                      <p className="font-bold">要注意！</p>
                      <p className="text-sm opacity-90">3匹以上が同じ弱点を持っています。タイプ補完を考えてみましょう。</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: GYM STRATEGY */}
          {view === 'gym' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">ボス攻略シミュレーター</h2>
                <p className="text-gray-500 mt-1">AIがジムリーダー攻略法を伝授</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">ターゲット選択</label>
                    <div className="grid grid-cols-1 gap-3">
                      {GYM_LEADERS.map((gym) => (
                        <button
                          key={gym.name}
                          onClick={() => setSelectedGym(gym)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all border ${selectedGym.name === gym.name ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-300'
                            }`}
                        >
                          <div className="text-left">
                            <p className="text-xs font-bold text-gray-400">{gym.title}</p>
                            <p className="font-bold text-gray-800">{gym.name}</p>
                          </div>
                          <TypeBadge type={gym.type} size="sm" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">自分のエースタイプ</label>
                    <select
                      value={aceType}
                      onChange={(e) => setAceType(e.target.value as PokemonType)}
                      className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 font-bold outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {Object.keys(TYPE_NAME_JP).map(t => (
                        <option key={t} value={t}>{TYPE_NAME_JP[t as PokemonType]}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={fetchStrategy}
                    disabled={isAdviceLoading}
                    className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {isAdviceLoading ? 'AIが思考中...' : 'AI戦略アドバイスを取得'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">勝率期待度</p>
                    <div className="text-7xl font-black text-gray-900 mb-2">{calculateWinProbability()}%</div>
                    <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                        style={{ width: `${calculateWinProbability()}%` }}
                      />
                    </div>
                    <p className={`text-sm font-bold ${calculateWinProbability() > 60 ? 'text-green-600' : 'text-red-500'}`}>
                      {calculateWinProbability() > 60 ? 'この対面は有利です！' : '対策を検討しましょう'}
                    </p>
                  </div>

                  {aiAdvice && (
                    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-3xl text-white shadow-2xl animate-in zoom-in duration-300">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-500 px-2 py-1 rounded text-[10px] font-bold uppercase">AI Coach</span>
                        <h4 className="font-bold">戦略ガイドライン</h4>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">
                        {aiAdvice}
                      </div>
                    </div>
                  )}

                  {isAdviceLoading && (
                    <div className="bg-gray-100 p-8 rounded-3xl animate-pulse flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-bold">Gemini 3 が分析を生成しています...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CAMERA ANALYSIS */}
          {view === 'camera' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">AIカメラ診断</h2>
                <p className="text-gray-500 mt-1">バトル画面を撮影して、その場でアドバイスを取得</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <ImagePicker
                    onImageSelected={handleImageSelected}
                    selectedImage={cameraImage}
                  />
                </div>

                <div className="space-y-6">
                  {analysisResult ? (
                    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl text-white shadow-2xl animate-in zoom-in duration-300 border border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">LIVE ANALYSIS</span>
                        <h4 className="font-bold text-lg">AI戦術アドバイス</h4>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap opacity-90 font-medium">
                        {analysisResult}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[300px] border-4 border-dashed border-gray-200 rounded-[2.5rem] flex items-center justify-center p-8 text-center text-gray-400 bg-white">
                      {isAnalyzing ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                          <p className="font-bold text-gray-600 animate-pulse">画像を解析中...</p>
                          <p className="text-xs">状況を判断しています</p>
                        </div>
                      ) : (
                        <div>
                          <span className="text-6xl block mb-4 filter grayscale opacity-50">📸</span>
                          <p className="font-bold text-lg">写真をアップロードしてください</p>
                          <p className="text-sm mt-2">バトル画面やステータス画面に対応しています</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
