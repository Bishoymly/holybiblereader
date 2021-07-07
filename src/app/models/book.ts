import { Chapter } from "./chapter";
import { Verse } from "./verse";
import { Version } from "./version";

export class Book{
        public Title : string = '';
        public Url : string = '';
        public UniqueId : string = '';
        public IsLoaded : boolean = false;
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

        public Load()
        {
            //BibleDictionary.Default.ProcessChaptersAsync(this);
        }
    }