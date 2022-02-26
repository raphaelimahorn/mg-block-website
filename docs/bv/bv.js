import {loadJsonAsync} from '../io/io.js';

function renderBv(sinner, amount, parent) {
    const entry = document.createElement('div');
    entry.classList.add('bv-entry');
    entry.appendChild(document.createTextNode(sinner));
    if (amount) {
        let i = amount;
        while (i --> 1) {
            entry.appendChild(document.createElement('hr'));
        }
    }
    parent.appendChild(entry);
}

function renderBvs(bvs) {
    const node = document.getElementById('bvs');
    if (!node) return;

    for (const [sinner, amount] of Object.entries(bvs)) {
        amount && renderBv(sinner, amount, node);
    }
}

export async function init() {
    const data = await loadJsonAsync('./bv/bv.json', console.warn);
    renderBvs(data);
}
