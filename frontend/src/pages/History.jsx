import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function History() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/history", { params: { token } })
      .then(r => {
        setItems(r.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL reports? This cannot be undone.")) return;
    try {
      await axios.delete("/history", { params: { token } });
      setItems([]);
    } catch (err) {
      console.error(err);
      alert("Failed to clear history");
    }
  };

  const deleteReport = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`/report/${id}`, { params: { token } });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Previous Reports</h1>
          <p className="text-gray-400">Manage and view your past medical analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            Total Reports: {items.length}
          </div>
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear History
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-glass backdrop-blur-md rounded-2xl border border-glassBorder animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-300">No reports found</h3>
          <p className="text-gray-500 mt-2">Upload your first report to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {items.map((i, idx) => (
            <div key={idx} className="bg-glass backdrop-blur-md rounded-xl border border-glassBorder p-6 hover:bg-white/10 transition-all duration-300 group shadow-lg hover:shadow-blue-500/10 relative">

              {/* Delete Button */}
              <button
                onClick={(e) => deleteReport(e, i._id)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:text-red-300"
                title="Delete Report"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-2 truncate pr-8" title={i.file}>
                {i.file}
              </h4>

              <div className="bg-black/40 rounded-lg p-3 my-4 max-h-32 overflow-hidden relative">
                <pre className="text-xs text-gray-400 font-mono">
                  {JSON.stringify(i.result, null, 2)}
                </pre>
                {/* Fade out effect */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>

              <button
                onClick={() => i._id && navigate(`/report/${i._id}`)}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
