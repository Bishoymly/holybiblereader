import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { BibleService } from './services/bible.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'Holy Bible Reader';

  constructor(
    public Bible:BibleService
  ) {

  }

  ngOnInit(){
    this.Bible.Version.subscribe(version => {
      this.prepareDoc();
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  prepareDoc(){
    if(this.Bible.DarkMode){
      document.body.classList.add('dark');
    }
    else{
      document.body.classList.remove('dark');
    }
    
    if(this.Bible.RTL){
      document.body.dir = "rtl";
      document.body.lang = "ar";
      document.body.classList.add('arabic');
    }
    else{
      document.body.dir = "ltr";
      document.body.lang = "en";
      document.body.classList.remove('arabic');
    }
  }

  switchDarkMode(){
    this.Bible.DarkMode = !this.Bible.DarkMode;
    this.prepareDoc();
  }
}
