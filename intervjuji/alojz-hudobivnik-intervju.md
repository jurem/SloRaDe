---
layout: page
title: "Intervju: Alojz Hudobivnik"
featured-img: intervju
summary: Intervju
categories: slo-post
---

# Intervju: Alojz Hudobivnik

**Kakšen je bil vaš začetek v slovenski računalniški idustriji, pri katerem podjetju ste bili zaposleni in kakšna je bila vaša vloga?**

Gimnazijo sem zaključil leta 1978 ter postal štipendist v kranjski Iskra Elektromehaniki in se odločil za študij na Fakulteti za elektrotehniko v Ljubljani. Leta 1979 so me po prvem letniku študija poslali v TOZD Iskra Računalniki, kjer sem opravljal prakso.
V treh tednih pri Iskri sem se spoznal z bodočimi sodelavci, programsko opremo, ki so jo uporabljali in napisal aplikacijo, ki je iz informacij o javnem prometu pridobila najhitrejšo linijo.

Prakso v drugem letniku sem opravil v Švici. Jeseni 1980 pa so naju s kolegom Rokom Sošićem (danes je doktor na Univerzi Stanford) povabili na delo v Iskro.

Najina prva naloga je bil disassembler, to je program, ki omogoča programerjem lažji pregled kode, tako da zaporedja ničel in enic pretvori v jezik assembler, ki je bolj prijazen za bralca. Projekt sva zaključila v začetku čertega letnika. Disassembler so uporabljali na Iskra Telematika, kjer je potekala proizvodnja telefonskih central. Diplomiral sem leta 1983 in se zaposlil v Iskrinem oddelku za razvoj mikroračunalnikov v Kranju.

**Na čem ste delali po zaposlitvi?**

Zvone Duplančič je bil vodja projekta za emulacijo IBM terminala. Pred odhodom v vojsko sem mu pomagal s prikazom informacij na zaslonu. Problem je bil namreč v tem, da so imeli IBM-ovi terminali drugačne zaslone od ostalih terminalov, ki so bili takrat v uporabi.

Ko sem prišel iz vojske leta 1984 so me poslali na tečaj operacijskega sistema Unix v London. Med mojo odsotnostjo (služenje vojaškega roka) so kolegi že naredili nekaj strojne opreme za Motorolin 68000 procesor, nakar so trije sistemci poleti1984 odpotovali za 3 mesece v Ameriko na »portiranje« UNICX operacijskega sistema na to strojno opremo.

Leta 1984 in 1985 smo delali z Unix operacijskim sistemom. Ekipa se je v tem času ukvarjala predvsem z pisanjem gonilnikov za UNIX.

**Vaša magistrska naloga je bila povezana z računalnikom Triglav, kako ste bili povezani z razvojem tega računalnika?**

Moj prvi projekt v zvezi s Triglavom je bil komercialen. Leta 1985 so v sosednjem oddelku delali na grafični kartici za Triglav, ki ježe podpirala barve. Naša naloga je bila priskrbeti programe, ki bi pokazali zmogljivosti Triglava na sejmih. Analizirali smo nemški teletekst ter naredili svojo izvedbo, ki se je uporabila na Triglavu. Za prikaz Teletexta smo uporabili zmogljivosti grafične kartice.

Leta 1986 pa smo imeli že kar precej izkušenj in lotili smo se razvoja SCSI kontrolerja. SCSI standard se je pojavil istega leta in je predstavljal nov način dostopa procesorja do več diskov. Izpeljanke tega standarda se uporabljajo še danes. Zaradi hitrejšega dostopa, branja in pisanja na disk smo sodelovali z Iskro Telematiko, ki so se za naš projekt zanimali zaradi ogromnih količin podatkov, 
s katerimi delajo telefonske centrale.

Zvone Duplančič, Matej Kranjec in jaz smo delali na programski opremi za SCSI kontroler. Sodelovali smo z drugo ekipo, ki je bila zadolžena za strojno opremo. Strojno opremo so sestavljali po zahtevah programerske ekipe in razvili smo koncept pametnega SCSI kontrolerja. Razvoj je potekal 3 leta. Leta 1988 je nastal večji del moje magistrske naloge, ki bolj natančno opisuje naš projekt.

