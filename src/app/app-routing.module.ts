import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'mockup',
    loadChildren: () => import('./features/mockup.module').then(m => m.MockupModule)
  },
  {
    path: '',
    redirectTo: 'mockup',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }