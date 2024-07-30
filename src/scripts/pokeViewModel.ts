
import { fetchPokemon } from "./pokeAPI.js";
import { pokemonNames } from "./pokeDB.js";
import { loaderAnimation } from "./gsapAnimations.js";
import Glide from '@glidejs/glide'
import { isAlphabetical } from "./utilities.js";
import psyduck from "../assets/psyduck_animation.gif"
import Chart from 'chart.js/auto';
import { createCard } from "./pokeView.js";

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
      .sort((a, b) => a.toLowerCase().indexOf(query.toLowerCase()) - b.toLowerCase().indexOf(query.toLowerCase())).slice(0, 10);
      

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
const suggestionPlaceholder = document.querySelector('.search-wrapper > .search > p');


searchbarDOM?.addEventListener("keyup", handleKeyPress);

//Figure out how to change e : any to the appropriate type
suggestionsDOM?.addEventListener('click', (e : any) => {
    if(suggestionPlaceholder){
        suggestionPlaceholder.textContent = "";
    }
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