**Nam lahko poveste še kaj o pametnem SCSI kontrolerju?**

Vgrajeno programsko opremo smo programirali v programskem jeziku C, a smo ugotovili da je koda napisana v  zbirniku (assemberju) dvakrat hitrejša. To smo kompenzirali z močnejšim procesorjem M68020. Programiranje v višjem programskem jeziku je namreč bistveno hitrejše in udobnejše.
Po mojem predlogu smo se odločili za izvedbo kontrolerja, ki ni omogočal le komuniciranje z več diski, ampak je lahko do podatkov dostopalo tudi več procesorjev prek tega kontrolerja. Takrat smo delali z za eno generacijo boljšimi komponentami kot ostale ekipe, ki so delale Triglav.
Zvone Duplančič je iz Iskra Telematika priskrbel RTOS s pomočjo katerega smo realizirali programski del kontrolerja. Jaz sem bil odgovoren za pravilno razporejanje procesov po prioriteti.
Predvidevali smo, da bo naš izdelek lahko komuniciral z osmimi različnimi procesorji.
Dostop do SCSI krmilnika smo z uporabo predpomnilnika in razporejanjem ukazov za branje optimizirali tako učinkovito, da smo dobili povprečni dostopni čas 4ms (normalno pri tedanji tehnologiji je bilo 8-10ms in več). Načrtovali smo tudi RAID1 in RAID5, ampak to nam zaradi poslovnih razlogov konec 1989 ni uspelo.

V tistem času so imeli računalniki Partnerji 20MB diske, mi pa smo našo opremo testirali z 8 x 400MB diski.  Računalnik Triglav je lahko  imel tri različne procesorje, SCSI kontroler je moral delovati z vsemi. 
Procesorji so z drugimi napravami komunicirali preko VME vodila. Naš SCSI kontroler smo pripravili za delo z vsemi tremi konfiguracijami Triglava (Motorola, Intel, VAX). Na kontrolerju je bilo možno tudi posodabljanje vgrajene programske opreme med delovanjem računalnika preko serijskega porta na plošči.

Zanimivo je še to, da je prevajanje in generiranje programskega paketa (SCSI kontroler) na Triglavih trajalo dve uri ali več (make). Računalnik podjetja Sun Workstations pa je omogočal generiranje te kode in s tem testiranje nove verzije programa v 20 minutah. Ker je bil v Jugoslavijov tistem času  prepovedan uvoz teh naprav smo se na delo vozili v Celovec, kjer smo imeli na voljo te računalnike in tako smo prihranili čas.

Izdelek se je stabiliziral z Unix operacijskim sistemom na procesorju Motorola 68020. Žal se je kmalu v letu 1989 začel zaton podjetja in s tem se je razvoj in proizvodnja končala.

**Ali se je ohranilo kaj strojne ali programske opreme po zaključku, ko je bilo jasno da ne bo prišlo do proizvodnje?**

Namen je bil tak. Programsko opremo smo shranili na diske in popisali kaj vse imamo, da bi lahko komu prišlo prav. Kasneje sem izvedel,  da so bili po stečaju diski prodani, vsebina pa je bila izgubljena saj so jih formatirali.

**Vaši ekipi sta razvijali nekaj novega. So bile izkušnje dovolj ali ste se morali še dodatno izobraževati?**

Iskra Delta je v tem času organizirala poletna šolanja. Ravno v času, ko smo začeli z razvojem SCSI kontrolerja, je potekalo šolanje v Dubrovniku. Šlo je za predavanja ki so jih izvajali profesorji jugoslovanskega porekla, ki so poučevali in delali v Ameriki. Zame je bilo najbolj koristno predavanje profesorja Miloša D. Ercegovaca iz Univerze v Kaliforniji. Profesor je predaval o arhitekturi takrat najnovejših superačunalnikov.
Ekipa se je tako spoznala s koncepti porazdeljenega računalništva in se odločila, da bo ideje, ki se uporabljajo v superračunalnikih implementirala v mikroračunalnike.
Kot sem omenil že prej so nas pošiljali na izobraževanja tudi v ekipah in posamezno, nakar smo udeleženci izobraževanj delili znanje z drugimi zaposlenimi.
V Novi Gorici smo organizirali tudi izobraževanja za kupce naših izdelkov.

