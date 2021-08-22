import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BibleService } from 'src/app/services/bible.service';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public Bible: BibleService,
    private route: ActivatedRoute,
    private seo:SEOService
    ) { }

  ngOnInit(): void {
    this.route.url.subscribe( route => {
      var url = route;
      if(url.length>0){
        let v = this.Bible.Versions.find(v=>v.UniqueId == url[0].path);
        if(v){
          this.Bible.SetVersion(v);
        }
      }
      this.seo.setTitle(this.Bible.Version.value.Title + " | Holy Bible Reader");
      this.seo.createCanonicalLink("https://holybiblereader.com/" + this.Bible.Version.value.Url);
    });
  }
}
