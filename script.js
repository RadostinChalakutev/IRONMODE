'use strict';


const plans = Array.from(document.querySelectorAll('.program'));
const levelSelect = document.getElementById('level');
const buttons = Array.from(document.querySelectorAll('[data-filter]'));
let activeSplit = 'upper';

function showProgram() {
    const level = levelSelect.value;
    plans.forEach((plan) => {
        plan.hidden = plan.dataset.split !== activeSplit || plan.dataset.level !== level;
    });
    buttons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === activeSplit));
    });
    const active = plans.find((plan) => !plan.hidden);
    document.getElementById('program-status').textContent = active.querySelector('h2').textContent + ' · ' + levelSelect.options[levelSelect.selectedIndex].text;
    const url = new URL(window.location.href);
    url.searchParams.set('split', activeSplit);
    url.searchParams.set('level', level);
    try { window.history.replaceState(null, '', url); } catch (error) {

    }
}

if (plans.length) {
    const params = new URLSearchParams(window.location.search);
    if (buttons.some((button) => button.dataset.filter === params.get('split'))) activeSplit = params.get('split');
    if (params.get('level') === 'intermediate') levelSelect.value = 'intermediate';
    document.querySelector('.controls').hidden = false;
    buttons.forEach((button) => button.addEventListener('click', () => {
        activeSplit = button.dataset.filter;
        showProgram();
    }));
    levelSelect.addEventListener('change', showProgram);
    showProgram();
}


const checks = Array.from(document.querySelectorAll('input[name="ready"]'));
const storageKey = 'iron-mode-ready-v1';
function updateChecks(save) {
    const values = checks.filter((check) => check.checked).map((check) => check.value);
    const status = document.getElementById('check-status');
    status.textContent = 'Подготвени: ' + values.length + ' от ' + checks.length;
    if (save) {
        try { localStorage.setItem(storageKey, JSON.stringify(values)); }
        catch (error) { status.textContent += ' · Запазването е недостъпно.'; }
    }
}
if (checks.length) {
    let saved = [];
    try {
        const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (Array.isArray(value)) saved = value;
    } catch (error) {
     }
    checks.forEach((check) => {
        check.checked = saved.includes(check.value);
        check.addEventListener('change', () => updateChecks(true));
    });
    document.getElementById('reset-checks').addEventListener('click', () => {
        checks.forEach((check) => { check.checked = false; });
        updateChecks(true);
    });
    updateChecks(false);
}
