import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // I have added REAL online image links here
  private posts = [
    {
      id: 1,
      title: 'The Delicious Pizza',
      date: 'Sept 10, 2018',
      author: 'Admin',
      comments: 3,
      description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' 
    },
    {
      id: 2,
      title: 'Amazing Coffee Blend',
      date: 'Sept 10, 2018',
      author: 'Admin',
      comments: 3,
      description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80'
    },
    {
      id: 3,
      title: 'The Best Breakfast',
      date: 'Sept 10, 2018',
      author: 'Admin',
      comments: 3,
      description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 4,
      title: 'New Curry Recipe',
      date: 'Jan 05, 2026',
      author: 'Chef',
      comments: 10,
      description: 'The newest addition to our menu is here and it is spicy!',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=1224&q=80'
    }
  ];

  constructor() { }

  getAllPosts() {
    return this.posts;
  }

  getRecentPosts(limit: number = 3) {
    return this.posts.slice(0, limit);
  }
}