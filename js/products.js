const products = [
  {
    id: "dress-01",
    slug: "womans-long-dress",
    name: "Woman's Long Dress",
    price: 45,
    category: "clothes",
    image: "images/product_1.jpg",
    gallery: [
      "images/product_1.jpg",
      "images/product_1.jpg",
      "images/product_1.jpg"
    ],
    description: "Elegant long dress with a clean silhouette and versatile styling for day or evening wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: true,
    rating: 4,
    badge: "New"
  },
  {
    id: "swimsuit-01",
    slug: "2-piece-swimsuit",
    name: "2 Piece Swimsuit",
    price: 35,
    category: "swimwear",
    image: "images/product_2.jpg",
    gallery: [
      "images/product_image_1.jpg",
      "images/product_image_2.jpg",
      "images/product_image_4.jpg"
    ],
    description: "Two-piece swimsuit with a modern fit and lightweight fabric for comfort and style.",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: true,
    rating: 4,
    badge: "Hot"
  },
  {
    id: "jacket-01",
    slug: "man-blue-jacket",
    name: "Man Blue Jacket",
    price: 145,
    category: "jackets",
    image: "images/product_3.jpg",
    gallery: [
      "images/product_3.jpg",
      "images/product_3.jpg",
      "images/product_3.jpg"
    ],
    description: "Blue jacket designed for a versatile casual look with a structured fit.",
    sizes: ["S", "M", "L", "XL"],
    stock: true,
    rating: 5,
    badge: "Best Seller"
  }
];

function getProductById(productId) {
  return products.find(product => product.id === productId);
}

function getProductBySlug(slug) {
  return products.find(product => product.slug === slug);
}