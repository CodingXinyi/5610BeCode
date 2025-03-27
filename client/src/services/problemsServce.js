// Fetch problems by category and update state
export const getProblemsByCategory = async (categoryId) => {
    try {
        const url =  `${process.env.REACT_APP_API_URL}/problems/category/${categoryId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error fetching problems: ${response.statusText}`);
        }
        
        const problems = await response.json();
        return problems;
    } catch (error) {
        console.error("Failed to fetch problems:", error);
    }
};

// Function to add or update a problem in the category map
export const addOrUpdateProblemToCategoryMap = (newProblem, problemsByCategory, setProblemsByCategory, setOpenProblemDialog) => {
    const updatedProblems = (problemsByCategory[newProblem.categoryId] || []).map(problem => 
        problem.id === newProblem.id ? newProblem : problem
    );

    if (!updatedProblems.find(problem => problem.id === newProblem.id)) {
        updatedProblems.push(newProblem);
    }

    const updatedProblemsByCategory = {
        ...problemsByCategory,
        [newProblem.categoryId]: updatedProblems,
    };

    setProblemsByCategory(updatedProblemsByCategory);
    setOpenProblemDialog(false);
};



// insert problems 
export const postProblems = async (data) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/problems`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log("postProblems API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error creating problem: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to create problem:", error);
        throw error;
    }
};


// update problem
export const putProblems = async (id, data) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/problems/${id}`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log("putProblems API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error updating problem: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to update problem:", error);
        throw error;
    }
};


// delete problem
export const deleteProblems = async (problemId) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/problems/${problemId}`; // Send ID in the URL
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        const responseData = await response.json();
        console.log("deleteProblems API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error deleting problem: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to delete problem:", error);
        throw error;
    }
};


