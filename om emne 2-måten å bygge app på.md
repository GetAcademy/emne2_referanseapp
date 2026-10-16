# Om Emne 2-måten å bygge en applikasjon

Dette dokumentet beskriver hvordan vi bygger frontend-applikasjoner i Emne 2 ved GET Academy.

Det har to formål:

1. Det er en kort referanse for studentene.
2. Det kan gis til en KI-agent sammen med bestilling, skjermbilder, modell og kode.

Når dokumentet gis til en KI-agent, skal KI-en følge reglene her som **prosjektets kodestandard**.

Målet er ikke å bruke den mest moderne eller mest avanserte JavaScript-arkitekturen.

Målet er å bygge enkle applikasjoner på en måte som hele teamet kan forstå.

---

# Hvorfor vi begrenser verktøykassen

I Emne 2 lærer vi grunnleggende programmering, tilfeldigvis i JavaScript.

Vi bruker bevisst en liten verktøykasse som:

- er stor nok til å løse mange reelle frontend-oppgaver
- er liten nok til at alle på teamet kan lese koden
- gjør dataflyten tydelig
- gjør det mulig å fokusere på programmering framfor rammeverk

Dette er også realistisk trening.

I en bedrift vil du ofte møte regler som:

> Slik bygger vi applikasjoner her.

Da skal du kunne arbeide innenfor prosjektets teknologivalg og kodestil i stedet for å introdusere nye teknikker fordi du tilfeldigvis kjenner dem.

Det samme gjelder KI:

> **KI skal tilpasse seg vår verktøykasse. Vi skal ikke tilpasse prosjektet til alt KI kan.**

---

# Fra behov til kode

Arbeidsprosessen i Emne 2 er:

**kundebehov → tekstlig oppsummering → skjermbilder → modell → implementasjon**

Før vi begynner å implementere bør vi vite:

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

Modellen har grovt sett tre typer state:

1. `app`
2. `viewState`
3. domenedata

---

# `model.app`

Her ligger state som gjelder hele applikasjonen.

For eksempel:

```js
model.app.currentPage
```

Dette forteller hvilken side som skal vises.

Andre typer app-state kan også ligge her dersom de gjelder hele applikasjonen.

---

# `model.viewState`

Her ligger det brukeren holder på med akkurat nå.

Et skjema for å redigere en kontakt kan for eksempel bruke:

```js
model.viewState.editContactPage
```

View state er ofte et **arbeidsutkast**.

Brukeren kan skrive i feltene uten at de lagrede domenedataene endres med en gang.

Eksempel:

```js
viewState: {
    editContactPage: {
        contactId: 7,
        name: 'Terje',
        phone: '12345678',
        email: 'terje@example.com',
    },
}
```

Når brukeren trykker Lagre, kan controlleren bruke disse verdiene til å oppdatere domenedataene.

---

# Domenedata

De faktiske dataene ligger i egne arrays direkte på modellen:

```js
model.contacts
model.groups
model.memberships
```

Som hovedregel bruker vi én toppliste per type ting.

Eksempel:

```js
contacts: [
    { id: 1, name: 'Terje', phone: '123', email: 'terje@mail.com' },
],

groups: [
    { id: 1, name: 'Sykling' },
],

memberships: [
    { contactId: 1, groupId: 1 },
],
```

Vi trenger ikke et ekstra:

```js
model.data
```

rundt domenedataene.

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

Dette:

```js
{
    id: 1,
    name: 'Terje',
    groups: [
        { id: 1, name: 'Sykling' }
    ]
}
```

er derfor normalt ikke måten vi modellerer en relasjon på.

Vi bruker heller separate lister og ID-er.

Bruk også ID når controller-funksjoner skal identifisere objekter:

```js
deleteContact(17);
editContact(17);
```

Ikke bruk plasseringen i arrayen som identiteten til objektet.

---

# Ikke lagre det som kan beregnes

Modellen skal først og fremst inneholde det applikasjonen faktisk må huske.

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

Den filtrerte listen kan beregnes når viewet trenger den.

Det samme gjelder ofte:

- totalpris
- antall elementer
- filtrerte lister
- sorterte visninger
- gruppene til en kontakt
- kontaktene i en gruppe
- om et utstyr er utlånt
- navn som allerede kan finnes via en ID

Prøv å ha:

> **én sannhet**

framfor flere kopier av den samme informasjonen.

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

Dette er den viktigste dataflyten i applikasjonen.

## View

View:

> **leser modellen og lager HTML**

View skal normalt ikke endre domenedata.

## Controller

Controller:

> **håndterer brukerhandlinger og endrer modellen**

Når modellen er endret, kaller controlleren:

