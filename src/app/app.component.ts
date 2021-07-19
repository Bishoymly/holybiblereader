import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    public Bible:BibleService,
    public route: ActivatedRoute,
    private translate: TranslateService
  ) {
    
      translate.setDefaultLang('en');

      translate.setTranslation('en', {
        TITLE: 'Holy Bible Reader',
        NEXT: 'Next',
        PREVIOUS: 'Previous',
        COPY: 'Copy',
        SHARE: 'Share',
        COPIED: 'Copied!',
        DARK: 'Dark Mode'
      });

      translate.setTranslation('ar', {
        TITLE: 'الكتاب المقدس',
        NEXT: 'التالي',
        PREVIOUS: 'السابق',
        COPY: 'نقل',
        SHARE: 'نشر',
        COPIED: 'تم النقل!',
        DARK: 'داكن'
      });
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
      this.translate.use('ar');
    }
    else{
      document.body.dir = "ltr";
      document.body.lang = "en";
      document.body.classList.remove('arabic');
      this.translate.use('en');
    }
  }

  switchDarkMode(){
    this.Bible.DarkMode = !this.Bible.DarkMode;
    this.prepareDoc();
  }
}
