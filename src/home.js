const el = {
    container: document.querySelector('#custom-element-container'),
    viewBtn: document.querySelector('#view-race-button'),
    clearBtn: document.querySelector('#clear-button')
};

function clearContainer() {
    el.container.innerHTML = '';
}

el.viewBtn.addEventListener('click', clearContainer);
el.clearBtn.addEventListener('click', clearContainer);