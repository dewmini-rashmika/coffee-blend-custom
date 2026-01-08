import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service'; 
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  // --- 1. CAROUSEL CONFIGURATION ---
  currentSlide = 0;
  slideInterval: any;

  // --- 2. BOOKING FORM MODEL ---
  // This binds to the form inputs in your HTML
  model = { 
    name: '',       
    lastname: '',   
    phone: '', 
    date: '', 
    time: '', 
    message: ''     
  };
  successMessage = '';

  // --- 3. DATA FOR 'BEST SELLERS' SECTION ---
  // Matches: *ngFor="let product of bestSellers"
  bestSellers = [
    {
      id: 101,
      name: 'Coffee Capuccino',
      description: 'Rich foam and delicious espresso.',
      price: '5.90',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80'
    },
    {
      id: 102,
      name: 'Coffee Espresso',
      description: 'Strong and bold taste.',
      price: '4.90',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80'
    },
    {
      id: 103,
      name: 'Coffee Latte',
      description: 'Smooth and creamy.',
      price: '6.50',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80'
    },
    {
      id: 104,
      name: 'Coffee Mocha',
      description: 'Chocolate infused delight.',
      price: '7.00',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80'
    }
  ];

  // --- 4. DATA FOR 'OUR PRODUCTS' TABBED SECTION ---
  // Used by getFilteredProducts()
  activeTab = 'Drinks'; // Default tab
  
  menuProducts = [
    // --- MAIN DISHES ---
    { category: 'Main', name: 'Grilled Beef', price: '20.00', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80', description: 'Grilled to perfection.' },
    { category: 'Main', name: 'Steak & Fries', price: '25.00', image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&q=80', description: 'Classic combo.' },
    
    // --- DRINKS ---
    { category: 'Drinks', name: 'Lemonade Juice', price: '2.90', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', description: 'Freshly squeezed.' },
    { category: 'Drinks', name: 'Pineapple Juice', price: '2.90', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&q=80', description: 'Tropical delight.' },
    { category: 'Drinks', name: 'Soda Drinks', price: '2.90', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', description: 'Fizzy and cold.' },

    // --- DESSERTS ---
    { category: 'Desserts', name: 'Hot Cake Honey', price: '4.90', image: 'https://images.unsplash.com/photo-1619860641123-5e7836511b06?w=500&q=80', description: 'Sweet morning treat.' },
    { category: 'Desserts', name: 'Choco Lava', price: '5.90', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80', description: 'Molten chocolate.' }
  ];

  // --- 5. BLOG DATA ---
  recentPosts: any[] = [];

  constructor(
    private http: HttpClient, 
    private cartService: CartService,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    // Start the image slider
    this.startSlider();

    // Fetch blog posts (Assuming your BlogService works)
    // If BlogService is not ready yet, you can comment this out.
    this.recentPosts = this.blogService.getRecentPosts(3);
  }

  ngOnDestroy() {
    // Stop the slider when leaving the page to prevent memory leaks
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // --- HELPER METHODS ---

  startSlider() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide === 0) ? 1 : 0; 
    }, 3000); // Change slide every 3 seconds
  }

  // Used in HTML: *ngFor="let product of getFilteredProducts()"
  getFilteredProducts() {
    return this.menuProducts.filter(product => product.category === this.activeTab);
  }

  addToCart(product: any) {
    // Add to Cart Service
    this.cartService.addToCart(product);
    // User Feedback
    alert(`${product.name} has been added to your cart!`);
  }

  bookTable() {
    // 1. Validation
    if(!this.model.name || !this.model.phone || !this.model.date) {
        alert('Please fill in Name, Phone, and Date');
        return;
    }

    // 2. HTTP Request
    // Ensure your backend is running at this URL
    this.http.post('http://localhost:3000/api/reservation', this.model)
      .subscribe({
        next: (response: any) => {
          console.log('Booking success', response);
          this.successMessage = 'Table booked successfully!';
          alert('Table Booked for ' + this.model.name + '!'); 
          // Reset form
          this.model = { name: '', lastname: '', phone: '', date: '', time: '', message: '' };
        },
        error: (error) => {
          console.error('Error booking table', error);
          alert('Failed to book table. Please try again later.');
        }
      });
  }
}