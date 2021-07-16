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
    public router : Router,
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
              if(this.route.snapshot.fragment){
                this.setVerse(parseInt(this.route.snapshot.fragment));          
              }
            }
          })
        }
      });
    });

    this.route.fragment.subscribe(fragment =>{
      this.setVerse(parseInt(fragment??'0'));
    });
  }

  nextChapter(){
    if(this.Book && this.Chapter){
      let ch = this.Chapter.Number + 1;
      if(ch > this.Book.Chapters.length){
        let b = this.Bible.Version.Books.indexOf(this.Book);
        b++;
        if(b<this.Bible.Version.Books.length)
        {
          this.Book = this.Bible.Version.Books[b];
          ch = 1;
        }
      }

      this.router.navigate([this.Book.Url, ch.toString()], { fragment: '1' });
    }
  }

  previousChapter(){
    if(this.Book && this.Chapter){
      let ch = this.Chapter.Number - 1;
      if(ch<1){
        let b = this.Bible.Version.Books.indexOf(this.Book);
        b--;
        if(b>0)
        {
          this.Book = this.Bible.Version.Books[b];
          ch = this.Book.Chapters.length;
        }
      }
        
      this.Chapter = this.Book?.Chapters.find(b=>b.UniqueId == ch.toString());
      this.router.navigate([this.Book.Url, ch.toString()], { fragment: this.Chapter?.Verses.length.toString() });
    }
  }

  setVerse(num : number){

    if(this.Verse){
      this.Verse.IsSelected = false;
    }

    this.VerseNumber = num;
    this.Verse = this.Chapter?.Verses[this.VerseNumber - 1];
    if(this.Verse){
      this.Verse.IsSelected = true;
      //this.router.navigate([], { fragment: this.Verse.Number.toString() });
      /*document.getElementById(this.Verse.Number.toString())?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
        });*/
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    switch(event.code){
    case 'ArrowRight':
      if(this.Chapter){
        if(this.VerseNumber<this.Chapter.Verses.length){
          this.router.navigate([], { fragment: (this.VerseNumber+1).toString() });
        }
        else{
          this.nextChapter();
        }
      }
      break;

    case 'ArrowLeft':
      if(this.Chapter){
        if(this.VerseNumber>1){
          this.router.navigate([], { fragment: (this.VerseNumber-1).toString() });
        }
        else{
          this.previousChapter();
        }
      }
      break;
    default:
      break;
    }
  }
}
