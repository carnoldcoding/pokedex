import { Pokemon } from "./pokeModel.js";
import { fetchPokemon } from "./pokeAPI.js";
import { pokemonNames } from "./pokeDB.js";
import { loaderAnimation, searchbarAnimation, searchbarAnimationReverse } from "./gsapAnimations.js";
import Glide from '@glidejs/glide'
import { isAlphabetical } from "./utilities.js";

import pokeball from "../assets/pokeball.png"
import psyduck from "../assets/psyduck_animation.gif"

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
                    <img src="${pokeball}">
                    <h3>${pokemon.name}</h3>
                </div>
                <div class="types">
                    ${pokemon.types.map(type => `<p style="background:${typeColorMap[type.name]}">${type.name}</p>`).join('')}
                </div>
            </div>
        </div>
        <div class="grid-item info-slide-wrapper">
            <div class="glide">
                <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides">
                    <li class="glide__slide">
                            <div class="info-slide">
                                <article>
                                    <header>
                                        <h3>Gen <span>${pokemon.generation}</span></h3>
                                    </header>
                                    <div class="description">
                                        <p>${pokemon.flavorText}</p>
                                    </div>
                                </article>
                            </div>
                        </li>
                        <li class="glide__slide">
                            <div class="info-slide">
                                <article>
                                    <header>
                                        <h3>moves</h3>
                                    </header>
                                    <div class="moves">
                                        ${pokemon.moves.map(move => `<p style="background:${typeColorMap[move.name]}">${move.name}</p>`).join('')}
                                    </div>
                                </article>
                            </div>
                        </li>
                        <li class="glide__slide">
                            <div class="info-slide">
                                <article>
                                    <header>
                                    <h3>Abilities</h3>
                                    </header>
                                    <div class="moves">
                                        ${pokemon.abilities.map(ability => `<p style="background:${typeColorMap[ability.name]}">${ability.name}</p>`).join('')}
                                    </div>
                                </article>
                            </div>
                        </li>
                        <li class="glide__slide">
                            <div class="info-slide">
                                <article>
                                    <header>
                                        <h3>Evolutions</h3>
                                    </header>
                                    <div class="evolutions">
                                        ${pokemon.evolutions.map(evolution => `
                                            <div class="evolution" data-name=${evolution.name}>
                                                <img src="${evolution.sprite}"/>
                                                <p>${evolution.name}</p>
                                            </div>
                                            `).join('')}
                                    </div>
                                </article>
                            </div>
                        </li>
                    </ul>
                </div>
                 <div class="glide__arrows" data-glide-el="controls">
                    <button class="left" data-glide-dir="<"><ion-icon name="play-outline"></ion-icon></button>
                    <button class="" data-glide-dir=">"><ion-icon name="play-outline"></ion-icon></button>
                </div>
            </div>
        </div>
    `;
}

export const search = async function(query : string){
    const resultsDOM = document.querySelector(".results-screen") as HTMLElement;
    const inputDOM = document.querySelector("input") as HTMLInputElement;
    const animation = searchbarAnimationReverse();
    
    inputDOM.value = "";
    setTimeout(()=>{
        inputDOM.blur();
    }, 700)

    const userInput = query;
    animation.play();
    if(resultsDOM){
        resultsDOM.innerHTML = `
        <div class="loader">
            <div></div>
            <div></div>
            <div></div>
        </div>`;
        loaderAnimation();
        const result = await fetchPokemon(userInput.toLowerCase());
        setTimeout(()=>{
            if (result){
                resultsDOM.innerHTML = createCard(result);
                attachCardListeners();
                new Glide('div.glide').mount()
            }else{
                resultsDOM.innerHTML = `
                <div class="not-found-animation">
                    <img src="${psyduck}">
                </div>
                <div class="not-found-message">
                    <h2>Oops! Sorry, we can't find that pokemon. </h2>
                </div>
                `;
            }
        }, 1500)
        
    }
}

export const makeSuggestions = async function(query : string){
    const suggestionsElement = document.querySelector('aside > .search-suggestions');
    if(isAlphabetical(query) && suggestionsElement){
        const pokemonList = pokemonNames.filter(name => name.toLowerCase().includes(query));
        const suggestionsDOM = `
                ${pokemonList.map(name => `<div><p>${name}</p></div>` ).join('')}
        `;
        suggestionsElement.innerHTML = suggestionsDOM;
    }
}

export const handleKeyPress = async function (e : KeyboardEvent) {
    const inputElement = e.target as HTMLInputElement;
    const userInput = inputElement.value.toLowerCase();

    makeSuggestions(userInput);

    if(e.code === "Enter"){
        search(userInput);
    }
}

export const attachCardListeners = function(){
    const evolutions = document.querySelectorAll("div[class='evolutions'] > div");
    console.log(evolutions);
    if(evolutions){
        evolutions.forEach(evolution=>{
            evolution.addEventListener('click', (e : any)=>{
                search(e.target.dataset.name);
            })
        })
    }
}

//Attach Event Listeners
const searchIconDOM = document.querySelector('.search');
const searchbarDOM = document.querySelector("input");
const suggestionsDOM = document.querySelector('aside > .search-suggestions');
const pokedexButtonDOM = document.querySelectorAll('.pokedex .ui-semicircle');
const pokedexDOM = document.querySelector(".pokedex");

searchbarDOM?.addEventListener("keydown", handleKeyPress);
searchIconDOM?.addEventListener("click", ()=>{
    const animation = searchbarAnimation();
    animation.play();
    setTimeout(()=>{searchbarDOM?.focus();}, 500);
});

//Figure out how to change e : any to the appropriate type
suggestionsDOM?.addEventListener('click', (e : any) => {
    if(searchbarDOM){
        searchbarDOM.value = e.target.textContent;
        search(e.target.textContent);
    }
});

pokedexButtonDOM?.forEach(button => {
    button.addEventListener("click", (e : any) =>{
        pokedexDOM?.classList.toggle("open");
    })
})