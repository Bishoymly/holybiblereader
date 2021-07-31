import { BehaviorSubject } from "rxjs";
import { Book } from "./book";
import { Chapter } from "./chapter";
import { ResultGroup } from "./result-group";
import { Verse } from "./verse";
import { Version } from "./version";

export class SearchResult{
    public TotalVerses = 0;
    public Groups:ResultGroup[] = [];
}
