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

export interface IPokemon {
    id: number,
    name: string,
    abilities: IAbility[],
    forms: IForm[],
    moves: IMove[],
    sprite: string
}

export class Pokemon implements IPokemon{
    id: number;
    name: string;
    abilities: IAbility[];
    forms: IForm[];
    moves: IMove[];
    sprite: string;

    constructor(pokemon : Pokemon){
        this.name = pokemon.name;
        this.id = pokemon.id;
        this.abilities = pokemon.abilities;
        this.forms = pokemon.forms;
        this.moves = pokemon.moves;
        this.sprite = pokemon.sprite;
    }
}