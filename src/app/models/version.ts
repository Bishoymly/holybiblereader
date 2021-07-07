import { Book } from "./book";
import { BookGroup } from "./book-group";

export class Version {
    
    public Title: string = '';
    public Url: string = '';
    public UniqueId: string = '';
    public OldTestamentTitle: string = '';
    public NewTestamentTitle: string = '';
    public IsLoaded: boolean = false;
    public Books: Book[] = [];
    public BookGroups: BookGroup[] = [];
    public OldTestamentBooks: Book[] = [];
    public NewTestamentBooks: Book[] = [];
    
    public Load() {
        // Make sure all version is loaded
        this.Books.forEach((book : Book)=>{
            if ((book.IsLoaded == false)) {
                book.Load();
            }
        });        
    }
    
    public ToString(): string {
        return this.Title;
    }
}