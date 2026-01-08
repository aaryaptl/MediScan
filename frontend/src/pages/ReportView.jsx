import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ReportView() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        axios.get(`/report/${id}`, { params: { token } })
            .then(res => setReport(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load report. It may not exist.");
            })
            .finally(() => setLoading(false));
    }, [id, token]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );

    if (error) return (
        <div className="text-center py-20">
            <h2 className="text-2xl text-red-400 mb-4">{error}</h2>
            <button onClick={() => navigate("/history")} className="text-blue-400 hover:underline">
                Back to History
            </button>
        </div>
    );

    if (!report) return null;

    const { structured, analysis } = report.result || {};

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button onClick={() => navigate("/history")} className="text-gray-400 hover:text-white mb-2 flex items-center gap-1 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to History
                    </button>
                    <h1 className="text-3xl font-bold text-white">{report.file}</h1>
                    <p className="text-gray-400 text-sm">Analyzed on {new Date(report.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Analysis Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    Medical Analysis
                </h2>

                <AnalysisDisplay data={analysis} title="Analysis" />
            </section>

            {/* Structured Data Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                    Extracted Data
                </h2>

                <StructuredDisplay data={structured} />
            </section>
        </div>
    );
}

// Helper to display Analysis (JSON or Raw Text)
function AnalysisDisplay({ data }) {
    if (!data) return <div className="text-gray-500 italic">No analysis data available.</div>;

    // Handle "Invalid JSON" case
    if (data.error && data.raw) {
        return (
            <div className="bg-glass backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-yellow-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <span className="font-semibold">Note: The AI response could not be fully structured, but here is the analysis:</span>
                </div>
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {data.raw}
                </div>
            </div>
        );
    }

    // Handle Valid JSON
    return (
        <div className="grid gap-6">
            {/* Summary */}
            {data.summary && (
                <div className="bg-glass backdrop-blur-xl rounded-2xl border border-glassBorder p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                    <p className="text-gray-300 leading-relaxed">{data.summary}</p>
                </div>
            )}

            {/* Abnormal Findings */}
            {data.abnormal_findings && data.abnormal_findings.length > 0 && (
                <div className="bg-glass backdrop-blur-xl rounded-2xl border border-red-500/20 p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-red-300 mb-4">Abnormal Findings / Attention Needed</h3>
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {data.abnormal_findings.map((item, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="font-bold text-white mb-1">{item.test}</div>
                                <div className="text-sm text-red-300 mb-2">Value: {item.value} <span className="text-gray-500">({item.normal_range})</span></div>
                                <div className="text-sm text-gray-300">{item.interpretation}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Advice */}
            <div className="grid md:grid-cols-2 gap-6">
                {data.general_health_advice && (
                    <div className="bg-glass backdrop-blur-xl rounded-2xl border border-glassBorder p-6">
                        <h3 className="text-lg font-semibold text-green-300 mb-2">Health Advice</h3>
                        <p className="text-gray-300 text-sm">{data.general_health_advice}</p>
                    </div>
                )}
                {data.when_to_see_doctor && (
                    <div className="bg-glass backdrop-blur-xl rounded-2xl border border-glassBorder p-6">
                        <h3 className="text-lg font-semibold text-blue-300 mb-2">Recommendation</h3>
                        <p className="text-gray-300 text-sm">{data.when_to_see_doctor}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper to display Structured Data (JSON or Raw Text)
function StructuredDisplay({ data }) {
    if (!data) return <div className="text-gray-500 italic">No extracted data available.</div>;

    if (data.error && data.raw) {
        return (
            <div className="bg-glass backdrop-blur-xl rounded-2xl border border-glassBorder p-6 shadow-lg">
                <p className="text-gray-400 italic mb-2">Raw extracted text:</p>
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap font-mono text-sm">
                    {data.raw}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-glass backdrop-blur-xl rounded-2xl border border-glassBorder p-6 shadow-lg overflow-hidden">
            {/* Meta Info Grid */}
            {data.meta && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-b border-white/10 pb-6">
                    {Object.entries(data.meta).map(([k, v]) => (
                        v && (
                            <div key={k}>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{k.replace("_", " ")}</div>
                                <div className="text-white font-medium truncate" title={v}>{v}</div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Tests Table */}
            {data.tests && data.tests.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-sm border-b border-white/10">
                                <th className="pb-3 pl-2">Test Name</th>
                                <th className="pb-3">Value</th>
                                <th className="pb-3">Unit</th>
                                <th className="pb-3">Ref Range</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.tests.map((t, i) => (
                                <tr key={i} className="text-sm hover:bg-white/5 transition-colors">
                                    <td className="py-3 pl-2 text-white font-medium">{t.name}</td>
                                    <td className="py-3 text-gray-300">{t.value}</td>
                                    <td className="py-3 text-gray-500">{t.unit}</td>
                                    <td className="py-3 text-gray-500">{t.reference_range}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${t.status?.toLowerCase().includes("high") || t.status?.toLowerCase().includes("low") || t.status?.toLowerCase().includes("abnormal")
                                                ? "bg-red-500/20 text-red-300"
                                                : "bg-green-500/20 text-green-300"
                                            }`}>
                                            {t.status || "Normal"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
