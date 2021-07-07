export class Verse {
        
    public Number: string = '';
    public Text: string = '';
    public SearchableText: string = '';
    public Url:string = '';
    
    public Copy(): Verse {
        let v: Verse = new Verse();
        v.Number = this.Number;
        v.Url = this.Url;
        v.Text = this.Text;
        v.SearchableText = this.SearchableText;
        return v;
    }
}
