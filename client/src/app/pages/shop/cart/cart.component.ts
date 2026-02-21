import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: any = [];
  cartItems: any[] = [];
  public subTotal: number = 0;
  public delivery: number = 0;
  public discount: number = 0;
  public grandTotal: number = 0;
  couponInput: string = ''; 

  relatedProducts = [
    { id: 101, name: 'Coffee Capuccino', description: 'Rich creamy cappuccino blend', price: 5.90, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500' },
    { id: 102, name: 'Coffee Espresso', description: 'Bold and strong traditional espresso', price: 4.90, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500' },
    { id: 103, name: 'Iced Coffee', description: 'Refreshing cold coffee with ice', price: 6.50, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500' },
    { id: 104, name: 'Coffee Latte', description: 'Smooth milk-based creamy latte', price: 5.90, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500' }
  ];

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.getProducts().subscribe(res => {
      this.products = res;
      this.calculateBill();
    });
    this.cartItems = this.cartService.getCartItems();
  }

applyCoupon() {
  const codeToSend = this.couponInput.trim().toUpperCase();
  console.log("Button Clicked! Input value is:", codeToSend); // Check your browser console (F12)

  if (!codeToSend) {
    alert("Input is empty!");
    return;
  }

  const url = 'http://192.168.1.101:3000/api/validate-coupon';
  this.http.post(url, { code: codeToSend }).subscribe({
    next: (res: any) => {
      console.log("Server Response:", res);
      this.cartService.applyCoupon(res); 
      this.calculateBill(); 
      alert(`Success! Applied ${res.percent}% discount.`);
    },
    error: (err) => {
      console.error("Server Error Details:", err);
      alert(err.error?.message || "Coupon Not Found");
    }
  });
}
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

  onQuantityChange(item: any, event: any) {
    const qty = parseInt(event.target.value);
    if(qty > 0) {
        this.cartService.updateQuantity(item, qty);
        this.calculateBill();
    }
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.calculateBill();
    alert(`${product.name} added to cart!`);
  }
}