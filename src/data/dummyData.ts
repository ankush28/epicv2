import { Product, Order } from '../types';

export const initialProducts: Product[] = [
  { 
    id: 1, 
    name: "Cricket Bat", 
    category: "Cricket",
    wholesalePrice: 800, 
    retailPrice: 1200, 
    quantity: 10 
  },
  { 
    id: 2, 
    name: "Football", 
    category: "Football",
    wholesalePrice: 400, 
    retailPrice: 650, 
    quantity: 15 
  },
  { 
    id: 3, 
    name: "Tennis Racket", 
    category: "Tennis",
    wholesalePrice: 1500, 
    retailPrice: 2200, 
    quantity: 5 
  },
  { 
    id: 4, 
    name: "Basketball", 
    category: "Basketball",
    wholesalePrice: 600, 
    retailPrice: 950, 
    quantity: 8 
  },
  { 
    id: 5, 
    name: "Table Tennis Paddle", 
    category: "Table Tennis",
    wholesalePrice: 300, 
    retailPrice: 480, 
    quantity: 20 
  },
  { 
    id: 6, 
    name: "Badminton Racket", 
    category: "Badminton",
    wholesalePrice: 700, 
    retailPrice: 1100, 
    quantity: 12 
  }
];

export const initialOrders: Order[] = [
  { 
    id: 101, 
    date: "2025-01-28", 
    items: [{ name: "Football", qty: 2, price: 1300 }], 
    total: 1300, 
    profit: 500 
  },
  { 
    id: 102, 
    date: "2025-01-27", 
    items: [{ name: "Cricket Bat", qty: 1, price: 1200 }], 
    total: 1200, 
    profit: 400 
  },
  { 
    id: 103, 
    date: "2025-01-26", 
    items: [
      { name: "Tennis Racket", qty: 1, price: 2200 },
      { name: "Basketball", qty: 2, price: 1900 }
    ], 
    total: 4100, 
    profit: 1400 
  }
];