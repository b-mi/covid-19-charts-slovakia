import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Chart3Component } from './chart3/chart3.component';


const routes: Routes = [
  { path: '', component: Chart3Component },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
