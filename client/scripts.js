document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for the logout button
    document.getElementById('logoutButton').addEventListener('click', async function () {
        const userId = localStorage.getItem("userId");
        const authToken = localStorage.getItem("authToken");

        if (!authToken || !userId) {
            categoryMessageElement.innerText = "Unauthorized, please login.";
            return;
        }
        try {
            const response = await fetch('https://home-mate-server-ekkv.onrender.com/api/logout', {
                method: 'POST',
                credentials: 'include', // Ensures cookies are sent with the request
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (response.ok) {
                Swal.fire({
                    title: "Logout successful"
                });
                // Clear user data from local storage
                localStorage.removeItem("userId");
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");

                // Redirect to the login page or display a message
                window.location.href = "./index.html";
            } else {
                console.error("Logout failed.");
                Swal.fire({
                    icon: "error",
                    title: "Logout Failed",
                    text: "Please try again.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        }
    });
    const categoryMessageElement = document.getElementById("categoryMessage");

    const userData = JSON.parse(localStorage.getItem("userData"));

    // Add category form submit
    // document.getElementById("CategoryForm").addEventListener("submit", async function (e) {
    //     e.preventDefault();
    
    //     const CategoryName = document.getElementById("CategoryName").value.trim();
    //     const recoverCategory = document.getElementById("recoveryOption");
    //     const recoveryButton = document.getElementById("recoveryButton");
    
    //     if (!CategoryName) {
    //         categoryMessageElement.innerText = "Please enter a category name.";
    //         return;
    //     }
    
    //     const requestBody = { name: CategoryName };
    //     const userId = localStorage.getItem("userId");
    //     const authToken = localStorage.getItem("authToken");
    
    //     if (!authToken || !userId) {
    //         categoryMessageElement.innerText = "Unauthorized, please login.";
    //         return;
    //     }
    
    //     try {
    //         // Check if category already exists
    //         const response = await fetch(
    //             `https://home-mate-server-ekkv.onrender.com/api/v1/user/${userId}/category`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     'Authorization': `Bearer ${authToken}`,
    //                 },
    //                 credentials: 'include',
    //             }
    //         );
    
    //         const result = await response.json();
    
    //         if (response.ok && result.option === "recovery") {
    //             // Category exists but is deleted - provide recovery option
    //             // categoryMessageElement.textContent = result.message || "Category exists and can be recovered.";
    //             // recoverCategory.style.display = "block";
    //                 await recovery(result._id); // Call recovery function
    
    //         } else if (response.ok && !result.category) {
    //             // Category does not exist - proceed to create a new one
    //             await createCategory(CategoryName);
    //         } else if (response.status === 409) {
    //             // Conflict - category exists and cannot be recovered
    //             categoryMessageElement.textContent = result.message || "Category already exists.";
    //             recoverCategory.style.display = "none";
    //         } else {
    //             categoryMessageElement.textContent = result.message || "Error checking category.";
    //         }
    //     } catch (error) {
    //         categoryMessageElement.innerText = "Error occurred: " + error.message;
    //     }
    // });
    
    // async function createCategory(CategoryName) {
    //     const userId = localStorage.getItem("userId");
    //     const authToken = localStorage.getItem("authToken");
    //     const requestBody = { name: CategoryName };
    
    //     try {
    //         const response = await fetch(
    //             `https://home-mate-server-ekkv.onrender.com/api/v1/admin/user/${userId}/category`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${authToken}`,
    //                 },
    //                 body: JSON.stringify(requestBody),
    //                 credentials: 'include',
    //             }
    //         );
    
    //         const result = await response.json();
    
    //         if (response.status === 201) {
    //             // Successfully created a new category
    //             categoryMessageElement.textContent = "Category created successfully!";
    //             recoverCategory.style.display = "none";
    
    //             // Update UI
    //             const newCategory = document.createElement("li");
    //             newCategory.id = result._id;
    //             newCategory.innerText = result.name;
    //             newCategory.className = "list-group-item d-flex justify-content-between align-items-center";
    //             newCategory.style.cursor = "pointer";
    
    //             const deleteButton = document.createElement("button");
    //             deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    //             deleteButton.className = "btn btn-danger btn-sm";
    //             deleteButton.onclick = (e) => {
    //                 e.stopPropagation();
    //                 deleteCategorybyID(result._id);
    //             };
    
    //             newCategory.appendChild(deleteButton);
    //             document.getElementById("CategoryList").appendChild(newCategory);
    
    //             document.getElementById("CategoryForm").reset();
    //             const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
    //             if (modal) modal.hide();
    
    //             fetchCategories(); // Refresh the list
    //         } else {
    //             categoryMessageElement.textContent = result.message || "Failed to create category.";
    //         }
    //         setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
    //     } catch (error) {
    //         categoryMessageElement.innerText = "Error occurred: " + error.message;
    //         setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
    //     }
    // }
    
    // async function recovery(categoryId) {
    //     const userId = localStorage.getItem("userId");
    //     const authToken = localStorage.getItem("authToken");
    
    //     if (!userId || !authToken) {
    //         console.error("User ID or auth token is undefined. Redirecting to login.");
    //         window.location.href = "./index.html";
    //         return;
    //     }
    
    //     try {
    //         const recover = await fetch(
    //             `https://home-mate-server-ekkv.onrender.com/api/v1/user/${userId}/category/${categoryId}/recover`,
    //             {
    //                 method: "PATCH",
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${authToken}`,
    //                 },
    //                 credentials: "include",
    //             }
    //         );
    
    //         const data = await recover.json();
    
    //         if (recover.status === 200) {
    //             categoryMessageElement.textContent = data.message || "Category recovered successfully!";
    //             document.getElementById("recoveryOption").style.display = "none";
    //             fetchCategories(); // Refresh the list
    //         } else {
    //             categoryMessageElement.textContent = data.message || "Recovery failed. Create a new category.";
    //         }
    //         setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
    //     } catch (error) {
    //         categoryMessageElement.innerText = "Error occurred: " + error.message;
    //         setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
    //     }
    // }
    
    document.getElementById("CategoryForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const CategoryName = document.getElementById("CategoryName").value.trim();
        if (!CategoryName) {
            categoryMessageElement.innerText = "Please enter a category name.";
            return;
        }

        const requestBody = { name: CategoryName };
        const userId = localStorage.getItem("userId");
        const authToken = localStorage.getItem("authToken");

        if (!authToken || !userId) {
            categoryMessageElement.innerText = "Unauthorized, please login.";
            return;
        }

        try {
            const response = await fetch(`https://home-mate-server-ekkv.onrender.com/api/v1/admin/user/${userId}/category`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                // Update the UI with the new category
                const newCategory = document.createElement('li');
                newCategory.id = result._id;
                newCategory.innerText = result.name;
                newCategory.className = 'list-group-item d-flex justify-content-between align-items-center';
                newCategory.style.cursor = 'pointer';

                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.onclick = (e) => {
                    e.stopPropagation();
                    deleteCategorybyID(result._id);
                };

                newCategory.appendChild(deleteButton);
                document.getElementById('CategoryList').appendChild(newCategory);

                categoryMessageElement.innerText = "Category created successfully!";
                document.getElementById("CategoryForm").reset();

                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (modal) modal.hide();

                setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
                fetchCategories();
            } else {
                categoryMessageElement.innerText = result.message || "Failed to create category.";
            }
        } catch (error) {
            categoryMessageElement.innerText = "Error occurred: " + error.message;
        }
    });
    
    // Fetch and display categories
    async function fetchCategories() {
        const userId = localStorage.getItem("userId");
        const authToken = localStorage.getItem("authToken");

        if (!userId || !authToken) {
            console.error("User ID or auth token is undefined. Redirecting to login.");
            window.location.href = "./index.html";
            return;
        }

        try {
            const response = await fetch(`https://home-mate-server-ekkv.onrender.com/api/v1/user/${userId}/category`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                categoryMessageElement.innerText = errorText;
                return;
            }

            const categories = await response.json();
            const CategoryList = document.getElementById('CategoryList');
            CategoryList.innerHTML = '';

            categories.forEach(category => {
                const newCategory = document.createElement('li');
                newCategory.id = category._id;
                newCategory.className = 'list-group-item d-flex justify-content-between align-items-center';
                newCategory.style.cursor = 'pointer';

                // Container for count and name
                const countAndNameContainer = document.createElement('div');
                countAndNameContainer.className = 'd-flex align-items-center';

                // Create badge for incomplete item count
                const incompleteCountSpan = document.createElement('span');
                incompleteCountSpan.className = 'badge bg-danger rounded-pill me-2';
                incompleteCountSpan.innerText = 'Loading...';

                // Fetch and display incomplete item count
                fetchIncompleteItemCount(category._id).then(incompleteCount => {
                    incompleteCountSpan.innerText = incompleteCount > 0 ? incompleteCount : '';
                });

                // Create span for category name
                const categoryNameSpan = document.createElement('span');
                categoryNameSpan.innerText = category.name;

                // Add count and name to the container
                countAndNameContainer.appendChild(incompleteCountSpan); // Incomplete item count
                countAndNameContainer.appendChild(categoryNameSpan);     // Category name

                // Set click event to navigate to category page
                newCategory.addEventListener('click', () => {
                    window.location.href = `categories.html?categoryId=${category._id}`;
                });

                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.onclick = (e) => {
                    e.stopPropagation();
                    deleteCategorybyID(category._id);
                };

                // Append elements in the correct order
                newCategory.appendChild(countAndNameContainer); // Left-aligned count and name
                newCategory.appendChild(deleteButton);          // Right-aligned delete button

                CategoryList.appendChild(newCategory);
            });
            setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
        } catch (error) {
            console.error('Error fetching categories:', error);
            categoryMessageElement.innerText = "An error occurred while fetching categories.";
            setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
        }
    }

    // Helper function to fetch incomplete item count for a category
    async function fetchIncompleteItemCount(categoryId) {
        const userId = localStorage.getItem("userId");
        const authToken = localStorage.getItem("authToken");

        if (!userId || !authToken) {
            console.error("User ID or auth token is missing.");
            return 0;
        }

        try {
            const response = await fetch(`https://home-mate-server-ekkv.onrender.com/api/v1/user/${userId}/category/${categoryId}/item`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) {
                categoryMessageElement.innerText = "Unauthorized, please login!";
                return 0;
            }

            const data = await response.json();
            const items = data.items || [];
            const incompleteItems = items.filter(item => !item.workFinish);
            return incompleteItems.length;
        } catch (error) {
            console.error('Error fetching incomplete item count:', error);
            return 0;
        }
    }

    // Delete category by ID
    async function deleteCategorybyID(categoryId) {
        // Replace confirm dialog with SweetAlert and include an input field
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Type "DELETE" to confirm the deletion of this category.',
            icon: 'warning',
            input: 'text', // Input field to type "DELETE"
            inputPlaceholder: 'Type "DELETE" to confirm',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true
        });
    
        // Check if the user confirmed the action and typed "DELETE"
        if (!result.isConfirmed || result.value.toLowerCase() !== 'delete') {
            if (result.isDismissed) {
                categoryMessageElement.innerText = 'Category deletion canceled.';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You must type "DELETE" to confirm.',
                });
            }
            return; // Exit the function if the user cancels or does not type "DELETE"
        }
    
        const userId = localStorage.getItem("userId");
        const authToken = localStorage.getItem("authToken");
    
        if (!userId || !authToken) {
            console.error("User ID or auth token is undefined. Redirecting to login.");
            window.location.href = "./index.html";
            return;
        }
    
        try {
            const response = await fetch(`https://home-mate-server-ekkv.onrender.com/api/v1/user/${userId}/category/${categoryId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
    
            if (response.ok) {
                const categoryElement = document.getElementById(categoryId);
                if (categoryElement) categoryElement.remove();
                categoryMessageElement.innerText = 'Category deleted successfully!';
                setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
            } else {
                categoryMessageElement.innerText = 'Failed to delete category.';
            }
            setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
        } catch (error) {
            categoryMessageElement.innerText = `Error deleting category: ${error.message}`;
            setTimeout(() => { categoryMessageElement.innerText = ''; }, 3000);
        }
    }
    
    fetchCategories();
});
