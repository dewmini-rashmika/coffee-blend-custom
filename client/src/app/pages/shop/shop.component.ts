import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service'; // Ensure path is correct

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  // Default active category
  activeCategory: string = 'Coffee';

  // Master list of all products
  allProducts = [
    // --- COFFEE ---
    { name: 'Coffee Capuccino', price: '5.90', category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'A small river named Duden flows by their place and supplies' },
    { name: 'Creamy Latte', price: '4.90', category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'A small river named Duden flows by their place and supplies' },
    { name: 'Dark Roast', price: '6.50', category: 'Coffee', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'A small river named Duden flows by their place and supplies' },
    { name: 'Espresso', price: '3.50', category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'A small river named Duden flows by their place and supplies' },

    // --- MAIN DISH ---
    { name: 'Grilled Steak', price: '29.00', category: 'Main Dish', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'A small river named Duden flows by their place and supplies' },
    { name: 'Chicken Fillet', price: '22.00', category: 'Main Dish', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'A small river named Duden flows by their place and supplies' },
    { name: 'Sea Trout', price: '49.91', category: 'Main Dish', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'A small river named Duden flows by their place and supplies' },

    // --- DRINKS ---
    { name: 'Lemonade', price: '9.00', category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Freshly squeezed lemon with mint' },
    { name: 'Pineapple Juice', price: '12.00', category: 'Drinks', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Tropical sweet pineapple juice' },
    
    // --- DESSERTS ---
    { name: 'Cherry Pie', price: '15.00', category: 'Desserts', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Sweet and tart cherry filling' },
    { name: 'Chocolate Mousse', price: '18.00', category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Rich dark chocolate mousse' },
  ];

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
  }

  // Helper to get products for the current category
  get filteredProducts() {
    return this.allProducts.filter(p => p.category === this.activeCategory);
  }

  // Change category on tab click
  setCategory(category: string) {
    this.activeCategory = category;
  }

  addToCart(item: any) {
    this.cartService.addToCart(item);
    this.router.navigate(['/cart']);
  }
}