```js
updateView();
```

Controlleren skal ikke bygge HTML.

---

# En side består av én view-fil og én controller-fil

Dette er en viktig del av Emne 2-måten.

Som hovedregel har hver side:

- én view-fil
- én controller-fil

Eksempel:

```text
contactsPageView.js
contactsPageController.js

editContactPageView.js
editContactPageController.js

groupsPageView.js
groupsPageController.js
```

Hvis vi lager en side for utstyr:

```text
itemsPageView.js
itemsPageController.js
```

Hvis vi lager en side for aktive utlån:

```text
loansPageView.js
loansPageController.js
```

Vi samler normalt **ikke alle view-funksjonene i én stor `view.js`**.

Vi samler normalt **ikke alle controller-funksjonene i én stor `controller.js`**.

Dette er et bevisst valg.

Hvis du arbeider med en bestemt side, skal det være enkelt å vite hvor du skal lete.

---

# Hver side eier sitt eget view

Hver side har en hovedfunksjon som tegner siden.

Eksempel:

```js
function updateViewContactsPage() {
    document.getElementById('app').innerHTML = /*HTML*/`
        <h1>Kontakter</h1>

        <div>
            ...
        </div>
    `;
}
```

En annen side kan ha:

```js
function updateViewGroupsPage() {
    document.getElementById('app').innerHTML = /*HTML*/`
        <h1>Grupper</h1>

        <div>
            ...
        </div>
    `;
}
```

Hovedregelen er:

> **`updateViewXxxPage()` skal vise den overordnede HTML-strukturen for den aktuelle siden.**

Det skal være mulig å åpne sidefilen og raskt forstå hvordan siden er bygget opp.

---

# Den overordnede `updateView()` kan ligge i `index.html`

Vi bruker ikke et router-bibliotek.

`model.app.currentPage` forteller hvilken side som skal vises.

Den overordnede `updateView()` kan gjerne ligge nederst i `index.html`.

Eksempel:

```html
<script src="model.js"></script>
<script src="common.js"></script>
<script src="commonView.js"></script>

<script src="contactsPageController.js"></script>
<script src="contactsPageView.js"></script>

<script src="editContactPageController.js"></script>
<script src="editContactPageView.js"></script>

<script src="groupsPageController.js"></script>
<script src="groupsPageView.js"></script>

<script>
    function updateView() {
        if (model.app.currentPage === 'contactsPage') {
            updateViewContactsPage();
        }
        else if (model.app.currentPage === 'editContactPage') {
            updateViewEditContactPage();
        }
        else if (model.app.currentPage === 'groupsPage') {
            updateViewGroupsPage();
        }
    }

    updateView();
</script>
```

Dette passer godt fordi vi uansett må inn i `index.html` når vi lager en ny side.

Når en ny side opprettes må vi vanligvis:

1. lage view-filen
2. lage controller-filen
3. legge filene inn med `<script>`-tagger
4. legge siden inn i `updateView()`

---

# Vi bruker vanlige script-tagger

Vi bruker ikke JavaScript-moduler.

Filene lastes slik:

```html
<script src="model.js"></script>
<script src="common.js"></script>
<script src="commonView.js"></script>
<script src="contactsPageController.js"></script>
<script src="contactsPageView.js"></script>
```

Alle funksjonene blir dermed tilgjengelige globalt.

Dette er enkelt og tilstrekkelig for Emne 2.

---

# HTML inne i JavaScript

Vi bygger HTML med template strings og backticks:

```js
const html = /*HTML*/`
    <div>
        <h1>Kontakter</h1>
    </div>
`;
```

Legg merke til:

```js
/*HTML*/
```

rett foran template stringen.

Dette gjør blant annet at Visual Studio Code kan gi bedre HTML syntax highlighting inne i JavaScript-strengen.

Bruk derfor gjerne:

```js
/*HTML*/
```

for HTML-template strings.

---

# Enkle komponenter

Vi bruker ikke React-, Vue- eller andre komponenter.

Når vi sier «komponent» i Emne 2 mener vi vanligvis bare:

> **en vanlig funksjon som lager og returnerer HTML**

Eksempel:

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

Dette er en liten parametriserbar HTML-funksjon.

Den kan brukes flere ganger.

---

# Trekk ut deler av siden – ikke hele siden

Hvis den samme HTML-delen brukes flere steder, kan den trekkes ut.

Eksempel:

