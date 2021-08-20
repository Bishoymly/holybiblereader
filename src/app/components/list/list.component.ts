import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BookGroup } from 'src/app/models/book-group';
import { BibleService } from 'src/app/services/bible.service';

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
    private titleService: Title,
    ) { }

  ngOnInit(): void {
    this.route.url.subscribe( route => {
      var url = route;
        if(url.length>0){
          let v = this.Bible.Versions.find(v=>v.UniqueId == url[0].path);
          if(v){
            this.Bible.SetVersion(v);
            this.BookGroup = this.Bible.Version.value.BookGroups.find(b=>b.Url == url[0].path + '/' + url[1].path);
            if(this.BookGroup){
              alert(this.BookGroup.Title);
              this.titleService.setTitle(this.BookGroup.Title);
            }            
          }
        }
    });
  }

}
