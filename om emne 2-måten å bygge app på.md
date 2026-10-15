# Om Emne 2-måten å bygge en applikasjon

Dette dokumentet beskriver hvordan vi bygger frontend-applikasjoner i Emne 2 ved GET Academy.

Det har to formål:

1. Det er en kort referanse for studentene.
2. Det kan gis til en KI-agent sammen med skjermbilder, modell og kode. KI-en skal da følge reglene i dette dokumentet.

## Hvorfor vi begrenser verktøykassen

I Emne 2 lærer vi grunnleggende programmering, tilfeldigvis i JavaScript. Målet er ikke å bruke mest mulig moderne JavaScript.

Vi bruker bevisst en liten verktøykasse som er stor nok til å løse svært mange frontend-oppgaver, men liten nok til at alle på teamet kan forstå koden.

Dette er også realistisk trening. I en bedrift vil du ofte møte regler som:

> Slik bygger vi applikasjoner her.

Da skal du kunne arbeide innenfor prosjektets teknologivalg og kodestil i stedet for å introdusere nye teknikker fordi du tilfeldigvis kjenner dem.

Det samme gjelder KI: **KI skal tilpasse seg vår verktøykasse. Vi skal ikke tilpasse prosjektet til alt KI kan.**

---

# Fra behov til kode

Arbeidsprosessen er:

**kundebehov → tekstlig oppsummering → skjermbilder → modell → implementasjon**

Før vi implementerer bør vi vite:

- hvilke sider applikasjonen trenger
- hva brukeren ser på hver side
- hva brukeren kan gjøre
- hvilke data applikasjonen må huske

Skjermbildene og brukerhandlingene brukes som grunnlag for modellen.

---

# Modellen

Vi har én global modell:

```js
const model = {
    app: {
        currentPage: 'contactsPage',
    },

    viewState: {
        contactsPage: {
            searchText: '',
        },

        editContactPage: {
            contactId: null,
            name: '',
            phone: '',
            email: '',
        },
    },

    contacts: [],
    groups: [],
    memberships: [],
};
```

## `model.app`

Her ligger state som gjelder hele applikasjonen, for eksempel:

```js
model.app.currentPage
```

## `model.viewState`

Her ligger det brukeren holder på med akkurat nå.

Et skjema for å redigere en kontakt kan for eksempel ha:

```js
model.viewState.editContactPage
```

View state er ofte et **arbeidsutkast**. Brukeren kan endre dette uten at de lagrede dataene endres.

## Domenedata

De faktiske dataene ligger i egne arrays direkte på modellen:

```js
model.contacts
model.groups
model.memberships
```

Som hovedregel har vi én liste per type ting.

---

# Relasjoner mellom data

Objektene får ID-er:

```js
contacts: [
    { id: 1, name: 'Terje' },
],

groups: [
    { id: 1, name: 'Sykling' },
],

memberships: [
    { contactId: 1, groupId: 1 },
],
```

Vi bruker ID-er til å koble objekter sammen.

Vi legger normalt ikke komplette gruppeobjekter inni kontaktobjektene.

Bruk også ID når controller-funksjoner skal identifisere et objekt:

```js
deleteContact(17);
editContact(17);
```

Ikke bruk plasseringen i arrayen som identiteten til objektet.

---

# Ikke lagre det som kan beregnes

Modellen skal først og fremst inneholde det applikasjonen må huske.

Hvis vi har:

```js
model.contacts
```

og:

```js
model.viewState.contactsPage.searchText
```

trenger vi vanligvis ikke også:

```js
model.filteredContacts
```

Den filtrerte listen kan beregnes når den trengs.

Det samme gjelder for eksempel:

- totalpris
- antall elementer
- filtrerte lister
- gruppene til en kontakt
- kontaktene i en gruppe

Prøv å ha **én sannhet** fremfor flere kopier av den samme informasjonen.

---

# Objektreferanser og view state

I Emne 2 bruker vi vanlig, muterende imperativ programmering.

Dette er helt greit:

```js
model.contacts.push(newContact);
```

```js
model.contacts.splice(index, 1);
```

```js
contact.name = 'Nytt navn';
```

Vi har **ikke** en regel om at modellen skal være immutable.

Men vi må forstå objektreferanser.

Dette er feil:

```js
model.contacts.push(model.viewState.editContactPage);
```

Da peker domenedataene og view state på det samme objektet.

Lag i stedet et nytt objekt når et arbeidsutkast skal bli et nytt domenobjekt:

