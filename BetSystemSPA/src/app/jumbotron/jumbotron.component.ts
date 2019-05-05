import { BetService } from './../_services/bet.service';
import { Season } from './../_models/season';
import { SeasonService } from './../_services/season.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css'],
})
export class JumbotronComponent implements OnInit {
  quotes = ['Done is better than perfect', 'Practice makes the master', 'Simplicity is the ultimate sophistication'];
  season: Season;
  pageName: string = 'Home';
  noBets: number;
  noUnsettled: number;
  index = 0;

  constructor(private seasonService: SeasonService,
    private betService: BetService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.getSeason();
    this.getPageName();

    // update the season's info when change selection from admin component
    this.seasonService.currentSeason
      .subscribe(s => this.season = s);

    this.betService.noBets
      .subscribe(data => {
        this.noBets = data['a'];
        this.noUnsettled = data['b'];
      });
  }

  getSeason() {
    this.seasonService.getSelectedSeason()
      .subscribe(s => {
        // Object.assign(this.season, s);
        this.season = s;
      });
  }

  getPageName() {
    this.router.events.subscribe((res) => {
      let page = this.router.url;
      page = page === '/' ? 'home' : page === '/new-bet' ? 'new bet' : page.substr(1);
      page = page.startsWith("bets") ? page = 'bets' : page;

      if(this.pageName != page.toUpperCase()) {
        this.index = this.index + 1 == this.quotes.length ? 0 : this.index + 1;
      }
      this.pageName = page.toUpperCase();
    });
  }

}
