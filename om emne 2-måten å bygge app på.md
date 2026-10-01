# Emne 2-måten å bygge en applikasjon

I Emne 2 går vi fra å kunne programmere enkeltstående ting til å utvikle en fungerende applikasjon for en kunde. Målet er ikke først og fremst å lære et bestemt rammeverk. Målet er å lære en enkel og systematisk måte å tenke utvikling på: fra kundens behov, via skjermbilder og modell, til en ferdig applikasjon.

Metoden er med vilje enkel. Den skal være mulig å bruke tidlig i programmeringsopplæringen, samtidig som den introduserer prinsipper som også er viktige i større frontend-rammeverk.

## Fra behov til kode

Vi går normalt gjennom fire hovedsteg:

**1. Forstå bestillingen**  
Vi møter kunden, stiller spørsmål og prøver å forstå behovet. Etter møtet oppsummerer vi forståelsen vår skriftlig og lar kunden korrigere eventuelle misforståelser.

**2. Tegne skjermbilder**  
Vi lager grove skisser av løsningen. Poenget er ikke grafisk design, men å konkretisere hvordan brukeren skal bruke systemet.

For hvert skjermbilde spør vi blant annet:

- Hva skal brukeren se?
- Hva kan brukeren gjøre?
- Hva skjer når brukeren gjør det?
- Hvordan kommer brukeren videre til neste skjermbilde?

Skjermbildene skal også hjelpe oss til å oppdage spørsmål og uklarheter vi ikke så tidligere.

**3. Lage modellen**  
Når skjermbildene er tydelige, finner vi ut hvilken state og hvilke data applikasjonen trenger.

Et viktig prinsipp er:

> Ikke finn på modellen uavhengig av skjermbildene. La skjermbildene og brukerens handlinger fortelle hva modellen trenger.

**4. Implementere applikasjonen**  
Til slutt lager vi view- og controller-koden som bruker modellen. Hvis de foregående stegene er gjort grundig, skal mye av implementasjonen følge naturlig av skjermbildene og modellen.

---

# Modellen

Vi deler modellen i tre hovedområder:

```js
const model = {
    app: {
    },

    viewState: {
    },

    data: {
    },
};
```

## 1. `app`

Her ligger state som gjelder hele applikasjonen.

Eksempler:

```js
app: {
    currentPage: 'productsPage',
    loggedInUserId: null,
}
```

`currentPage` forteller hvilket hovedskjermbilde som skal vises.

Hvis en bruker er logget inn, kan `loggedInUserId` peke på en bruker i `data.users`.

DOM-elementer, produkter, ordre og lignende hører ikke hjemme her.

---

# 2. `viewState`

`viewState` beskriver det brukeren holder på med akkurat nå i brukergrensesnittet.

Vi organiserer vanligvis view state etter sider:

```js
viewState: {
    productsPage: {
        searchText: '',
        selectedCategoryId: null,
    },

    editContactPage: {
        contactId: null,
        name: '',
        phone: '',
        email: '',
    },

    shoppingCartPage: {
        pickupDate: null,
        pickupTime: null,
    },
}
```

Et nyttig spørsmål er:

> Er dette noe systemet vet, eller noe brukeren holder på med akkurat nå?

Hvis kunden for eksempel finnes i systemet med navnet «Per Hansen», er dette data.

Hvis brukeren akkurat nå redigerer navnet i et inputfelt og har skrevet «Per Hans», er dette view state.

View state fungerer derfor ofte som et **arbeidsutkast**.

Når brukeren trykker Lagre, kan controlleren bruke verdiene i view state til å oppdatere de faktiske dataene.

Når brukeren trykker Avbryt, kan vi bare forkaste arbeidsutkastet.

---

# 3. `data`

Her ligger de faktiske tingene applikasjonen handler om.

Eksempel:

```js
data: {
    contacts: [
        { id: 1, name: 'Terje', phone: '123' },
        { id: 2, name: 'Per', phone: '456' },
    ],

    groups: [
        { id: 1, name: 'Sykling' },
        { id: 2, name: 'Reising' },
    ],
}
```

Vi prøver som hovedregel å ha **én liste per type entitet**.

For eksempel:

```js
students: []
courses: []
enrollments: []
```

