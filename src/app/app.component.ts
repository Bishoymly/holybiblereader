import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
  lastScrollTop = 0;

  constructor(
    public Bible:BibleService,
    public route: ActivatedRoute,
    private router: Router,
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
        DARK: 'Dark Mode',
        SEARCH: 'Search',
        FOUND: 'Found',
        VERSESFOR: 'verses for',
      });

      translate.setTranslation('ar', {
        TITLE: 'الكتاب المقدس',
        NEXT: 'التالي',
        PREVIOUS: 'السابق',
        COPY: 'نسخ',
        SHARE: 'نشر',
        COPIED: 'تم النسخ!',
        DARK: 'داكن',
        SEARCH: 'بحث',
        FOUND: '',
        VERSESFOR: 'نتائج البحث عن',
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
    if(this.Bible.Settings.DarkMode){
      document.body.classList.add('dark');
    }
    else{
      document.body.classList.remove('dark');
    }

    if(this.Bible.Settings.Serif){
      document.body.classList.remove('sans');
    }
    else{
      document.body.classList.add('sans');
    }

    document.body.classList.remove('big');
    document.body.classList.remove('small');
    if(this.Bible.Settings.FontSize!=''){
      document.body.classList.add(this.Bible.Settings.FontSize);
    }
        
    if(this.Bible.Settings.RTL){
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
    this.Bible.Settings.DarkMode = !this.Bible.Settings.DarkMode;
    this.Bible.Save();
    this.prepareDoc();
  }

  serif(){
    this.Bible.Settings.Serif = true;
    this.Bible.Save();
    this.prepareDoc();
  }

  sans(){
    this.Bible.Settings.Serif = false;
    this.Bible.Save();
    this.prepareDoc();
  }

  tashkeel(){
    this.Bible.Settings.Tashkeel = true;
    this.Bible.Save();
    this.reload();
  }

  removeTashkeel(){
    this.Bible.Settings.Tashkeel = false;
    this.Bible.Save();
    this.reload();
  }

  increaseFont(){
    if(this.Bible.Settings.FontSize === ''){
      this.Bible.Settings.FontSize = 'big';
    }
    else{
      this.Bible.Settings.FontSize = '';
    }
    this.Bible.Save();
    this.prepareDoc();
  }

  decreaseFont(){
    if(this.Bible.Settings.FontSize === ''){
      this.Bible.Settings.FontSize = 'small';
    }
    else{
      this.Bible.Settings.FontSize = '';
    }
    this.Bible.Save();
    this.prepareDoc();
  }

  reload(){
    location.reload();
  }

  switchToVersion(event:Event, name:string){
    
    let url = window.location.pathname.split('/');
    let fragment = window.location.hash.split('#');
    if(url.length>3){
      if(fragment && fragment.length>1){
        this.router.navigate([name, url[2], url[3], url[4]], { fragment: fragment[1] });
      }
      else{
        this.router.navigate([name, url[2], url[3], url[4]]);
      }
      event.preventDefault();
    }
  }

  search(event:any){
    let query = event.target.value;
    let path = location.pathname;
    if(this.route.snapshot.queryParams.where){
      path = this.route.snapshot.queryParams.where;
    }
    
    if(path=='' || path == '/'){
      path = this.Bible.Version.value.Url;
    }

    if(path.startsWith('/')){
      path = path.substring(1);
    }
    this.router.navigate(['search'], { queryParams: {q:query, where:path}});
  }

  @HostListener('window:scroll', ['$event'])
  scroll(){
    let scrollTop = window.scrollY;
    if(scrollTop < this.lastScrollTop) {
      document.body.classList.remove('scrolled-down');
      document.body.classList.add('scrolled-up');
    }
    else {
      document.body.classList.remove('scrolled-up');
      document.body.classList.add('scrolled-down');
    }
    this.lastScrollTop = scrollTop;
  }
}