```js
const newContact = {
    id: getNextId(model.contacts),
    name: model.viewState.editContactPage.name,
    phone: model.viewState.editContactPage.phone,
    email: model.viewState.editContactPage.email,
};

model.contacts.push(newContact);
```

Ved redigering av et eksisterende objekt er vanlig mutasjon helt greit:

```js
const contact = findObjectById(model.contacts, contactId);

contact.name = model.viewState.editContactPage.name;
contact.phone = model.viewState.editContactPage.phone;
contact.email = model.viewState.editContactPage.email;
```

---

# View og controller

Hovedideen er:

```text
BRUKERHANDLING
      ↓
CONTROLLER
      ↓
MODELLEN ENDRES
      ↓
updateView()
      ↓
NY HTML
```

## View

View leser modellen og lager HTML.

Vi har én hovedfunksjon:

```js
function updateView() {
    if (model.app.currentPage === 'contactsPage') {
        updateViewContactsPage();
    }
    else if (model.app.currentPage === 'editContactPage') {
        updateViewEditContactPage();
    }
}
```

En side kan for eksempel tegnes slik:

```js
function updateViewContactsPage() {
    const html = /*HTML*/`
        <h1>Kontakter</h1>
        ...
    `;

    document.getElementById('app').innerHTML = html;
}
```

Når HTML gjentas, kan vi trekke den ut i en liten funksjon:

```js
function createContactHtml(contact) {
    return /*HTML*/`
        <div>
            <h3>${contact.name}</h3>
            <button onclick="editContact(${contact.id})">
                Rediger
            </button>
        </div>
    `;
}
```

En komponent trenger altså ikke være noe mer avansert enn en funksjon som returnerer HTML.

## Controller

Controller-funksjoner håndterer brukerhandlinger:

```js
function deleteContact(contactId) {
    ...
    updateView();
}
```

Controlleren endrer modellen.

Viewet lager HTML.

Controlleren skal ikke bygge HTML.

---

# Hjelpefunksjoner

Hvis en løkke eller annen operasjon brukes flere steder eller gjør koden vanskelig å lese, trekker vi den ut i en funksjon.

Eksempel:

```js
function findObjectById(array, id) {
    for (const object of array) {
        if (object.id === id) {
            return object;
        }
    }

    return null;
}
```

Det er helt greit at løsningen blir noen linjer lengre når resultatet er kode alle på teamet forstår.

---

# Verktøykassen vi bruker

Dette er hovedverktøykassen i Emne 2.

## Grunnleggende JavaScript

Vi bruker:

- `const` og `let`
- tall, tekst, boolean, `null` og `undefined`
- objekter
- arrays
- vanlige funksjoner med `function`
- parametre og returverdier
- `if`, `else if` og `else`
- ternary operator `condition ? value1 : value2`
- logiske operatorer `&&`, `||` og `!`
- sammenligningsoperatorer
- aritmetiske operatorer
- tilordning og operatorer som `++`, `+=` osv.

## Løkker

Vi bruker vanlige løkker:

```js
for (let i = 0; i < array.length; i++) {
}
```

og:

```js
for (const item of array) {
}
```

`while` er også grunnleggende programmering og kan brukes når det passer.

## Arrays

Vi kan blant annet bruke:

```js
array.length
array.push(...)
array.splice(...)
array.includes(...)
array.indexOf(...)
```

For søking, filtrering, transformasjon og opptelling bruker vi normalt løkker og eventuelt egne hjelpefunksjoner.

## Innebygde funksjoner

Vanlige innebygde funksjoner og metoder for tekst, tall og dato er en del av verktøykassen.

Eksempler:

```js
text.trim()
text.toLowerCase()
text.toUpperCase()
text.includes(...)
text.indexOf(...)
text.startsWith(...)
text.endsWith(...)
text.substring(...)
text.slice(...)
text.split(...)
text.replace(...)
```

```js
Number(...)
parseInt(...)
number.toFixed(...)
Math.round(...)
Math.floor(...)
Math.ceil(...)
Math.min(...)
Math.max(...)
Math.random()
```

```js
new Date()
```

Vi kan bruke andre grunnleggende innebygde tekst-, tall- og datofunksjoner studentene har arbeidet med.

## DOM og HTML

Vi bruker først og fremst:

```js
document.getElementById(...)
```

og setter for eksempel:

```js
document.getElementById('app').innerHTML = html;
```

