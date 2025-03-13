import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  public isDisabled = input(false);
  public isBlock = input(false);
  public isSecondary = input(false);
  public width = input('auto');
}
