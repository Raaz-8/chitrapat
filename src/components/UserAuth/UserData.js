const getUserData = () => {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        const parsedUser = JSON.parse(user);
        
        // Check if necessary properties exist (adjust based on your data structure)
        if (parsedUser && parsedUser.email && parsedUser.name) {
            return parsedUser;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export default getUserData;
