import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'; // Adjust the path to your actual service file

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // State variables
  isMenuCollapsed = true;
  isShopOpen = false;

  // Cart count variable
  public totalItem: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to the cart service observable
    this.cartService.getProducts().subscribe(res => {
      // Calculate total quantity across all products
      this.totalItem = res.reduce((acc: number, item: any) => acc + item.quantity, 0);
    });
  }

  // Toggle for Mobile Hamburger
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  // Toggle for Shop Dropdown
  toggleShop() {
    this.isShopOpen = !this.isShopOpen;
  }

  // Helper: Close everything
  closeAll() {
    this.isMenuCollapsed = true;
    this.isShopOpen = false;
  }
}