export interface IAbility {
    name: string,
    url: string
}

export interface IForm {
    name: string,
    url: string
}

export interface IMove{
    name: string,
    url: string
}

export interface IType{
    name: string,
    url: string
}

export interface IEvolution{
    name: string,
    sprite: string
}

export interface IPokemon {
    id: number,
    name: string,
    abilities: IAbility[],
    forms: IForm[],
    moves: IMove[],
    types: IType[],
    sprite: string,
    species: string,
    generation?: string,
    flavorText?:string,
    evolutions: IEvolution[]
}

export class Pokemon implements IPokemon{
    id: number;
    name: string;
    abilities: IAbility[];
    forms: IForm[];
    moves: IMove[];
    types: IType[];
    sprite: string;
    species: string;
    generation?:string;
    flavorText?:string;
    evolutions:IEvolution[];
    

    constructor(pokemon : Pokemon){
        this.name = pokemon.name;
        this.id = pokemon.id;
        this.abilities = pokemon.abilities;
        this.forms = pokemon.forms;
        this.moves = pokemon.moves;
        this.types = pokemon.types;
        this.sprite = pokemon.sprite;
        this.species = pokemon.species;
        this.evolutions = pokemon.evolutions;
    }
}