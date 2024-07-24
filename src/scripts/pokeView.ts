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
                    <img src="src/assets/pokeball.png">
                    <h3>${pokemon.name}</h3>
                </div>
                <div class="types">
                    ${pokemon.types.map(type => `<p style="background:${typeColorMap[type.name]}">${type.name}</p>`).join('')}
                </div>
            </div>
        </div>

        
        
    `;
}

const loaderAnimation = function(){
    const tl = gsap.timeline({ repeat: -1 });
    const circles = document.querySelectorAll(".loader > div");

    circles.forEach((circle, index) => {
    tl.to(circle, {
        y: -25,
        ease: "power1.inOut",
        duration: 0.4,
    }, index * 0.2)
    .to(circle, {
        y: 0,
        ease: "power1.outIn",
        duration: 0.4,
    },`-=0.12`);
    });
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
                }else{
                    resultsDOM.innerHTML = "There is no pokemon with that name.";
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
