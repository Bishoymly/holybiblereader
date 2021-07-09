import { BehaviorSubject } from "rxjs";
import { Chapter } from "./chapter";
import { Verse } from "./verse";
import { Version } from "./version";

export class Book{
        public Title : string = '';
        public Url : string = '';
        public UniqueId : string = '';
        public IsLoaded : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
        public Color : string =  '#ffffff';

        public Chapters : Chapter[] = [];

        public Version : Version;
        public Verses : Verse[] = [];

        constructor(version : Version){
            this.Version = version;
        }

        public ToString() : string
        {
            return this.Title;
        }
    }
