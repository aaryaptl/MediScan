import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    if (!token) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: "Upload Report", path: "/upload" },
        { name: "History", path: "/history" },
    ];

    return (
        <nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl bg-glass backdrop-blur-md border border-glassBorder shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-2xl tracking-wider">
                            Medi<span className="text-blue-400">Scan</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-transparent ${isActive(link.path)
                                            ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 border-blue-400/30 ring-1 ring-blue-400/50"
                                            : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/10 hover:shadow-md hover:-translate-y-0.5"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-6 w-px bg-white/10 mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-200 border border-red-500/30 hover:from-red-500/30 hover:to-red-600/30 hover:text-white hover:border-red-400/50 transition-all duration-300 shadow-md hover:shadow-red-900/20"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900/90 backdrop-blur-xl rounded-b-2xl border-t border-glassBorder animate-fade-in">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
