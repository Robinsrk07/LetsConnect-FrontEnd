
export const validateName = (name) => {
    const namePattern = /^[A-Za-z]+$/; 
    if (!name || name.length < 2) {
        return "First Name must be at least 2 characters long";
    }
    if (!namePattern.test(name)) {
        return "First Name must contain only alphabetic characters.";
    }
    return "";
};



export const validateEmailId = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        return false;
    }
    if (!emailPattern.test(email)) {
        return false;
    }
    return true; // Indicate success explicitly
};



export const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!password) {
        return false;
    }
    if (!passwordPattern.test(password)) {
        return false ;
    }
    return true;
};



export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return "Password does not match.";
    }
    return "";
};

