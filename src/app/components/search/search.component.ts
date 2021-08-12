import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultGroup } from 'src/app/models/result-group';
import { SearchResult } from 'src/app/models/search-result';
import { BibleService } from 'src/app/services/bible.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public Query:string='';
  public Location:string='';
  public Results = new SearchResult();

  constructor(
    private route: ActivatedRoute,
    public router : Router,
    private titleService: Title,
    public Bible: BibleService
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe( route => {
      var url = route;
      this.Bible.Loaded.subscribe( loaded => {
        let v = this.Bible.Versions.find(v=>v.UniqueId == url[0].path);
        if(v){
          this.Bible.SetVersion(v);
        }
      });
    });

    this.route.queryParams.subscribe( route => {
      this.Bible.Loaded.subscribe( loaded => {
        this.Query = this.route.snapshot.queryParams.q;
        this.Location = this.route.snapshot.queryParams.where;
        this.titleService.setTitle('Search for \''+this.Query+'\'');
        if(loaded){
          this.Results = this.Bible.Search(this.Query, this.route.snapshot.queryParams.where);
        }
      });
    });
  }

}
