import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-ledger-pay',
  templateUrl: './ledger-pay.component.html',
  styleUrls: ['./ledger-pay.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class LedgerPayComponent {
  routes = routes;
} 