```js
function createNavigationHtml() {
    let contactsClass = '';
    let groupsClass = '';

    if (model.app.currentPage === 'contactsPage') {
        contactsClass = 'selected';
    }
    else if (model.app.currentPage === 'groupsPage') {
        groupsClass = 'selected';
    }

    return /*HTML*/`
        <nav>
            <button
                class="${contactsClass}"
                onclick="goToContactsPage()">
                Kontakter
            </button>

            <button
                class="${groupsClass}"
                onclick="goToGroupsPage()">
                Grupper
            </button>
        </nav>
    `;
}
```

Denne funksjonen kan for eksempel ligge i:

```text
commonView.js
```

Sidefilen kan bruke den slik:

```js
function updateViewContactsPage() {
    document.getElementById('app').innerHTML = /*HTML*/`
        ${createNavigationHtml()}

        <main>
            <h1>Kontakter</h1>
            ${createContactsHtml()}
        </main>
    `;
}
```

En annen side kan gjøre:

```js
function updateViewGroupsPage() {
    document.getElementById('app').innerHTML = /*HTML*/`
        ${createNavigationHtml()}

        <main>
            <h1>Grupper</h1>
            ${createGroupsHtml()}
        </main>
    `;
}
```

---

# Litt gjentakelse er helt greit

I eksemplet over gjentas:

```html
<main>
    ...
</main>
```

og kanskje også annen overordnet struktur.

Det er helt greit.

Vi prøver ikke å fjerne all gjentakelse.

I Emne 2 foretrekker vi ofte:

> **litt gjentatt, lettlest HTML framfor en abstraksjon som gjør det vanskeligere å se hele siden på ett sted**

Dette gjør koden enklere å lese for teamet.

Det gir også fleksibilitet.

Hvis én side senere trenger en litt annen struktur, kan vi endre akkurat den siden.

---

# Ikke lag en generell side-wrapper

Vi ønsker normalt ikke et mønster som dette:

```js
function updateViewContactsPage() {
    showPage(createContactsHtml(), 'contactsPage');
}
```

med en generell funksjon:

```js
function showPage(content, selectedPage) {
    document.getElementById('app').innerHTML = /*HTML*/`
        <header>
            ...
        </header>

        <nav>
            ...
        </nav>

        <main>
            ${content}
        </main>
    `;
}
```

Dette kan være teknisk ryddig.

Men det er **ikke Emne 2-måten**.

Da ligger store deler av contacts-sidens struktur et annet sted enn i:

```js
updateViewContactsPage()
```

Studenten må hoppe mellom flere funksjoner for å forstå hvordan siden faktisk ser ut.

Det ønsker vi å unngå.

Trekk heller ut mindre deler:

```js
createNavigationHtml()
createContactHtml(contact)
createMessageHtml(message)
```

men la den enkelte `updateViewXxxPage()` eie sidens overordnede HTML.

---

# Hva kan ligge i `commonView.js`?

Felles view-funksjoner kan ligge i:

```text
commonView.js
```

Eksempler:

```js
createNavigationHtml()
createErrorMessageHtml(message)
createConfirmButtonsHtml(...)
```

Disse funksjonene lager mindre HTML-deler som faktisk brukes på flere sider.

Ikke bruk `commonView.js` som et sted hvor vi flytter hele sidemalen.

---

# Controller-filer

Controller-funksjoner som hører til en side ligger normalt i sidens controller-fil.

Eksempel:

```text
contactsPageController.js
```

kan inneholde:

```js
function goToEditContactPage(contactId) {
    model.viewState.editContactPage.contactId = contactId;
    model.app.currentPage = 'editContactPage';
    updateView();
}
```

Og:

```text
editContactPageController.js
```

kan inneholde:

```js
function saveContact() {
    ...
    model.app.currentPage = 'contactsPage';
    updateView();
}
```

Dette gjør det enkelt å finne brukerhandlingene som tilhører siden.

---

# Felles controller-funksjoner

Hvis en controller-funksjon faktisk brukes på flere sider, kan den ligge i for eksempel:

```text
commonController.js
```

Men lag ikke en stor `commonController.js` bare fordi funksjonene ikke fikk plass andre steder.

Felles kode skal være **reelt felles**.

---

# Hjelpefunksjoner

Vanlige hjelpefunksjoner kan ligge i for eksempel:

```text
common.js
```

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

Et annet eksempel:

```js
function getNextId(array) {
    let highestId = 0;

    for (const object of array) {
        if (object.id > highestId) {
            highestId = object.id;
        }
    }

    return highestId + 1;
}
```

Det er helt greit at løsningen blir noen linjer lengre når resultatet er kode hele teamet forstår.

---

# Typisk filstruktur

En liten Emne 2-app kan for eksempel se slik ut:

```text
index.html
style.css

model.js
common.js
commonView.js
commonController.js

contactsPageView.js
contactsPageController.js

editContactPageView.js
editContactPageController.js

groupsPageView.js
groupsPageController.js
```

