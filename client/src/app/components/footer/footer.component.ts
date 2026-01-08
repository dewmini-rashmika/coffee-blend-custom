import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service'; // Make sure path is correct

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  footerPosts: any[] = [];

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    // Fetch the top 2 most recent posts for the footer
    this.footerPosts = this.blogService.getRecentPosts(2);
  }

}