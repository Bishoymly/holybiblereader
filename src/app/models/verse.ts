export class Verse {

  public Number: number = 0;
  public Text: string = '';
  public SearchableText: string = '';
  public Url:string = '';
  public get IsEndOfParagraph(): boolean {
    return this.Text.indexOf('\r\n')>-1;
  }

  public Copy(): Verse {
      let v: Verse = new Verse();
      v.Number = this.Number;
      v.Url = this.Url;
      v.Text = this.Text;
      v.SearchableText = this.SearchableText;
      return v;
  }
}
