// Create category
export const createCategory = async (data) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/categories`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        // console.log("createCategory API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error creating category: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to create category:", error);
        throw error;
    }
};

// Update category
export const putCategory = async (id, data) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/categories/${id}`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log("putCategory API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error updating category: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to update category:", error);
        throw error;
    }
};

// Delete category
export const deleteCategory = async (id) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/categories/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
        });

        const responseData = await response.json();
        console.log("deleteCategory API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error deleting category: ${responseData.error || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error("Failed to delete category:", error);
        throw error;
    }
};
