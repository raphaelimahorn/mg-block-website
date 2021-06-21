import {loadHtmlAsync} from '../io/io.js';

export class HtmlHelper{

    /**
     *
     * @param name {string} the name of the template
     * @param path {string} the path where the html template can be found
     * @returns {Promise<Template>}
     */
    static async registerTemplateFromUrlAsync(name, path){
        if (templates.has(name)) return templates.get(name);
        
        const template = await loadHtmlAsync(path);
        
        return this.registerTemplateFromString(name, template);
    }

    /**
     *
     * @param name {string} the name of the template
     * @param template {string} the html template
     * @returns {Template}
     */
    static registerTemplateFromString(name, template){
        return templates.get(name) ?? new Template(name, template);
    }

    /**
     *
     * @param name {string} the name of the template
     * @param object {T}
     * @returns {string}
     */
    static fillInTemplate(name, object){
        return templates.get(name)?.replace(object) ?? '';
    }
}

/**
 * 
 * @type {Map<string, Template>}
 */
let templates = new Map();

/**
 * @typedef T
 */
class Template {
    /**
     * @type string
     */
    template;
    /**
     * 
     * @type {Map<string, function(T):string | string>}
     */
    replacements = new Map();

    /** 
     * creates and registers a Template
     * @param name {string} the name of the template
     * @param template {string} a html template
     */
    constructor(name, template) {
        this.template = template;
        templates.set(name, this);
    }

    /**
     * 
     * @param what {string}
     * @param withWhat {function(T):string | string}
     * @returns {Template}
     */
    registerReplacer(what, withWhat) {
        if (!this.replacements.has(what)) {
            this.replacements.set(what, withWhat);
        }
        return this;
    }

    /**
     * 
     * @param object {T}
     * @returns {string}
     */
    replace(object){
        let temp = this.template;
        this.replacements.forEach((replacer, from) => {
            const to = (typeof replacer === 'function') ? replacer(object) : replacer; 
            temp = temp.replaceAll(from, to);
        });
        return temp;
    }
    
}
