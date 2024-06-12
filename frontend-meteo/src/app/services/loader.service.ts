import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoaderService {
  private loaderSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  /**
   * La fonction `show` définit le chargeur sur true.
   */
  show(): void {
    this.loaderSubject.next(true);
  }

  /**
   * La fonction `hide` définit l'état du chargeur sur false.
   */
  hide(): void {
    this.loaderSubject.next(false);
  }

  /**
   * La fonction `getLoaderState` renvoie un observable qui émet des valeurs booléennes représentant
   * l'état du chargeur.
   * @returns La méthode `getLoaderState()` renvoie un Observable de type booléen. Il renvoie
   * l'observable émis par le `loaderSubject`.
   */
  getLoaderState(): Observable<boolean> {
    return this.loaderSubject.asObservable();
  }
}
