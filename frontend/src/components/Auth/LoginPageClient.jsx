import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Car, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { loginClient } from '../../api/ClientApi';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = React.useState({});
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loginStatus, setLoginStatus] = React.useState(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setLoginStatus(null);
        try {
            const result = await loginClient(formData);
            setLoginStatus('success');
            localStorage.setItem('token', result.token);

            let userData = {};
            let dashboardPath = '/dashboard';

            if (result.client) {
                userData = { ...result.client, role: 'client' };
                dashboardPath = '/dashboard/client';
                // ✅ Sauvegarder les données client pour le BookingModal
                localStorage.setItem('clientId', result.client._id);
                localStorage.setItem('clientData', JSON.stringify({
                    name: result.client.name,
                    phone: result.client.phone,
                    email: result.client.email
                }));
            } else if (result.provider) {
                userData = { ...result.provider, role: 'provider' };
                dashboardPath = '/dashboard/provider';
            } else if (result.product) {
                userData = { ...result.product, role: 'product' };
                dashboardPath = '/dashboard/product';
            } else {
                throw new Error('Type d\'utilisateur non reconnu');
            }

            localStorage.setItem('user', JSON.stringify(userData));
            // ✅ Vérifier s'il y a une réservation en attente
            const pendingBooking = localStorage.getItem('pendingBooking');

            setTimeout(() => {
                if (pendingBooking) {
                    // Revenir à la page où était le BookingModal
                    // Vous pouvez aussi sauvegarder l'URL précédente
                    const previousUrl = localStorage.getItem('previousUrl') || '/';
                    navigate(previousUrl);
                } else {
                    // Redirection normale vers le dashboard
                    navigate(dashboardPath);
                }
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            setLoginStatus('error');
            let errorMessage = 'Erreur lors de la connexion';
            if (error.response?.status === 401) {
                errorMessage = 'Email ou mot de passe incorrect';
            } else if (error.response?.status === 404) {
                errorMessage = 'Aucun compte trouvé avec cet email';
            } else if (error.message) {
                errorMessage = error.message;
            }
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        alert('Fonctionnalité de récupération de mot de passe - À implémenter');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">

                {/* Bouton retour vers choix profil */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/auth')}
                        aria-label="Retour à choix profil"
                        className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-8"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Router
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion Client</h1>
                    <p className="text-gray-600">Accédez à votre espace client</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {loginStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-green-700">Connexion réussie ! {localStorage.getItem('pendingBooking')
                                ? ' Retour à votre réservation...'
                                : ' Redirection vers le dashboard...'}</span>
                        </div>
                    )}

                    {loginStatus === 'error' && errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                            <span className="text-red-700">{errors.general}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Adresse email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="votre@email.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Votre mot de passe"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                disabled={isLoading}
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Vous n'avez pas encore de compte ?{' '}
                        <button
                            onClick={() => navigate('/auth/register/client')}
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                        >
                            Créer un compte client
                        </button>
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <Car className="w-6 h-6 text-green-500 mr-2" />
                        <span className="text-sm text-green-700 font-medium">Espace Client</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;