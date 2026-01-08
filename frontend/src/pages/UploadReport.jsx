import { useState, useContext, useRef } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function UploadReport() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const upload = async () => {
    if (!file) return;

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { token }
      });
      setResult(res.data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
          Upload Medical Report
        </h1>
        <p className="text-gray-400 text-lg">
          Drag and drop your report files here for instant analysis
        </p>
      </div>

      <div className="bg-glass backdrop-blur-xl rounded-3xl shadow-2xl border border-glassBorder p-8 md:p-12 transition-all duration-300">
        {!result ? (
          <div className="space-y-8">
            {/* Drag Zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${dragActive
                  ? "border-blue-400 bg-blue-500/10 scale-[1.02]"
                  : "border-gray-500 hover:border-blue-400 hover:bg-white/5"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf,.jpg,.png,.jpeg"
              />

              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full bg-white/5 ${file ? "text-green-400" : "text-blue-400"}`}>
                  {file ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )}
                </div>

                <div>
                  {file ? (
                    <>
                      <p className="text-xl font-semibold text-white mb-1">{file.name}</p>
                      <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-semibold text-white mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PDF, JPG, or PNG (MAX. 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Button */}
            {file && (
              <div className="flex justify-center animate-fade-in">
                <button
                  onClick={upload}
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-1 ${loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </div>
                  ) : "Analyze Report"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Analysis Result</h2>
              <button
                onClick={reset}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Analyze another
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 overflow-x-auto">
              <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
