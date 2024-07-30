import { Pokemon, IAbility, IForm, IMove, IType, IEvolution, ISprites, IStat } from "./pokeModel.js";

export const fetchPokemon = async function(query : string){
    try {
        const pokemon = await fetchPokemonBasic(query);

        if(pokemon){
            try {
                const pokemonSpecies = await fetchPokemonSpecies(pokemon.species);
                const {generation, flavor_text_entries, evolution_chain} = pokemonSpecies;

                const parsedGeneration = generation.name.split('-')[1];
                pokemon.generation = parsedGeneration;

                let parsedFlavorText = "";

                flavor_text_entries.forEach((entry : {flavor_text : string, language: {name: string, url: string}}) => {
                    if(entry.language.name === "en" && parsedFlavorText === ""){
                        parsedFlavorText = entry.flavor_text.replace(/[^a-zA-Z0-9.,?!:;(){}\[\]'"\-_ é]/g, ' ');
                    }
                })

                pokemon.flavorText = parsedFlavorText;

                try {
                    const evolutionChain = await fetchEvolutionChain(evolution_chain.url);

                    let chain = evolutionChain.chain;
                    const chainList : {name: string, url: string}[] =  [];
                    chainList.push(chain.species);

                    //Follow evolution chain depth-wise
                    while(chain.evolves_to[0]){
                        chain = chain.evolves_to[0];
                        chainList.push(chain.species);
                    }

                    //Reset Chain
                    chain = evolutionChain.chain;

                    //Follow evolution chain laterally
                    for(let i = 0; i < chain.evolves_to.length; i++){
                        if(chain.evolves_to[i]){
                            if(!chainList.includes(chain.evolves_to[i].species)){
                                chainList.push(chain.evolves_to[i].species);
                            }
                        }
                    }

                    for (const link of chainList){
                        try {
                            const linkSpecies = await fetchEvolutionData(link.name);
                            if(linkSpecies){
                                const {name} = linkSpecies;
                                const sprite = linkSpecies.officialArt;
                                const evolution : IEvolution = {name, sprite};
                                if(evolution.name != pokemon.name){
                                    pokemon.evolutions.push(evolution);
                                }
                            }

                        } catch (error) {
                            console.log(`Unable to fetch data for evolution link: ${link}`, error)
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

export const fetchEvolutionData = async function(query : string){
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if(!response.ok){
            console.log(`Error: Failed to fetch data for ${query}. Status: ${response.status} - ${response.statusText}`);
            return
        }else{
            const data = await response.json();
            const {name, sprites} = data;
            const {
                other: {
                    'official-artwork':{
                        front_default : officialArt
                    }
                } 
            } = sprites;

            return {name, officialArt}
        }
    }
    catch(err){
        console.log(`Couldn't fetch evolution data for ${query}`, err);
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
            const {name, abilities, forms, moves, types, sprites, id, species, stats } = data;
            const pAbilities : IAbility[] = [];
            const pForms : IForm[] = [];
            const pMoves : IMove[] = [];
            const pTypes : IType[] = [];
            const pStats : IStat[] = [];

            //Handle Stats
            stats.forEach((stat : any) =>{
                const {
                    base_stat: baseStat,
                    stat: {
                        name: baseName
                    }
                } = stat;

                pStats.push({name: baseName, value: baseStat});
            })

            //Handle Sprites
            const {front_default : frontDefault, 
                front_female: frontFemale, 
                front_shiny: frontShiny, 
                front_shiny_female: frontShinyFemale,
                other: {
                    'official-artwork':{
                        front_default : officialArt
                    }
                } 
            } = sprites;
            const pSprites : ISprites = {frontDefault, frontFemale, frontShiny, frontShinyFemale, officialArt};
            const speciesURL : string = species.url.split('/');
            const speciesId : string = speciesURL[speciesURL.length - 2];

            forms.forEach((form : IForm)=> {
                pForms.push(form);
            })

            types.forEach((entity: {type : IType})=>{
                pTypes.push(entity.type);
            })

            //Handle Moves
            for (const entry of moves){
                const {version_group_details:{
                        0:{
                            level_learned_at : learnLevel,
                            move_learn_method : learnMethod
                        }
                    }
                } = entry;
                if(learnMethod.name == 'level-up'){
                    try {
                        const moveData = await fetchPokemonMoveData(entry.move.url);
                        
                        const {pp, power, name, flavor_text_entries : flavorTextEntries} = moveData;
                        let flavorText : string = "";
    
                        for(let i = 0; i < flavorTextEntries.length - 1; i++){
                            if(flavorTextEntries[i].language.name == "en"){
                                flavorText = flavorTextEntries[i].flavor_text;
                                break;
                            }
                        }
                        const pMove : IMove = {pp, power, name, flavorText, learnLevel};
                        pMoves.push(pMove)
                    } catch (error) {
                        console.log(`Unable to retrieve data for move ${entry.move}`);
                    }
                }
            }

            // Handle Abilities
            for (const entry of abilities){
                try {
                    const abilityData = await fetchPokemonAbilityData(entry.ability.url);
                    const abilityName = entry.ability.name;
                    const {effect_entries : effectEntries} = abilityData;
                    let abilityEffect = "";

                    for(let i = 0; i < effectEntries.length; i++){
                        if(effectEntries[i].language.name == "en"){
                            abilityEffect = effectEntries[i].effect;
                            break;
                        }
                    }
                    const pAbility : IAbility = {name: abilityName, effect: abilityEffect};
                    pAbilities.push(pAbility);
                } catch (error) {
                    console.log(`Error when fetching data for ability ${entry}`, error);
                }
            }

            return (new Pokemon({id: id, 
                name : name,
                abilities: pAbilities, 
                forms: pForms, 
                stats: pStats,
                moves: pMoves, 
                types: pTypes, 
                sprites : pSprites, 
                species : speciesId, 
                evolutions : []}))
        }
    } catch (error) {
        console.error("Unable to fetch pokemon, exited with error: ", error)
    }
}

export const fetchPokemonAbilityData = async function(url : string){
    try {
        const response = await fetch(url);
        if(!response.ok){
            console.log("Unable to fetch abilities");
            return
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Unable to fetch abilities, exited with error: ", error);
    }
}

export const fetchPokemonMoveData = async function(url : string){
    try {
        const response = await fetch(url);
        if(!response.ok){
            console.log("Unable to fetch moves");
            return
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Unable to fetch moves, exited with error: ", error);
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