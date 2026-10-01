# Kontaktboka – referanseapp for Emne 2

En liten kontaktapp med kontaktliste, oppretting/redigering og grupper.
Vanilla JavaScript, HTML og CSS; Vite kjører appen og Vitest tester logikken.
Data finnes kun i minnet. Omlasting gjenoppretter eksempeldataene.

Den autoritative forklaringen er [Emne 2-måten å bygge en applikasjon](om%20emne%202-måten%20å%20bygge%20app%20på.md).
Les den sammen med eksemplet.

## Kjør lokalt

Du trenger Node.js 22 eller nyere og npm. Fra prosjektmappen:

```sh
npm install
npm run dev
```

Åpne adressen Vite skriver i terminalen, vanligvis http://127.0.0.1:5173.

```sh
npm test             # alle tester én gang, uten DOM
npm run test:watch   # tester mens du arbeider
npm run build        # produksjonsbygg i dist/
npm run preview      # vis produksjonsbygget lokalt
```

## Fra skjermbilder til modell

Behovet: Brukeren skal finne kontakter, endre kontaktopplysninger og organisere
kontakter i flere grupper. Disse enkle skjermskissene bestemmer nødvendig state:

```text
Kontakter                   Ny / rediger kontakt       Grupper
[Søk____________] [Ny]      [Navn_______________]      [Nytt gruppenavn____]
Terje                       [Telefon____________]      [Opprett gruppe]
Telefon / e-post            [E-post_____________]      Sykling
Grupper: Sykling, Reising    [x] Sykling [ ] Konsert     - Terje
[Rediger] [Slett]            [x] Reising                Konsert
[Til grupper]               [Lagre] [Avbryt]            - Per
```

| Hva må huskes? | Plassering | Hvorfor? |
| --- | --- | --- |
| Hvilken side er åpen? | `app.currentPage` | Gjelder hele appen; enkel SPA-navigasjon. |
| Hva søker brukeren etter? | `viewState.contactsPage.searchText` | Midlertidig input. Trefflisten beregnes. |
| Hva redigerer brukeren? | `viewState.editContactPage` | Arbeidsutkast med kontakt-ID, felter og valgte gruppe-ID-er. |
| Hvilken gruppe opprettes? | `viewState.groupsPage.newGroupName` | Input før lagring. |
| Hva vet systemet? | `data.contacts`, `data.groups`, `data.memberships` | Lagrede domenedata, én liste per type. |

## Arkitektur og prinsipper

- **Model:** `model.js` samler app-state, view-state og domenedata.
- **View:** `view.js` leser modellen og returnerer HTML. `main.js` har én sentral
  `updateView()` som velger side og skriver HTML til DOM.
- **Controller:** `controller.js` endrer modellen og kaller `updateView()`.
  `createController(model, updateView)` mottar avhengighetene som to argumenter,
  så testene kan sende inn en fersk modell og en testfunksjon uten nettleser.
- **Arbeidsutkast:** Rediger kopierer kontaktens felter og medlemskap til view-state.
  Lagre oppdaterer domenedata. Avbryt forkaster utkastet. «Kontakter» fra
  redigeringssiden fungerer også som Avbryt; bruk Lagre/Avbryt før du går til Grupper.
- **Relasjoner via ID:** `memberships` kobler kontakter og grupper mange-til-mange.
  Hele gruppeobjekter kopieres aldri inn i kontaktene. Handlinger bruker ID, ikke indeks.
- **Avledede verdier:** Filtrerte kontakter, gruppene til en kontakt og kontaktene
  i en gruppe beregnes ved visning. Ingen av disse listene lagres i modellen.
- **Nye arrays og objekter:** Spread, `map` og `filter` erstatter endrede domenedata.
  Vi tilordner nye arrays til modellen; vi fryser ikke hele modellen eller kopierer alt.
- **Små komponenter:** `contactCard`, `groupCheckbox` og `groupSection` lager
  gjentakende HTML. Brukerinput escapes før det settes inn i HTML.

```text
BRUKERHANDLING → CONTROLLER → MODELLENDRING → updateView() → NY HTML
```

Enkle input-events skriver direkte til view-state. Søk tegner viewet på nytt;
tekstfeltene i skjemaene trenger ikke tegnes på nytt for hvert tastetrykk.
Domenedata oppdateres bare gjennom controlleren. Fokus og markør ved ny tegning
håndteres i view-laget, og er ikke del av modellen.

## Foreslått leserekkefølge

1. `src/model.js`: de tre hovedområdene og eksempeldataene.
2. `src/main.js`: `updateView()` og koblingen til HTML-hendelsene.
3. `src/view.js`: `contactsPageView()` og `contactCard()`.
4. `src/controller.js`: `startEditContact()` lager arbeidsutkastet.
5. `src/view.js`: `editContactPageView()` viser utkastet.
6. `src/controller.js`: `saveContact()`, `cancelEditContact()` og `deleteContact()`.
7. Se `memberships` i modellen, lagring i controlleren og relasjonsoppslagene i viewet.
8. `tests/controller.test.js`: oppretting, redigering, avbryt, medlemskap, sletting,
   grupper, ID-er og avledede verdier. Testene sjekker også at gamle data bevares.

## Prøv selv

Søk etter Pål, tøm søket og opprett en kontakt med to grupper. Rediger navnet
og fjern en gruppe; sjekk begge sidene etter lagring. Rediger igjen og avbryt:
de lagrede dataene skal være uendret. Opprett en gruppe, legg kontakten i den,
og slett kontakten fra et søketreff. Gruppen skal da ikke lenger vise kontakten.
Last siden på nytt for å starte med eksempeldataene igjen.
