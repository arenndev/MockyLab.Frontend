import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockupEditorComponent } from './components/mockup-editor/mockup-editor.component';

const routes: Routes = [
  {
    path: 'edit',
    component: MockupEditorComponent
  },
  {
    path: 'edit/:id',
    component: MockupEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MockupRoutingModule { }