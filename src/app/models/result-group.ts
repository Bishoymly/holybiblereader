import { BehaviorSubject } from "rxjs";
import { Book } from "./book";
import { Chapter } from "./chapter";
import { Verse } from "./verse";
import { Version } from "./version";

export class ResultGroup{
    public Book : Book;
    public Verses : Verse[] = [];

    constructor(book : Book){
        this.Book = book;
    }
}
