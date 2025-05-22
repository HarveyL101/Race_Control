export async function fetchCurrentUser() {
    try {
        const response = await fetch('/api/current-user', {
            credentials: 'include'
        });

        const data = await response.json();

        console.log("user details: ", data);
        
        return {
            id: data.id,
            username: data.username
        };
    } catch (error) {
        console.error("Failed to fetch user details: ", error);
    }
}