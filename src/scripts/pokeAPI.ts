import { Pokemon, IAbility, IForm, IMove, IType, IEvolution } from "./pokeModel.js";

export const fetchPokemon = async function(query : string){
    try {
        const pokemon = await fetchPokemonBasic(query);

        if(pokemon){
            try {
                const pokemonSpecies = await fetchPokemonSpecies(pokemon.species);
                const {generation, flavor_text_entries, evolution_chain} = pokemonSpecies;

                const parsedGeneration = generation.name.split('-')[1];
                pokemon.generation = parsedGeneration;

                const parsedFlavorText = flavor_text_entries[0].flavor_text;
                pokemon.flavorText = parsedFlavorText;

                try {
                    const evolutionChain = await fetchEvolutionChain(evolution_chain.url);
                    let chain = evolutionChain.chain;
                    const chainList : {name: string, url: string}[] =  [];
                    chainList.push(chain.species);
                    while(chain.evolves_to[0]){
                        chain = chain.evolves_to[0];
                        chainList.push(chain.species);
                    }

                    for (const link of chainList){
                        try {
                            const linkSpecies = await fetchPokemonBasic(link.name);
                            if(linkSpecies){
                                const {name, sprite} = linkSpecies;
                                const evolution : IEvolution = {name, sprite};
                                pokemon.evolutions.push(evolution);
                            }

                        } catch (error) {
                            console.log(`Unable to fetch data for evolution: ${link}`, error)
                        }
                    }
                    
                } catch (error) {
                    console.log(`Could not fetch evolution chain ${evolution_chain.url}, exited with error: `, error)
                }
            } catch (error) {
                console.log("Unable to fetch pokemon species", error);
            }

            return pokemon;
        }
    } catch (error) {
        console.log("Couldn't fetch the pokemon", error);
    }
    
}

export const fetchPokemonBasic = async function(query : string){
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if(!response.ok){
            console.log(`Error: Failed to fetch data for ${query}. Status: ${response.status} - ${response.statusText}`);
            return

        }else{
            const data = await response.json();
            const {name, abilities, forms, moves, types, sprites, id, species } = data;
            const pAbilities : IAbility[] = [];
            const pForms : IForm[] = [];
            const pMoves : IMove[] = [];
            const pTypes : IType[] = [];
            const sprite : string = sprites.front_default;

            const speciesURL : string = species.url.split('/');
            const speciesId : string = speciesURL[speciesURL.length - 2];
            
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

            return (new Pokemon({id: id, name : name, abilities: pAbilities, forms: pForms, moves: pMoves, types: pTypes, sprite : sprite, species : speciesId, evolutions : []}))
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

export const fetchEvolutionChain = async function(url : string){
    try {
        const response = await fetch(url);
        if(!response.ok){
            console.log(`Error: Failed to fetch data for endpoint: ${url}. Status: ${response.status} - ${response.statusText}`);
            return
        }else{
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log("Could not fetch evolution data for the requested id");
    }
}