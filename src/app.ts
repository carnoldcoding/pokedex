import { fetchPokemon } from "./scripts/pokeAPI.js";
console.log("Pokemon App Initialized");

(async ()=>{
    const data = await fetchPokemon("pikachu"); 
    console.log(data);
})();