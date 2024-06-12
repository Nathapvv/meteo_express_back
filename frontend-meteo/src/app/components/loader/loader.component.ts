import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading: boolean = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.createListenerState();
  }

  /**
   * La fonction crée un écouteur pour les changements d'état du chargeur et met à jour le style de
   * débordement de corps en conséquence.
   */
  private createListenerState() {
    this.loaderService.getLoaderState().subscribe((state) => {
      this.loading = state;
      if (this.loading) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  }
}
