'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _require = require('ramda'),
    keys = _require.keys;

var _require2 = require('./componentConstants.js'),
    UI_COMPONENTS = _require2.UI_COMPONENTS,
    UI_FUNCTIONS = _require2.UI_FUNCTIONS;

var askInstrumentNameQ = exports.askInstrumentNameQ = [{
    type: 'input',
    name: 'instrumentName',
    message: 'What\'s the instrument\'s name?'
}];

var askUIComponentsQ = exports.askUIComponentsQ = [{
    type: 'checkbox',
    name: 'uiComponents',
    message: 'Select the UI components you want...',
    choices: function choices() {
        return keys(UI_COMPONENTS).map(function (key) {
            return UI_COMPONENTS[key];
        });
    }
}];

var getUIComponentQuantityQuestion = exports.getUIComponentQuantityQuestion = function getUIComponentQuantityQuestion(component) {
    return [{
        type: 'input',
        name: 'numberOfComponent',
        message: 'How many ' + component + ' do you want?'
    }];
};

var getUIComponentDetailQuestion = exports.getUIComponentDetailQuestion = function getUIComponentDetailQuestion(component, index) {
    var comp = component.slice(0, -1);
    return [{
        type: 'input',
        name: 'componentName',
        message: 'Name ' + comp + ' ' + (index + 1) + ':',
        default: '' + comp + (index + 1)
    }, {
        type: 'list',
        name: 'componentFunction',
        message: 'What\'s the function of this ' + comp + '?',
        choices: function choices() {
            return keys(UI_FUNCTIONS).map(function (key) {
                return key;
            });
        }
    }, {
        type: 'input',
        name: 'componentMin',
        message: 'Set the minimum function setting:',
        default: '0'
    }, {
        type: 'input',
        name: 'componentMax',
        message: 'Set the maximum function setting:',
        default: '100000'
    }];
};