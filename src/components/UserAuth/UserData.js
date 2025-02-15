const getUserData = () => {
    const user = localStorage.getItem("user");

    if (!user) {
        console.warn("No user data found in localStorage");
        return null;
    }

    try {
        const parsedUser = JSON.parse(user);
        
        // Check if necessary properties exist (adjust based on your data structure)
        if (parsedUser && parsedUser.email && parsedUser.name) {
            return parsedUser;
        } else {
            console.warn("User data is missing required fields");
            return null;
        }
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
    }
};

export default getUserData;
