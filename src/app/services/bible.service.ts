import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { BookGroup } from '../models/book-group';
import { Version } from '../models/version';

@Injectable({
  providedIn: 'root'
})
export class BibleService {

    public Version : Version = new Version();

  constructor(
      private http:HttpClient
  ) { 
    this.Version.Url = 'kjames';
    this.Version.BookGroups.push(new BookGroup(), new BookGroup());
    this.processBooksAsync(this.Version, false);
  }

  private processBooksAsync(version : Version, loadData : boolean ){

    this.http.get('/assets/'+version.Url+'/Index.txt', {responseType: 'text'})
        .subscribe((data) => {
            var i = 0;
            for (const line of data.split(/[\r\n]+/)){
                
                var words = line.split(',');
                if (words.length > 1){
                    i++;
                    var book = new Book(version);
                    book.UniqueId = words[0];
                    book.Url = version.Url + '/' + words[0];
                    book.Title = words[1];
                    book.IsLoaded = loadData;

                    version.Books.push(book);

                    if (version.BookGroups[0].Books.length < 39)
                        version.BookGroups[0].Books.push(book);
                    else
                        version.BookGroups[1].Books.push(book);
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
        });
  }
}