var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { fetchPokemon } from "./pokeAPI.js";
export var createCard = function (pokemon) {
    return "\n        <article class=\"card\">\n            <img class=\"sprite\" src=\"".concat(pokemon.sprite, "\">\n            <div class=\"info\">\n                <h1>").concat(pokemon.name, "</h1>\n                <div class=\"abilities\">\n                    <h3>Abilities</h3>\n                    ").concat(pokemon.abilities.map(function (ability) { return "<p>".concat(ability.name, "</p>"); }).join(''), " \n                </div>\n                <div class=\"moves\">\n                    <h3>Moves</h3>\n                    ").concat(pokemon.moves.map(function (move) { return "<p>".concat(move.name, "</p>"); }).join(''), " \n                </div>\n            </div>\n        </article>\n    ");
};
export var search = function (e) {
    return __awaiter(this, void 0, void 0, function () {
        var resultsDOM, inputElement, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resultsDOM = document.querySelector(".results");
                    inputElement = e.target;
                    if (!(e.code === "Enter")) return [3 /*break*/, 2];
                    if (!resultsDOM) return [3 /*break*/, 2];
                    resultsDOM.innerHTML = "<div class=\"loader\">Loading...</div>";
                    return [4 /*yield*/, fetchPokemon(inputElement.value.toLowerCase())];
                case 1:
                    result = _a.sent();
                    if (result) {
                        resultsDOM.innerHTML = createCard(result);
                    }
                    else {
                        resultsDOM.innerHTML = "There is no pokemon with that name.";
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
};
//Attach Event Listeners
var searchbarDOM = document.querySelector("input");
searchbarDOM === null || searchbarDOM === void 0 ? void 0 : searchbarDOM.addEventListener("keydown", search);
