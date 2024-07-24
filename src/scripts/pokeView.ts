import { Pokemon } from "./pokeModel.js";
import { fetchPokemon } from "./pokeAPI.js";
import { gsap } from "gsap";

export const createCard = function(pokemon : Pokemon){
    return `
        <article class="card">
            <img class="sprite" src="${pokemon.sprite}">
            <div class="info">
                <h1>${pokemon.name}</h1>
                <div class="abilities">
                    <h3>Abilities</h3>
                    ${pokemon.abilities.map(ability => `<p>${ability.name}</p>`).join('')} 
                </div>
                <div class="moves">
                    <h3>Moves</h3>
                    ${pokemon.moves.map(move => `<p>${move.name}</p>`).join('')} 
                </div>
            </div>
        </article>
    `;
}

export const search = async function (e : KeyboardEvent) {
    const resultsDOM = document.querySelector(".results") as HTMLElement;
    const inputElement = e.target as HTMLInputElement;
    if(e.code === "Enter"){
        if(resultsDOM){
            resultsDOM.innerHTML = `<div class="loader">Loading...</div>`;
            const result = await fetchPokemon(inputElement.value.toLowerCase());
            if (result){
                resultsDOM.innerHTML = createCard(result);
            }else{
                resultsDOM.innerHTML = "There is no pokemon with that name.";
            }
        }
    }
}

//Attach Event Listeners
const searchIconDOM = document.querySelector('.search');
const searchbarDOM = document.querySelector("input");
searchbarDOM?.addEventListener("keydown", search);
searchIconDOM?.addEventListener("click", ()=>{
    let tl = gsap.timeline();
})
