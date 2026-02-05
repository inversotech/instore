import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lamb-period-configuration-close',
  templateUrl: 'period-configuration-close.component.html',
  styleUrls: ['./period-configuration-close.component.scss'],
})
export class PeriodConfigurationCloseComponent implements OnInit {
  @Input() paramsCloseYear: any;
  @Input() messageClosePeriod: string = '';
  @Output() onConfirm = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  public onCancel(): void {
    this.onConfirm.emit(false);

  }

  public onSave(): void {
    this.onConfirm.emit(true);
  }
}
