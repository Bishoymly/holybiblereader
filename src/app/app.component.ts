import { Component } from '@angular/core';
import { BibleService } from './services/bible.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Holy Bible Reader';

  constructor(
    public Bible: BibleService
  ) { 
    
  }
}
