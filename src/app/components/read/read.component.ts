import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { Book } from 'src/app/models/book';
import { Chapter } from 'src/app/models/chapter';
import { BibleService } from 'src/app/services/bible.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  public Book : Book | undefined;
  public Chapter: Chapter | undefined;

  constructor(
    private route: ActivatedRoute,
    public Bible: BibleService
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe( route => {
      var url = route;

      this.Bible.Loaded.subscribe( loaded => {
        this.Book = this.Bible.Version.Books.find(b=>b.UniqueId == url[2].path);
        if(this.Book){
          this.Bible.ProcessChapters(this.Book);
          this.Book.IsLoaded.subscribe(loaded => {
            this.Chapter = this.Book?.Chapters.find(b=>b.UniqueId == url[3].path);
          })
        }
      });
    });
  }

  public GetLines():string[] | undefined {
    return this.Chapter?.Content?.split(/[\r\n]+/);
  }
}
