export const validators = {
    email: (email: string): string | null => {
        if (!email) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Formato de email inválido';
        return null;
    },

    password: (password: string): string | null => {
        if (!password) return 'La contraseña es requerida';
        if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return null;
    },

    confirmPassword: (password: string, confirmPassword: string): string | null => {
        if (!confirmPassword) return 'Confirmar contraseña es requerido';
        if (password !== confirmPassword) return 'Las contraseñas no coinciden';
        return null;
    },

    required: (value: string, fieldName: string): string | null => {
        if (!value || value.trim() === '') return `${fieldName} es requerido`;
        return null;
    },

    name: (name: string, fieldName: string): string | null => {
        if (!name) return `${fieldName} es requerido`;
        if (name.length < 2) return `${fieldName} debe tener al menos 2 caracteres`;
        if (name.length > 50) return `${fieldName} no puede tener más de 50 caracteres`;
        return null;
    },

    amount: (amount: string): string | null => {
        if (!amount) return 'El monto es requerido';
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return 'El monto debe ser un número válido';
        if (numAmount <= 0) return 'El monto debe ser mayor que 0';
        if (numAmount > 999999999) return 'El monto no puede ser mayor a 999,999,999';
        return null;
    },

    currency: (currency: string): string | null => {
        if (!currency) return 'La moneda es requerida';
        const validCurrencies = ['USD', 'EUR', 'GBP', 'COP', 'JPY'];
        if (!validCurrencies.includes(currency)) return 'Moneda inválida';
        return null;
    },

    operationType: (type: string): string | null => {
        if (!type) return 'El tipo de operación es requerido';
        if (!['buy', 'sell'].includes(type)) return 'Tipo de operación inválido';
        return null;
    },
};

export const validateLoginForm = (data: { email: string; password: string }) => {
    const errors: Record<string, string> = {};

    const emailError = validators.email(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validators.password(data.password);
    if (passwordError) errors.password = passwordError;

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};

export const validateRegisterForm = (data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}) => {
    const errors: Record<string, string> = {};

    const emailError = validators.email(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validators.password(data.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validators.confirmPassword(data.password, data.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    const firstNameError = validators.name(data.firstName, 'Nombre');
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = validators.name(data.lastName, 'Apellido');
    if (lastNameError) errors.lastName = lastNameError;

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};

export const validateOperationForm = (data: {
    type: string;
    amount: string;
    currency: string;
}) => {
    const errors: Record<string, string> = {};

    const typeError = validators.operationType(data.type);
    if (typeError) errors.type = typeError;

    const amountError = validators.amount(data.amount);
    if (amountError) errors.amount = amountError;

    const currencyError = validators.currency(data.currency);
    if (currencyError) errors.currency = currencyError;

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};