import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { Book } from 'src/app/models/book';
import { Chapter } from 'src/app/models/chapter';
import { Verse } from 'src/app/models/verse';
import { BibleService } from 'src/app/services/bible.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css'],
})
export class ReadComponent implements OnInit {

  public Book : Book | undefined;
  public Chapter: Chapter | undefined;
  public Verse: Verse | undefined;
  public VerseNumber: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private titleService: Title,
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
            if(this.Chapter){
              this.titleService.setTitle(this.Chapter.ToString());
            }
          })
        }
      });
    });
  }

  public OpenNext(){
    if(this.Book && this.Chapter){
      let ch = this.Chapter.Number + 1;
      if(ch > this.Book.Chapters.length){
        let b = this.Bible.Version.Books.indexOf(this.Book);
        b++;
        if(b<this.Bible.Version.Books.length)
        {
          this.Book = this.Bible.Version.Books[b];
          ch = 1;
          this.router.navigateByUrl('/' + this.Book.Url + '/' + ch.toString());
        }
      }
      else{
        this.router.navigateByUrl('/' + this.Book.Url + '/' + ch.toString());
      }
    }    
  }

  public OpenPrevious(){
    if(this.Book && this.Chapter){
      let ch = this.Chapter.Number - 1;
      if(ch<1){
        let b = this.Bible.Version.Books.indexOf(this.Book);
        b--;
        if(b>=0)
        {
          this.Book = this.Bible.Version.Books[b];
          ch = this.Book.Chapters.length;
          this.router.navigateByUrl('/' + this.Book.Url + '/' + ch.toString());
        }
      }
      else{
        this.router.navigateByUrl('/' + this.Book.Url + '/' + ch.toString());
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    switch(event.code){
    case 'ArrowRight':
      if(this.Chapter){  
        if(this.Verse){
          this.Verse.IsSelected = false;
        }
        this.VerseNumber++;
        if(this.VerseNumber<=this.Chapter.Verses.length){
          this.Verse = this.Chapter.Verses[this.VerseNumber];
          this.Verse.IsSelected = true;  
        }
      }
      break;

    case 'ArrowLeft':
      if(this.Chapter){  
        if(this.Verse){
          this.Verse.IsSelected = false;
        }
        
        if(this.VerseNumber>0){
          this.VerseNumber--;
          this.Verse = this.Chapter.Verses[this.VerseNumber];
          this.Verse.IsSelected = true;  
        }
      }
      break;
    default:
      break;
    }
  }
}
