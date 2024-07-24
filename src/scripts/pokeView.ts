import { Pokemon } from "./pokeModel.js";
import { fetchPokemon } from "./pokeAPI.js";
import { loaderAnimation, searchbarAnimation } from "./gsapAnimations.js";
import Glide from '@glidejs/glide'

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
                    <img src="src/assets/pokeball.png">
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
                                        <h3>moves</h3>
                                    </header>
                                    <div class="moves">
                                        ${pokemon.moves.map(move => `<p style="background:${typeColorMap[move.name]}">${move.name}</p>`).join('')}
                                    </div>
                                </article>
                                <article class="abilities">
                                    <header>
                                    <h3>Abilities</h3>
                                    </header>
                                    <div class="moves">
                                        ${pokemon.abilities.map(ability => `<p style="background:${typeColorMap[ability.name]}">${ability.name}</p>`).join('')}
                                    </div>
                                </article>
                            </div>
                        </li>
                        <li class="glide__slide">1</li>
                        <li class="glide__slide">2</li>
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

export const search = async function (e : KeyboardEvent) {
    const resultsDOM = document.querySelector(".results-screen") as HTMLElement;
    const inputElement = e.target as HTMLInputElement;
    if(e.code === "Enter"){
        inputElement.blur();
        if(resultsDOM){
            resultsDOM.innerHTML = `
            <div class="loader">
                <div></div>
                <div></div>
                <div></div>
            </div>`;
            loaderAnimation();
            const result = await fetchPokemon(inputElement.value.toLowerCase());
            setTimeout(()=>{
                if (result){
                    resultsDOM.innerHTML = createCard(result);
                    new Glide('div.glide').mount()
                }else{
                    resultsDOM.innerHTML = `
                    <div class="not-found-animation">
                        <img src="/src/assets/psyduck_animation.gif">
                    </div>
                    <div class="not-found-message">
                        <h2>Oops! Sorry, we can't find that pokemon. </h2>
                    </div>
                    `;
                }
            }, 1500)
            
        }
    }
}

//Attach Event Listeners
const searchIconDOM = document.querySelector('.search');
const searchbarDOM = document.querySelector("input");

searchbarDOM?.addEventListener("keydown", search);
searchIconDOM?.addEventListener("click", ()=>{
    searchbarAnimation();
    setTimeout(()=>{searchbarDOM?.focus();}, 500);
});