Ikke alle apper trenger alle fellesfilene.

`commonController.js` kan for eksempel utelates dersom det ikke finnes noen felles controller-logikk.

Det viktige mønsteret er:

> **Én side → én view-fil + én controller-fil**

---

# Når du lager en ny side

En enkel oppskrift:

1. Finn ut hva siden skal vise.
2. Finn ut hva brukeren kan gjøre på siden.
3. Legg nødvendig state under `model.viewState`.
4. Lag `<sidenavn>View.js`.
5. Lag `<sidenavn>Controller.js`.
6. Lag `updateView<Sidenavn>()`.
7. La `updateView<Sidenavn>()` vise hele sidens overordnede HTML.
8. Lag eventuelt mindre HTML-funksjoner for ting som gjentas.
9. Legg de nye filene inn med `<script>` i `index.html`.
10. Legg siden inn i den overordnede `updateView()`.

---

# Verktøykassen vi bruker

Dette er hovedverktøykassen i Emne 2.

## Grunnleggende JavaScript

Vi bruker:

- `const`
- `let`
- tall
- tekst
- boolean
- `null`
- `undefined`
- objekter
- arrays
- vanlige funksjoner med `function`
- parametre
- returverdier
- `if`
- `else if`
- `else`
- ternary operator
- logiske operatorer
- sammenligningsoperatorer
- aritmetiske operatorer
- vanlig tilordning
- `++`
- `+=` og lignende

---

# Løkker

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

`while` kan også brukes når det passer.

---

# Arrays

Vi kan blant annet bruke:

```js
array.length
array.push(...)
array.splice(...)
array.includes(...)
array.indexOf(...)
```

For søking, filtrering, transformasjon og opptelling bruker vi normalt løkker og eventuelt egne hjelpefunksjoner.

---

# Vanlige innebygde funksjoner

Vanlige innebygde funksjoner og metoder for tekst, tall og dato kan brukes.

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

Tall:

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

Dato:

```js
new Date()
```

Andre grunnleggende innebygde funksjoner studentene allerede har arbeidet med kan også brukes.

---

# DOM og HTML

Vi bruker først og fremst:

```js
document.getElementById(...)
```

og:

```js
document.getElementById('app').innerHTML = html;
```

HTML bygges med template strings:

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

---

# Testing

Vi bruker **QUnit**.

Vi tester særlig:

- hjelpefunksjoner
- controller-logikk
- hvordan modellen endres

En controller kan for eksempel kalle:

```js
updateView();
```

I en test kan vi ha en tom funksjon:

```js
function updateView() {
}
```

Da kan vi teste controller-logikken uten å tegne vanlig HTML.

---

# Dette bruker vi ikke i Emne 2

KI skal ikke introdusere følgende teknikker i løsningen.

---

# Ingen JavaScript-moduler

Ikke bruk:

```js
import
export
```

Ikke bruk:

```html
<script type="module">
```

Bruk vanlige:

```html
<script src="..."></script>
```

---

# Ingen Node-verktøy

Ikke bruk:

- Node.js
- npm
- Vite
- `package.json`
- bundlere
- build-systemer

Applikasjonen er vanlig HTML, CSS og JavaScript.

---

# Ingen arrow functions

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

---

# Ingen funksjonelle array-metoder

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

`sort()` skal heller ikke introduseres som en generell løsning uten at det eksplisitt er en del av oppgaven.

---

# Ingen nyere objektsyntaks vi ikke har lært

Ikke bruk:

- destructuring
- spread syntax
- `Object.assign()`

Ikke bruk:

```js
const { name, email } = contact;
```

Ikke bruk:

```js
const copy = { ...contact };
```

Lag objekter eksplisitt.

---

# Ingen classes

Ikke bruk:

```js
class Contact {
}
```

Vi bruker vanlige objekter og funksjoner.

---

# Ingen asynkron programmering ennå

Ikke bruk:

- `async`
- `await`
- `Promise`
- `fetch`

Emne 2-applikasjonen er en ren frontend uten backend/API.

Dette kommer senere i utdanningen.

---

# Ingen avansert DOM-programmering

Ikke bruk som standard:

- `querySelector`
- `querySelectorAll`
- `addEventListener`
- `createElement`
- manuell bygging av DOM-noder

Bruk:

- `getElementById`
- `innerHTML`
- template strings
- inline-events

---

# Ingen rammeverk

Ikke introduser:

- React
- Vue
- Angular
- Svelte
- TypeScript

---

# Ingen ekstra arkitektur

Ikke introduser:

