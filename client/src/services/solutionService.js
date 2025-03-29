// Create a new solution
export const createSolution = async (data) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/solutions`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log("createSolution API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error creating solution: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to create solution:", error);
        throw error;
    }
};

// Get solutions by problem ID
export const getSolutionsByProblemId = async (problemId) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/solutions/problem/${problemId}`;
        const response = await fetch(url, { credentials: "include" });
        const responseData = await response.json();
        console.log("getSolutionsByProblemId API Response:", responseData);
        
        if (!response.ok) {
            throw new Error(`Error fetching solutions: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to fetch solutions:", error);
        throw error;
    }
};

// Update a solution by ID
export const updateSolution = async (solutionId, data) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/solutions/${solutionId}`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log("updateSolution API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error updating solution: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to update solution:", error);
        throw error;
    }
};

// Delete a solution by ID
export const deleteSolution = async (solutionId) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/solutions/${solutionId}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include"
        });
        
        const responseData = await response.json();
        console.log("deleteSolution API Response:", responseData);
        
        if (!response.ok) {
            throw new Error(`Error deleting solution: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to delete solution:", error);
        throw error;
    }
};
