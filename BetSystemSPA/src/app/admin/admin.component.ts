import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { currency } from './../_models/currency';
import { CurrencyService } from './../_services/currency.service';
import { Router } from '@angular/router';
import { SnackBarService } from './../_services/snack-bar.service';
import { Season } from './../_models/season';
import { SeasonService } from './../_services/season.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { SeasonNew } from '../_models/seasonNew';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  seasonForm: FormGroup;
  seasonShow: boolean = false;
  currencyShow: boolean = false;
  season: Season;
  seasons: Season[];
  currencies: currency[];
  currencySelected: currency;
  modalSeason: BsModalRef;
  displayedColumns: string[] = ['no', 'name', 'date-start', 'active', 'date-closed', 'selected', 'teams', 'bets', 'profit'];

  constructor(private fb: FormBuilder,
      private seasonService: SeasonService,
      private snackBar: SnackBarService,
      private router: Router,
      private modalService: BsModalService,
      private currencyService: CurrencyService) {}

  ngOnInit() {
    this.getSeasons();
    this.getCurrencies();
    this.createSeasonForm();
  }

  createSeasonForm(){
    this.seasonForm = this.fb.group({
      name: ['', 
        [Validators.required, Validators.maxLength(36), Validators.minLength(6)]
      ],
      selected: [false, Validators.required]
    },
      { validator: this.seasonNameValidation }
    );
  }

  seasonNameValidation(g: FormControl){
    let name: string = g.get('name').value;
    let seasonsList = document.getElementsByClassName('mat-column-name') as HTMLCollectionOf<HTMLElement>;
    for (let i = 1; i < seasonsList.length; i++) {
      if(name && (seasonsList[i].innerText.toLowerCase() === name.toLowerCase()) )
          return {'error': true};    
    }
    return null;
  }

  errorMessage(){
    return '"' + this.seasonForm.value.name.toUpperCase() + '" already exists in Seasons list.';
  }

  getSeasons(){
    this.seasonService.getSeasons()
      .subscribe( data => {
        this.seasons = data;
        this.seasonService.changeSelectedSeason(this.seasons.find(x => x.selected));
      }, error => {
        this.snackBar.snackBarMessage(error, 'Close', 'error');
      });
  }

  addSeason(){
    let season = {} as SeasonNew;
    Object.assign(season, this.seasonForm.value);
    this.seasonService.addSeason(season)
      .subscribe( s => {
        let seasonFromDb = s;
        this.snackBar.snackBarMessage(season.name.toUpperCase() + ' has been added to the database', 'Ok', 'confirm');
        
        // send the new selected season to jumbotron component throughout a shared service
        if(seasonFromDb.selected) this.seasonService.changeSelectedSeason(seasonFromDb);
        this.cancel();
        this.getSeasons();
      }, error => {
        this.snackBar.snackBarMessage(error, 'Close', 'error');
      });
  }

  cancel(){
    this.seasonShow = false;
    this.seasonForm.reset();
  }

  selectSeason(id){
    this.seasonService.selectSeason(id)
      .subscribe( next => {
        this.getSeasons();
        let season = this.seasons.find(x => x.id == id);
        this.snackBar.snackBarMessage(season.name.toUpperCase() + ' has been selected', 'Ok', 'message');
        // send the new selected season to jumbotron component throughout a shared service
        this.seasonService.changeSelectedSeason(season);
      }, error => {
        this.snackBar.snackBarMessage(error, 'Close', 'error');
      });
      
  }

  getCurrencies(){
    this.currencyService.getCurrencies()
      .subscribe( data => {
        this.currencies = data;
        this.currencySelected = this.currencies.find(c => c.isSelected);
      }, error => {
        this.snackBar.snackBarMessage(error, 'Close', 'error');
      });
  }

  selectCurrency(id){
    this.currencySelected = this.currencies.find(c => c.id == id);
    this.currencyService.selectCurrency(id)
      .subscribe( next => {
        this.currencyShow = false;
        // send the new selected currency to other components throughout a shared service
        this.currencyService.getSelectedCurrencyFromHome(this.currencySelected);
        this.snackBar.snackBarMessage(this.currencySelected.name.toUpperCase() + ' is the selected currency', 'Ok', 'message');
      }, error => {
        this.snackBar.snackBarMessage(error, 'Close', 'error');
      });
  }

  // closing season modal
  openSeasonDialog(template: TemplateRef<any>, season: Season){
    this.season = season;
    this.modalSeason = this.modalService.show(template, {class: 'modal-md'});
  }

  modalConfirm(){
    this.seasonService.closeSeason(this.season.id)
      .subscribe( next => {
        this.snackBar.snackBarMessage(this.season.name.toUpperCase() + ' has been closed', 'Ok', 'confirm');
        
        this.getSeasons();
      }, error => {
        this.snackBar.snackBarMessage(error, 'Close', 'error');
      }, () => {
        this.modalCancel();
      });
    
  }

  modalCancel(){
    this.modalSeason.hide();
    this.season = Object.values = null;
  }
}
