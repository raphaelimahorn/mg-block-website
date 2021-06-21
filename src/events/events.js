import {loadHtmlAsync, loadJsonAsync} from '../io/io.js';

let eventTemplate;
let eventWrapper;
const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];


function renderYear(eventsInYear, year) {

    eventWrapper.innerHTML += `<h2 class="year">${year}</h2>`;
    eventsInYear.forEach(renderEvent);
}

function renderEvent(event) {
    let newEvent = eventTemplate;
    const from = new Date(Date.parse(event.from));
    const to = event.to && new Date(Date.parse(event.to));
    const tbd = event.tbd ?? false;
    let date = tbd ? 'Infos folgen' : `${from.toLocaleDateString()}${to ? ` - ${to.toLocaleDateString()}` : ''}`;
    newEvent = newEvent.replace("$TITLE", event.title)
        .replace("$DATE", date)
        .replace("$DAY", tbd ? '??' : from.getDate().toString().padStart(2, '0'))
        .replace("$MONTH", tbd ? '' : months[from.getMonth()])
        .replace("$YEAR", from.getFullYear())
        .replace("$LOCATION", `${event.where} - ${date}`)
        .replace("$DESC", event.description ?? '')
        .replaceAll("$TENU", getTenuOrDefault(event.tenu));
    eventWrapper.insertAdjacentHTML('beforeend', newEvent);
}

function getTenuOrDefault(tenu) {
    switch (tenu?.toLowerCase()) {
        case 'b':
        case 'tenub':
        case 'tenu b':
        case 'tenue b':
        case 'tenueb':
            return 'b';
        case 'a':
        case 'tenua':
        case 'tenu a':
        case 'tenue a':
        case 'tenuea':
            return 'a';
        case 'cps':
        case 'off':
        case 'hochoff':
        case 'cp':
        case 'farben':
            return 'cps';
        default:
            return 'none';
    }
}

export async function init() {
    const events = (await loadJsonAsync('./events/events.json')).events;

    eventTemplate ??= await loadHtmlAsync('./events/event.html');
    eventWrapper = document.getElementById('event-wrapper');
    const sortedEvents = events.sort((a, b) => a.from < b.from);
    groupBy(sortedEvents, event => new Date(event.from).getFullYear())
        .forEach(renderYear);
}

function groupBy(data, keyFunc) {
    let dict = new Map();
    data.forEach(d => {
        const key = keyFunc(d);
        dict.set(key, [...dict.get(key) ?? [], d]);
    });
    return dict;
}

// TODO replace events.json