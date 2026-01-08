import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  // SECTION 1: STARTER
  starters = [
    { name: 'Cornish - Mackerel', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Roasted Steak', description: 'A small river named Duden flows by their place and supplies', price: '29.00', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Seasonal Soup', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Chicken Curry', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
  ];

  // SECTION 2: MAIN DISH
  mains = [
    { name: 'Sea Trout', description: 'A small river named Duden flows by their place and supplies', price: '49.91', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Roasted Beef', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Butter Fried Chicken', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Chicken Filet', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
  ];

  // SECTION 3: DESSERTS
  desserts = [
    { name: 'Cherry Pie', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Dark Chocolate Mousse', description: 'A small river named Duden flows by their place and supplies', price: '29.00', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Creamy Latte', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
  ];

  // SECTION 4: DRINKS
  drinks = [
    { name: 'Lemonade Juice', description: 'A small river named Duden flows by their place and supplies', price: '49.91', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Pineapple Juice', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Soda Drinks', description: 'A small river named Duden flows by their place and supplies', price: '20.00', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.router.navigate(['/cart']); 
  }

  // --- NEW: View Product Logic ---
  viewProduct(item: any) {
    // Generate a URL-friendly ID (slug)
    const slug = item.name.replace(/\s+/g, '-');
    
    // Navigate and pass the whole product object
    this.router.navigate(['/shop/product', slug], { 
      state: { product: item } 
    });
  }
}