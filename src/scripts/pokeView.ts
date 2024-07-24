import { Pokemon } from "./pokeModel.js";
import { fetchPokemon } from "./pokeAPI.js";
import { gsap } from "gsap";

export const createCard = function(pokemon : Pokemon){
    return `
        <div class="sprite">
            <img src="${pokemon.sprite}">
        </div>
        
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
    `;
}

export const search = async function (e : KeyboardEvent) {
    const resultsDOM = document.querySelector(".pokemon") as HTMLElement;
    const inputElement = e.target as HTMLInputElement;
    if(e.code === "Enter"){
        inputElement.blur();
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
    let tl = gsap.timeline({});
    const defaultDuration = .2;
    const defaultEase = "power3.inOut";

    tl.to("ion-icon",{
        duration: defaultDuration,
        ease: defaultEase,
        opacity: 0,
        display: "none"
    }).to(".search",{
        width: "90%",
        duration: defaultDuration,
        ease: defaultEase
    }).to("input",{
        ease: defaultEase,
        duration: defaultDuration,
        display: "inline-block"
    })
    setTimeout(()=>{
        searchbarDOM?.focus();
    }, 600)
})
