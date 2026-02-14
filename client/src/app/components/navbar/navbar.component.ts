import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CartService } from '../../services/cart.service';

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

  // Inject ElementRef to detect clicks on this specific component
  constructor(
    private cartService: CartService,
    private eRef: ElementRef 
  ) {}

  ngOnInit(): void {
    // Subscribe to the cart service observable
    this.cartService.getProducts().subscribe(res => {
      // Calculate total quantity across all products
      this.totalItem = res.reduce((acc: number, item: any) => acc + item.quantity, 0);
    });
  }

  // --- NEW: Detect clicks outside of the navbar ---
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // If the click happened OUTSIDE the navbar, close all menus
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeAll();
    }
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