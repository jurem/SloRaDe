---
layout: page
title: "ID 800"
herofoto: "hero/chips.jpg"
---

# Iskra Delta 800

<img style="float: right; height: 30vh;" src="{{site.baseurl}}/assets/img/ID800/id800_1.jpg">

<br>

 - 1970-1990
 - CPU: J11, 4.5 MHz
 - RAM: Up to 4 MB
 - ROM: 4 KB
 - Operating system: Delta/M
 - RS232 interface

<br>
<br>

------

<br>

The Iskra Delta 800 is a parallel binary 16-bit computer system of general use. It was developed on the basis of the then-popular PDP-11 minicomputer, manufactured by American company DEC (Digital Equipment Corporation) from 1970 to 1990

It ran using the J11 CPU, the average instruction-cycle time of which was 225 ns. It used 8 16-bit registers which featured a program counter and a stack pointer. When switching between tasks the register content was written onto the stack. The CPU was able to differentiate between 8 priority levels of program execution and could execute tasks in either the user mode or the privileged mode. The privileged mode was able to carry out any command and was used by monitors and supervisory programs. In the user mode, switching programs from the privileged mode was disabled, as was shutting down the CPU, while memory reservation was also limited.

Task switching was enabled by nesting interrupts on four priority levels. The device issued an interrupt command through one of the four lines on the bus, each defining its own priority. If the priority of the interrupt command was higher than the priority of the running program, the CPU placed a vector address on the bus that pointed to a suitable interrupt service routine.

The CPU, along with all the other components of the computer, was connected to the “Delta bus”, Delta’s version of the “Unibus”. It is a bidirectional asynchronous bus with separate address, data, and control lines. The speed of the bus could reach up to 1.9 Mbit/s. It was possible to add up to 20 devices to the bus, and even more by using REPEATER.

The CPU was connected to the main memory by a separate memory bus. Generally, the CPU addressed the RAM with 16-bit addresses, which could be expanded to 18 or 22-bit and so could address up to 4 MB of the RAM. The topmost 4k of the address memory were reserved to be addressed by input–output devices.

To enable quicker access to often-used commands, parts of the RAM would be written onto the quicker ROM with the size of 2 KB (4 KB according to some sources).

The usage of components used was enabled by the DELTA/M operating system, while the RS232 interface enabled the computer to connect with external components.


------

References/Sources:

 - [Informatica - Časopis za tehnologijo računalništva in probleme informatike, 1984](https://drive.google.com/drive/u/1/folders/1OMyc91sh_xfEMRsIvhhqpfmahhB0Mnyc)
 - [PDP-11 Arhitektura](https://en.wikipedia.org/wiki/PDP-11_architecture)
 - Janez Kožuh

------

- [Back to computers]({{site.baseurl}}/en/computers)
