const products = [
  {
    id: 1,
    image: "./images/products/burger.png",
    title: "Burger1",
    description: "Enjoy the crispy chicken fillet in a soft bun with spicy mayo and our signature sauce",
    price: 100,
    category: "Burger",
    rating: 5,
  },
  {
    id: 2,
    image: "./images/products/shawarma.jpg",
    title: "Shawarma1",
    description: "Aromatic arabian rice with 6 packs of hot shots with KFC famous vietnamese sauce",
    price: 200,
    category: "Shawarma",
    rating: 4,
  },
  {
    id: 3,
    image: "./images/products/piz.jpg",
    title: "Pizza1",
    description: "Crispy zinger with crispy rolled into paratha",
    price: 300,
    category: "Pizza",
    rating: 3,
  },
  {
    id: 4,
    image: "./images/products/burger.png",
    title: "Burger2",
    description: "Enjoy the crispy chicken fillet in a soft bun with spicy mayo and our signature sauce",
    price: 400,
    category: "Burger",
    rating: 2,
  },
  {
    id: 5,
    image: "./images/products/shawarma.jpg",
    title: "Shawarma2",
    description: "Aromatic arabian rice with 6 packs of hot shots with KFC famous vietnamese sauce",
    price: 500,
    category: "Shawarma",
    rating: 1,
  },
  {
    id: 6,
    image: "./images/products/piz.jpg",
    title: "Pizza2",
    description: "Crispy zinger with crispy rolled into paratha",
    price: 600,
    category: "Pizza",
    rating: 5,
  },
  {
    id: 7,
    image: "./images/products/burger.png",
    title: "Burger3",
    description: "Enjoy the crispy chicken fillet in a soft bun with spicy mayo and our signature sauce",
    price: 700,
    category: "Burger",
    rating: 4,
  },
  {
    id: 8,
    image: "./images/products/shawarma.jpg",
    title: "Shawarma3",
    description: "Aromatic arabian rice with 6 packs of hot shots with KFC famous vietnamese sauce",
    price: 800,
    category: "Shawarma",
    rating: 3,
  },
  {
    id: 9,
    image: "./images/products/piz.jpg",
    title: "Pizza3",
    description: "Crispy zinger with crispy rolled into paratha",
    price: 900,
    category: "Pizza",
    rating: 2,
  },
  {
    id: 10,
    image: "./images/products/burger.png",
    title: "Burger4",
    description: "Enjoy the crispy chicken fillet in a soft bun with spicy mayo and our signature sauce",
    price: 900,
    category: "Burger",
    rating: 3,
  },
];

// State
let state = {
  selectedCategories: [],
  selectedRating: null,
  priceMin: 0,
  priceMax: 1000,
  sortBy: "PriceHighToLow",
  searchQuery: "",
  currentPage: 1,
  itemsPerPage: 6,
};

// DOM Elements
const categoryFilterEl = document.getElementById("categoryFilter");
const productsGridEl = document.getElementById("productsGrid");
const ratingFilterEl = document.getElementById("ratingFilter");
const sortingEl = document.getElementById("val");
const filterChipsEl = document.getElementById("filterChips");
const clearAllEl = document.getElementById("clearAll");
const searchInputEl = document.getElementById("searchInput");
const priceMinEl = document.getElementById("priceMin");
const priceMaxEl = document.getElementById("maxPrice");
const minPriceLabelEl = document.getElementById("minPrice");
const maxPriceLabelEl = document.getElementById("maxPrice");
const prevPageEl = document.getElementById("prevPage");
const nextPageEl = document.getElementById("nextPage");
const pageNumbersEl = document.getElementById("pageNumbers");
const loadingEl = document.getElementById("loading");

// Categories
const categories = [
  { id: 1, title: "Burger", image: "" },
  { id: 2, title: "Shawarma", image: "" },
  { id: 3, title: "Pizza", image: "" },
];
const categoryTitles = categories.map((category) => category.title);

// Initialize price range
const findRange = () => {
  let min = Math.min(...products.map((p) => p.price));
  let max = Math.max(...products.map((p) => p.price));
  return { min, max };
};
const priceRange = findRange();
priceMinEl.max = priceRange.max;
priceMaxEl.max = priceRange.max;
priceMaxEl.value = priceRange.max;
minPriceLabelEl.textContent = `$${state.priceMin}`;
maxPriceLabelEl.textContent = `$${state.priceMax}`;

// URL State Management
const updateURL = () => {
  const params = new URLSearchParams();
  if (state.selectedCategories.length) params.set("categories", state.selectedCategories.join(","));
  if (state.selectedRating) params.set("rating", state.selectedRating);
  if (state.priceMin !== 0) params.set("priceMin", state.priceMin);
  if (state.priceMax !== priceRange.max) params.set("priceMax", state.priceMax);
  if (state.sortBy !== "PriceHighToLow") params.set("sortBy", state.sortBy);
  if (state.searchQuery) params.set("search", state.searchQuery);
  if (state.currentPage !== 1) params.set("page", state.currentPage);
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
};

const loadStateFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  state.selectedCategories = params.get("categories")?.split(",") || [];
  state.selectedRating = params.get("rating") ? parseInt(params.get("rating")) : null;
  state.priceMin = params.get("priceMin") ? parseInt(params.get("priceMin")) : 0;
  state.priceMax = params.get("priceMax") ? parseInt(params.get("priceMax")) : priceRange.max;
  state.sortBy = params.get("sortBy") || "PriceHighToLow";
  state.searchQuery = params.get("search") || "";
  state.currentPage = params.get("page") ? parseInt(params.get("page")) : 1;
  // Update UI
  priceMinEl.value = state.priceMin;
  priceMaxEl.value = state.priceMax;
  minPriceLabelEl.textContent = `$${state.priceMin}`;
  maxPriceLabelEl.textContent = `$${state.priceMax}`;
  sortingEl.value = state.sortBy;
  searchInputEl.value = state.searchQuery;
};

// Event Listeners
sortingEl.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  state.currentPage = 1;
  updateURL();
  render();
});

searchInputEl.addEventListener("input", (e) => {
  state.searchQuery = e.target.value.trim().toLowerCase();
  state.currentPage = 1;
  updateURL();
  render();
});

priceMinEl.addEventListener("input", (e) => {
  state.priceMin = parseInt(e.target.value);
  minPriceLabelEl.textContent = `$${state.priceMin}`;
  state.currentPage = 1;
  updateURL();
  render();
});

priceMaxEl.addEventListener("input", (e) => {
  state.priceMax = parseInt(e.target.value);
  maxPriceLabelEl.textContent = `$${state.priceMax}`;
  state.currentPage = 1;
  updateURL();
  render();
});

clearAllEl.addEventListener("click", () => {
  state.selectedCategories = [];
  state.selectedRating = null;
  state.priceMin = 0;
  state.priceMax = priceRange.max;
  state.searchQuery = "";
  state.currentPage = 1;
  priceMinEl.value = state.priceMin;
  priceMaxEl.value = state.priceMax;
  minPriceLabelEl.textContent = `$${state.priceMin}`;
  maxPriceLabelEl.textContent = `$${state.priceMax}`;
  searchInputEl.value = "";
  updateURL();
  render();
});

prevPageEl.addEventListener("click", () => {
  if (state.currentPage > 1) {
    state.currentPage--;
    updateURL();
    render();
  }
});

nextPageEl.addEventListener("click", () => {
  const totalPages = Math.ceil(getFilteredProducts().length / state.itemsPerPage);
  if (state.currentPage < totalPages) {
    state.currentPage++;
    updateURL();
    render();
  }
});

// Filter Handlers
const onChangeCategory = (category, isChecked) => {
  if (isChecked) {
    state.selectedCategories.push(category);
  } else {
    state.selectedCategories = state.selectedCategories.filter((cat) => cat !== category);
  }
  state.currentPage = 1;
  updateURL();
  render();
};

const onChangeRatingHandler = (rating) => {
  state.selectedRating = state.selectedRating === rating ? null : rating;
  state.currentPage = 1;
  updateURL();
  render();
};

// Filtering and Sorting
const getFilteredProducts = () => {
  let filteredProducts = [...products];

  if (state.selectedCategories.length) {
    filteredProducts = filteredProducts.filter((product) =>
      state.selectedCategories.includes(product.category)
    );
  }

  if (state.selectedRating !== null) {
    filteredProducts = filteredProducts.filter((product) => product.rating >= state.selectedRating);
  }

  if (state.priceMin !== 0 || state.priceMax !== priceRange.max) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= state.priceMin && product.price <= state.priceMax
    );
  }

  if (state.searchQuery) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(state.searchQuery) ||
      product.description.toLowerCase().includes(state.searchQuery)
    );
  }

  // Sorting
  filteredProducts.sort((a, b) => {
    if (state.sortBy === "PriceHighToLow") return b.price - a.price;
    if (state.sortBy === "PriceLowToHigh") return a.price - b.price;
    if (state.sortBy === "RatingHighToLow") return b.rating - a.rating;
    if (state.sortBy === "RatingLowToHigh") return a.rating - b.rating;
    return 0;
  });

  return filteredProducts;
};

// Rendering Functions
const renderCategories = () => {
  categoryFilterEl.innerHTML = categoryTitles
    .map(
      (category) => `
        <div class="relative flex items-center">
            <div class="flex items-center h-5">
                <input 
                    type="checkbox"
                    class="w-4 h-4 rounded cursor-pointer"
                    ${state.selectedCategories.includes(category) ? "checked" : ""}
                    onchange="onChangeCategory('${category}', this.checked)"
                />
            </div>
            <label class="ml-3 text-md text-white cursor-pointer font-medium">
                ${category}
            </label>
        </div>
      `
    )
    .join("");
};

