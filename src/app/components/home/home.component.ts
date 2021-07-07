import { Component, OnInit } from '@angular/core';
import { BibleService } from 'src/app/services/bible.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public Bible: BibleService) { }

  ngOnInit(): void {
  }

}
