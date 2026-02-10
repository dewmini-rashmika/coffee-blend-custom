import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; 
import { CartService } from '../../../services/cart.service';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  // 1. BILLING MODEL
  model: any = {
    firstname: '', lastname: '', country: '', street: '', 
    apartment: '', city: '', postcode: '', phone: '', email: '',
    createAccount: false,
    shipDifferent: false
  };

  // 2. SHIPPING MODEL
  shippingModel: any = {
    firstname: '', lastname: '', street: '', city: '', postcode: ''
  };

  cartTotals: any = {};
  recentPosts: any[] = [];
  categories: any[] = [];

  // MOCK MENU DATA
  menuData = { 'Starter': [1, 2, 3, 4], 'Main Dish': [1, 2, 3, 4], 'Desserts': [1, 2, 3], 'Drinks': [1, 2, 3] };

  private apiUrl = 'http://localhost:3000/api';

  allCountries: string[] = ["France", "Japan", "USA", "Sri Lanka", "India", "UK", "Australia", "Canada"];

  constructor(
    private cartService: CartService,
    private blogService: BlogService,
    private router: Router,
    private http: HttpClient 
  ) { }

  ngOnInit(): void {
    this.cartTotals = this.cartService.getBill();
    this.recentPosts = this.blogService.getRecentPosts(3);
    this.calculateCategoryCounts();
  }

  calculateCategoryCounts() {
    this.categories = [
      { name: 'Starter', count: this.menuData['Starter'].length },
      { name: 'Main Dish', count: this.menuData['Main Dish'].length },
      { name: 'Desserts', count: this.menuData['Desserts'].length },
      { name: 'Drinks', count: this.menuData['Drinks'].length },
    ];
  }

  searchCategory(query: string) {
    if(!query) return;
    let sectionId = '';
    const term = query.toLowerCase();
    if (term.includes('start')) sectionId = 'section-starter';
    else if (term.includes('main')) sectionId = 'section-main';
    else if (term.includes('dessert')) sectionId = 'section-desserts';
    else if (term.includes('drink') || term.includes('juice')) sectionId = 'section-drinks';
    this.router.navigate(['/menu'], { fragment: sectionId });
  }

  // --- 1. SAVE FULL ACCOUNT DETAILS ---
  registerAccount() {
    if (!this.model.email) {
      alert('Please enter an email address first.');
      return;
    }
    
    // Send the ENTIRE model (contains firstname, lastname, street, phone, etc.)
    console.log('Sending Full Registration:', this.model);

    this.http.post(`${this.apiUrl}/register`, this.model).subscribe({
      next: (res: any) => {
          console.log(res);
          alert(res.message); 
      },
      error: (err) => {
          console.error(err);
          alert('Error: ' + (err.error?.message || 'Registration failed'));
      }
    });
  }

  // --- 2. UPDATE SHIPPING IN USER ACCOUNT ---
  saveShippingDetails() {
    if (!this.shippingModel.firstname || !this.shippingModel.street) {
      alert('Please fill in the Shipping Name and Address first.');
      return;
    }
    if (!this.model.email) {
      alert('Please fill in the Email Address in Billing section so we know which account to update.');
      return;
    }

    const payload = {
        email: this.model.email,
        shipping: this.shippingModel
    };

    console.log('Updating User Shipping...', payload);

    this.http.post(`${this.apiUrl}/shipping`, payload).subscribe({
      next: (res: any) => {
        console.log(res);
        alert(res.message); 
      },
      error: (err) => {
        console.error(err);
        alert('Error: ' + (err.error?.message || 'Failed to save shipping'));
      }
    });
  }
showStatusDialog = false;
orderStatus = 'pending';
currentOrderId = '';
  // --- 3. PLACE ORDER (SAVES EVERYTHING) ---
  placeOrder(form: NgForm) {
    if (form.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    // This object contains Billing Details + Shipping + ITEMS + Totals
    const orderEntry = {
      billing: this.model,
      shipping: this.model.shipDifferent ? this.shippingModel : null,
      items: this.cartService.getCartItems(), // <--- THIS SENDS THE ITEMS
      grandTotal: this.cartTotals.grandTotal
    };

    console.log('Sending Order:', orderEntry);

    this.http.post('http://192.168.1.101:3000/api/order', orderEntry).subscribe({
      
     next: (res: any) => {
        this.currentOrderId = res.orderId;
        this.showStatusDialog = true; // Open the dialog box [cite: 1]
        this.cartService.removeAllCart();
        form.reset();
        this.startPollingStatus(res.orderId);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order.');
      }
    });
}

startPollingStatus(id: string) {
    const interval = setInterval(() => {
        this.http.get(`http://192.168.1.101:3000/api/order/${id}`).subscribe((res: any) => {
            this.orderStatus = res.status;
            if (res.status === 'ready') clearInterval(interval); // [cite: 2]
        });
    }, 2000);
  }
}