import { Book } from "./book";
import { Verse } from "./verse";

export class Chapter {

  public Title: string = '';
  public Number: number = 0;
  public Url: string ='';
  public UniqueId: string ='';
  public OriginalContent: string = '';

  private _content: string = '';

  public get Content(): string {
      return this.OriginalContent;
  }

  public set Content(value: string)  {
      this.OriginalContent = value;
      this._content = value;
  }

  public get Lines(): string[] {
    return this.Content?.split(/[\r\n]+/);
  }

  public Verses: Verse[] = [];

  public Book: Book;

  public get SelectedVerses(): Verse[] {
      var selectedVerses:Verse[] = [];
      this.Verses.forEach(verse => {
          if(verse.IsSelected){
              selectedVerses.push(verse);
          }
      });
      return selectedVerses;
  }

  public ClearSelection(){
      this.Verses.forEach(verse => {
          verse.IsSelected = false;
      });
  }

  public Select(fragment:string) : number{
      this.ClearSelection();
      var firstVerseNumber = 0;
      var ranges = fragment.split(',').map(range=>range.split('-').map(r=>parseInt(r)));
      for (let i = 0; i < ranges.length; i++) {
          for (let num = ranges[i][0]; num <= (ranges[i].length>1?ranges[i][1]:ranges[i][0]); num++) {
            if(firstVerseNumber == 0) firstVerseNumber = num;
            this.Verses[num - 1].IsSelected = true;
          }
      }
      return firstVerseNumber;
  }

  public SelectionToFragment() : string{
    var startRange = -1;
    var endRange = -1;
    var fragment = '';

    for (let i = 0; i < this.Verses.length; i++) {
        const verse = this.Verses[i];
        if(verse.IsSelected && startRange == -1){
            startRange = verse.Number;
        }

        if(!verse.IsSelected && startRange>=0){
            endRange = verse.Number - 1;

            if(fragment.length>0){
                fragment += ',';
            }

            if(startRange == endRange){
                fragment += startRange;
            }
            else{
                fragment += startRange + '-' + endRange;
            }

            startRange = -1;
            endRange = -1;
        }
    }

    return fragment;
  }

  constructor(book : Book){
      this.Book = book;
  }

  public ToString(): string {
      return (this.Book.Title + " " + this.Title);
  }
}
