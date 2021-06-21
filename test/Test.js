/** @typedef {Map<string, Description>} Test */
/**@typedef {Map<string, Expectation>}  Description */
/** @typedef {{desc: string, func: function:Result }} Expectation */

/**
 * @type Expectation | undefined
 */
let expectation;

/**
 * @type Test | undefined
 */
let tTest;

/**
 * @type Description | undefined
 */
let tDesc;

export function test(description, func) {
    tests.has(description) || tests.set(description, new Map());
    tTest = tests.get(description);
    func();
    tTest = undefined;
}

/**
 * @param description {string}
 * @param func {function}
 */
export function desc(description, func) {
    tTest.has(description) || tTest.set(description, new Map());
    tDesc = tTest.get(description);
    func();
    tDesc = undefined;
}

/**
 * @param desc {string}
 * @param func {function:Result}
 */
export function it(desc, func) {
    tDesc.set(desc, {desc, func});
}


/**
 * @type {Map<string, Map<string, Description>>}
 */
let tests = new Map();

let body;

export function run() {
    body = document.getElementsByTagName('body')[0];
    tests.forEach((descs, name) => {
        let html = '<div class="test">';
        html += `<h2>${name}</h2>`;
        descs.forEach((exp, desc) => {
            html += `<h3>${desc}</h3>`;
            exp.forEach(e => {
                expectation = e.desc;
                try {
                    const result = e.func();
                    html += `<p class=${result.isSuccessful ? 'passed' : 'failed'}>${e.desc}: ${result.isSuccessful ? 'passed' : `failed: 
    ${result.failureMsg}`}</p>`;
                } catch (_) {
                    html += `<p class="failed">${e.desc}: failed: test throw unexpectedly`;
                }
            });
        });
        body.insertAdjacentHTML('beforeend', html);
    });
}
