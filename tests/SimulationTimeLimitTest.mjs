import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function createElement() {
    const listeners = new Map();
    return {
        hidden: true,
        disabled: false,
        textContent: '',
        innerHTML: '',
        classList: {
            add() {},
            remove() {},
            toggle() {},
        },
        addEventListener(type, callback) {
            listeners.set(type, callback);
        },
        setAttribute() {},
        focus() {},
        trigger(type) {
            return listeners.get(type)?.();
        },
    };
}

const elements = new Map([
    ['timer', createElement()],
    ['start', createElement()],
    ['pause', createElement()],
    ['reset', createElement()],
    ['completeSimulation', createElement()],
    ['completionStatus', createElement()],
    ['simulationTimeLimitAlert', createElement()],
    ['acknowledgeTimeLimit', createElement()],
    ['timerState', createElement()],
    ['returnToSelector', createElement()],
]);
const simulator = createElement();

const windowMock = {
    APP_BASE: '',
    ASSIGNMENT_ID: 0,
    SIMULATION_TIME_LIMIT: 1,
    location: { search: '?id=1' },
    addEventListener() {},
    dispatchEvent() {},
    setTimeout,
};

const context = vm.createContext({
    window: windowMock,
    document: {
        addEventListener() {},
        getElementById(id) {
            return elements.get(id) ?? null;
        },
        querySelector(selector) {
            return selector === '.simulator' ? simulator : null;
        },
    },
    URLSearchParams,
    CustomEvent: class CustomEvent {
        constructor(type, options = {}) {
            this.type = type;
            this.detail = options.detail;
        }
    },
    fetch: async () => ({
        ok: true,
        json: async () => ({ ok: true, data: { session_token: 'test-session', unlocked: [] } }),
    }),
    console,
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout,
});

const source = fs.readFileSync(new URL('../public/js/simulador.js', import.meta.url), 'utf8');
vm.runInContext(source, context);
vm.runInContext('godotStarted = true; setupTimer();', context);
await vm.runInContext('window.beginSelectedSimulation();', context);
await new Promise((resolve) => setTimeout(resolve, 1150));

assert.equal(elements.get('timer').textContent, '00:00:01');
assert.equal(elements.get('simulationTimeLimitAlert').hidden, false);
assert.equal(elements.get('start').disabled, true);
assert.equal(elements.get('pause').disabled, true);
assert.equal(elements.get('reset').disabled, true);
assert.match(elements.get('completionStatus').textContent, /Tiempo máximo alcanzado/);
assert.match(elements.get('timerState').innerHTML, /Tiempo agotado/);

console.log('Simulation time limit test passed.');
