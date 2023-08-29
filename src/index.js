import axios from "axios";

const elements = {
    form: document.querySelector("#search-form",)
}

elements.form.addEventListener("submit", handlerSearch);

function handlerSearch(evt){
    evt.preventDefault();
    const input = elements.form.elements.searchQuery.value;
    console.log(input);


}