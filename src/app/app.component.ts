import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pokedex';
  selectedPokemonData: any;

  onPokemonSelected(pokemonData: any) {
    this.selectedPokemonData = pokemonData;
  }
}