const renderRatingFilter = () => {
  ratingFilterEl.innerHTML = [5, 4, 3, 2, 1]
    .map(
      (rating) => `
        <div class="flex items-center gap-2 cursor-pointer" onclick="onChangeRatingHandler(${rating})">
            <div class="flex justify-start">
                ${Array(5)
                  .fill()
                  .map(
                    (_, i) => `
                    <svg
                        aria-hidden="true"
                        class="w-5 h-5 ${
                          i < rating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-500"
                        } ${rating === state.selectedRating ? "!text-[#ff3d47]" : ""}"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `
                  )
                  .join("")}
            </div>
            <p class="text-gray-400">
                ${rating === 5 ? "5.0" : rating.toFixed(1) + " +"}
            </p>
        </div>
      `
    )
    .join("");
};

const renderProducts = () => {
  const filteredProducts = getFilteredProducts();
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);

  productsGridEl.innerHTML = paginatedProducts
    .map(
      (product) => `
        <div class="col-span-3">
            <div class="rounded-2xl shadow-lg bg-[#1B1B1B]">
                <div class="flex flex-col">
                    <img
                        src="${product.image}"
                        alt="${product.title}"
                        class="object-cover rounded-t-2xl z-[1] opacity-90 hover:opacity-100 transition-opacity w-full h-[250px]"
                    />
                    <div class="relative p-3 space-y-2 h-48 text-white">
                        <h1 class="font-medium text-2xl">${product.title}</h1>
                        <div class="flex items-center gap-2">
                            <div class="flex justify-start">
                                ${Array(5)
                                  .fill()
                                  .map(
                                    (_, i) => `
                                    <svg
                                        aria-hidden="true"
                                        class="w-5 h-5 ${
                                          i < product.rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                  `
                                  )
                                  .join("")}
                            </div>
                            (${product.rating})
                        </div>
                        <p class="max-h-24 overflow-auto">${product.description}</p>
                        <div class="absolute bottom-2 w-full flex justify-between items-center pr-6">
                            <span class="text-white text-xl">$${product.price}</span>
                            <button class="hover:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `
    )
    .join("") || "<p class='col-span-12 text-center'>No products found.</p>";

  // Render Pagination
  const totalPages = Math.ceil(filteredProducts.length / state.itemsPerPage);
  pageNumbersEl.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(
      (page) => `
        <button class="p-2 ${page === state.currentPage ? "bg-[#ff3d47]" : "bg-slate-600"} rounded" onclick="state.currentPage=${page};updateURL();render();">${page}</button>
      `
    )
    .join("");
  prevPageEl.disabled = state.currentPage === 1;
  nextPageEl.disabled = state.currentPage === totalPages;
};

const renderFilterChips = () => {
  const chips = [];
  state.selectedCategories.forEach((category) => {
    chips.push({
      label: category,
      onRemove: () => {
        state.selectedCategories = state.selectedCategories.filter((cat) => cat !== category);
        state.currentPage = 1;
        updateURL();
        render();
      },
    });
  });
  if (state.selectedRating !== null) {
    chips.push({
      label: `${state.selectedRating}+ Rating`,
      onRemove: () => {
        state.selectedRating = null;
        state.currentPage = 1;
        updateURL();
        render();
      },
    });
  }
  if (state.priceMin !== 0 || state.priceMax !== priceRange.max) {
    chips.push({
      label: `$${state.priceMin} - $${state.priceMax}`,
      onRemove: () => {
        state.priceMin = 0;
        state.priceMax = priceRange.max;
        priceMinEl.value = state.priceMin;
        priceMaxEl.value = state.priceMax;
        minPriceLabelEl.textContent = `$${state.priceMin}`;
        maxPriceLabelEl.textContent = `$${state.priceMax}`;
        state.currentPage = 1;
        updateURL();
        render();
      },
    });
  }
  if (state.searchQuery) {
    chips.push({
      label: `Search: ${state.searchQuery}`,
      onRemove: () => {
        state.searchQuery = "";
        searchInputEl.value = "";
        state.currentPage = 1;
        updateURL();
        render();
      },
    });
  }

  filterChipsEl.innerHTML = chips
    .map(
      (chip, index) => `
        <button class="filter-chip text-sm p-1.5 rounded-lg bg-white text-black border-slate-600 border-2" onclick="filterChips[${index}].onRemove()">
            ${chip.label} <i class="fa-solid fa-xmark"></i>
        </button>
      `
    )
    .join("");
  clearAllEl.classList.toggle("hidden", chips.length === 0);
};

// Main Render Function
const render = () => {
  loadingEl.style.display = "block";
  setTimeout(() => {
    renderCategories();
    renderRatingFilter();
    renderProducts();
    renderFilterChips();
    loadingEl.style.display = "none";
  }, 500); // Simulate loading
};

// Initialize
loadStateFromURL();
render();