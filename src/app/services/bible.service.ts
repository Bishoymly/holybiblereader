import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book';
import { BookGroup } from '../models/book-group';
import { Chapter } from '../models/chapter';
import { Verse } from '../models/verse';
import { Version } from '../models/version';

@Injectable({
  providedIn: 'root'
})
export class BibleService {

  public Version : Version = new Version();
  public Versions : Version[] = [];
  public DarkMode:boolean = true;
  public RTL:boolean = true;
  public Tashkeel:boolean = false;
  public Loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private http:HttpClient
  ) {

    let v = new Version();
    v.Url = 'kjames';
    v.IsArabic = false;
    v.Title = 'King James Bible';
    v.BookGroups.push(new BookGroup(), new BookGroup());
    v.BookGroups[0].Url = 'kjames/old';
    v.BookGroups[1].Url = 'kjames/new';
    this.Versions.push(v);

    v = new Version();
    v.Url = 'arabic';
    v.IsArabic = true;
    v.Title = 'الكتاب المقدس';
    v.BookGroups.push(new BookGroup(), new BookGroup());
    v.BookGroups[0].Url = 'arabic/old';
    v.BookGroups[1].Url = 'arabic/new';
    this.Versions.push(v);

    this.Version = this.Versions[0];
    this.RTL = this.Version.IsArabic;

    this.processBooks(this.Version, false);
  }

  private processBooks(version : Version, loadData : boolean ){

    this.http.get('/assets/'+version.Url+'/index.txt', {responseType: 'text'})
        .subscribe((data) => {
            console.log('/assets/'+version.Url+'/index.txt');
            var i = 0;
            for (const line of data.split(/[\r\n]+/)){

                var words = line.split(',');
                if (words.length > 1){
                    i++;

                    var bookGroup = version.BookGroups[0];
                    if (version.BookGroups[0].Books.length >= 39){
                      bookGroup = version.BookGroups[1];
                    }

                    var book = new Book(version);
                    book.UniqueId = words[0];
                    book.Url = bookGroup.Url + '/' + words[0];
                    book.Title = words[1];

                    version.Books.push(book);
                    bookGroup.Books.push(book);
                }
                else{
                    if (version.BookGroups[0].Title === '')
                    {
                        version.BookGroups[0].Title = line;
                    }
                    else if (version.BookGroups[1].Title === '')
                    {
                        version.BookGroups[1].Title = line;
                    }
                }
            }

            this.Loaded.next(true);
        });
  }

  public ProcessChapters(book : Book){
    if (book.IsLoaded.value == false)
    {
        this.processChapters(book, true);
    }
  }

  private processChapters(book:Book, loadData:boolean){

    this.http.get('/assets/'+book.Version.Url + '/' + book.UniqueId+'.txt', {responseType: 'text'})
      .subscribe((full) => {
        console.log('/assets/'+book.Version.Url + '/' + book.UniqueId+'.txt');
        var chapter : Chapter | null = null;
        var str : string = '';
        full = full.replace(/\r\n\r\n/g, '<break>');
        for (const line of full.split(/[\r\n]+/)){
          if (line.startsWith('==')){
            if (chapter!=null)
            {
                chapter.Content = this.processContent(str, chapter);
                str = '';
            }

            var ch = parseInt(line.replace(/==/g, ''));
            chapter = new Chapter(book);
            chapter.Number = ch;
            chapter.UniqueId = ch.toString();
            chapter.Url = book.Url + "/" + ch.toString();
            chapter.Book = book;
            chapter.Title = ch.toString();
            book.Chapters.push(chapter);
          }
          else
          {
            if (!line.startsWith("Chapter ") && !line.startsWith("الأصحاح ") && !line.startsWith("Psalm ") && !line.startsWith("مزمور ")){
              str += line + '\r\n';
            }
          }
        }

        if(chapter!=null){
          chapter.Content = this.processContent(str, chapter);
        }
        book.Chapters.sort((a, b)=> a.Number - b.Number);
        book.IsLoaded.next(true);
      });
  }

  private processContent(body : string, chapter : Chapter) : string {

    body = body.trim();
    body = body.replace(/\r/g, '').replace(/\r/g, '').replace(/<break>/g, '\r\n');
    if(!this.Tashkeel){
      body = body.replace(/\p{M}/gu, '');
    }
    
    //body = body.replace((char)160, (char)32);

    //Index verses
    var verse = 1;
    var verseStart = 0;

    verseStart = body.indexOf(verse.toString() + " ", verseStart);

    do
    {
      //find next verse number
      verseStart += verse.toString().length + 1;
      var nextStart = body.indexOf((verse+1).toString() + " ", verseStart);

      if(nextStart > -1){
        this.createVerse(chapter, verse, body.substring(verseStart, nextStart));
      }
      else{
        this.createVerse(chapter, verse, body.substring(verseStart));
      }
      verseStart = nextStart;
      verse++;
    }
    while(verseStart>-1);

    return body;
  }

  private createVerse(chapter:Chapter, num:number, body:string):Verse{
    var v = new Verse();
    v.Number = num;
    v.Url = chapter.Url + "#" + num;
    v.Text = body;
    v.SearchableText = this.MakeSearchable(body.trim());
    chapter.Verses.push(v);
    chapter.Book.Verses.push(v);
    return v;
  }

  public MakeSearchable(word:string){
      word = word.toLowerCase();
      var previousSpace = false;
      var builder = '';
      for (let i = 0; i < word.length; i++) {

          if (/\s/.test(word[i]) && previousSpace == false)
              builder+=' ';
          else if (word[i] == 'أ')
              builder+='ا';
          else if (word[i] == 'إ')
              builder+='ا';
          else if (word[i] == 'آ')
              builder+='ا';
          else if (word[i] == 'ى')
              builder+='ي';
          else if (word[i] == 'ة')
              builder+='ه';
          else if (word[i] == 'ؤ')
              builder+='و';
          else if (word[i] == 'ص')
              builder+='س';
          else if (word[i] == 'ض')
              builder+='د';
          else if (/^\d+$/.test(word[i]))
              builder+=word[i];
      }

      return builder;
  }
}
