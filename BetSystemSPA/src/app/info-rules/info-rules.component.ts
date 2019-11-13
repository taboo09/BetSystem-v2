import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-info-rules',
  templateUrl: './info-rules.component.html',
  styleUrls: ['./info-rules.component.css']
})
export class InfoRulesComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<InfoRulesComponent>) { }

  ngOnInit() {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
