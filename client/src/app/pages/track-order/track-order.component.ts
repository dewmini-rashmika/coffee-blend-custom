import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html'
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  orderId: string = '';
  status: string = 'pending';
  poller: any;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    // Poll server every 2 seconds
    this.poller = setInterval(() => {
      this.orderService.checkStatus(this.orderId).subscribe(res => {
        this.status = res.status;
        if(res.status === 'ready') clearInterval(this.poller);
      });
    }, 2000);
  }

  ngOnDestroy() { if(this.poller) clearInterval(this.poller); }
}