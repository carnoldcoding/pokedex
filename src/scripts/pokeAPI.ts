import { Pokemon, IAbility, IForm, IMove, IType } from "./pokeModel.js";

export const fetchPokemon = async function(query : string){
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if(!response.ok){
            console.log(`Error: Failed to fetch data for ${query}. Status: ${response.status} - ${response.statusText}`);
            return

        }else{
            const data = await response.json();
            const {name, abilities, forms, moves, types, sprites, id } = data;
            const pAbilities : IAbility[] = [];
            const pForms : IForm[] = [];
            const pMoves : IMove[] = [];
            const pTypes : IType[] = [];
            const sprite : string = sprites.front_default;
            
            abilities.forEach((entity: {ability: IAbility}) => {
                pAbilities.push(entity.ability);
            });

            forms.forEach((form : IForm)=> {
                pForms.push(form);
            })

            moves.forEach((entity : {move : IMove})=>{
                pMoves.push(entity.move);
            })

            types.forEach((entity: {type : IType})=>{
                pTypes.push(entity.type);
            })

            return (new Pokemon({id: id, name : name, abilities: pAbilities, forms: pForms, moves: pMoves, types: pTypes, sprite : sprite }))
        }
    } catch (error) {
        console.error("Unable to fetch pokemon, exited with error: ", error)
    }
}

export const fetchPokemonSpecies = async function(name : string){
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        if(!response.ok){
            console.log(`Error: Failed to fetch data for ${name}. Status: ${response.status} - ${response.statusText}`);
            return
        }else{
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error("There is no pokemon species under that name, exited with error:", error);
    }
}

export const fetchEvolutionChain = async function(id : number){
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}/`);
        if(!response.ok){
            console.log(`Error: Failed to fetch data for ${id}. Status: ${response.status} - ${response.statusText}`);
            return
        }else{
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log("Could not fetch evolution data for the requested id");
    }
}