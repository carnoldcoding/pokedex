import { Pokemon, IAbility, IForm, IMove } from "./pokeModel.js";

export const fetchPokemon = async function(query : string){
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if(!response.ok){
            console.log("There's no pokemon with that name");
            return

        }else{
            const data = await response.json();
            const {name, abilities, forms, moves, sprites, id } = data;
            const pAbilities : IAbility[] = [];
            const pForms : IForm[] = [];
            const pMoves : IMove[] = [];
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

            return (new Pokemon({id: id, name : name, abilities: pAbilities, forms: pForms, moves: pMoves, sprite : sprite }))
        }
    } catch (error) {
        console.error("Unable to fetch pokemon, exited with error: ", error)
    }
}

export const fetchEvolutionChain = async function(){
    
}