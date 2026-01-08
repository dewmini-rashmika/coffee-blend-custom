import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  // STATS CONFIGURATION
  stats = [
    { label: 'Coffee Branches', count: 0, target: 100 },
    { label: 'Number of Awards', count: 0, target: 85 },
    { label: 'Happy Customer', count: 0, target: 10567 },
    { label: 'Staff', count: 0, target: 900 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Start animation immediately when page loads
    this.stats.forEach(stat => {
      this.animateValue(stat);
    });
  }

  animateValue(stat: any) {
    let startTimestamp: number | null = null;
    const duration = 2500; // Animation lasts 2.5 seconds
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Calculate number based on progress
      stat.count = Math.floor(progress * (stat.target - 0) + 0);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        stat.count = stat.target; // Ensure it finishes on the exact number
      }
    };
    
    window.requestAnimationFrame(step);
  }
}