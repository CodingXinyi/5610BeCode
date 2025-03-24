// export const fetchProducts = async (token, requestBody) => {
//     try {
//       const url = `${BASE_URL}/products/search/?page=${requestBody.page}&pageSize=${requestBody.page_size}`;
//       const response = await axios.post(url, requestBody, {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       if (response.data.success) {
//         return response.data.data;
//       } else {
//         throw new Error('Failed to load products. Please try again later.');
//       }
//     } catch (err) {
//       throw new Error('Error fetching products. Please try again later.');
//     }
//   };
  
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
