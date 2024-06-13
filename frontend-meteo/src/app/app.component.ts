import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { lastValueFrom } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { Title } from '@angular/platform-browser';

const keyStorageIndicator = 'maxIntensity';
const keyStorageIndicatorCondition = 'indicatorCondition';
const valueGreaterOrEqual = 'greaterOrEqual';
const valueGreater = 'greater';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public name = 'Météo Express';
  public filters = {
    location: 'Amiens',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    fenetre: 0,
  };
  public chartOptions: any = null;
  public isGraph = false;
  public carbonData: any[] = [];
  public carbonMoyIntensity = 0;
  public carbonLocation: string = '';
  public indicatorValue: number = 100;
  public indicatorCondition: string = valueGreaterOrEqual;
  public locationList: string[] = [
    'Tokyo',
    'Delhi',
    'Shanghai',
    'Sao Paulo',
    'Mexico City',
    'Cairo',
    'Mumbai',
    'Beijing',
    'Amiens',
    'Dhaka',
    'Osaka',
    'New York',
    'Karachi',
    'Buenos Aires',
    'Chongqing',
    'Istanbul',
    'Kolkata',
    'Manila',
    'Lagos',
    'Rio de Janeiro',
    'Tianjin',
    'Kinshasa',
    'Guangzhou',
    'Los Angeles',
    'Moscow',
    'Shenzhen',
    'Lahore',
    'Bangalore',
    'Paris',
    'Bogotá',
    'Jakarta',
    'Chennai',
    'Lima',
    'Bangkok',
    'Seoul',
    'Nagoya',
    'Hyderabad',
    'London',
    'Tehran',
    'Chicago',
    'Chengdu',
    'Nanjing',
    'Wuhan',
    'Ho Chi Minh City',
    'Luanda',
    'Ahmedabad',
    'Kuala Lumpur',
    'Xi’an',
    'Hong Kong',
    'Dongguan',
    'Hangzhou',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille',
    'Rennes',
    'Reims',
    'Le Havre',
    'Saint-Étienne',
    'Toulon',
    'Angers',
    'Grenoble',
    'Dijon',
    'Nîmes',
    'Aix-en-Provence',
    'Saint-Quentin',
  ];

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private title: Title
  ) {
    this.title.setTitle('Météo Express');
  }

  async ngOnInit(): Promise<void> {
    this.loadMetedata();
    await this.getCarbonIntensity();
  }

  /**
   * La fonction `setConditionIndicator` définit un indicateur de condition basé sur la valeur d'entrée
   * et le stocke dans le stockage local.
   * @param {string} conditionIndicator - Le paramètre « conditionIndicator » est une chaîne qui
   * détermine la condition de définition de la propriété « indicatorCondition » dans l'extrait de code
   * que vous avez fourni. Il peut avoir les valeurs « valueGreaterOrEqual » ou « valueGreater ». Si le
   * `conditionIndicator` ne fait pas partie de ces valeurs, la condition par défaut
   */
  public setConditionIndicator(conditionIndicator: string) {
    if (conditionIndicator == valueGreaterOrEqual) {
      this.indicatorCondition = valueGreaterOrEqual;
    } else if (conditionIndicator == valueGreater) {
      this.indicatorCondition = valueGreater;
    } else {
      this.indicatorCondition = valueGreaterOrEqual;
    }

    localStorage.setItem(keyStorageIndicatorCondition, this.indicatorCondition);
  }

  private updateChatOptions() {
    let chartOptions: any = {
      series: [
        {
          name: 'Intensité carbonne',
          data: [],
        },
        {
          name: 'Indicateur',
          data: [],
          color: '#FF0000',
        },
      ],
      chart: {
        height: 350,
        width: 720,
        type: 'line',
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: 'Intensité carbonne par heure',
      },
    };
    for (let index = 0; index < this.carbonData.length; index++) {
      const element = this.carbonData[index];
      chartOptions.series[0].data.push(element.intensity);
      chartOptions.series[1].data.push(this.indicatorValue);
      chartOptions.xaxis.categories.push(element.date + ' ' + element.time);
    }
    this.chartOptions = chartOptions;
  }

  /**
   * Cette fonction TypeScript vérifie si la valeur d'intensité répond à une certaine condition basée sur
   * une valeur d'indicateur.
   * @param {number} intensity - La fonction `checkIntensityIndicator` que vous avez fournie semble
   * vérifier si une valeur d'intensité donnée répond à une certaine condition basée sur les propriétés
   * `indicatorCondition` et `indicatorValue` de l'objet.
   * @returns La méthode `checkIntensityIndicator` renvoie une valeur booléenne. Il renvoie « vrai » si
   * l'intensité répond à la condition basée sur la valeur de l'indicateur et la condition de
   * l'indicateur, sinon il renvoie « faux ».
   */
  public checkIntensityIndicator(intensity: number): boolean {
    if (this.indicatorCondition == valueGreater) {
      if (intensity <= this.indicatorValue) {
        return true;
      }
    } else {
      if (intensity < this.indicatorValue) {
        return true;
      }
    }
    return false;
  }

  /**
   * La fonction `loadMetadata` récupère les paramètres d'intensité et d'indicateur enregistrés à partir
   * du stockage local dans TypeScript.
   */
  private loadMetedata() {
    const savedIntensity = localStorage.getItem(keyStorageIndicator);
    const savedParamsIndicator = localStorage.getItem(
      keyStorageIndicatorCondition
    );
    if (savedIntensity !== null) {
      this.indicatorValue = +savedIntensity;
    }
    if (savedParamsIndicator !== null) {
      this.indicatorCondition = savedParamsIndicator;
    }
  }

  /**
   * La fonction « getLocation » récupère de manière asynchrone les données de localisation d'un service
   * API, affiche un chargeur lors de la récupération et gère les erreurs de manière appropriée.
   */
  async getLocation(): Promise<void> {
    this.loaderService.show();

    try {
      const response: any = await lastValueFrom(this.apiService.getLocation());

      this.locationList = response.locationList;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données de location',
        error
      );
    } finally {
      this.loaderService.hide();
    }
  }

  /**
   * La fonction `onIntensityChange` enregistre la valeur de l'indicateur dans le stockage local dans
   * TypeScript.
   */
  public onIntensityChange(): void {
    localStorage.setItem(keyStorageIndicator, this.indicatorValue.toString());
    this.updateChatOptions();
  }

  /**
   * La fonction `resetData` définit la propriété `carbonMoyIntensity` à 0 et efface le tableau
   * `carbonData`.
   */
  public resetData(): void {
    this.carbonMoyIntensity = 0;
    this.carbonData = [];
  }

  /**
   * Cette fonction réinitialise le filtre d'heure de début sur une chaîne vide.
   */
  public resetStartTime(): void {
    this.filters.startTime = '';
  }

  /**
   * Cette fonction réinitialise le filtre d’heure de fin sur une chaîne vide.
   */
  public resetEndTime(): void {
    this.filters.endTime = '';
  }

  /**
   * Cette fonction TypeScript récupère les données d'intensité carbone en fonction des filtres
   * spécifiés et calcule l'intensité moyenne dans la plage de temps spécifiée.
   */
  async getCarbonIntensity(): Promise<void> {
    this.loaderService.show();
    this.resetData();

    try {
      const response: any = await lastValueFrom(
        this.apiService.getMeteoDataToday(
          this.filters.location,
          this.filters.fenetre,
          this.filters.startTime,
          this.filters.endTime
        )
      );

      this.carbonLocation = this.filters.location;
      const history = response
        ? response.history
          ? response.history
          : response
        : [];
      this.carbonData = history.map((entry: any) => {
        const date = new Date(entry.datetime);
        return {
          date: date.toISOString().split('T')[0],
          time: date.toISOString().split('T')[1].slice(0, 5),
          intensity: entry.carbonIntensity,
        };
      });

      const filteredData = this.carbonData.filter((entry) => {
        return (
          (!this.filters.startDate || entry.date >= this.filters.startDate) &&
          (!this.filters.endDate || entry.date <= this.filters.endDate) &&
          (!this.filters.startTime || entry.time >= this.filters.startTime) &&
          (!this.filters.endTime || entry.time <= this.filters.endTime)
        );
      });

      if (filteredData.length > 0) {
        this.carbonMoyIntensity =
          filteredData.reduce((sum, entry) => sum + entry.intensity, 0) /
          filteredData.length;
      } else {
        this.carbonMoyIntensity = 0;
      }

      this.updateChatOptions();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données d'intensité carbone",
        error
      );
    } finally {
      this.loaderService.hide();
    }
  }
}