**Iskra je sodelovala tudi na raznih športnih prireditvah, nam lahko poveste kaj več o tem?**

V Kranju se je z obdelavo športnih prireditev ukvarjal Božo Oman, še ena ekipa je delala v Ljubljani. Šlo je za prikazovanje štartnih mest, rezultatov in podobnih informacij na zaslonih med potekom prireditev za televizijo. To storitev so potrebovali vsi in tudi sam sem se v prvih nekaj letih dela pri Delti pridružil ekipam, ki so šle na lokacije prireditev urejati prenos in obdelavo podatkov.
Delali smo v Planici in Kranjski Gori, univerzijadi na Slovaški (Štrbski Pleso, 1987), za Balkanijado v Ljubljani (1987) pa smo razvili zelo naprdno mrežno aplikacijo. Leta 1989 sem bil prisoten tudi na Bledu kjer je potekalo tekmovanje v veslanju za veterane.

**Kaj se je dogajalo z vašo ekipo in vami ob zatonu Iskre Delte?**

Direktor razvoja na komunikacijskem oddelku nam je razložil okoliščine in začeli smo iskati možne rešitve.
Ekipa za strojno opremo je naredila skice za masovno proizvodnjo in tudi na sejmih smo navduševali z izdelkom. V Kranju nas je vodil Marko Rogač pri razvoju Triglav (Motorola linija). Iskali smo podjetja, ki bi lahko odkupila naš oddelek. Šlo je za 60 ljudi, polovica je delala na aplikacijah, ostali pa smo delali na grafični kartici, SCSI kartici ter ostali strojni in sistemski programski opremi.

Žal pa se nam ni uspelo dogovoriti z nobenim podjetjem za odkup celotnega oddelka. Iskratel je zaposlil cca 20 članov, ostali so po svoje iskali zaposlitev pred in po stečaju Iskra Delte spomladi 1990.

Zvone Duplančič je npr. ustvaril podjetje na osnovi zanimivih izkušenj preprogramiranja laserskih tiskalnikih podjetja Oki, da so omogočali tiskanje šumnikov. Pred mojim odhodom v Iskratel sem z njimi sodeloval. Kasneje se je podjetje EuroPlus ukvarjalo s tiskanjem črtnih kod ter enostavnih grafik. Danes je to podjetje znano kot NiceLabel.

Po prihodu v Iskratel sem se zaposlil v razvoju telefonskih central. Hitro sem šel tudi v Nemčijo, kjer sem delal in nabiral izkušnje na Siemens-ovih programih. Kasneje sem vrsto let vodil oddelek za prilagoditve in razvoj  EWSD Signalizacije št. 7 za različne države po svetu.

**Kakšen je vaš pogled na Iskro sedaj? Kje jo vidite v primerjavi z ostalimi podjetji po svetu?**

Če primerjam Iskra Delto s podjetji Billa Gatesa in Steva Jobsa bi rekel, da smo bili z razvojem le eden ali dva meseca za njimi. Naši najboljši ljudje so bili na enakem nivoju kot tisti drugje po svetu. Le kot primer bi dal študenta (Peter Brajak), ki je na Japonskem študiral paralelne računalnike. Ob njegovi vrnitvi smo ga oblili z vprašanji, saj smo imeli dovolj praktične podlage,
da smo lahko vse novo znanje takoj aplicirali.

Veliko smo se ukvarjali tudi z omrežji. Povezovali smo različne računalnike na različnih lokacijah. Tako je prišlo tudi do demonstracije za JNA, kjer smo Ljubljano, Banjaluko in Vrhniko povezali ter vojski na zaslonih pokazali grafično karto, ki je v realnem času prikazovala situacijo na terenu.
Na tem področju je znano tudi to, da smo na Kitajsko prodali celotno omrežje računalnikov (1986 so bila LAN/WAN omrežja velika redkost).

Obdobje Iskre Delte je bilo čudovito in še danes vse »deltaše« ta vez močno povezuje. Na žalost se je ta zgodba takrat prisilno končala, večina sodelavcev pa je na osnovi takratnih izkušenj in zasenjaštva to uspešno izkoristila v svojem življenju na različnih področjih.

<br>

------

- [Nazaj na intervjuje]({{site.base}}/SloRaDe/intervjuji)
