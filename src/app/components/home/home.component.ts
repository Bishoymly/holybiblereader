import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BibleService } from 'src/app/services/bible.service';
import { CanonicalService } from 'src/app/services/canonical.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public Bible: BibleService,
    private route: ActivatedRoute,
    private titleService: Title,
    private canonical:CanonicalService
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
      this.titleService.setTitle(this.Bible.Version.value.Title);
      this.canonical.createCanonicalLink("https://holybiblereader.com/" + this.Bible.Version.value.Url);
    });
  }
}