Vi bygger HTML med template strings:

```js
const html = /*HTML*/`
    <div class="${isSelected ? 'selected' : ''}">
        ${text}
    </div>
`;
```

Vi bruker enkle inline-events:

```html
<button onclick="saveContact()">Lagre</button>
```

```html
<input oninput="model.viewState.editPage.name = this.value">
```

```html
<select onchange="...">
```

CSS-klasser og annen HTML kan gjerne bestemmes med `${...}` inne i template strings.

## Testing

Vi bruker **QUnit**.

Vi tester særlig funksjoner og controller-logikk ved å kontrollere hvordan modellen endres.

---

# Dette bruker vi ikke i Emne 2

KI skal ikke introdusere følgende teknikker i løsningen.

## Ingen JavaScript-moduler

Ikke bruk:

```js
import
export
```

eller:

```html
<script type="module">
```

JavaScript-filene lastes med vanlige `<script src="...">`.

## Ingen Node-verktøy

Ikke bruk:

- Node.js
- npm
- Vite
- package.json
- bundlere eller build-systemer

Applikasjonen er vanlig HTML, CSS og JavaScript.

## Ingen arrow functions

Ikke bruk:

```js
const save = () => {
};
```

Bruk:

```js
function save() {
}
```

## Ingen funksjonelle array-metoder

Ikke bruk:

```js
map()
filter()
find()
reduce()
forEach()
some()
every()
```

Bruk vanlige løkker og hjelpefunksjoner.

`sort()` skal heller ikke introduseres som en generell løsning uten at det eksplisitt er en del av oppgaven; sortering kan løses med teknikkene studentene kjenner.

## Ingen nyere objektsyntaks vi ikke har lært

Ikke bruk:

- destructuring
- spread syntax
- `Object.assign()`

Ikke bruk for eksempel:

```js
const { name, email } = contact;
```

eller:

```js
const copy = { ...contact };
```

Lag objekter eksplisitt.

## Ingen classes

Ikke bruk:

```js
class Contact {
}
```

Vi bruker vanlige objekter og funksjoner.

## Ingen asynkron programmering ennå

Ikke bruk:

- `async`
- `await`
- `Promise`
- `fetch`

Emne 2-applikasjonen er en ren frontend uten backend/API.

Dette kommer senere i utdanningen.

## Ingen avansert DOM-programmering

Ikke bruk som standard:

- `querySelector`
- `querySelectorAll`
- `addEventListener`
- `createElement`
- manuell bygging av DOM-noder

Bruk `getElementById`, `innerHTML`, template strings og enkle inline-events.

## Ingen rammeverk eller ekstra arkitektur

Ikke introduser:

- React
- Vue
- Angular
- Svelte
- TypeScript
- state management-biblioteker
- router-biblioteker
- services
- repositories
- factories
- dependency injection

Ikke legg til arkitektur bare fordi KI mener den er «mer profesjonell».

---

# Når KI brukes

KI kan gjerne:

- evaluere modellen
- foreslå view- og controller-funksjoner
- implementere kode
- forklare kode
- finne feil
- refaktorere innenfor denne verktøykassen
- lage QUnit-tester
- kvalitetssikre løsningen mot dette dokumentet

Men KI skal **ikke** få lov til å bytte ut den avtalte verktøykassen med teknikker den foretrekker selv.

Når KI evaluerer kode, bør den særlig se etter:

- Er `app`, `viewState` og domenedata skilt fornuftig?
- Brukes ID-er mellom relaterte objekter?
- Er data kopiert unødvendig?
- Lagres noe som heller burde beregnes?
- Endrer view domenedata?
- Bygger controller HTML?
- Er et viewState-objekt feilaktig blitt brukt direkte som domenobjekt?
- Brukes konstruksjoner som står på listen over ting vi ikke bruker?
- Kunne komplisert kode vært gjort forståelig med en vanlig løkke og en hjelpefunksjon?

---

# Hovedregelen

Emne 2-måten er ikke ment som den eneste eller mest avanserte måten å bygge JavaScript-applikasjoner på.

Den er en **bevisst begrenset pedagogisk arkitektur**.

Målet er at hele teamet skal kunne:

- lese koden
- forklare modellen
- forstå dataflyten
- finne fram i view og controller
- teste sentral logikk
- bruke KI uten å miste kontroll over kodebasen

**KI skal hjelpe oss å skrive kode innenfor verktøykassen – ikke utvide verktøykassen for oss.**