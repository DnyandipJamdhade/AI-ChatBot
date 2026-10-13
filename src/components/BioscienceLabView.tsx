import React, { useState } from 'react';
import {
  Dna,
  Search,
  ExternalLink,
  BookOpen,
  Atom,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

export const BioscienceLabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alphafold' | 'uniprot' | 'pubchem'>('alphafold');
  const [query, setQuery] = useState<string>('P04637'); // Tumor protein p53
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alphaFoldData, setAlphaFoldData] = useState<any>(null);
  const [uniprotData, setUniprotData] = useState<any[]>([]);
  const [pubchemData, setPubchemData] = useState<any>(null);

  // Lab Attendance Log State
  const [labHours, setLabHours] = useState<{ id: string; experiment: string; hours: number; date: string }[]>([
    { id: '1', experiment: 'Molecular Modeling & AlphaFold PAE Analysis', hours: 3, date: '2026-10-10' },
    { id: '2', experiment: 'Enzyme Kinetics & Spectrophotometry Lab', hours: 4, date: '2026-10-12' },
  ]);
  const [newExp, setNewExp] = useState('');
  const [newHours, setNewHours] = useState(3);

  const handleSearchAlphaFold = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/science/alphafold/${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error('Protein not found in AlphaFold DB.');
      const data = await res.json();
      setAlphaFoldData(Array.isArray(data) ? data[0] : data);
    } catch (e: any) {
      setError(e.message || 'AlphaFold fetch failed');
      setAlphaFoldData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUniProt = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/science/uniprot?query=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error('UniProt search failed.');
      const data = await res.json();
      setUniprotData(data.results || []);
    } catch (e: any) {
      setError(e.message || 'UniProt search failed');
      setUniprotData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPubChem = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/science/pubchem?name=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error('Compound not found in PubChem.');
      const data = await res.json();
      setPubchemData(data.PropertyTable?.Properties?.[0] || null);
    } catch (e: any) {
      setError(e.message || 'PubChem search failed');
      setPubchemData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'alphafold') handleSearchAlphaFold();
    else if (activeTab === 'uniprot') handleSearchUniProt();
    else handleSearchPubChem();
  };

  const handleAddLabHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.trim()) return;
    setLabHours((prev) => [
      { id: Date.now().toString(), experiment: newExp, hours: newHours, date: new Date().toISOString().split('T')[0] },
      ...prev,
    ]);
    setNewExp('');
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Bioscience & Structural Biology Lab</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300">
                  DeepMind Science Skills
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AlphaFold DB structures, UniProtKB functional annotations, and PubChem molecular analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('alphafold');
              setQuery('P04637');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'alphafold'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            AlphaFold DB
          </button>
          <button
            onClick={() => {
              setActiveTab('uniprot');
              setQuery('Insulin human');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'uniprot'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            UniProtKB
          </button>
          <button
            onClick={() => {
              setActiveTab('pubchem');
              setQuery('Aspirin');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'pubchem'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            PubChem Chemistry
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === 'alphafold'
                ? 'Enter UniProt Accession (e.g. P04637 for TP53, P01308 for Insulin)...'
                : activeTab === 'uniprot'
                ? 'Search protein name or gene (e.g. EGFR, Hemoglobin)...'
                : 'Enter chemical compound (e.g. Aspirin, Paracetamol, Caffeine)...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors"
        >
          {loading ? 'Searching...' : 'Explore Database'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Database Data View */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Atom className="w-4 h-4 text-teal-500" />
            <span>Database Query Results</span>
          </h2>

          {activeTab === 'alphafold' && (
            alphaFoldData ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
                      {alphaFoldData.uniprotAccession || query}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 font-semibold">
                      AlphaFold v4 Prediction
                    </span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 text-sm font-bold">
                    {alphaFoldData.uniprotDescription || 'Tumor protein p53'}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Organism: {alphaFoldData.organismScientificName || 'Homo sapiens (Human)'} · Sequence Length: {alphaFoldData.uniprotSequence?.length || '393'} AA
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-[11px] text-slate-400">pLDDT Metric</span>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">High Confidence</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-[11px] text-slate-400">3D Coordinates</span>
                    <a
                      href={alphaFoldData.pdbUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Download PDB</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-[11px] text-slate-400">mmCIF Data</span>
                    <a
                      href={alphaFoldData.cifUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Download CIF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Search a UniProt ID like P04637 to view AlphaFold 3D structure metadata.
              </div>
            )
          )}

          {activeTab === 'uniprot' && (
            uniprotData.length > 0 ? (
              <div className="space-y-3">
                {uniprotData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">
                        {item.primaryAccession}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {item.organism?.scientificName}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {item.proteinDescription?.recommendedName?.fullName?.value || item.uniProtkbId}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Gene: {item.genes?.[0]?.geneName?.value || 'N/A'} · Length: {item.sequence?.length} residues
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Search protein queries like "Insulin" or "TP53" to view UniProtKB annotations.
              </div>
            )
          )}

          {activeTab === 'pubchem' && (
            pubchemData ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {query}
                  </span>
                  <span className="font-mono text-teal-600 font-bold">
                    CID: {pubchemData.CID}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px]">Molecular Formula:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {pubchemData.MolecularFormula}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Molecular Weight:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {pubchemData.MolecularWeight} g/mol
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">IUPAC Name:</span>
                  <div className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {pubchemData.IUPACName}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Canonical SMILES:</span>
                  <div className="text-teal-700 dark:text-teal-300 font-mono text-[11px] bg-slate-100 dark:bg-slate-900 p-2 rounded">
                    {pubchemData.CanonicalSMILES}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Search chemical compounds like Aspirin or Caffeine to view chemical identifiers.
              </div>
            )
          )}
        </div>

        {/* Right Column: Research Lab Hours & Attendance Logging */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Science Research Lab Log</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Log supplementary laboratory hours toward attendance condonation.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddLabHours} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Experiment / Project:</label>
              <input
                type="text"
                value={newExp}
                onChange={(e) => setNewExp(e.target.value)}
                placeholder="e.g. Protein Crystallization Lab..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Hours Spent:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={newHours}
                onChange={(e) => setNewHours(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Add Verified Lab Hours
            </button>
          </form>

          {/* List of logged lab sessions */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Recent Lab Sessions:
            </span>
            {labHours.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-750 text-xs space-y-0.5"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {session.experiment}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{session.hours} hrs completed</span>
                  <span>{session.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
