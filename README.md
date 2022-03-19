# MG Block

## How To Use

### BV

In der Datei <a href="./docs/bv/bv.json">bv.json</a> können BV nachgetragen werden. Dabei ist zu beachten, dass folgendes
Schema eingehalten wird.

```json
{
  "Name 1": 1,
  "Ein anderer Name": 2
}
```

Also, die Datei beginnt `{` und endet `}` mit einem geschweiften Klammerpaar. Dazwischen kann auf jeder Zeile ein Vulgo
in Anführungs- und Schlusszeichen `"` gesetzt werden gefolgt von einem Doppelpunkt `:` und der Anzahl Stöcke. Jede Zeile
bis auf die letzte muss mit einem Komma `,` enden. Nun muss nur noch die Seite neu geladen werden, um die Änderungen zu
sehen.

### Anlässe

In der Datei <a href="./docs/events/events.json">events.json</a> können Anlässe nachgetragen werden. Dabei ist zu
beachten, dass folgendes Schema eingehalten wird.

```json
{
  "events": [
    {
      "title": "Name",
      "from": "2021-07-20",
      "to": "2021-07-23",
      "where": "Ort",
      "tenu": "b",
      "tbd": true,
      "description": "Eine Beschreibung."
    }
  ]
}
```

Also, die Datei beginnt mit `{ "events": [` und endet mit `]}`. Dazwischen wird pro Anlass ein geschweiftes
Klammerpaar `{}` gesetzt, wobei zwischen zwei Anlässen ein Komma zu setzen ist.

Ein Anlass besteht aus folgenden Elementen:

* `"title"`     Der Titel des Anlasses
* `"where"`     Der Ort wo der Anlass stattfindet
* `"from"`      Das Datum / der Zeitpunkt wann der Anlass beginnt. Im Format `yyyy-MM-dd` oder `yyyy-MM-dd hh:mm:ss`
* _Optional:_ `"to"` Das Datum / der Zeitpunkt, wann der Anlass endet, im selber Format wie `"from"`
* _Optional:_ `"tbd"` Kann auf `true` gesetzt werden, wenn noch nicht klar ist, wann der anlass genau stattfindet. Dann
  wird das Datum mit `??` angezeigt. Das Feld `"from"` muss trotzdem ausgefüllt werden. Es wird für die Sortierung
  genutzt. Es kann aber auf den Tag verzichtet werden.
* _Optional:_ `"tenu"` Hier kann angegeben werden, in welchem Tenü stattfindet. Entweder `"a"`, `"b"`, `"cps"` oder das
  feld wird gar nicht angegeben.
* _Optional:_ `"description"` Hier kann eine Beschreibung angegeben werden.

Dabei ist zu beachten, dass der linke Teil vom `:` jeweils in Anführungs- und Schlusszeichen `"` steht. Bis auf `tbd`
sind alle werte auf der rechten Seite ebenfalls in Anführungs- und Schlusszeichen zu setzten. Jedes Element bis auf die
letzte muss mit einem Komma `,` enden. Nun muss nur noch die Seite neu geladen werden, um die Änderungen zu sehen.

In einer künftigen Version wird dieses Modul potentiel eine Schnittstelle an einen öffentlichen Kalender aufweisen.

## Technical considerations

### Design decisions

The following design decisions were made

<dl>
<dt>No heavy backend</dt>
<dd>Use public available <i>content managment systems</i> as github pages and google calendar</dd>
<dt>Vanilla Javascript</dt>
<dd>No ussage of external libraries (except e.g. a google api or such)</dd>
<dd>reduce footprint by not using giant frameworks which handle every possible side case</dd>
<dd>do not depend on other's code</dd>
<dt>Modern features - No fallbacks</dt>
<dd>The target audience is in Switzerland, where the coverage of modern js- and css-features is satisfing.
So modern features will be used without fallbacks, since 95%+ Browser-Support in Switzerland is considered a sufficient coverage.</dd>
<dt>Semantic HTML</dt>
<dd>Use semantic html so accessibility is provided on this best effort strategy. 
No further accessibility will be provided, since this is not relevant for the target audience.</dd>
</dl>

### Framework

To register a module `<module>`, it has to be added via adding a hyperlink with a `href="#<module>"`
to <a href="src/index.html">index.html</a>. The framework will search for a js file in `./<module>/<module>.js` and a
html file with the same name in the same directory. When ever there is a navigation event (more precise, whenever
a `hashchange` event occurs), the framework does the following, considering `location.hash === '#<module>'`:

1. Open module `<module>` from cache or dynamicaly load it async
2. Call the `init` function of this method
3. If no `init` function exists or no js file can be found, the home module is loaded
4. The children of the first `main` element in the dom are replaced with whatever is contained
   in `./<module>/<module>.html`

Further the framework provides a html helper class, where one can register modules, register replacers to this templates
and then let the helper replace the placeholders in this template. e.g.

```js
HtmlHelper.registerTemplateFromString('example', '<h1>$PLACEHOLDER</h1>')
    .registerReplacer('$PLACEHOLDER', 'Hello world')
    .replace(); // yields <h1>Hello world</h1>


HtmlHelper.registerTemplateFromString('functionExample', <p>$INCREMENT</p>)
    .registerReplacer('INCREMENT', i => i + 1)
    .replace(3); // yields <p>4</p>
```

### Test Framework

To register a test class, the corresponding js-file should be linked as a module to <a href="test/test.html">
test.html</a>. The test class should look somewhat like this:

```js
// 1+ test()
test('<Testee>', () => {
    // 1+ times desc()
    desc('<testedMethod>', () => {
        // 1+ times it()
        it('should <expectedBehaviour>', () => {
            // arrange, act ...
            return Assert.<someAssertion>(/*...*/);
        });
    });
});
```

It's also possible to apply it to an array, where the elements of this array are passed as the parameter of the func of
it.

```js
[1, 2, 3].it('Should be positive', i => Assert.that(i >= 0));
```
