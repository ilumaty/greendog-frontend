/* ════════════════════════════════════════
utils/validation.js
════════════════════════════════════════ */

// Validation email
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

// Validation mot de passe (min 6 caractères)
export const validatePassword = (password) => {
    return password && password.length >= 6
}

// Verification force du mot de passe
export const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '' }

    let score = 0

    // Longueur
    if (password.length >= 6) score++
    if (password.length >= 10) score++

    // Caractères spéciaux
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']

    return {
        score,
        label: labels[Math.min(score, labels.length - 1)]
    }
}

// Validation nom (min 2 caractères, lettres uniquement)
export const validateName = (name) => {
    const regex = /^[a-zA-ZÀ-ÿ\s-]{2,}$/
    return regex.test(name)
}

// Validation formulaire complet
export const validateRegisterForm = (data) => {
    const errors = {}

    if (!data.firstName || !validateName(data.firstName)) {
        errors.firstName = 'Prénom invalide (min 2 caractères)'
    }

    if (!data.lastName || !validateName(data.lastName)) {
        errors.lastName = 'Nom invalide (min 2 caractères)'
    }

    if (!data.email || !validateEmail(data.email)) {
        errors.email = 'Email invalide'
    }

    if (!data.password || !validatePassword(data.password)) {
        errors.password = 'Mot de passe trop court (min 6 caractères)'
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

// Validation formulaire de connexion
export const validateLoginForm = (data) => {
    const errors = {}

    if (!data.email || !validateEmail(data.email)) {
        errors.email = 'Email invalide'
    }

    if (!data.password) {
        errors.password = 'Mot de passe requis'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}