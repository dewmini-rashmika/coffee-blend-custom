import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItemList: any = [];
  public productList = new BehaviorSubject<any>([]);
  private appliedCoupon: any = null; // Store database coupon info

  constructor() { 
    this.loadCart();
  }

  // Method to set coupon data and trigger recalculation
  applyCoupon(couponData: any) {
    this.appliedCoupon = couponData;
    this.pushUpdates(); 
  }

  getProducts() {
    return this.productList.asObservable();
  }

  getCartItems() {
    return this.cartItemList;
  }

  addToCart(product: any) {
    const existingProduct = this.cartItemList.find((item: any) => item.name === product.name);
    const qtyToAdd = product.quantity || 1;

    if (existingProduct) {
      existingProduct.quantity += qtyToAdd;
      existingProduct.total = existingProduct.quantity * existingProduct.price;
    } else {
      const newProduct = { 
          ...product, 
          quantity: qtyToAdd, 
          total: product.price * qtyToAdd 
      };
      this.cartItemList.push(newProduct);
    }
    this.pushUpdates();
  }

  removeCartItem(product: any) {
    this.cartItemList.map((a: any, index: any) => {
      if (product.name === a.name) {
        this.cartItemList.splice(index, 1);
      }
    });
    this.pushUpdates();
  }

  removeAllCart() {
    this.cartItemList = [];
    this.pushUpdates();
  }

  updateQuantity(product: any, qty: number) {
    const item = this.cartItemList.find((i: any) => i.name === product.name);
    if(item) {
        item.quantity = qty;
        item.total = item.quantity * item.price;
        this.pushUpdates();
    }
  }

  getBill() {
    let subTotal = 0;
    this.cartItemList.map((a: any) => {
      subTotal += (a.price * a.quantity);
    });

    let delivery = subTotal > 50 ? 0 : 5;
    if(subTotal === 0) delivery = 0; 

    // --- CALCULATE DISCOUNTS ---
    let discount = 0;
    
    // 1. Existing automatic 10% discount for orders over $100
    if (subTotal > 100) discount = (subTotal * 0.10);

    // 2. MODIFIED: Dynamic Database Coupon Logic
    if (this.appliedCoupon) {
      // Apply percentage-based discount from DB
      if (this.appliedCoupon.percent > 0) {
        discount += (subTotal * (this.appliedCoupon.percent / 100));
      }
      // Apply flat-rate discount from DB
      if (this.appliedCoupon.flat > 0) {
        discount += this.appliedCoupon.flat;
      }
    }

    let grandTotal = subTotal + delivery - discount;

    return {
        subTotal: subTotal,
        delivery: delivery,
        discount: discount,
        grandTotal: grandTotal < 0 ? 0 : grandTotal 
    };
  }

  private pushUpdates() {
    this.productList.next(this.cartItemList);
    localStorage.setItem('coffeeCart', JSON.stringify(this.cartItemList));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('coffeeCart');
    if (savedCart) {
      this.cartItemList = JSON.parse(savedCart);
      this.productList.next(this.cartItemList);
    }
  }
}