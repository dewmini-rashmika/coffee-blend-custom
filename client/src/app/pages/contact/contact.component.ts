import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  model: any = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  private apiUrl = 'http://192.168.1.101:3000/api/contact';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  sendMessage(form: NgForm) {
    if (form.invalid) {
      alert("Please fill all fields");
      return;
    }

    console.log("Sending Message...", this.model);

    this.http.post(this.apiUrl, this.model).subscribe({
      next: (res: any) => {
        alert(res.message); // "Message Sent Successfully!"
        form.reset(); // Clear the form
      },
      error: (err) => {
        console.error(err);
        alert("Error sending message. Check server console.");
      }
    });
  }

}