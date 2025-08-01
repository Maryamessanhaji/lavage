import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerProduct } from '../../api/productApi';

import { User, Package, ArrowLeft, Lock, Phone, Mail } from 'lucide-react';

const productRegistrationForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'product' // Ajout du rôle par défaut
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) newErrors.name = 'Le nom est requis';
        if (!formData.email?.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }
        if (!formData.password?.trim()) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Minimum 6 caractères';
        }
        if (!formData.phone?.trim()) {
            newErrors.phone = 'Le téléphone est requis';
        } else if (!/^(\+212|0)[5-7]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Format de téléphone invalide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // e.preventDefault();
        // Validation finale avant soumission
        if (!validateForm()) {
            console.log('Validation failed', errors);
            return;
        }

        setIsLoading(true);
        console.log('Données envoyées au backend:', formData);

        try {
            // Appel à l'API pour enregistrer le product
            const response = await registerProduct(formData);
            console.log('Inscription réussie:', response);
            // Stocker le token si nécessaire
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', 'product');
            }
            // Afficher un message de succès
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');

            // Redirection vers la page de connexion
            navigate('/auth/login/product', {
                state: {
                    email: formData.email,
                    message: 'Inscription réussie ! Veuillez vous connecter.'
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            // Gestion des erreurs spécifiques
            if (error.response?.data?.message) {
                if (error.response.data.message.includes('email')) {
                    setErrors({ email: 'Cet email est déjà utilisé' });
                } else {
                    alert('Erreur: ' + error.response.data.message);
                }
            } else {
                alert('Erreur lors de l\'inscription. Veuillez réessayer.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/auth'); // ou la route de votre sélecteur de profil
    };

    return (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                            disabled={isLoading}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à la sélection
                        </button>

                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription de Fornisseur de produit</h1>
                        <p className="text-gray-600">Créez votre compte Fornisseur</p>
                    </div>

                    {/* Form */}
                    <form className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Nom du responsable *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Votre nom complet"
                                        disabled={isLoading}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="+212 5XX XXX XXX"
                                    // disabled={isLoading}
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email professionnel *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="contact@Fornisseur.com"
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Lock className="w-4 h-4 inline mr-2" />
                                    Mot de passe *
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Minimum 6 caractères"
                                // disabled={isLoading}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-purple-700">
                                    <Package className="w-4 h-4 inline mr-2" />
                                    En tant que Fournisseur de produit, vous pourrez ajouter vos produits et gérer votre catalogue après inscription.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`px-8 py-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-purple-700'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Création en cours...
                                    </>
                                ) : (
                                    'Créer mon compte Fornisseur'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default productRegistrationForm;