heller enn å bygge store og dype strukturer hvor kurs ligger inni studenter eller studenter ligger inni kurs.

---

# Koble objekter sammen med ID-er

Når ulike typer data hører sammen, bruker vi vanligvis ID-er.

Eksempel:

```js
contacts: [
    { id: 1, name: 'Terje' },
],

groups: [
    { id: 10, name: 'Sykling' },
    { id: 20, name: 'Reising' },
],

memberships: [
    { contactId: 1, groupId: 10 },
    { contactId: 1, groupId: 20 },
]
```

Da slipper vi å kopiere hele gruppeobjekter inn i kontakten.

Det samme prinsippet kan brukes på:

- studenter, kurs og påmeldinger
- ordre, produkter og ordrelinjer
- brukere og roller
- filmer og sjangre

Dette ligner måten man modellerer relasjoner i en relasjonsdatabase.

---

# Ikke lagre det som kan beregnes

Modellen bør inneholde det applikasjonen må **huske**.

Den trenger ikke inneholde alt som skal **vises**.

Hvis vi har:

```js
cartItems: [
    { productId: 1, quantity: 2 },
    { productId: 4, quantity: 1 },
]
```

og prisene finnes på produktene, trenger vi normalt ikke lagre:

```js
totalPrice: 347
```

Totalprisen kan beregnes når den skal vises.

Det samme gjelder blant annet:

- antall varer i handlekurven
- filtrerte lister
- summer
- gjennomsnitt
- tekst som kan settes sammen fra andre data

Dette reduserer risikoen for at to verdier som egentlig beskriver samme ting kommer ut av synk.

---

# Én sannhet

Unngå å kopiere de samme opplysningene flere steder.

Hvis et produkt finnes slik:

```js
{
    id: 7,
    name: 'Cappuccino',
    price: 45
}
```

bør ikke handlekurven også lagre:

```js
{
    productId: 7,
    productName: 'Cappuccino',
    productPrice: 45
}
```

Vanligvis holder dette:

```js
{
    productId: 7,
    quantity: 2
}
```

Når viewet trenger navn og pris, finner det produktet ved hjelp av `productId`.

---

# Bruk ID-er, ikke plassering i array

Hvis en bruker klikker på en kontakt, et produkt eller en ordre, bør handlingen normalt identifisere objektet med ID.

For eksempel:

```js
editContact(17)
deleteProduct(42)
showOrder(1336)
```

Ikke baser logikken på at objektet tilfeldigvis er element nummer 3 i en array.

Array-rekkefølgen kan endre seg når vi søker, filtrerer eller sorterer.

ID-en identifiserer selve objektet.

---

# View

Viewets hovedoppgave er å:

> lese modellen og lage HTML.

En enkel struktur kan være:

```js
function updateView() {
    if (model.app.currentPage === 'contactsPage') {
        document.getElementById('app').innerHTML = contactsPageView();
    }
}
```

Mindre funksjoner kan brukes som komponenter:

```js
function contactCard(contact) {
    return `
        <div>
            <h3>${contact.name}</h3>
            <button onclick="editContact(${contact.id})">
                Edit
            </button>
        </div>
    `;
}
```

En komponent er i denne sammenhengen bare en funksjon som lager HTML som vi trenger flere ganger.

Viewet kan også beregne verdier det trenger.

For eksempel kan det filtrere en liste basert på `searchText`, eller beregne summen av en handlekurv.

---

# Controller

Controller-funksjoner håndterer handlinger som endrer applikasjonen.

Eksempler:

```js
saveContact()
deleteContact(id)
addToCart(productId)
completeOrder()
markOrderReady(orderId)
```

En typisk flyt er:

**brukeren gjør noe**

↓

**controller-funksjonen kjører**

↓

**modellen endres**

↓

**viewet tegnes på nytt**

Controlleren bør først og fremst arbeide med modellen.

Den bør normalt ikke være avhengig av å lese eller manipulere DOM direkte.

Det gjør koden enklere å forstå og enklere å teste.

---

# Lag nye objekter og arrays

Når modellen endres, foretrekker vi som hovedregel å lage nye objekter og arrays fremfor å endre eksisterende strukturer direkte.

Eksempel:

```js
model.data.contacts = [
    ...model.data.contacts,
    newContact
];
```

