import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import countries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

let value = '';

function onInpute(e) {
  value = e.target.value.trim();
  if (value === '') {
    clearInput();
    return;
  }
  countries.fetchCountries(value).then(createCountryInfo).catch(onCatch);
}

function createCountryInfo(country) {
  clearInput();
  if (country.length > 10) {
    clearInput();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (country.length === 1) {
    clearInput();
    const aboutCountries = country
      .map(({ name, capital, population, flags, languages }) => {
        let lang = Object.values(languages).join(', ');
        return `
    <ul class="country-list"><li class="name"><img src="${flags.svg}" alt="${name.official}" width='20' height ='15' >${name.official}</li></ul>
    <p>Сapital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${lang}</p>
    `;
      })
      .join('');
    refs.info.insertAdjacentHTML('beforeend', aboutCountries);
    return;
  } else {
    clearInput();
    const listName = country
      .map(({ name, flags }) => {
        return `
    <li><img src="${flags.svg}" alt="${name.official}" width='20' height ='15' >${name.official}</li>
    `;
      })
      .join('');
    refs.list.insertAdjacentHTML('beforeend', listName);
  }
}

function onCatch(error) {
  if (error) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

function clearInput() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}
////////////////////////////////////////
refs.input.addEventListener('input', debounce(onInpute, DEBOUNCE_DELAY));
