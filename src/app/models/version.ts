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

    public ToString(): string {
        return this.Title;
    }
}
