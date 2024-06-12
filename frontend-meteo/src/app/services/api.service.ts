import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { LogService } from './log.service';

@Injectable()
export class ApiService {
  private apiGetIntensity = environment.baseUrlBack + 'meteo';
  private apiGetLocation = environment.baseUrlBack + 'locations';

  constructor(private http: HttpClient, private logService: LogService) {}

  /**
   * Cette fonction TypeScript récupère des données météorologiques en fonction de paramètres facultatifs
   * tels que la ville, la fenêtre horaire, l'heure de début et l'heure de fin.
   * @param {string} [ville] - Le paramètre `ville` dans la méthode `getMeteoData` est utilisé pour
   * spécifier la ville pour laquelle vous souhaitez récupérer les données météo. Si une valeur « ville »
   * est fournie lors de l'appel de cette méthode, elle sera incluse en tant que paramètre de requête
   * dans la requête HTTP pour récupérer les données météorologiques.
   * @param {number} [fenetre] - Le paramètre `fenetre` dans la méthode `getMeteoData` est utilisé pour
   * spécifier une fenêtre horaire pour récupérer les données météorologiques. Il est de type « nombre »
   * et représente la durée de la fenêtre horaire dans une certaine unité (par exemple, les heures). Ce
   * paramètre permet de filtrer les
   * @param {string} [heureDebut] - Le paramètre `heureDebut` dans la fonction `getMeteoData` représente
   * l'heure de début pour laquelle vous souhaitez récupérer les données météo. Il s'agit d'un paramètre
   * de chaîne qui spécifie l'heure de début de la fenêtre de données qui vous intéresse.
   * @param {string} [heureFin] - Le paramètre `heureFin` dans la méthode `getMeteoData` représente
   * l'heure de fin pour laquelle vous souhaitez récupérer les données météorologiques. Elle est
   * facultative et vous permet de spécifier une heure de fin spécifique pour la récupération des
   * données. Si fourni, la méthode inclura ce paramètre dans la requête HTTP
   * @returns La méthode `getMeteoData` renvoie un Observable qui effectue une requête HTTP GET pour
   * récupérer les données météorologiques. La méthode accepte des paramètres facultatifs pour la ville
   * (ville), la fenêtre horaire (fenetre), l'heure de début (heureDebut) et l'heure de fin (heureFin).
   * Ces paramètres sont ajoutés à l'URL de la demande en tant que paramètres de requête à l'aide de
   * HttpParams. La méthode appelle ensuite la méthode `get` du HttpClient
   */
  public getMeteoData(
    ville?: string,
    fenetre?: number,
    heureDebut?: string,
    heureFin?: string
  ): Observable<any> {
    let params = new HttpParams();
    if (ville) params = params.set('ville', ville);
    if (fenetre) params = params.set('fenetre', fenetre);
    if (heureDebut) params = params.set('heureDebut', heureDebut);
    if (heureFin) params = params.set('heureFin', heureFin);

    return this.http
      .get(this.apiGetIntensity, { params })
      .pipe(catchError(this.logService.handleError));
  }

  /**
   * Cette fonction récupère les données de localisation pour une ville spécifiée à l'aide d'un point de
   * terminaison d'API.
   * @param {string} [ville] - Le paramètre `ville` dans la fonction `getLocation` est un paramètre de
   * chaîne qui représente la ville pour laquelle vous souhaitez récupérer les informations de
   * localisation. Il est facultatif, comme l'indique le symbole « ? » après le nom du paramètre, ce qui
   * signifie qu'il peut être fourni ou omis lors de l'appel de la fonction.
   * @returns Un Observable<any> est renvoyé.
   */
  public getLocation(ville?: string): Observable<any> {
    const url = `${this.apiGetLocation}/${ville}`;
    return this.http.get(url).pipe(catchError(this.logService.handleError));
  }
}
