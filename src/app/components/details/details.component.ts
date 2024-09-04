import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  pokemon: any;
  evolutionChain: any;
  evolutionImages: Map<string, string> = new Map(); // almacenar urls img de evoluciones
  stats: any[] = []; //  almacenar stats

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pokemonService.searchPokemon(id).subscribe(
        (pokemon: any) => {
          this.pokemon = pokemon;
          this.stats = pokemon.stats;
          this.getSpeciesUrl(pokemon.species.url);
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  }

  getSpeciesUrl(url: string): void {
    this.pokemonService.getSpecies(url).subscribe(
      (speciesData: any) => {
        const evolutionChainUrl = speciesData.evolution_chain.url;
        this.getEvolutionChain(evolutionChainUrl);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  getEvolutionChain(url: string): void {
    this.pokemonService.getEvolutionChainByUrl(url).subscribe(
      (evolutionChain: any) => {
        this.evolutionChain = evolutionChain;
        this.loadEvolutionImages(evolutionChain.chain);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  loadEvolutionImages(chain: any): void {
    const speciesUrls = new Set<string>();
    // fnc para recorrer la cadena de evolución y sacar las urls
    const traverseEvolutions = (evolutionChain: any) => {
      if (evolutionChain.evolves_to && evolutionChain.evolves_to.length > 0) {
        evolutionChain.evolves_to.forEach((evolution: any) => {
          const speciesUrl = evolution.species.url;
          speciesUrls.add(speciesUrl);
          traverseEvolutions(evolution);
        });
      }
    };


    traverseEvolutions(chain);
    // obtener  datos de pokemon de las urls de especies
    const requests = Array.from(speciesUrls).map((url) =>
      this.pokemonService.searchPokemon(this.extractIdFromUrl(url)).toPromise()
    );

    Promise.all(requests).then((pokemons) => {
      pokemons.forEach((pokemonData: any) => {
        this.evolutionImages.set(pokemonData.species.url, pokemonData.sprites.front_default);
      });
    }).catch((error) => {
      console.error('Error', error);
    });
  }

  extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }

getEvolutions(chain: any): any[] {
  let evolutions = [];
  let currentEvolution = chain;

  while (currentEvolution) {
    evolutions.push(currentEvolution);
    if (currentEvolution.evolves_to.length > 0) {
      currentEvolution = currentEvolution.evolves_to[0];
    } else {
      currentEvolution = null;
    }
  }

  return evolutions;
}

getPokemonImage(url: string): string {
  const id = url.split('/').filter(Boolean).pop(); // saca el ID 
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

  backhome(): void {
    this.router.navigate(['/pokemons']);
  }

}