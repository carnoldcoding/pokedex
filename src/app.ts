import { fetchPokemon, fetchEvolutionChain, fetchPokemonSpecies } from "./scripts/pokeAPI.js";
import "./scripts/pokeView.js";

console.log("Pokemon App Initialized");

(async ()=>{
    const data = await fetchPokemon("arcanine"); 
    if (data){
        console.log(data.name);
        const speciesData = await fetchPokemonSpecies(data.name);
        console.log(speciesData);
    }
})();