// Fetch LeetCode problem details from your backend
export const getLeetCodeProblemData = async (slug) => {
    try {
        // Assuming your backend is set up to handle this route
        const url = `${process.env.REACT_APP_API_URL}/leetcode/${slug}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();
        console.log("LeetCode problem details from backend:", responseData);

        if (!response.ok) {
            throw new Error(`Error fetching problem details: ${responseData.error || response.statusText}`);
        }

        return responseData;
        
    } catch (error) {
        console.error("Failed to fetch problem details:", error);
        throw error;
    }
};
