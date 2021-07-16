import { ViewportScroller } from '@angular/common';
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
    private viewportScroller: ViewportScroller,
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
              else{
                this.setVerse(0);
              }
            }
          })
        }
      });
    });

    this.route.fragment.subscribe(fragment =>{
      if(fragment){
        this.setVerse(parseInt(fragment));
      }
      else{
        this.setVerse(0);
      }
    });    
  }

  nextChapter(selectVerse = false){
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
        else{
          ch--;
        }
      }

      if(selectVerse){
        this.router.navigate([this.Book.Url, ch.toString()], { fragment: '1' });
      }
      else{
        this.VerseNumber = 0;
        this.router.navigate([this.Book.Url, ch.toString()]);
      }
    }
  }

  previousChapter(selectVerse = false){
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
      
      if(ch == 0){
        ch = 1;
        selectVerse = false;
      }
      
      if(selectVerse){
        this.Chapter = this.Book?.Chapters.find(b=>b.UniqueId == ch.toString());
        this.router.navigate([this.Book.Url, ch.toString()], { fragment: this.Chapter?.Verses.length.toString() });
      }
      else{
        this.VerseNumber = 0;
        this.router.navigate([this.Book.Url, ch.toString()]);
      }
    }
  }

  setVerse(num : number){

    if(this.Verse){
      this.Verse.IsSelected = false;
    }

    this.VerseNumber = num;
    if(this.VerseNumber == 0 || this.VerseNumber == 1){
      this.viewportScroller.scrollToPosition([0,0]);
    }

    this.Verse = this.Chapter?.Verses[this.VerseNumber - 1];

    if(this.Verse){
      this.Verse.IsSelected = true;
      setTimeout(()=>{
        if(this.VerseNumber > 1){
          this.viewportScroller.scrollToAnchor(this.VerseNumber.toString());
        }
      }, 1);
    }
  }

  verseClick(verse:Verse){
    if(this.Verse){
      verse.IsSelected = !verse.IsSelected;
    }
    else{
      this.router.navigate([], { fragment: (verse.Number).toString() });
    }    
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    switch(event.code){
    case 'ArrowRight':
      if(this.Chapter){
        if(this.VerseNumber<this.Chapter.Verses.length){
          this.router.navigate([], { fragment: (this.VerseNumber+1).toString(), replaceUrl: false });
        }
        else{
          this.nextChapter(true);
        }
      }
      break;

    case 'ArrowLeft':
      if(this.Chapter){
        if(this.VerseNumber>1){
          this.router.navigate([], { fragment: (this.VerseNumber-1).toString(), replaceUrl: false});
        }
        else{
          this.previousChapter(true);
        }
      }
      break;
    default:
      break;
    }
  }
}
