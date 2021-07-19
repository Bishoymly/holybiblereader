import { Book } from "./book";
import { BookGroup } from "./book-group";

export class Version {

    public Title: string = '';
    public Url: string = '';
    public UniqueId: string = '';
    public IsLoaded: boolean = false;
    public Books: Book[] = [];
    public BookGroups: BookGroup[] = [];
    public IsArabic: boolean = false;

    public ToString(): string {
        return this.Title;
    }
}
