# Kontaktboka – Emne 2

En liten SPA med kontaktliste, oppretting/redigering og grupper. Dobbeltklikk
`index.html` for å åpne appen direkte i nettleseren. Ingen installasjon eller
server er nødvendig. Data finnes kun i minnet; omlasting gir eksempeldataene tilbake.

## Fra skjermbilder til modell

Brukeren skal finne kontakter, endre opplysninger og organisere kontakter
i flere grupper. Skjermbildene bestemmer hva modellen må huske:

| Skjermbilde | Hva holder brukeren på med? | State |
| --- | --- | --- |
| Kontakter: søk, liste, Ny, Rediger, Slett | Søker etter en kontakt | `Model.ViewState.contactsPage.searchText` |
| Kontaktutkast: felter, gruppevalg, Lagre, Avbryt | Redigerer et arbeidsutkast | `Model.ViewState.editContactPage` |
| Grupper: medlemmer og felt for ny gruppe | Skriver et gruppenavn | `Model.ViewState.groupsPage.newGroupName` |

`Model.app.currentPage` husker hvilken side som vises. Domenedataene ligger
direkte i `Model.contacts`, `Model.groups` og `Model.memberships`.
Hver type har sin egen liste. Medlemskap kobler kontakter og grupper via ID-er;
vi legger ikke komplette grupper inn i kontaktobjektene.

## Kode og dataflyt

Vanlige script-tags i `index.html` laster globale JavaScript-filer i oppgitt
rekkefølge. Det finnes én global `const Model`. Innholdet i modellen kan endres,
men selve variabelen skal ikke erstattes.

```text
BRUKERHANDLING → CONTROLLER → MODELLENDRING → updateView() → NY HTML
```

`js/main.js` inneholder den sentrale `updateView()` og oppstartskallet.
Den velger mellom `updateViewContactsPage`, `updateViewEditContactPage` og
`updateViewGroupsPage`. Hvert sideview leser modellen, bygger HTML og skriver
til `#app`. Små funksjoner som `createContactHtml` lager gjentakende HTML.

Controller-funksjonene endrer modellen og ber om ny tegning. De leser ingen
inputfelt fra DOM og bygger ingen HTML. Enkle input-hendelser skriver direkte
til `Model.ViewState`; domenedata endres bare gjennom controllerne.

Rediger kopierer feltene til et arbeidsutkast. Lagre oppretter et nytt
kontaktobjekt og nye arrays. Avbryt eller navigasjon til en annen side forkaster
utkastet. Bare Lagre endrer de lagrede kontaktopplysningene og medlemskapene.

Tre ting beregnes ved behov og lagres aldri i modellen:

- Søketreff: `getFilteredContacts()`.
- Gruppene til en kontakt: `getGroupsForContact(contactId)`.
- Kontaktene i en gruppe: `getContactsForGroup(groupId)`.

Vi bruker bevisst vanlige løkker, eksplisitte objekter og eksplisitte nye arrays.
`push` fyller de nye arrayene uten å endre de gamle. Senere kan flere av disse
løsningene skrives kortere med `find`, `filter`, `map` og spread-syntaks.
Her prioriterer vi konstruksjonene studentene allerede kjenner.

`js/common.js` inneholder små hjelpefunksjoner. `escapeHtml` går gjennom tekst
tegn for tegn, slik at for eksempel et navn med `<` eller `"` vises som tekst.
Kontaktsidens view bevarer søkemarkøren når feltet tegnes på nytt; denne lille
DOM-detaljen ligger i viewet og ikke i controlleren eller modellen.

## Leserekkefølge

1. `js/model.js`: app-state, ViewState og entitetslistene.
2. `index.html` og `js/main.js`: script-rekkefølge og sidevalg.
3. `js/contactsPageView.js` og `js/common.js`: HTML, søk og relasjoner.
4. `js/editContactPageController.js`: start redigering, lagre og avbryt.
5. `js/editContactPageView.js`: input skriver bare til utkastet.
6. `js/contactsPageController.js`: sletting bruker ID og rydder medlemskap.
7. `js/groupsPageController.js` og `js/groupsPageView.js`: nye grupper og medlemmer.
8. `tests/controllerTests.js`: eksempler på forventet oppførsel.

Les også [Emne 2-måten å bygge en applikasjon](om%20emne%202-måten%20å%20bygge%20app%20på.md).
Dokumentet forklarer både arkitekturen og JavaScript-nivået. Appen følger dette
med stor `M` i `Model`, stor `V` i `ViewState`, domenelister direkte på modellen
og vanlige løkker.

## Tester i nettleseren

Dobbeltklikk `tests.html`. Den laster [QUnit](https://qunitjs.com/) fra CDN,
så testvisningen trenger nettforbindelse. Selve kontaktappen fungerer uten nett.

Testene laster modellen, hjelpefunksjonene og controllerne, men ingen app-viewer
eller app-HTML. En enkel `updateView()`-stub teller tegningskall. Før hver test
nullstilles modellen eksplisitt, så testene ikke påvirker hverandre.

Testene dekker oppretting, redigering, avbryt, sletting, medlemskap, nye grupper,
navigasjon, ID-er, søk, kopiering og HTML-tegn. De sjekker også at gamle arrays
og kontaktobjekter beholder innholdet sitt.

## Prøv selv

Søk etter Pål, tøm søket og opprett en kontakt med to grupper. Rediger navn og
gruppevalg og lagre. Prøv deretter å endre og avbryte: de lagrede opplysningene
skal være uendret. Opprett en gruppe, legg kontakten i den, og slett kontakten
fra et søketreff. Kontakten skal også forsvinne fra gruppens medlemsliste.
