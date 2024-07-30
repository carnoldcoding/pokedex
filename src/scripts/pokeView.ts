import { Pokemon } from "./pokeModel.js";

const spritePage = function(pokemon : Pokemon){
    return `
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
    `
}

const evolutionPage = function(pokemon : Pokemon){
    return `
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
    `
}

const abilityPage = function(pokemon : Pokemon){
    return `
    <li class="glide__slide">
        <div class="info-slide">
            <article>
                <header>
                <h3>Abilities</h3>
                </header>
                <div class="moves">
                    ${pokemon.abilities.map(ability => `<p>${ability.name}</p>`).join('')}
                </div>
            </article>
        </div>
    </li>
    `
}

const movePage = function(pokemon : Pokemon){
    return`
        <li class="glide__slide">
            <div class="info-slide">
                <article>
                    <header>
                        <h3>moves</h3>
                    </header>
                    <div class="moves">
                        ${pokemon.moves.map(move => `<p>${move.name}</p>`).join('')}
                    </div>
                </article>
            </div>
        </li>
    `
}

const generalPage = function(pokemon: Pokemon){
    return `
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
    `
}
const statPage = function(){
    return`
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
    `
}

const createHeader = function(pokemon: Pokemon){
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
        "dark": "#705898",
        "ice": '#98D8D8',  
        "dragon": '#7038F8',
        "steel": '#6E7889',
        "flying": '#A98FF3',
    }
    return `
        <div class="basic-info">
            <div class="name">
                <img src="https://pngimg.com/d/pokeball_PNG22.png">
                <h3>${pokemon.name}</h3>
            </div>
            <div class="types">
                ${pokemon.types.map(type => `<p style="background:${typeColorMap[type.name]}">${type.name}</p>`).join('')}
            </div>
        </div>
    `
}

export const createCard = function(pokemon : Pokemon){
    return `
        <div class="grid-item">
            <div class="sprite">
                <img src="${pokemon.sprites.officialArt}">
            </div>
        </div>
        <div class="grid-item basic-info-wrapper">
            ${createHeader(pokemon)}
        </div>
        <div class="grid-item info-slide-wrapper">
            <div class="glide">
                <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides">
                        ${statPage()}
                        ${generalPage(pokemon)}
                        ${movePage(pokemon)}
                        ${abilityPage(pokemon)}
                        ${evolutionPage(pokemon)}
                        ${spritePage(pokemon)}
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
