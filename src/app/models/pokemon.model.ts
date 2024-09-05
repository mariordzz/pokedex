export interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    abilities: Ability[];
    moves: Move[];
    sprites: Sprites;
    stats: Stat[];
    types: Type[];
  }
  
  export interface Ability {
    is_hidden: boolean;
    slot: number;
    ability: {
      name: string;
      url: string;
    };
  }
  
  export interface Move {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      version_group: {
        name: string;
        url: string;
      };
      move_learn_method: {
        name: string;
        url: string;
      };
    }[];
  }
  
  export interface Sprites {
    front_default: string;
    back_default: string;
  }
  
  export interface Stat {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }
  
  export interface Type {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }
  
  export interface Species {
    name: string;
    url: string;
  }
  
  export interface EvolutionChain {
    id: number;
  }
  