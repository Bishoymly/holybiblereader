import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';
import { ReadComponent } from './components/read/read.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'search', component: SearchComponent },
  { path: ':version/:group/:book/:chapter', component: ReadComponent },  
  { path: ':version/:group/:book', redirectTo: ':version/:group/:book/1' },  
  { path: ':version/:group', component: ListComponent },   
  { path: ':version', component: HomeComponent},
  /*{ path: '**', component: ReadComponent, data: {animation: 2} },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollOffset: [0, 150], scrollPositionRestoration: 'disabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
