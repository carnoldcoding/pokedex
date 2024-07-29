import { Pokemon } from "./pokeModel.js";
import { fetchPokemon } from "./pokeAPI.js";
import { pokemonNames } from "./pokeDB.js";
import { loaderAnimation } from "./gsapAnimations.js";
import Glide from '@glidejs/glide'
import { isAlphabetical } from "./utilities.js";
import psyduck from "../assets/psyduck_animation.gif"
import Chart from 'chart.js/auto';


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
                <img src="${pokemon.sprites.officialArt}">
            </div>
        </div>
        <div class="grid-item basic-info-wrapper">
            <div class="basic-info">
                <div class="name">
                    <img src="https://pngimg.com/d/pokeball_PNG22.png">
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
                                        <h3>Stats</h3>
                                    </header>
                                    <div class="stats">
                                        <canvas id="radar"></canvas>
                                    </div>
                                </article>
                            </div>
                        </li>
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
                        <li class="glide__slide">
                            <div class="info-slide">
                                <article>
                                    <header>
                                        <h3>Sprites</h3>
                                    </header>
                                    <div class="sprites">
                                        <div>
                                            <img src="${pokemon.sprites.frontDefault}"/>
                                            <p>Default</p>
                                        </div>
                                        <div>
                                            <img src="${pokemon.sprites.frontShiny}"/>
                                            <p>Shiny</p>
                                        </div>
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

//ChartJS
async function attachCanvas(stats : {name : string, value : number}[]) {

    // Extract labels and values
    const labels = ["HP", "ATK", "DEF", "SpATK", "SpDEF", "SPD"];
    const values = stats.map(item => item.value);

    // Get the context of the canvas element
    const ctx = document.getElementById('radar') as HTMLCanvasElement;

    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attributes',
                    data: values,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        ticks: {
                            display: false
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                }
            }
        });
    }
}

export const search = async function(query : string){
    const resultsDOM = document.querySelector(".results-screen") as HTMLElement;
    const inputDOM = document.querySelector("input") as HTMLInputElement;
    
    inputDOM.value = "";
    setTimeout(()=>{
        inputDOM.blur();
    }, 700)


    const userInput = query;

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
                attachCanvas(result.stats);
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

export const makeSuggestions = function(query : string){
    const suggestionsElement = document.querySelector('aside > .search-suggestions');
    if(isAlphabetical(query) && suggestionsElement){
        const pokemonList  = pokemonNames
      .filter(name => name.toLowerCase().startsWith(query.toLowerCase()))
      .sort((a, b) => a.toLowerCase().indexOf(query.toLowerCase()) - b.toLowerCase().indexOf(query.toLowerCase()));
      
      const suggestionsDOM = pokemonList.map(name => {
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedName = name.replace(regex, '<strong>$1</strong>');
        return `<div><p>${highlightedName}</p></div>`;
      }).join('');
        suggestionsElement.innerHTML = suggestionsDOM;
        return pokemonList;
    }
}

export const handleKeyPress = async function (e : KeyboardEvent) {
    const inputElement = e.target as HTMLInputElement;
    const userInput = inputElement.value.toLowerCase();
    const suggestionPlaceholder = document.querySelector('.search-wrapper > .search > p');

    const suggestions = makeSuggestions(userInput);


    //Clear if no input
    if(!userInput && suggestionPlaceholder){
        suggestionPlaceholder.textContent = "";
    }

    //Automatically choose the closest suggestion
    if(suggestions && suggestionPlaceholder){
        suggestionPlaceholder.textContent = suggestions[0];
    }

    if(e.code === "Enter" && suggestions && suggestionPlaceholder){
        suggestionPlaceholder.textContent = "";
        if(suggestions.includes(userInput)){
            search(userInput);
        }else if(suggestions.length > 0){
            search(suggestions[0]);
        }else{
            search(userInput);
        }
    }
}

export const attachCardListeners = function(){
    const evolutions = document.querySelectorAll("div[class='evolutions'] > div");
    if(evolutions){
        evolutions.forEach(evolution=>{
            evolution.addEventListener('click', (e : any)=>{
                search(e.target.dataset.name);
            })
        })
    }
}

//Attach Event Listeners
const searchbarDOM = document.querySelector("input");
const suggestionsDOM = document.querySelector('aside > .search-suggestions');
const pokedexButtonDOM = document.querySelectorAll('.pokedex .ui-semicircle > .button');
const pokedexDOM = document.querySelector(".pokedex");

searchbarDOM?.addEventListener("keyup", handleKeyPress);

//Figure out how to change e : any to the appropriate type
suggestionsDOM?.addEventListener('click', (e : any) => {
    if(searchbarDOM){
        searchbarDOM.value = e.target.textContent;
        search(e.target.textContent);
    }
});

pokedexButtonDOM?.forEach(button => {
    button.addEventListener("click", () =>{
        pokedexDOM?.classList.toggle("open");
        if(pokedexDOM){
            const pokeClassList : string[] = Array.from(pokedexDOM.classList);
            pokeClassList.includes("open") ? searchbarDOM?.focus() : searchbarDOM?.blur();
        }
    })
})