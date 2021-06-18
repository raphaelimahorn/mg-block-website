import {loadHtmlAsync} from '../io/io.js';

export class Framework {
    static mainNode = document.getElementsByTagName('main')[0];

    static async replaceContentAsync(module) {
        this.mainNode.innerHTML = await loadHtmlAsync(`./${module.name}/${module.name}.html`, console.warn);
        module?.init();
    }

    static async goHomeAsync() {
        this.mainNode.innerHTML = await loadHtmlAsync(`./home.html`);
    }

    static async loadModuleAsync(moduleName) {
        let m = await import(`../${moduleName}/${moduleName}.js`);
        if (!m.init) return;

        const module = new Module(moduleName, m.init);
        registerModule(module);

        return module;
    }

    static async startModuleOrHome() {
        const currentModule = location.hash?.substring(1);
        if (!currentModule) return await Framework.goHomeAsync();

        try {
            const module = getModuleByName(currentModule) ?? await Framework.loadModuleAsync(currentModule);
            await Framework.replaceContentAsync(module);
        } catch (_) {
            await Framework.goHomeAsync();
        }
    }
}

let modules = [];

function registerModule(module) {
    modules = [...modules, module];
}

function getModuleByName(name) {
    return modules.find(module => module.name === name);
}

class Module {
    name;
    init;

    constructor(name, init) {
        this.name = name;
        this.init = init;
    }
}

window.addEventListener("hashchange", Framework.startModuleOrHome);