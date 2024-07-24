import { Pokemon } from "./pokeModel.js";
import { fetchPokemon } from "./pokeAPI.js";
import { gsap } from "gsap";

export const createCard = function(pokemon : Pokemon){
    const typeColorMap : Record<string, string> = {
        "grass": '#78C850', 
        "fire": '#F08030',  
        "water": '#6890F0',  
        "bug": '#A8B820',  
        "normal": '#A8A878',  
        "poison": '#A040A0',  
        "electric": '#F8D030', 
        "ground": '#E0C068', 
        "fairy": '#EE99AC',  
        "fighting": '#C03028',  
        "psychic": '#F85888', 
        "rock": '#B8A038',  
        "ghost": '#705898',  
        "ice": '#98D8D8',  
        "dragon": '#7038F8',
        "steel": '#6E7889',
        "flying": '#A98FF3',
    }
    return `
        <div class="grid-item">
            <div class="sprite">
                <img src="${pokemon.sprite}">
            </div>
        </div>
        <div class="grid-item basic-info-wrapper">
            <div class="basic-info">
                <div class="name">
                    <img src="https://cdn.pixabay.com/photo/2016/08/15/00/50/pokeball-1594373_1280.png">
                    <h3>${pokemon.name}</h3>
                </div>
                <div class="types">
                    ${pokemon.types.map(type => `<p style="background:${typeColorMap[type.name]}">${type.name}</p>`).join('')}
                </div>
            </div>
        </div>

        
        
    `;
}
/*

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
            <div class="types">
                <h3>Types</h3>
                ${pokemon.types.map(type => `<p>${type.name}</p>`).join('')} 
            </div>
        </div>
*/

export const search = async function (e : KeyboardEvent) {
    const resultsDOM = document.querySelector(".results-screen") as HTMLElement;
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
        width: "100%",
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
