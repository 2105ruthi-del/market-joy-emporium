import iphone from "@/assets/products/iphone.jpg";
import headphones from "@/assets/products/headphones.jpg";
import jacket from "@/assets/products/jacket.jpg";
import shoes from "@/assets/products/shoes.jpg";
import apples from "@/assets/products/apples.jpg";
import honey from "@/assets/products/honey.jpg";
import sofa from "@/assets/products/sofa.jpg";
import chair from "@/assets/products/chair.jpg";
import lipstick from "@/assets/products/lipstick.jpg";
import serum from "@/assets/products/serum.jpg";
import storage from "@/assets/products/storage.jpg";
import smartwatch from "@/assets/products/smartwatch.jpg";

export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  stock: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
};

export const categories = [
  "Electronics", "Fashion", "Organic", "Furniture",
  "Beauty", "Accessories", "Home Essentials",
] as const;

export const products: Product[] = [
  { id: 1, title: "iPhone 15 Pro", category: "Electronics", price: 129999, originalPrice: 139999, discount: "7% OFF", rating: 4.8, stock: "In Stock", image: iphone, shortDescription: "Apple flagship smartphone with A17 Pro chip.", fullDescription: "Experience next-level performance with the iPhone 15 Pro featuring the powerful A17 Pro chip, titanium body, advanced camera system, and long-lasting battery life." },
  { id: 2, title: "Sony WH-1000XM5", category: "Electronics", price: 29999, originalPrice: 34999, discount: "14% OFF", rating: 4.7, stock: "In Stock", image: headphones, shortDescription: "Premium noise-cancelling wireless headphones.", fullDescription: "Enjoy immersive sound quality with Sony WH-1000XM5 headphones featuring industry-leading noise cancellation and crystal-clear audio." },
  { id: 3, title: "Men's Casual Jacket", category: "Fashion", price: 2499, originalPrice: 3999, discount: "37% OFF", rating: 4.5, stock: "In Stock", image: jacket, shortDescription: "Stylish and comfortable casual jacket.", fullDescription: "Upgrade your wardrobe with this premium men's casual jacket designed for comfort, durability, and modern style." },
  { id: 4, title: "Running Sports Shoes", category: "Fashion", price: 3499, originalPrice: 4999, discount: "30% OFF", rating: 4.6, stock: "Limited Stock", image: shoes, shortDescription: "Lightweight and durable sports shoes.", fullDescription: "Designed for comfort and performance, these running shoes provide excellent grip, cushioning, and breathability." },
  { id: 5, title: "Fresh Organic Apples", category: "Organic", price: 249, originalPrice: 299, discount: "17% OFF", rating: 4.8, stock: "In Stock", image: apples, shortDescription: "Naturally grown fresh apples.", fullDescription: "Fresh farm-picked organic apples grown without harmful chemicals or pesticides." },
  { id: 6, title: "Pure Organic Honey", category: "Organic", price: 499, originalPrice: 699, discount: "28% OFF", rating: 4.9, stock: "In Stock", image: honey, shortDescription: "100% pure natural honey.", fullDescription: "Premium organic honey collected naturally and packed with nutrients and antioxidants." },
  { id: 7, title: "Modern Wooden Sofa", category: "Furniture", price: 25999, originalPrice: 32999, discount: "21% OFF", rating: 4.4, stock: "In Stock", image: sofa, shortDescription: "Elegant wooden sofa for modern homes.", fullDescription: "Premium quality wooden sofa with comfortable cushioning and elegant modern design." },
  { id: 8, title: "Ergonomic Office Chair", category: "Furniture", price: 8999, originalPrice: 11999, discount: "25% OFF", rating: 4.5, stock: "In Stock", image: chair, shortDescription: "Comfortable ergonomic office chair.", fullDescription: "Improve productivity and posture with this ergonomic office chair featuring adjustable height and lumbar support." },
  { id: 9, title: "Matte Finish Lipstick", category: "Beauty", price: 799, originalPrice: 999, discount: "20% OFF", rating: 4.3, stock: "In Stock", image: lipstick, shortDescription: "Smooth long-lasting matte lipstick.", fullDescription: "Enhance your beauty with this premium matte lipstick offering rich color and long-lasting wear." },
  { id: 10, title: "Vitamin C Face Serum", category: "Beauty", price: 1199, originalPrice: 1599, discount: "25% OFF", rating: 4.7, stock: "In Stock", image: serum, shortDescription: "Brightening and hydrating face serum.", fullDescription: "Vitamin C serum that helps brighten skin tone, reduce dark spots, and improve skin texture." },
  { id: 11, title: "Kitchen Storage Container Set", category: "Home Essentials", price: 1499, originalPrice: 1999, discount: "25% OFF", rating: 4.4, stock: "In Stock", image: storage, shortDescription: "Airtight kitchen storage containers.", fullDescription: "Keep your kitchen organized with premium airtight storage containers suitable for grains, snacks, and spices." },
  { id: 12, title: "Smart Fitness Watch", category: "Accessories", price: 4999, originalPrice: 6999, discount: "29% OFF", rating: 4.6, stock: "In Stock", image: smartwatch, shortDescription: "Track fitness and health activities.", fullDescription: "Feature-rich smartwatch with heart-rate monitoring, fitness tracking, notifications, and long battery life." },
];

export const getProduct = (id: number) => products.find((p) => p.id === id);
export const getRelated = (category: string, excludeId: number) =>
  products.filter((p) => p.category === category && p.id !== excludeId).slice(0, 4);
