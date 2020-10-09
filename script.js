const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    keysLayouts: {
        en: [
            '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
            'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'Del',
            'CapsLk', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter',
            'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', 'ArrowUp', '/', '?',
            'Ctrl', 'Win', 'Alt', 'Space', 'ArrowLeft', 'ArrowDown', 'ArrowRight'
        ],
        ru: [
            'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
            'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'Del',
            'CapsLk', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', "э", 'Enter',
            'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', ',', 'ArrowUp',
            'Ctrl', 'Win', 'Alt', 'Space', 'ArrowLeft', 'ArrowDown', 'ArrowRight'
        ]
    },

    properties: {
        value: '',
        capsLock: false,
        ru: true,
    },

    init() {
        // Create containers
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        // Setup classes for containers
        this.elements.main.classList.add('keyboard');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys(this.properties.ru ? this.keysLayouts.ru : this.keysLayouts.en));
        this._createKeyboardListeners();
        this._changeLayout();

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    },

    _createKeys(keysLayout) {
        const fragment = document.createDocumentFragment();

        // Create special value of key
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keysLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = this.properties.ru ? ['backspace', 'Del', 'Enter', 'ArrowUp'].indexOf(key) !== -1 : ['backspace', 'Del', 'Enter', '?'].indexOf(key) !== -1;
            const textArea = document.querySelector('.keyboard__input');

            // Set attributes/classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            // Class Assignment, Values, and Actions
            switch (key) {
                case 'Ctrl':
                case 'Win':
                case 'Alt':
                    keyElement.classList.add('keyboard__key--special');
                    keyElement.textContent = key;
                    break;

                case 'ArrowUp':
                    keyElement.classList.add('keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_up");

                    keyElement.addEventListener('click', () => {
                        this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowUp');
                    });
                    break;

                case 'ArrowLeft':
                    keyElement.classList.add('keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

                    keyElement.addEventListener('click', () => {
                        this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowLeft');
                    });
                    break;

                case 'ArrowDown':
                    keyElement.classList.add('keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_down");

                    keyElement.addEventListener('click', () => {
                        this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowDown');
                    });
                    break;

                case 'ArrowRight':
                    keyElement.classList.add('keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

                    keyElement.addEventListener('click', () => {
                        this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowRight');
                    });
                    break;

                case 'Del':
                    keyElement.classList.add('keyboard__key--special');
                    keyElement.textContent = key;

                    keyElement.addEventListener('click', () => {
                        this._deleteCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, 'Del');
                    });
                    break;

                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener('click', () => {
                        this._deleteCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, 'backspace');
                    });
                    break;

                case 'CapsLk':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activable', 'keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                    });
                    break;

                case 'Enter':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener('click', () => {
                        this._addCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, '\n');
                    });
                    break;

                case 'Space':
                    keyElement.classList.add('keyboard__key--widest', 'keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener('click', () => {
                        this._addCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, ' ');
                    });
                    break;

                case 'Tab':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--special');
                    keyElement.innerHTML = createIconHTML("keyboard_tab");

                    keyElement.addEventListener('click', () => {
                        this._addCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, '\t');
                    });
                    break;

                case 'Shift':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--special');
                    keyElement.textContent = key;

                    keyElement.addEventListener('mousedown', () => {
                        this._toggleCapsLock();
                    });

                    keyElement.addEventListener('mouseup', () => {
                        this._toggleCapsLock();
                    });
                    break;

                default:
                    keyElement.textContent = key;

                    keyElement.addEventListener('click', () => {
                        const start = textArea.selectionStart;
                        const end = textArea.selectionEnd;
                        this.properties.capsLock ?
                            this._addCharacters(start, end, textArea, key.toUpperCase()) :
                            this._addCharacters(start, end, textArea, key.toLowerCase());
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'))
            }
        });

        return fragment;
    },

    _createKeyboardListeners() {
        document.addEventListener('keydown', event => {
            console.log('keyCode = ' + event.keyCode);
            console.log('key = ' + event.key);
            console.log(event);
            console.log(event.ctrlKey);
            console.log(event.altKey);

            const textArea = document.querySelector('.keyboard__input');

            switch (event.key) {
                case 'Control':
                case 'Alt':
                    event.preventDefault();
                    break;

                case 'ArrowUp':
                    this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowUp');
                    break;

                case 'ArrowLeft':
                    this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowLeft');
                    break;

                case 'ArrowDown':
                    this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowDown');
                    break;

                case 'ArrowRight':
                    this._moveCursor(textArea.selectionStart, textArea.selectionEnd, textArea, 'ArrowRight');
                    break;

                case 'CapsLock':
                    this._toggleCapsLock();
                    document.querySelector('.keyboard__key--activable').classList.toggle('keyboard__key--active', this.properties.capsLock);
                    break;

                case 'Tab':
                    this._addCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, '\t');
                    break;

                case ' ':
                    this._addCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, ' ');
                    break;

                case 'Enter':
                    event.preventDefault();
                    this._addCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, '\n');
                    break;

                case 'Backspace':
                    event.preventDefault();
                    this._deleteCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, 'backspace');
                    break;

                case 'Delete':
                    event.preventDefault();
                    this._deleteCharacters(textArea.selectionStart, textArea.selectionEnd, textArea, '');
                    break;

                case 'Shift':
                    event.preventDefault();
                    this._toggleCapsLock();
                    break;

                default:
                    const start = textArea.selectionStart;
                    const end = textArea.selectionEnd;
                    this.properties.capsLock ?
                        this._addCharacters(start, end, textArea, event.key.toUpperCase()) :
                        this._addCharacters(start, end, textArea, event.key.toLowerCase());
                    break;
            }
        });
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0 && !key.classList.contains('keyboard__key--special')) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleLayout() {
        this.properties.ru = !this.properties.ru;
    },

    _deleteCharacters(start, end, input, nameButton) {
        if (input.value.length === 0) return false;

        if (start !== end) {
            input.setRangeText('');
            input.focus();
            return false;
        }

        input.focus();
        nameButton === 'backspace' ? input.setRangeText('', start - 1, end) : input.setRangeText('', start, end + 1);
    },

    _addCharacters(start, end, input, key) {
        input.focus();

        const addCharacter = () => {
            input.setRangeText(key, start, end, 'end');
            return input.value;
        }

        this.properties.value = addCharacter();
    },

    _moveCursor(start, end, input, direction) {
        switch (direction) {
            case 'ArrowUp':
                input.focus();
                start === end ? input.selectionStart = input.selectionEnd = 0 : false;
                break;

            case 'ArrowLeft':
                input.focus();
                if (start === 0) return false;
                start === end ? input.selectionStart = input.selectionEnd = start - 1 : input.selectionEnd = input.selectionStart;
                break;

            case 'ArrowDown':
                input.focus();
                start === end ? input.selectionStart = input.selectionEnd = this.properties.value.length + 1 : false;
                console.log(this.properties.value.length);
                break;

            case 'ArrowRight':
                input.focus();
                start === end ? input.selectionStart = input.selectionEnd = end + 1 : input.selectionStart = input.selectionEnd;
                break;
        }
    },

    _changeLayout() {
        document.addEventListener('keydown', e => {
            for (let key = 0; key < this.) {
                if (key.childElementCount === 0 && !key.classList.contains('keyboard__key--special')) {
                    key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                }
            }

            this.properties.ru = !this.properties.ru;
        });
    }
};

window.addEventListener('DOMContentLoaded', function () {
    Keyboard.init();
});