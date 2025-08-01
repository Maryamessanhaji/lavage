import React from "react";
import { Car, Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            // 1. Supprimer TOUS les tokens et données utilisateur
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userRole");
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");

            // 2. Nettoyer aussi sessionStorage
            sessionStorage.clear();

            // 3. Supprimer les cookies d'authentification (si utilisés)
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // 4. Utiliser window.location.replace au lieu de navigate 
            // pour éviter que l'utilisateur puisse revenir en arrière
            window.location.replace("/auth/login/client");

        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            // Même en cas d'erreur, forcer la redirection
            window.location.replace("/auth/login/client");
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">WashConnectPro</h1>
                            <p className="text-sm text-gray-600">Tableau Client</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                        </button>
                        <button
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Paramètres"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Déconnexion"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;