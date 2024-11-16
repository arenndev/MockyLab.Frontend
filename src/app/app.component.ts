import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'mockylab-client';
}