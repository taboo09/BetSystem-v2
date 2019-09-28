import { betUpdate } from './../_models/betUpdate';
import { ActivatedRoute } from '@angular/router';
import { currency } from './../_models/currency';
import { CurrencyService } from './../_services/currency.service';
import { SnackBarService } from './../_services/snack-bar.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BetService } from '../_services/bet.service';
import { bet } from '../_models/bet';
import { MatTableDataSource } from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap';
import { BetsCount } from '../_models/betsCount';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {
  bets: bet[];
  bet: bet;
  betsCount: BetsCount;
  teamId: any;
  selectedValue: string;
  currency: currency;
  state: string = '';
  modalBet: BsModalRef;
  editForm: FormGroup;
  dataSource;
  displayedColumns: string[] = ['id', 'team', 'date', 'match', 'odd', 'stake', 'total', 'won', 'cash_out', 'return'];
  start: number = 0;
  finished = true;

  constructor(private betService: BetService,
      private modalService: BsModalService,
      private currencyService: CurrencyService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private snackBarService: SnackBarService) { }
  
  ngOnInit() {
    // get teamId from url
    this.route.params.subscribe(params => {
      this.teamId = +params['teamId'];
    });
    
    this.getBetsCount();
    this.selectedValue = 'last15';    
    this.getSelectedCurrency();
  }

  createEditForm(){
    this.editForm = this.fb.group({
      return: [this.bet.cashReturn],
      won: [null, Validators.required],
      withdrawal: [0, Validators.required]
    },
      {validator: [this.withdrawalValidation, this.cashReturnValidation]}
    );
  }

  withdrawalValidation(g: FormGroup){
    return isNaN(g.get('withdrawal').value) ? null :
    g.get('withdrawal').value >= 0 ? null : {'validation': true};
  }

  cashReturnValidation(g: FormGroup){
    return g.get('withdrawal').value <= g.get('return').value ? null : {'cashReturn': true};
  }

  withDrawalValidationMessage() {
    return this.editForm.get('withdrawal').hasError('required') ? "Value is required!" :
      this.editForm.hasError('validation') ? "Value needs to be a positive number!" :
      this.editForm.hasError('cashReturn') ? "Withdrawal cannot be higher than " + this.editForm.get('return').value : "";
  }

  getBetsCount(){
    this.betService.getCount()
      .subscribe(data => {
        this.betsCount = data;
        // this.betService.getNoBets(Object.create({ 'a' : this.betsCount.count, 'b' : this.betsCount.unsettled }));
        this.sharedServiceBetsCount(this.betsCount.count, this.betsCount.unsettled);
        if(this.teamId && this.teamId > 0){
          this.getBetsByTeamId(this.teamId);
        } else {
          this.getCustomBets('last15');
        }
      });
  }

  sharedServiceBetsCount(count: number, unsettled: number){
    this.betService.getNoBets(Object.create({ 'a' : count, 'b' : unsettled }));
  }

  getInfiniteBets(){
    if (this.bets.length < this.betsCount.count) {
      this.betService.getBets(this.start)
        .subscribe(bets => {
          this.bets = [...this.bets,...bets];
          this.finished = this.bets.length < this.betsCount.count ? false : true;
          this.selectedValue = 'all';
          this.dataSource = new MatTableDataSource(this.bets);
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      });
    } 
  }
  
  getBetsByTeamId(teamId: number){
    this.finished = true;
    this.selectedValue = '';
    this.betService.getBetsByTeamId(teamId)
      .subscribe(bets => {
        this.bets = bets;
        this.dataSource = new MatTableDataSource(this.bets);
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      });
  }

  enableDelete(){
    if (this.displayedColumns.indexOf('delete') > 0) 
      this.displayedColumns.splice(this.displayedColumns.length - 1, 1);
    else 
      this.displayedColumns.push('delete');
  }

  openBetDialog(template: TemplateRef<any>, bet: bet, state: string){
    this.bet = bet;
    this.state = state;
    this.modalBet = this.modalService.show(template, {class: 'modal-md'});

    // To bind bet.match.cashReturn value to form control property
    this.createEditForm();
  }

  modalConfirm(): void {
    if (this.state === 'edit') {
      let betToUpdate = {} as betUpdate;
      betToUpdate.id = this.bet.id;
      Object.assign(betToUpdate, this.editForm.value);
      this.betsCount.unsettled--;
      this.betService.editBet(betToUpdate)
        .subscribe( next => {
          let messageType = String(betToUpdate.won) == "true" ? 'message' : 'confirm';
          this.snackBarService.snackBarMessage(next['message'], "Ok", messageType);
          this.getCustomBets('last15');
          this.sharedServiceBetsCount(this.betsCount.count, this.betsCount.unsettled);
        }, error => {
          this.snackBarService.snackBarMessage(error, "Close", "error");
        });
    } 
    else if (this.state === 'delete') {
      this.betsCount.count--;
      if(this.bet.won == null) this.betsCount.unsettled--;
      this.betService.deleteBet(this.bet.id)
        .subscribe( next => {
          this.getCustomBets('last15');
          this.sharedServiceBetsCount(this.betsCount.count, this.betsCount.unsettled);
          this.snackBarService.snackBarMessage(next['message'], "Ok", "confirm");
      }, error => {
        this.snackBarService.snackBarMessage(error, "Close", "error");
      });
    }
    this.modalCancel();
  }

  getSelectedCurrency(){
    this.currencyService.selectedCurrency
      .subscribe(c => this.currency = c);
  }
 
  modalCancel(): void {
    this.modalBet.hide();
    this.state = '';
    this.bet = Object.values = null;
  }

  sortDesc(){
    this.bets.sort((a, b) => b.profit - a.profit);
    this.dataSource = new MatTableDataSource(this.bets);
  }

  displayAll(){
    this.finished = false;
    this.start = 0;
    this.bets = [];
    this.getInfiniteBets();
  }

  getCustomBets(selection: string){
    this.finished = true;
    this.selectedValue = selection;
    this.start = 0;
    this.betService.getCustomBets(selection)
      .subscribe(bets => {
        this.bets = bets;
        this.dataSource = new MatTableDataSource(this.bets);
      }, error => {
        this.snackBarService.snackBarMessage(error, "Close", "error");
      })
  }

  onScrollDown () {
    if (!this.finished){
      console.log('scrolled down!!');

      this.start += 50;
      this.getInfiniteBets();
    }
  }

}