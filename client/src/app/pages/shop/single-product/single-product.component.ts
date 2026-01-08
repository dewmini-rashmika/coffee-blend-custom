import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// FIX: Go up 3 levels to find services
import { CartService } from '../../../services/cart.service';
@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  
  // ... rest of your code remains exactly the same ...
  defaultProduct = {
      name: 'Creamy Latte Coffee',
      price: '4.90',
      description: 'A small river named Duden flows by their place...',
      image: 'assets/images/coffee-beans.jpg', 
      category: 'Coffee'
  };
relatedProducts = [
    { name: 'Cornish Mackerel', price: '20.00', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', description: 'A small river named Duden flows by their place' },
    { name: 'Roasted Steak', price: '29.00', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', description: 'A small river named Duden flows by their place' },
    { name: 'Chicken Curry', price: '20.00', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', description: 'A small river named Duden flows by their place' },
    { name: 'Pineapple Juice', price: '20.00', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf', description: 'A small river named Duden flows by their place' }
  ];
  product: any;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private cartService: CartService // This will work now
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['product']) {
      this.product = navigation.extras.state['product'];
    } else {
      this.product = this.defaultProduct;
    }
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

 addToCart(item?: any) {
    if (item) {
      // Case A: User clicked "Add to Cart" on a Related Product (Default qty 1)
      this.cartService.addToCart({ ...item, quantity: 1 });
    } else {
      // Case B: User clicked the Main Big Button (Uses selected qty)
      const itemToAdd = { ...this.product, quantity: this.quantity };
      this.cartService.addToCart(itemToAdd);
    }
    
    // Redirect to cart
    this.router.navigate(['/cart']);
  }
}