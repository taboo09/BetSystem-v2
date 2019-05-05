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
import { betUpdate } from '../_models/betUpdate';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {
  bets: bet[];
  initialBets: bet[];
  bet: bet;
  teamId: any;
  selectedValue: string;
  currency: currency;
  state: string = '';
  modalBet: BsModalRef;
  editForm: FormGroup;
  dataSource;
  displayedColumns: string[] = ['id', 'team', 'date', 'match', 'odd', 'stake', 'total', 'won', 'cash_out', 'return'];

  constructor(private betService: BetService,
      private modalService: BsModalService,
      private currencyService: CurrencyService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private snackBarService: SnackBarService) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamId = +params['teamId'];
    });

    this.getBets(this.teamId);
    this.selectedValue = 'all';    
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

  getBets(teamId?: number){
    setTimeout( () =>
    this.betService.getBets()
      .subscribe(bets => {
        this.bets = bets;
        this.initialBets = this.bets;
        this.selectedValue = 'all';
        // call serice method to send data to jumbotron component
        this.betService.getNoBets(Object.create({ 'a' : this.initialBets.length, 'b' : this.initialBets.filter(x => x.won == null).length }));

        if(teamId){
          this.displayBetsById(teamId);
        }
        this.dataSource = new MatTableDataSource(this.bets);
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      }), 50);
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
      this.betService.editBet(betToUpdate)
        .subscribe( next => {
          this.snackBarService.snackBarMessage("Bet Updated.", "Ok", "confirm");
          this.getBets();
          this.selectedValue = 'all';
        }, error => {
          this.snackBarService.snackBarMessage("Error", "Close", "error");
        });
    } 
    else if (this.state === 'delete') {
      this.betService.deleteBet(this.bet.id)
        .subscribe( next => {
        this.getBets();
        this.selectedValue = 'all';
        this.snackBarService.snackBarMessage("Bet Deleted.", "Ok", "confirm");
      }, error => {
        this.snackBarService.snackBarMessage("Error", "Close", "error");
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

  displayBetsById(teamId: number){
    this.bets = this.initialBets.filter(x => x.teamId == teamId)
      .sort((a,b) => +new Date(a.date) - +new Date(b.date));
    this.selectedValue = '';

    // passing a wrong id
    if(this.bets.length == 0) {
      this.bets = this.initialBets;
      this.selectedValue = 'all';
      this.snackBarService.snackBarMessage("Team with Id (" + teamId + ") couldn't be found!", "Close", "message");
    }
    this.dataSource = this.bets;
  }

  displayAll(){
    // this.bets = this.initialBets.sort((a,b) => +new Date(a.date) - +new Date(b.date));
    this.bets = this.initialBets;
    this.dataSource = this.bets;
  }

  last15(){
    this.bets = this.initialBets;
    this.bets = this.bets.slice( - 15)
      .sort((a,b) => +new Date(a.date) - +new Date(b.date));
    this.dataSource = new MatTableDataSource(this.bets);
  }

  unsettled(){
    this.bets = this.initialBets.filter(x => x.won == null);
    this.dataSource = new MatTableDataSource(this.bets);
  }

  lastDate(){
    let dateOfLastBet = this.initialBets.slice(-1)[0].date;
    this.bets = this.initialBets.filter(x => x.date == dateOfLastBet);
    this.dataSource = new MatTableDataSource(this.bets);
  }  
}