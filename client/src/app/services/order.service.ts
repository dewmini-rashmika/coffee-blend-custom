import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://192.168.1.101:3000/api'; 

  constructor(private http: HttpClient) { }

  checkStatus(orderId: string) {
    return this.http.get<any>(`${this.apiUrl}/order/${orderId}`);
  }
}