i stedet for:

```js
model.data.contacts.push(newContact);
```

Og:

```js
model.data.contacts =
    model.data.contacts.filter(contact => contact.id !== id);
```

i stedet for å bruke `splice()` på den eksisterende arrayen.

Dette gjør dataflyten mer forutsigbar og reduserer problemer knyttet til delte objektreferanser.

---

# Hold controller-logikken testbar

En nyttig test er:

> Kan jeg teste controller-funksjonen uten en nettleserside?

Hvis vi har:

```js
function deleteContact(id) {
    model.data.contacts =
        model.data.contacts.filter(contact => contact.id !== id);
}
```

kan vi sette opp en modell, kjøre funksjonen og kontrollere resultatet.

Hvis funksjonen i stedet er avhengig av `document.getElementById()`, HTML-elementer og andre detaljer i brukergrensesnittet, blir den vanskeligere å teste.

Derfor prøver vi å holde domenelogikken i controlleren og selve HTML-genereringen i viewet.

---

# Fra skjermbilde til kode

Når du står fast, gå tilbake til skjermbildet.

For hvert skjermbilde kan du spørre:

### Hva må viewet vise?

Dette forteller hvilke data viewet må kunne lese.

### Hva holder brukeren på med akkurat nå?

Dette peker ofte på `viewState`.

### Hva kan brukeren gjøre?

Dette forteller hvilke controller-funksjoner vi trenger.

### Hva må endres eller huskes når brukeren gjør dette?

Dette forteller hvilke deler av modellen controlleren må endre.

På denne måten kan vi ofte gå ganske systematisk fra skjermbilde til ferdig applikasjon.

---

# Den grunnleggende dataflyten

Hele arkitekturen kan oppsummeres slik:

**MODEL → VIEW**

Viewet leser modellen og tegner brukergrensesnittet.

**BRUKER → CONTROLLER → MODEL**

Når brukeren gjør noe, kaller viewet en controller-funksjon som endrer modellen.

Deretter tegnes viewet på nytt:

**BRUKERHANDLING → CONTROLLER → MODEL → UPDATE VIEW → NYTT SKJERMBILDE**

Dette er den viktigste ideen i måten vi bygger applikasjoner på i Emne 2.

---

# Når du vurderer din egen løsning

Spør blant annet:

- Har jeg skilt tydelig mellom `app`, `viewState` og `data`?
- Ligger midlertidige inputverdier i riktig view state?
- Ligger de faktiske domenedataene i `data`?
- Har hver type entitet sin egen liste?
- Bruker jeg ID-er til å koble objekter sammen?
- Har jeg kopiert informasjon som allerede finnes et annet sted?
- Lagrer jeg noe som egentlig kan beregnes?
- Bruker jeg ID i stedet for array-indeks?
- Endrer controller-funksjonene modellen uten å være avhengige av DOM?
- Kan viewet i prinsippet tegnes på nytt bare ved å lese modellen?
- Lager jeg nye objekter og arrays når state endres?
- Er det tydelig hvilke controller-funksjoner som svarer på brukerens handlinger?

Hvis dette er på plass, har applikasjonen vanligvis en struktur som er både enkel å forstå og mulig å bygge videre på.

---

# KI som kvalitetssikring

Når du bruker KI til å evaluere løsningen din, kan du gi KI:

1. denne beskrivelsen av Emne 2-måten
2. skjermbildene dine
3. modellen din
4. controller- og view-koden din

Be så KI undersøke om løsningen følger prinsippene over.

KI bør ikke bare foreslå «bedre kode», men forklare konkrete avvik fra denne arkitekturen:

- data som ligger på feil sted
- dobbeltlagret eller avledet state
- manglende view state
- dype eller unødvendig nøstede datastrukturer
- objekter som burde kobles sammen med ID-er
- controller-funksjoner som arbeider direkte med DOM
- view-funksjoner som endrer domenedata
- bruk av array-indeks der ID burde brukes
- mutasjon som med fordel kunne vært erstattet av nye objekter eller arrays

Målet er ikke at all kode skal se helt lik ut.

Målet er at vi skal kunne forklare **hvorfor state og data ligger der de ligger, hvordan brukerhandlinger endrer modellen, og hvordan viewet bygges fra modellen**.