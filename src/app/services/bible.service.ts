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
  public Loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private http:HttpClient
  ) {
    this.Version.Url = 'kjames';
    this.Version.BookGroups.push(new BookGroup(), new BookGroup());
    this.Version.BookGroups[0].Url = 'kjames/old';
    this.Version.BookGroups[1].Url = 'kjames/new';
    this.processBooks(this.Version, false);
  }

  private processBooks(version : Version, loadData : boolean ){

    this.http.get('/assets/'+version.Url+'/index.txt', {responseType: 'text'})
        .subscribe((data) => {
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
                    if (version.OldTestamentTitle === '')
                    {
                        version.OldTestamentTitle = line;
                        version.BookGroups[0].Title = line;
                    }
                    else if (version.NewTestamentTitle === '')
                    {
                        version.NewTestamentTitle = line;
                        version.BookGroups[1].Title = line;
                    }
                }
            }

            this.Loaded.next(true);
        });
  }

  private processChapters(book:Book, loadData:boolean){

    this.http.get('/assets/'+book.Version.Url + '/' + book.UniqueId+'.txt', {responseType: 'text'})
      .subscribe((full) => {
        var chapter : Chapter | null = null;
        var str : string = '';
        for (const line of full.split(/[\r\n]+/)){
            if (line.startsWith('==')){
                if (chapter!=null)
                {
                    chapter.Content = this.processContent(str, chapter);
                    str = '';
                }

                var ch = parseInt(line.replace(/==/g, ''));
                chapter = new Chapter(book);
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

        book.IsLoaded.next(true);
      });
  }

  public ProcessChapters(book : Book){
      if (book.IsLoaded.value == false)
      {
          this.processChapters(book, true);
      }
  }

  private processContent(body : string, chapter : Chapter) : string {

      body = body.trim();
      //body = body.replace(/\r\n\r\n\r\n/g, '');

      //body = body.replace(/\n/g, '').replace(/\r/g, '');
      //body = body.replace((char)160, (char)32);

      //Index verses
      var verse = 1;
      var verseStart = 0;
      var spanOpened = false;
      while (true)
      {
          var index = body.indexOf(verse.toString() + " ", verseStart);
          if (index == -1)
              break;
          else
          {
              if (spanOpened)
              {
                  var v = new Verse();
                  v.Number = (verse - 1).toString();
                  v.Url = chapter.Url + "#" + (verse - 1).toString();
                  v.Text = chapter.Title + " : " + (verse - 1).toString() + "  " + body.substring(verseStart, index - verseStart).trim();
                  v.SearchableText = this.MakeSearchable(body.substring(verseStart, index - verseStart).trim());
                  chapter.Book.Verses.push(v);
              }
              spanOpened = true;
              verseStart = index + verse.toString().length;
              verse++;
          }
      }
      if (spanOpened)
      {
          var v = new Verse();
          v.Number = (verse - 1).toString();
          v.Url = chapter.Url + "#" + (verse - 1).toString();
          v.Text = chapter.Title + " : " + (verse - 1).toString() + "  " + body.substring(verseStart).trim();
          v.SearchableText = this.MakeSearchable(body.substring(verseStart).trim());
          chapter.Book.Verses.push(v);
      }

      return body;
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
