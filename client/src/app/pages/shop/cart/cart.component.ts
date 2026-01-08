import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: any = [];
  cartItems: any[] = [];
  // Variables for the bill
  public subTotal: number = 0;
  public delivery: number = 0;
  public discount: number = 0;
  public grandTotal: number = 0;
// 1. DATA FOR RELATED PRODUCTS
  relatedProducts = [
    {
      id: 101,
      name: 'Coffee Capuccino',
      description: 'A small river named Duden flows by their place and supplies',
      price: 5.90,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 102,
      name: 'Coffee Espresso',
      description: 'A small river named Duden flows by their place and supplies',
      price: 4.90,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 103,
      name: 'Iced Coffee',
      description: 'A small river named Duden flows by their place and supplies',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 104,
      name: 'Coffee Latte',
      description: 'A small river named Duden flows by their place and supplies',
      price: 5.90,
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getProducts().subscribe(res => {
      this.products = res;
      this.calculateBill(); // Recalculate whenever products change
    });
    this.cartItems = this.cartService.getCartItems();
  }

  // Helper to get math from Service
  calculateBill() {
    const bill = this.cartService.getBill();
    this.subTotal = bill.subTotal;
    this.delivery = bill.delivery;
    this.discount = bill.discount;
    this.grandTotal = bill.grandTotal;
  }

  removeItem(item: any) {
    this.cartService.removeCartItem(item);
  }

  emptyCart() {
    this.cartService.removeAllCart();
  }

  onQuantityChange(item: any, event: any) {
    const qty = parseInt(event.target.value);
    if(qty > 0) {
        this.cartService.updateQuantity(item, qty);
    }
  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
    
    // Refresh the list so the table updates instantly
    this.cartItems = this.cartService.getCartItems(); 
    
    // Optional: Show an alert
    alert(`${product.name} added to cart!`);
  }
}
