import RikkaPlugin from '@rikka/Common/entities/Plugin';
import { sleep } from '@rikka/API/Utils/time';

export default class ExamplePlugin extends RikkaPlugin {
    Manifest = {
        name: "Goosemod-Compat",
        description: "Goosemod compatibility plugin for Rikka",
        author: "V3L0C1T13S",
        license: "BSD 3-Clause",
        version: "0.1.0",
        dependencies: []
    }

    private initGoosemod = async () => {
        while (!(window as any).webpackJsonp?.push && !(window as any).webpackChunkdiscord_app?.push) {
            await sleep(10);
        }

        let wpRequire: any;

        if ((window as any).webpackJsonp) { // Older
            wpRequire = (window as any).webpackJsonp.push([[], { get_require: (mod: any, _exports: any, wpRequire: any) => mod.exports = wpRequire }, [["get_require"]]]); // Get Webpack's require via injecting into webpackJsonp

            // Remove module injected
            delete wpRequire.m.get_require;
            delete wpRequire.c.get_require;
        } else if ((window as any).webpackChunkdiscord_app) { // New (Canary @ 22nd Oct)
            (window as any).webpackChunkdiscord_app.push([['gm_webpackInject'], {}, (req: any) => { wpRequire = req; }]);
        }

        const locale = Object.keys(wpRequire.c).map((x) => wpRequire.c[x].exports).find((x) => x?.default?.getLocaleInfo).default.getLocale();

        console.log('[GooseMod Bootstrap]', 'Found locale', locale);

        const url = `https://raw.githubusercontent.com/GooseMod/GooseMod/dist-dev/goosemod.${locale}.js?_<buildtime>`;
        console.log(url);
        // eval(await (await fetch(`http://localhost:1234/goosemod.${locale}.js`)).text());
        eval(await (await fetch(`https://raw.githubusercontent.com/GooseMod/GooseMod/dist-dev/goosemod.${locale}.js?_<buildtime>`, { cache: 'force-cache' })).text());
    };

    inject() {
        this.initGoosemod();
    }
}
