import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItemList: any = [];
  public productList = new BehaviorSubject<any>([]);

  constructor() { 
    this.loadCart();
  }

  getProducts() {
    return this.productList.asObservable();
  }

  getCartItems() {
    return this.cartItemList;
  }

  // --- UPDATED: Respects the quantity passed from Single Product Page ---
  addToCart(product: any) {
    const existingProduct = this.cartItemList.find((item: any) => item.name === product.name);
    
    // Check if the incoming product has a specific quantity (from Single Product page), otherwise default to 1
    const qtyToAdd = product.quantity || 1;

    if (existingProduct) {
      // Add the specific quantity (not just +1)
      existingProduct.quantity += qtyToAdd;
      existingProduct.total = existingProduct.quantity * existingProduct.price;
    } else {
      // Add new item with specific quantity
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

  // --- Calculate All Totals ---
  getBill() {
    let subTotal = 0;
    this.cartItemList.map((a: any) => {
      subTotal += (a.price * a.quantity);
    });

    // LOGIC: Delivery is $5, but free if order is over $50
    let delivery = subTotal > 50 ? 0 : 5;
    if(subTotal === 0) delivery = 0; 

    // LOGIC: Discount is 10% if order is over $100
    let discount = subTotal > 100 ? (subTotal * 0.10) : 0;

    let grandTotal = subTotal + delivery - discount;

    return {
        subTotal: subTotal,
        delivery: delivery,
        discount: discount,
        grandTotal: grandTotal
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