- state management-biblioteker
- router-biblioteker
- services
- repositories
- factories
- dependency injection

Ikke legg til arkitektur bare fordi KI mener at det er «mer profesjonelt».

---

# Ikke optimaliser bort den enkle filstrukturen

KI skal ikke:

- samle alle views i én `view.js`
- samle alle controllere i én `controller.js`
- lage en generell `showPage()`
- lage en generell `renderPage()`
- lage en generell `layout()` som eier hele sidens HTML
- skjule den enkelte sidens struktur bak mange abstraksjonslag

Selv om en slik løsning kan være teknisk gyldig, er den ikke den arkitekturen vi bruker i Emne 2.

Hovedregelen er:

> **Hver side skal være lett å finne og lett å lese.**

---

# Når KI brukes

KI kan gjerne:

- evaluere modellen
- finne mulig dobbeltlagring av data
- foreslå view- og controller-funksjoner
- foreslå hvilke sider applikasjonen trenger
- implementere kode
- forklare kode
- finne feil
- refaktorere innenfor denne verktøykassen
- lage QUnit-tester
- kvalitetssikre løsningen mot dette dokumentet

Men KI skal ikke bytte ut den avtalte verktøykassen eller arkitekturen med teknikker den selv foretrekker.

---

# Når KI evaluerer modellen

KI bør blant annet undersøke:

- Er `app`, `viewState` og domenedata skilt fornuftig?
- Brukes ID-er mellom relaterte objekter?
- Er data kopiert unødvendig?
- Lagres noe som heller burde beregnes?
- Mangler modellen data som skjermbildene trenger?
- Er noe egentlig viewState, men lagt i domenedata?
- Er noe egentlig domenedata, men lagt i viewState?

KI bør forklare problemene før den gjør store endringer.

---

# Når KI evaluerer koden

KI bør særlig kontrollere:

- Har hver side sin egen view-fil?
- Har hver side sin egen controller-fil?
- Ligger den overordnede `updateView()` enkelt og synlig?
- Eier hver `updateViewXxxPage()` sin egen overordnede HTML?
- Er mindre gjentakende HTML trukket ut på en fornuftig måte?
- Er det opprettet en unødvendig generell side-wrapper?
- Endrer view domenedata?
- Bygger controller HTML?
- Er et viewState-objekt brukt direkte som domenobjekt?
- Brukes ID-er riktig?
- Lagres avledede verdier unødvendig?
- Brukes teknikker som står på listen over ting vi ikke bruker?
- Kan komplisert kode gjøres forståelig med en vanlig løkke og en hjelpefunksjon?

---

# Et eksempel på en god KI-instruks

Når en KI-agent skal implementere en Emne 2-app kan den for eksempel få denne instruksen:

> Les bestillingen, skjermbildene, modellen og dokumentet «Om Emne 2-måten å bygge en applikasjon» før du begynner.
>
> Følg dette dokumentet som prosjektets kodestandard.
>
> Hver side skal ha sin egen view-fil og controller-fil.
>
> Hver `updateViewXxxPage()` skal eie den overordnede HTML-strukturen for sin side.
>
> Den overordnede `updateView()` kan ligge i `index.html`.
>
> Felles, mindre HTML-deler kan trekkes ut som funksjoner, for eksempel i `commonView.js`.
>
> Ikke lag en generell `showPage()`, `renderPage()` eller tilsvarende funksjon som overtar hele sidens layout.
>
> Litt gjentatt HTML mellom sidene er helt greit dersom det gjør hver side enklere å lese.
>
> Bruk bare JavaScript-konstruksjonene som er tillatt i dette dokumentet.
>
> Bruk `/*HTML*/` foran HTML-template strings.
>
> Ikke introduser modules, npm, Vite, rammeverk eller annen arkitektur.
>
> Kontroller løsningen mot dokumentet når du er ferdig.

---

# Hovedregelen

Emne 2-måten er ikke ment som den eneste eller mest avanserte måten å bygge JavaScript-applikasjoner på.

Den er en:

> **bevisst begrenset pedagogisk arkitektur**

Målet er at hele teamet skal kunne:

- lese koden
- forklare modellen
- forstå dataflyten
- finne fram til riktig side
- finne fram i view og controller
- forstå hvordan HTML blir laget
- teste sentral logikk
- bruke KI uten å miste kontroll over kodebasen

Vi prioriterer:

> **enkelhet, lokal lesbarhet og felles forståelse foran maksimal abstraksjon**

Og hovedregelen for KI er:

> **KI skal hjelpe oss å skrive kode innenfor verktøykassen og arkitekturen – ikke utvide eller erstatte dem for oss.**