import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book';
import { BookGroup } from '../models/book-group';
import { Chapter } from '../models/chapter';
import { ResultGroup } from '../models/result-group';
import { SearchResult } from '../models/search-result';
import { Settings } from '../models/settings';
import { Verse } from '../models/verse';
import { Version } from '../models/version';

@Injectable({
  providedIn: 'root'
})
export class BibleService {

  public Version = new BehaviorSubject<Version>(new Version());
  public Versions : Version[] = [];
  public Settings = new Settings();
  public Loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private http:HttpClient
  ) {

    let v = new Version();
    v.UniqueId = 'kjames';
    v.Url = 'kjames';
    v.IsArabic = false;
    v.Title = 'King James Bible';
    v.BookGroups.push(new BookGroup(), new BookGroup());
    v.BookGroups[0].Url = 'kjames/old';
    v.BookGroups[1].Url = 'kjames/new';
    this.Versions.push(v);

    v = new Version();
    v.UniqueId = 'arabic';
    v.Url = 'arabic';
    v.IsArabic = true;
    v.Title = 'الكتاب المقدس';
    v.BookGroups.push(new BookGroup(), new BookGroup(), new BookGroup());
    v.BookGroups[0].Url = 'arabic/old';
    v.BookGroups[1].Url = 'arabic/new';
    v.BookGroups[2].Url = 'arabic/second';
    this.Versions.push(v);

    this.Load();

    let current = this.Versions.find(v=>v.UniqueId == this.Settings.Version);
    if(current){
      this.SetVersion(current);
    }
    else{
      if(navigator.language.startsWith("ar")){
        this.SetVersion(this.Versions[1]);
      }
      else{
        this.SetVersion(this.Versions[0]);
      }
    }
  }

  public SetVersion(version: Version){
    if(this.Version.value !== version){
      this.Settings.Version = version.UniqueId;
      this.Settings.RTL = version.IsArabic;
      this.Save();
      if(version.Books.length == 0){
        this.processBooks(version, true);
      }
      this.Version.next(version);
    }
  }

  private processBooks(version : Version, loadData : boolean ){
    this.Loaded.next(false);
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
                    if (version.BookGroups[1].Books.length >= 27){
                      bookGroup = version.BookGroups[2];
                    }

                    var book = new Book(version);
                    book.UniqueId = words[0];
                    book.Url = bookGroup.Url + '/' + words[0];
                    book.Title = words[1];

                    version.Books.push(book);
                    bookGroup.Books.push(book);

                    this.ProcessChapters(book);
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
                    else if (version.BookGroups[2].Title === '')
                    {
                        version.BookGroups[2].Title = line;
                    }
                }
            }
        });
  }

  public ProcessChapters(book : Book){
    if (book.IsLoaded.value == false)
    {
        this.processChapters(book);
    }
  }

  private processChapters(book:Book){

    this.http.get('/assets/'+book.Version.Url + '/' + book.UniqueId+'.txt', {responseType: 'text'})
      .subscribe((full) => {
        console.log('/assets/'+book.Version.Url + '/' + book.UniqueId+'.txt');
        var chapter : Chapter | null = null;
        var str : string = '';

        book.Chapters = [];

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
        this.Version.value.Loaded++;
        if(this.Version.value.Loaded==this.Version.value.Total){
          this.Loaded.next(true);
        }
      });
  }

  private processContent(body : string, chapter : Chapter) : string {

    body = body.trim();

    if(!this.Settings.Tashkeel){
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
    v.Title = chapter.ToString() + ':' + v.Number;
    v.Url = chapter.Url + "#" + num;
    v.Text = body;
    v.SearchableText = this.MakeSearchable(v.OriginalText);
    chapter.Verses.push(v);
    chapter.Book.Verses.push(v);
    return v;
  }

  public MakeSearchable(word:string){
      word = word.toLowerCase();
      word = word.replace(/\p{M}/gu, '');
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
          else
              builder+=word[i];
      }

      return builder;
  }

  public Save() {
    const jsonData = JSON.stringify(this.Settings);
    localStorage.setItem('settings', jsonData);
  }

  Load() {
    this.Settings = JSON.parse(localStorage.getItem('settings')??'{}');
  }

  public Search(SearchQuery:string, SearchLocation:string):SearchResult {
  var result = new SearchResult();

  /*if (isNumber(SearchQuery))
  {
      //Try to go to chapter in the current book
      //Otherwise this number is not going to be found in search
      if (XmlSiteMapProvider.FindNode(SearchLocation.Url + "/" + SearchQuery) != null)
      {
          result.URL = XmlSiteMapProvider.FindNode(SearchLocation.Url + "/" + SearchQuery).Url;
          return result;
      }
  }*/

  //Bug fix: Adding a space between the first number that is preceded with letter
  //So "Gen10" should be "Gen 10"
  /*for (int i = 0; i < SearchQuery.Length - 1; i++)
  {
      if (char.IsLetter(SearchQuery[i]) && char.IsNumber(SearchQuery[i + 1]))
      {
          SearchQuery = SearchQuery.Insert(i + 1, " ");
          break;
      }
  }*/

  var keywords = SearchQuery.split(' ');//, ':', '-');
  for (let i = 0; i < keywords.length; i++) {
    console.log(keywords[i] + ' > ' + this.MakeSearchable(keywords[i]));
    keywords[i] = this.MakeSearchable(keywords[i]);
  }

  var version = this.Version.value;

  //Check for verse or chapter
  /*int s = 0;
  int shortcut = 0;
  string key = "";
  string url = "";
  string number = "";

  do
  {
      key += keywords[s];
      s++;

      if (Shortcuts.ContainsKey(key))
      {
          url = Shortcuts[key];
          shortcut = s;
      }
  }
  while (keywords.Length > s);

  if (string.IsNullOrEmpty(url) == false)
  {
      if ((keywords.Length > shortcut) && (isNumber(keywords[shortcut])))
      {
          url = url + "/" + keywords[shortcut];
          shortcut++;

          if (keywords.Length > shortcut)
          {
              number = keywords[shortcut];
              shortcut++;

              if (keywords.Length > shortcut)
              {
                  number = number + "-" + keywords[shortcut];
                  shortcut++;
              }
          }

          result.URL = SearchLocation.Url + url;//, number);
          return result;
      }
  }*/

  //Actual Search
  var searchResultsCount = 0;
  version.Books.forEach(b => {
    var currentGroup = new ResultGroup(b);
      b.Verses.forEach(v => {
        //if (this.inLocation(v.Url, SearchLocation)){
          var found = true;
          keywords.forEach(keyword => {
            if (v.SearchableText.indexOf(keyword) < 0){
              found = false;
            }
          });

          if (found) {
            searchResultsCount++;
            currentGroup.Verses.push(v);
          }
        //}
      });

      if (currentGroup.Verses.length > 0){
        result.TotalVerses+=currentGroup.Verses.length;
        result.Groups.push(currentGroup);
      }
    });

    return result;
  }

  private inLocation(url:string, locations:string):boolean {
    var l = locations.split(',');
    for (let i = 0; i < l.length; i++) {
      const location = l[i];
      if (url.startsWith(location + "/") || url.startsWith(location + "#")){
        return true;
      }
    }
    return false;
  }

  private isNumber(text:string) {
    return /^-?\d+$/.test(text);
  }
}
