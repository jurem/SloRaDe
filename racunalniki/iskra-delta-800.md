---
layout: page
title: "ID 800"
herofoto: "hero/chips.jpg"
---

# Iskra Delta 800

<img style="float: right; height: 30vh;" src="{{site.baseurl}}/assets/img/ID800/id800_1.jpg">

<br>

 - 1970-1990
 - 4.5 MHz Procesor J11
 - Do 4 MB RAM pomnilnika
 - 4 KB ROM pomnilnik
 - Operacijski sistem Delta/M
 - RS232 vmesnik

<br>
<br>

------

<br>

Iskra Delta 800 je vzporedni binarni 16-bitni računalniški sistem splošne namembnosti. Razvit je bil na osnovi takrat popularnega miniračunalnika PDP-11, proizvajanega med leti 1970 do 1990 s strani ameriškega podjetja DEC (Digital Equipment Corporation).

Uporabljal je procesor J11, katerega povprečni čas ukaznega cikla je bil 225ns. Vseboval je 8 16-bitnih registrov, ki so vključevali programski števec in kazalec na sklad, na katerega se je zapisala vsebina registrov od preklopu med opravili. Procesor je razlikoval 8 prioritetnih nivojev izvajanja programov in opravila izvajal v uporabniškem ali privilegiranem načinu. V privilegiranem načinu so se lahko izvajali vsi ukazi, ta način so uporabljali monitorji in super nadzorni programi. V uporabniškem načinu so bile onemogočene menjave programov iz privilegiranega načina in ustavljanje procesorja, omejena pa je bila tudi rezervacija pomnilnika.

Za preklapljanje med opravili so bile omogočene gnezdene prekinitve v štirih prioritetnih nivojih. Naprava je podala zahtevo za prekinitev preko ene izmed štirih linij na vodilu, ki so določale vsaka svojo prioriteto. V primeru, da je prioriteta prekinitvene zahteve bila višja od prioritete trenutno izvajanega opravila, je procesor na vodilo postavil naslov vektorja, ki je kazal na primeren prekinitveno strežni program.

Procesor je bil, tako kot ostale komponente računalnika, povezan na "Delta vodilo", ki je bila Deltina različica vodila "Unibus". Gre za dvosmerno asinhrono vodilo z ločenimi naslovnimi, podatkovnimi ter kontrolnimi linijami. Hitrosti vodila so segale do 1,9 Mbit/s. Na vodilo je bilo možno dodati do 20 naprav, z uporabo REPEATER-ja pa tudi več.

Z ločenim pomnilniškim vodilom je bil procesor povezan z glavnim pomnilnikom. V osnovi je procesor pomnilnik naslavljal s 16-bitnimi naslovi, ki pa so se lahko razširili na 18 ali 22-bitne in tako naslovili do 4MB pomnilnika. Najvišji 4k naslovnega prostora so bili rezervirani za naslavljanje vhodno izhodnih naprav.

Za hitrejši ponovni dostop do pogosto izvajanih ukazov, so se deli glavnega pomnilnika prepisovali v hitrejši ROM medpomnilnik velikosti 2 KB (glede na nekatere vire tudi 4 KB).

Izkoriščanje uporabljenih komponent je omogčal operacijski sistem DELTA/M, povezava z zunanjimi komponentami pa je bila možna preko vmesnika RS232.


------

Viri:

 - [Informatica - Časopis za tehnologijo računalništva in probleme informatike, 1984](https://drive.google.com/drive/u/1/folders/1OMyc91sh_xfEMRsIvhhqpfmahhB0Mnyc)
 - [PDP-11 Arhitektura](https://en.wikipedia.org/wiki/PDP-11_architecture)
 - Janez Kožuh

------

Še nekaj podatkov, ki jih je po izvedbi projekta priskrbel Jože Stepan.

- Proizvajalec: ISKRA DELTA
- Ime računalnika: Delta 800
- Začetek proizvodnje: 1984
- Dolžina besede: 16 bit
- Procesor: predelani procesorski plošči računalnika DIGITAL PDP 11/34A, M8265 in M8266 ali kompatibilni enoploščni procesor D 800 domačega razvoja in proizvodnje.
- Predpomnilnik (cashe): statični 2kbyte – opcija, DEC M8268
- Memory management: RUP modul (IDC razvoj in proizvodnja) in MPC modul za pariteto (IDC razvoj in proizvodnja)
- RAM: dinamični – max. 4M byte. Tuji moduli ali moduli MPE256 – domač razvoj in proizvodnja.
- BOOT ROM : DEC M9312, ali TBC modul domače proizvodnje. Vsebuje konzolni emulator s testom 1kx4 ROM in max. 4 kosi 512X4bit ROM. Vsak za svoj tip  periferne enote (floppy drive, tračna enota, diskovna enota itd.) če je bila vgrajena.
- Komunikacija: RS232 (20 mA zanka) vmesniki za komunikacijo z videoterminali in tiskalniki (AVD16, AVD004, AVD001-vse domači razvoj in proizvodnja), LTV002 paralelni vmesnik za delo z linijskimi tiskalniki (domač razvoj in proizvodnja), ter ostali moduli kompatibilni z UNIBUS vodilom - paralelni i/o vmesniki, DAQ vmesniki itd.
- Tračna enota: TSC kontroler, domač razvoj in proizvodnja. Enote proizvajalca Cipher.
- Diskovna enota: BP01 kontroler. Diski Fujitsu, največ 4 enote.
- Operacijski sistem: Delta-M

------

[Nazaj na pregled računalnikov]({{site.base}}/SloRaDe/racunalniki)
