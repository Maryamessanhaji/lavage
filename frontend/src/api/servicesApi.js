const API_URL = 'http://localhost:3000/api/services';

// ✅ Fonction pour générer les headers dynamiquement
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const toggleServiceStatus = async (id) => {
    const res = await fetch(`${API_URL}/${id}/toggle-status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors du changement de statut');
    }

    return res.json();
};

// 🔁 Lire tous les services du prestataire
export const fetchServices = async () => {
    const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des services');
    return res.json();
};

// ➕ Créer un service
export const createService = async (service) => {
    console.log('Service envoyé:', service);  // debug

    // ✅ Assurez-vous que isActive est un booléen
    const serviceData = {
        ...service,
        isActive: typeof service.isActive === 'boolean' ? service.isActive : true
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData),
    });
    if (!res.ok) {
        const error = await res.json();
        console.error('Erreur backend createService:', JSON.stringify(error, null, 2));
        throw new Error(error.message || 'Erreur lors de la création du service');
    }
    return res.json();
};

// 🖊️ Modifier un service
export const updateService = async (id, service) => {

    // ✅ Assurez-vous que isActive est un booléen
    const serviceData = {
        ...service,
        isActive: typeof service.isActive === 'boolean' ? service.isActive : true
    };

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la modification du service');
    }
    return res.json();
};

// ❌ Supprimer un service
export const deleteService = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la suppression du service');
    }
    return res.json();
};