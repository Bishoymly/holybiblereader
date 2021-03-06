export class Verse {

  public Number: number = 0;
  public Title: string = '';
  public OriginalText: string = '';
  private _Text: string = '';
  public get Text(): string {
    return this._Text;
  }
  public set Text(value: string) {
    this.OriginalText = value.replace(/{(.*)}/g,'');
    this._Text = '<sup aria-hidden="true">' + this.Number + '</sup> ' + value.replace(/{(.*)}/g,'');

    // putting word definitions
    var match = value.match(/{(.*):(.*)}/);
    if(match){
      if(match.length>=2){
        var word = match[1].replace('…','');
        var meaning = match[2];
        this._Text = this._Text.replace(word, '<dfn tabindex="0" title="'+meaning+'">'+word+'</dfn>');
      }
    }
  }

  public getTextHighlighted(query:string){
    let words = query.split(' ');
    let text = this.OriginalText.replace(/\p{M}/gu, '');
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/\p{M}/gu, '');
      var regEx = new RegExp(word, "ig");
      text = text.replace(regEx, '<span class="selectedverse">'+ word+'</span>');  
    }
    
    return text;
  }

  public SearchableText: string = '';
  public Url:string = '';
  public IsSelected: boolean = false;
  public get IsEndOfParagraph(): boolean {
    return this.Text.indexOf('\r')>-1;
  }

  public Copy(): Verse {
      let v: Verse = new Verse();
      v.Number = this.Number;
      v.Url = this.Url;
      v._Text = this._Text;
      v.SearchableText = this.SearchableText;
      return v;
  }
}
