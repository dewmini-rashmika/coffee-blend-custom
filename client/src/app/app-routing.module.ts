import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all your components
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ServicesComponent } from './pages/services/services.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { SingleProductComponent } from './pages/shop/single-product/single-product.component';
import { CartComponent } from './pages/shop/cart/cart.component';
import { CheckoutComponent } from './pages/shop/checkout/checkout.component';
import { TrackOrderComponent} from './pages/track-order/track-order.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  
  
  // Shop Routes
  { path: 'shop', component: ShopComponent },
  { path: 'shop/product/:id', component: SingleProductComponent }, // Dynamic route for specific product
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  { path: 'contact', component: ContactComponent },
  // Wildcard (Redirects unknown URLs to Home)
  { path: 'track-order/:id', component: TrackOrderComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled',scrollPositionRestoration: 'enabled' })], // Scrolls to top on navigation
  exports: [RouterModule]
})
export class AppRoutingModule { }