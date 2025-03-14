import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
