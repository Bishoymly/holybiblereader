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

      /*if ((Windows.Globalization.ApplicationLanguages.PrimaryLanguageOverride.StartsWith("ar")
                  && (Settings.Default.ShowTashkeel == false))) {
          return this.RemoveTashkeel(OriginalContent);
      }
      else {*/
          return this.OriginalContent;
      //}
  }

  public set Content(value: string)  {
      this.OriginalContent = value;
      this._content = value;
      /*Lines = Content.Split([
                  "
"], StringSplitOptions.None);*/
  }

  /*private RemoveTashkeel(body: string): string {
      for (let i: number = 0; (i < body.Length); i++) {
          if ((((<number>(body[i])) >= 1611)
                      && ((<number>(body[i])) <= 1631))) {
              body = body.Remove(i, 1);
              i--;
          }

      }

      return body;
  }*/

  public get Lines(): string[] {
    return this.Content?.split(/[\r\n]+/);
  }

  public Verses: Verse[] = [];

  public Book: Book;

  constructor(book : Book){
      this.Book = book;
  }

  public ToString(): string {
      return (this.Book.Title + " " + this.Title);
  }
}
