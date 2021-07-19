import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReadComponent } from './components/read/read.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: ':version', component: HomeComponent},
  { path: ':version/:group/:book/:chapter', component: ReadComponent },
  /*{ path: '**', component: ReadComponent, data: {animation: 2} },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollOffset: [0, 150], scrollPositionRestoration: 'disabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
