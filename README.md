# Expresso: An Online Ordering App

## Introduction

Princeton University's Coffee Club, a student-led organization, has already brought together thousands of students since its founding in 2019, with a menu featuring dozens of food and drink options as well as a sit-down venue for people to enjoy each other's company.

The wildly successful Coffee Club ran into what most would consider a great problem to have: long wait times due to queues that went out the door. Given that most students on campus only have minutes to spare to get their daily coffee dose, the Coffee Club staff needed to find a way to keep traffic moving and process orders as quickly as possible. The club's queue system entailed every student to wait on line and order at the register, which proved to be the traffic bottleneck.

Thus, along with four other Princeton students, I helped develop a web application, Expresso, designed exclusively for the Coffee Club that allows anyone with a Princeton University ID (PUID) order online in advance and pick up their completed order the moment they step into the club. This allows students in a hurry to save precious time between classes, meetings, or any of the other numerous obligations college students have.

Expresso was launched early in the 2020 Spring semester and is being used heavily by students across campus.

## About

Expresso was developed in Princeton University's COS 333: Advanced Programming Techniques Fall 2019 course. The frontend is written in JavaScript/React and the backend in Python/Flask. The app is hosted on cPanel. Google Maps API is used for geo-location and the map display. More information about the Coffee Club can be found [here](https://pucoffeeclub.com/).

## My Contribution

I led the frontend team and developed most of the frontend, using React.

## Demo

The web app is live [here](http://coffeeclub.princeton.edu/landing). Anyone can view the landing, team, about, and location pages. Unfortunately, only people with a PUID can login, view the menu, and place orders. For those without a PUID, I've included screen captures of all pages below.

## Screen Captures



## Features

Expresso's main features include:

<b>Dual Interface:</b> Customers and baristas have completely different interfaces: Customers can view the menu, add items to their cart, place orders, view order history, send feedback, and more. Baristas can view the queue of orders, complete orders, view order history, change inventory, and more.

<b>Secure Login:</b> Customers must login with a valid PUID to view the menu and place orders, and can choose to stay logged in. Baristas must login with a valid username and password to use the barista interface. An admin login also exists and allows more privileges on the barista interface.

<b>Online and In-person Payment:</b> Customers can either pay for their order online using their PUID, which will directly charge their Princeton financial account to save time and allow them to grab-and-go, or pay in person at the register. They make this selection before placing their order. (Trivia: We're the first group in COS 333 history to integrate PUID payment into our project.)

<b>Delayed Ordering:</b> Customers can either place their order immediately, or select a valid time during Coffee Club hours to place a delayed order. This order will not pop up on the barista interface until the selected time.

<b>Notifications:</b> Customers will receive a notification via email after they place an order with details about the order.

<b>Menu:</b> Customers can click on any item on the menu to render a popup with more details, along with any add-ons they'd like to make. Baristas can toggle any item's availability on and off which will affect item status on the customer menu, and can enable/disable ordering at any time. Admins can add and remove items from the menu.

<b>Tablet and Mobile:</b> Expresso is mobile-friendly—we anticipated that most of our users would place orders through their phones. It is also tablet-friendly since the Coffee Club anticipates providing tablets for baristas to handle orders.
