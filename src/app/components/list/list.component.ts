import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  pokemonName: string = '';
  pokemons: any[] = [];

  limit: number = 24;
  offset: number = 0;
  currentPage: number = 1; 
  totalPokemons: number = 0;
  totalPages: number = 0; 

  selectedPokemon: any;

  isSecretChallengeOpen = false;
  encryptedMessage = `W'mp xi tpeîx, hiwwmri-qsm yr tixmx tvmrgi, pym hiqerhi Tixmx Qsyxsr. Pym, mp ri wemx tew hiwwmriv. Rm yr glizep, rm yr gemppsy, vmir. Xsyx gi uy'mp zsmx, g'iwx yr kvsw dévs. Epsvw, mp gsqqirgi à pi hiwwmriv ix eywwm h’eyxviw xvygw uy’mp zsmx herw we xêxi. Ix çe, g’iwx tpyw jsvx uyi jsvx !.`;
  decipheredMessage = '';


  constructor(
    private pokemonService: PokemonService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPokemons();
    this.decipheredMessage = this.decipherMessage(this.encryptedMessage);
    console.log(this.decipheredMessage); 
  }

  searchPokemon() {
    if (this.pokemonName.trim() === '') {
      return;
    }

    this.pokemonService.searchPokemon(this.pokemonName.toLowerCase()).subscribe(
      data => {
        this.pokemons = [data];
        console.log('pokemon cargado', this.pokemons);
      },
      error => {
        console.error('Error:', error);
        this.pokemons = [];
      }
    );
  }

  randomPokemon() {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    this.pokemonService.searchPokemon(randomId.toString()).subscribe(
      data => {
        this.pokemons = [data];
        console.log('pokemon cargado', this.pokemons);
      },
      error => {
        console.error('Error:', error);
        this.pokemons = [];
      }
    );
  }

  loadPokemons(): void {
    this.pokemonService.getAllPokemons(this.limit, this.offset).subscribe(
      (response: any) => {
        this.pokemons = response.results;
        this.totalPokemons = response.count;
        this.totalPages = Math.ceil(this.totalPokemons / this.limit);
        // detalles de cada pokemon
        const pokemonDetailsObservables = this.pokemons.map((pokemon: any) =>
          this.pokemonService.getPokemonDetails(pokemon.url)
        );
        // forkJoin para esperar a que todos los observables
        forkJoin(pokemonDetailsObservables).subscribe(
          (pokemonDetails: any[]) => {
            // Asignar detalles al array de pokemons
            this.pokemons = pokemonDetails;
            console.log('pokemon cargado', this.pokemons);
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  selectPokemon(pokemon: any){
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  goHome() {
    window.location.href = '/pokemons';
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.offset = (this.currentPage - 1) * this.limit;
      this.loadPokemons();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.offset = (this.currentPage - 1) * this.limit;
      this.loadPokemons();
    }
  }

  firstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.offset = 0;
      this.loadPokemons();
    }
  }

  lastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
      this.offset = (this.totalPages - 1) * this.limit;
      this.loadPokemons();
    }
  }

  // Parte secretChallenge

  openSecretChallenge() {
    this.isSecretChallengeOpen = true;
  }

  closeSecretChallenge() {
    this.isSecretChallengeOpen = false;
  }

  //  descifrar el mensaje usando ROT3 (desplazamiento de 3 posiciones)
  decipherMessage(encryptedMessage: string, shift: number = -3): string {
    return encryptedMessage.split('').map(char => {
      if (char.match(/[a-zA-Z]/)) { 
        const code = char.charCodeAt(0);
        const base = (code >= 65 && code <= 90) ? 65 : 97; 
        return String.fromCharCode(((code - base + shift + 26) % 26) + base); 
      } else {
        return char; 
      }
    }).join('');
  }

}
