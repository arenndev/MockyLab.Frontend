import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: 'mockup',
    loadChildren: () => import('./features/mockup/mockup.module').then(m => m.MockupModule)
  },
  {
    path: '',
    redirectTo: 'mockup',
    pathMatch: 'full'
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));