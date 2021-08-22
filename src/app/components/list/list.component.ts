import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BookGroup } from 'src/app/models/book-group';
import { BibleService } from 'src/app/services/bible.service';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public BookGroup : BookGroup | undefined;

  constructor(
    public Bible: BibleService,
    private route: ActivatedRoute,
    private seo:SEOService
    ) { }

  ngOnInit(): void {
    this.seo.createCanonicalLink();
    this.route.url.subscribe( route => {
      var url = route;
        if(url.length>0){
          let v = this.Bible.Versions.find(v=>v.UniqueId == url[0].path);
          if(v){
            this.Bible.SetVersion(v);
            this.BookGroup = this.Bible.Version.value.BookGroups.find(b=>b.Url == url[0].path + '/' + url[1].path);
            if(this.BookGroup){
              this.seo.setTitle(this.BookGroup.Title + " | " + this.Bible.Version.value.Title + " | Holy Bible Reader");
            }
          }
        }
    });
  }

}
