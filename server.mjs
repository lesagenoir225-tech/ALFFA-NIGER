// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";

// src/data/initialData.ts
var INITIAL_SETTINGS = {
  name: "ALFFA NIGER",
  slogan: "La qualit\xE9 au meilleur prix.",
  whatsappElectronique: "22796222310",
  whatsappTextile: "22796222310",
  phone: "",
  address: "",
  email: "",
  hours: "",
  facebook: "https://www.facebook.com/share/1BpsCF3tBK/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/khalil_baye?srtk=NzVnbzJ2dmFvNnhr",
  tiktok: "https://www.tiktok.com/@alffaniger?_r=1&_t=ZS-9AQ5RF69CYY",
  mapsElectronique: "https://maps.app.goo.gl/yr1v33pcPDGsSSpe8?g_st=ic",
  mapsTextile: "",
  siteUrl: "https://alffaniger.com",
  legalName: "",
  legalInfo: "",
  privacyText: "",
  heroTitle: "La qualit\xE9 au meilleur prix.",
  heroSubtitle: "T\xE9l\xE9phones, \xE9lectronique, bazins et tissus de premier choix au Niger. Deux boutiques distinctes, une seule exigence de qualit\xE9.",
  elecIntro: "Smartphones et appareils \xE9lectroniques de grandes marques certifi\xE9es, avec prix transparents affich\xE9s en FCFA.",
  textileIntro: "Bazins et tissus rigoureusement s\xE9lectionn\xE9s pour leur qualit\xE9, leur tenue, leur \xE9clat et leurs motifs prestigieux."
};
var INITIAL_ELECTRONIQUE_PRODUCTS = [
  {
    id: "samsung-a14",
    shop: "electronique",
    name: "Samsung A14",
    brand: "samsung",
    category: "smartphones",
    price: 9e4,
    availability: "disponible",
    capacity: "",
    colors: "Noir, Argent, Vert",
    condition: "Neuf scell\xE9",
    reference: "SM-A145F",
    description: "Smartphone Samsung Galaxy A14, grand \xE9cran fluide et autonomie longue dur\xE9e.",
    specs: '\xC9cran 6.6" FHD+\nTriple cam\xE9ra 50 MP\nBatterie 5000 mAh\nRecharge rapide',
    image: "/images/products/electronique/samsung-a14.webp",
    sourceImage: "https://i.ibb.co/LdztL2Kf/IMG-6725.webp",
    isNew: false,
    createdAt: 1
  },
  {
    id: "iphone-13-pro-max",
    shop: "electronique",
    name: "iPhone 13 Pro Max \u2014 256 Go",
    brand: "apple",
    category: "smartphones",
    price: 3e5,
    availability: "disponible",
    capacity: "256 Go",
    colors: "Bleu Alpin, Graphite, Or",
    condition: "Excellent \xE9tat",
    reference: "A2643",
    description: "Apple iPhone 13 Pro Max avec \xE9cran Super Retina XDR ProMotion 120Hz et triple capteur photo professionnel.",
    specs: '\xC9cran 6.7" Super Retina XDR ProMotion\nPuce A15 Bionic\nTriple appareil photo 12 MP avec zoom optique\nAutonomie exceptionnelle',
    image: "/images/products/electronique/iphone-13-pro-max.jpg",
    sourceImage: "https://i.ibb.co/d1W1N3k/IMG-6726.jpg",
    isNew: false,
    createdAt: 2
  },
  {
    id: "samsung-note-20-ultra",
    shop: "electronique",
    name: "Samsung Note 20 Ultra \u2014 256 Go",
    brand: "samsung",
    category: "smartphones",
    price: 15e4,
    availability: "disponible",
    capacity: "256 Go",
    colors: "Mystic Bronze, Mystic Black",
    condition: "Tr\xE8s bon \xE9tat",
    reference: "SM-N986B",
    description: "Samsung Galaxy Note 20 Ultra avec stylet S-Pen ultra-r\xE9actif et \xE9cran Dynamic AMOLED 2X.",
    specs: '\xC9cran 6.9" Dynamic AMOLED 120Hz\nStylet S-Pen int\xE9gr\xE9\nCapteur 108 MP avec Space Zoom 50x\nCompatibilit\xE9 5G',
    image: "/images/products/electronique/samsung-note-20-ultra.jpg",
    sourceImage: "https://i.ibb.co/whbRgZjB/IMG-6727.jpg",
    isNew: false,
    createdAt: 3
  },
  {
    id: "iphone-12-pro-max",
    shop: "electronique",
    name: "iPhone 12 Pro Max \u2014 256 Go",
    brand: "apple",
    category: "smartphones",
    price: 23e4,
    availability: "disponible",
    capacity: "256 Go",
    colors: "Bleu Pacifique, Graphite, Argent",
    condition: "Tr\xE8s bon \xE9tat",
    reference: "A2411",
    description: "iPhone 12 Pro Max, design \xE9l\xE9gant en acier chirurgical avec Ceramic Shield et compatibilit\xE9 MagSafe.",
    specs: '\xC9cran 6.7" Super Retina XDR\nPuce A14 Bionic\nScanner LiDAR pour r\xE9alit\xE9 augment\xE9e et portraits de nuit\nEnregistrement vid\xE9o Dolby Vision HDR',
    image: "/images/products/electronique/iphone-12-pro-max.webp",
    sourceImage: "https://i.ibb.co/chF0jcnM/IMG-6728.webp",
    isNew: false,
    createdAt: 4
  },
  {
    id: "samsung-s24-ultra",
    shop: "electronique",
    name: "Samsung S24 Ultra \u2014 256 Go",
    brand: "samsung",
    category: "smartphones",
    price: 4e5,
    availability: "disponible",
    capacity: "256 Go",
    colors: "Titane Gris, Titane Noir, Titane Violet",
    condition: "Neuf scell\xE9",
    reference: "SM-S928B",
    description: "Le fleuron de Samsung avec cadre en titane ultra-r\xE9sistant, processeur Snapdragon 8 Gen 3 et fonctionnalit\xE9s Galaxy AI.",
    specs: '\xC9cran plat 6.8" QHD+ Dynamic AMOLED 2X\nCapteur principal 200 MP avec zoom optique haute r\xE9solution\nStylet S-Pen inclus\nBatterie 5000 mAh',
    image: "/images/products/electronique/samsung-s24-ultra.jpg",
    sourceImage: "https://i.ibb.co/3YdBZDgs/IMG-6729.jpg",
    isNew: true,
    createdAt: 5
  },
  {
    id: "iphone-x",
    shop: "electronique",
    name: "iPhone X \u2014 256 Go",
    brand: "apple",
    category: "smartphones",
    price: 1e5,
    availability: "disponible",
    capacity: "256 Go",
    colors: "Gris Sid\xE9ral, Argent",
    condition: "Bon \xE9tat r\xE9vis\xE9",
    reference: "A1901",
    description: "iPhone X avec \xE9cran OLED Super Retina bord \xE0 bord, Face ID et double appareil photo avec stabilisation optique.",
    specs: '\xC9cran 5.8" Super Retina OLED\nReconnaissance faciale Face ID s\xE9curis\xE9e\nDouble cam\xE9ra 12 MP grand-angle et t\xE9l\xE9objectif\nRecharge sans fil',
    image: "/images/products/electronique/iphone-x.jpg",
    sourceImage: "https://i.ibb.co/BVy1S4x8/IMG-6730.jpg",
    isNew: false,
    createdAt: 6
  },
  {
    id: "iphone-16-pro-max",
    shop: "electronique",
    name: "iPhone 16 Pro Max \u2014 256 Go",
    brand: "apple",
    category: "smartphones",
    price: 63e4,
    availability: "disponible",
    capacity: "256 Go",
    colors: "Titane Naturel, Titane D\xE9sert, Titane Noir",
    condition: "Neuf scell\xE9 sous bo\xEEte",
    reference: "A3296",
    description: 'Le dernier n\xE9 haut de gamme d\u2019Apple : \xE9cran immersif 6.9", commande de l\u2019appareil photo tactile et puce A18 Pro.',
    specs: '\xC9cran 6.9" Super Retina XDR ProMotion\nPuce A18 Pro surpuissante\nBouton Commande de l\u2019appareil photo\nAutonomie record',
    image: "/images/products/electronique/iphone-16-pro-max.webp",
    sourceImage: "https://i.ibb.co/xSpFRwQd/IMG-6731.webp",
    isNew: true,
    createdAt: 7
  },
  {
    id: "iphone-14-pro-max",
    shop: "electronique",
    name: "iPhone 14 Pro Max",
    brand: "apple",
    category: "smartphones",
    price: null,
    availability: "non_precise",
    capacity: "",
    colors: "Violet Intense, Noir Sid\xE9ral, Or",
    condition: "Selon arrivage",
    reference: "A2894",
    description: "iPhone 14 Pro Max avec Dynamic Island interactive et capteur photo principal 48 MP.",
    specs: '\xC9cran 6.7" Super Retina XDR avec Dynamic Island\nPuce A16 Bionic\nCapteur 48 MP\nMode Action pour vid\xE9os ultra-stables',
    image: "/images/products/electronique/iphone-14-pro-max.webp",
    sourceImage: "https://i.ibb.co/4nWv0TMs/IMG-6732.webp",
    isNew: false,
    createdAt: 8
  },
  {
    id: "samsung-s23-ultra",
    shop: "electronique",
    name: "Samsung S23 Ultra",
    brand: "samsung",
    category: "smartphones",
    price: null,
    availability: "non_precise",
    capacity: "",
    colors: "Vert, Noir Fant\xF4me, Cr\xE8me",
    condition: "Selon arrivage",
    reference: "SM-S918B",
    description: "Samsung Galaxy S23 Ultra, capteur 200 MP r\xE9volutionnaire et performances gaming de premier ordre.",
    specs: '\xC9cran 6.8" Dynamic AMOLED 2X 120Hz\nPuce Snapdragon 8 Gen 2 for Galaxy\nCapteur 200 MP et zoom 100x\nStylet S-Pen',
    image: "/images/products/electronique/samsung-s23-ultra.webp",
    sourceImage: "https://i.ibb.co/TxXR4NPj/IMG-6734.webp",
    isNew: false,
    createdAt: 9
  },
  {
    id: "iphone-x-max",
    shop: "electronique",
    name: "iPhone X Max",
    brand: "apple",
    category: "smartphones",
    price: null,
    availability: "non_precise",
    capacity: "",
    colors: "Or, Gris Sid\xE9ral, Argent",
    condition: "Selon arrivage",
    reference: "A2101",
    description: "Grand \xE9cran Super Retina OLED 6.5 pouces et finition de prestige.",
    specs: '\xC9cran 6.5" Super Retina OLED\nPuce A12 Bionic\nFace ID\nDouble appareil photo 12 MP',
    image: "/images/products/electronique/iphone-x-max.jpg",
    sourceImage: "https://i.ibb.co/MyPdrSxq/IMG-6735.jpg",
    isNew: false,
    createdAt: 10
  },
  {
    id: "iphone-15",
    shop: "electronique",
    name: "iPhone 15",
    brand: "apple",
    category: "smartphones",
    price: null,
    availability: "non_precise",
    capacity: "",
    colors: "Rose, Jaune, Vert, Bleu, Noir",
    condition: "Selon arrivage",
    reference: "A3090",
    description: "iPhone 15 avec Dynamic Island, port universel USB-C et appareil photo 48 MP.",
    specs: '\xC9cran 6.1" Super Retina XDR avec Dynamic Island\nPuce A16 Bionic\nCapteur 48 MP\nPort USB-C',
    image: "/images/products/electronique/iphone-15.webp",
    sourceImage: "https://i.ibb.co/5X7Q3wtJ/IMG-6736.webp",
    isNew: false,
    createdAt: 11
  }
];
var INITIAL_TEXTILE_PRODUCTS = [
  {
    id: "bazin-drews",
    shop: "textile",
    name: "Bazin Drews",
    brand: "drews",
    category: "bazins",
    price: 11e3,
    availability: "disponible",
    model: "Bazin Riche Damass\xE9",
    description: "Bazin Drews de premi\xE8re qualit\xE9, r\xE9put\xE9 pour sa tenue impeccable, sa brillance \xE9clatante et la finesse de son tissage.",
    specs: "100% Coton peign\xE9 sup\xE9rieur\nBrillance longue tenue\nId\xE9al pour grands boubous et c\xE9r\xE9monies\nLargeur standard export",
    image: "/images/products/textile/bazin-drews.jpg",
    sourceImage: "https://i.ibb.co/m5YVjNyq/33914-DC5-AC3-B-4-FED-900-B-FAE666-D7-FDCE.png",
    isNew: false,
    createdAt: 1
  },
  {
    id: "bazin-gagny-lah",
    shop: "textile",
    name: "Bazin Gagny Lah",
    brand: "gagny-lah",
    category: "bazins",
    price: 12500,
    availability: "disponible",
    model: "Bazin Riche Authentique",
    description: "V\xE9ritable Bazin Riche Gagny Lah, c\xE9l\xE8bre pour son \xE9clat prestigieux, sa texture soyeuse et ses motifs damass\xE9s incomparables.",
    specs: "Qualit\xE9 Gagny Lah originale certifi\xE9e\nTeinture riche et reflets \xE9clatants\nTenue majestueuse pour les occasions d\u2019exception",
    image: "/images/products/textile/bazin-gagny-lah.jpg",
    sourceImage: "https://i.ibb.co/CKrV5K7C/562-A8232-EBA6-4354-997-D-7-E162-C8-F92-CD.png",
    isNew: true,
    createdAt: 2
  },
  {
    id: "bazin-getzner",
    shop: "textile",
    name: "Bazin Getzner",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique, la r\xE9f\xE9rence internationale du damas pour son raffinement absolu.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble",
    image: "/images/products/textile/bazin-getzner.jpg",
    sourceImage: "https://i.ibb.co/qMXLbNsn/E694684-B-5-A0-A-41-C3-829-F-338-C0-A4659-B4.png",
    isNew: false,
    createdAt: 3
  },
  {
    id: "bazin-getzner-1",
    shop: "textile",
    name: "Bazin Getzner \u2014 Bleu Turquoise",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique, brillance \xE9clatante et tissage damass\xE9 soyeux en nuance bleu turquoise.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-1.jpg",
    sourceImage: "https://i.ibb.co/HDy0NDV7/878b1df5-ba13-426c-94e0-831334e27b3a.jpg",
    isNew: true,
    createdAt: 4
  },
  {
    id: "bazin-getzner-2",
    shop: "textile",
    name: "Bazin Getzner \u2014 Lilas Nacr\xE9",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique en nuance lilas nacr\xE9 avec reflets scintillants et damas pr\xE9cieux.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-2.jpg",
    sourceImage: "https://i.ibb.co/nN1jbNnX/1fde637b-c79f-4b62-9da7-26ba0843c72e.jpg",
    isNew: true,
    createdAt: 5
  },
  {
    id: "bazin-getzner-3",
    shop: "textile",
    name: "Bazin Getzner \u2014 Gris Anthracite",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique en gris anthracite profond, tissage damass\xE9 noble pour c\xE9r\xE9monies.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-3.jpg",
    sourceImage: "https://i.ibb.co/MDgBRzZ1/71d867e8-ca26-45e9-9b04-98d8cd2f2b34.jpg",
    isNew: true,
    createdAt: 6
  },
  {
    id: "bazin-getzner-4",
    shop: "textile",
    name: "Bazin Getzner \u2014 Bleu Glacier",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique ton bleu glacier doux avec damas g\xE9om\xE9trique lumineux.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-4.jpg",
    sourceImage: "https://i.ibb.co/53srJVf/0fc307b5-c713-49ae-8f61-d951283df64d.jpg",
    isNew: true,
    createdAt: 7
  },
  {
    id: "bazin-getzner-5",
    shop: "textile",
    name: "Bazin Getzner \u2014 Bleu Canard",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique bleu canard aux reflets oc\xE9aniques, broderie damass\xE9e prestigieuse.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-5.jpg",
    sourceImage: "https://i.ibb.co/pBQJFq5t/b48e8966-9e87-4afc-a49b-6bf5ae7b4c55.jpg",
    isNew: true,
    createdAt: 8
  },
  {
    id: "bazin-getzner-6",
    shop: "textile",
    name: "Bazin Getzner \u2014 Bleu Royal",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique bleu royal vif, \xE9clat majestueux et texture damass\xE9e 100% coton peign\xE9.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-6.jpg",
    sourceImage: "https://i.ibb.co/Rp2q5p9N/1ac6d4cd-bd35-4393-b4da-a2f0259d23c2.jpg",
    isNew: true,
    createdAt: 9
  },
  {
    id: "bazin-getzner-7",
    shop: "textile",
    name: "Bazin Getzner \u2014 Gris Ardoise",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique gris ardoise \xE9l\xE9gant, brillance sobre et tenue remarquable.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-7.jpg",
    sourceImage: "https://i.ibb.co/WWZWbZzr/eae83e82-c7fd-4790-9175-d0f4c6d72261.jpg",
    isNew: true,
    createdAt: 10
  },
  {
    id: "bazin-getzner-8",
    shop: "textile",
    name: "Bazin Getzner \u2014 Violet Prune",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique violet prune profond, damas raffin\xE9 pour tenues traditionnelles de prestige.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-8.jpg",
    sourceImage: "https://i.ibb.co/SGkHhjb/26b13441-a900-4067-9e00-ede449e060c2.jpg",
    isNew: true,
    createdAt: 11
  },
  {
    id: "bazin-getzner-9",
    shop: "textile",
    name: "Bazin Getzner \u2014 Bleu Azur",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique bleu azur lumineux, finesse du tissage jacquard et \xE9clat intense.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-9.jpg",
    sourceImage: "https://i.ibb.co/CKf2YvxZ/2a37cce8-6c6e-447a-ab15-d52187146907.jpg",
    isNew: true,
    createdAt: 12
  },
  {
    id: "bazin-getzner-10",
    shop: "textile",
    name: "Bazin Getzner \u2014 Gris Perle Argent\xE9",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique gris perle aux reflets argent\xE9s, souplesse et tenue de grand apparat.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-10.jpg",
    sourceImage: "https://i.ibb.co/fGXcMTkn/fc191a94-7175-49a5-99ba-6b349f580550.jpg",
    isNew: true,
    createdAt: 13
  },
  {
    id: "bazin-getzner-11",
    shop: "textile",
    name: "Bazin Getzner \u2014 Mauve Parme",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique nuance mauve parme \xE9clatant, motifs damass\xE9s autrichiens d\u2019exception.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-11.jpg",
    sourceImage: "https://i.ibb.co/vxYJTPxX/afdaf383-fcee-4d72-87a6-3febdb816eac.jpg",
    isNew: true,
    createdAt: 14
  },
  {
    id: "bazin-getzner-12",
    shop: "textile",
    name: "Bazin Getzner \u2014 Lavande Doux",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique ton lavande doux, soyeux au toucher et brillance naturelle longue dur\xE9e.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-12.jpg",
    sourceImage: "https://i.ibb.co/S4Db2wvr/30928e90-ba51-4a32-8793-4b9ecaf3e8b9.jpg",
    isNew: true,
    createdAt: 15
  },
  {
    id: "bazin-getzner-13",
    shop: "textile",
    name: "Bazin Getzner \u2014 Noir \xC9b\xE8ne",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique noir \xE9b\xE8ne profond, damas sombre au lustre exceptionnel pour grandes c\xE9r\xE9monies.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-13.jpg",
    sourceImage: "https://i.ibb.co/ns7zmGSp/07e6fdcc-d3e3-4125-b7c3-d83414c5a1ed.jpg",
    isNew: true,
    createdAt: 16
  },
  {
    id: "bazin-getzner-14",
    shop: "textile",
    name: "Bazin Getzner \u2014 Violet Imp\xE9rial",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique violet imp\xE9rial, nuances majestueuses et tissage damass\xE9 haute d\xE9finition.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-14.jpg",
    sourceImage: "https://i.ibb.co/fdMcNVfr/6064af33-0e3b-4105-81a0-6248d213e00b.jpg",
    isNew: true,
    createdAt: 17
  },
  {
    id: "bazin-getzner-15",
    shop: "textile",
    name: "Bazin Getzner \u2014 Bleu Cobalt",
    brand: "getzner",
    category: "bazins",
    price: 1e4,
    availability: "disponible",
    model: "Bazin Autrichien Damass\xE9",
    description: "Bazin autrichien Getzner authentique bleu cobalt \xE9clatant, damas noble d\u2019Autriche avec tomb\xE9 parfait.",
    specs: "Tissage d\u2019Autriche Getzner authentique\nMotifs jacquard haute d\xE9finition\nToucher soyeux et tenue noble\nLargeur standard grand boubou",
    image: "/images/products/textile/bazin-getzner-15.jpg",
    sourceImage: "https://i.ibb.co/tPN3cPww/5c515e47-de35-40ed-93a8-0455a8bc1367.jpg",
    isNew: true,
    createdAt: 18
  }
];
var INITIAL_TEXTILE_BRANDS = [
  {
    id: "drews",
    name: "Drews",
    logo: "/images/brands/drews.jpg",
    sourceLogo: "https://i.ibb.co/m5YVjNyq/33914-DC5-AC3-B-4-FED-900-B-FAE666-D7-FDCE.png",
    order: 1
  },
  {
    id: "gagny-lah",
    name: "Gagny Lah",
    logo: "/images/brands/gagny-lah.jpg",
    sourceLogo: "https://i.ibb.co/CKrV5K7C/562-A8232-EBA6-4354-997-D-7-E162-C8-F92-CD.png",
    order: 2
  },
  {
    id: "getzner",
    name: "Getzner",
    logo: "/images/brands/getzner.jpg",
    sourceLogo: "https://i.ibb.co/qMXLbNsn/E694684-B-5-A0-A-41-C3-829-F-338-C0-A4659-B4.png",
    order: 3
  }
];
var INITIAL_FEATURED = {
  electronique: [
    "iphone-16-pro-max",
    "samsung-s24-ultra",
    "iphone-13-pro-max",
    "samsung-a14"
  ],
  textile: [
    "bazin-getzner-1",
    "bazin-getzner-2",
    "bazin-getzner-3",
    "bazin-getzner-4",
    "bazin-getzner-5",
    "bazin-getzner-6",
    "bazin-drews",
    "bazin-gagny-lah"
  ]
};
var INITIAL_BTP_PROJECTS = [];
var INITIAL_DATABASE = {
  version: 1,
  seededAt: (/* @__PURE__ */ new Date()).toISOString(),
  settings: INITIAL_SETTINGS,
  products: [...INITIAL_ELECTRONIQUE_PRODUCTS, ...INITIAL_TEXTILE_PRODUCTS],
  featured: INITIAL_FEATURED,
  brands: INITIAL_TEXTILE_BRANDS,
  btpProjects: INITIAL_BTP_PROJECTS
};

// src/data/experienceReferences.ts
var EXPERIENCE_DOMAIN_ORDER = ["btp", "informatique", "vivrier"];
function isPublishableDocument(doc) {
  return doc.isPublic === true && doc.redacted === true;
}
function toPublicExperienceReference(ref) {
  return {
    ...ref,
    beneficiary: ref.beneficiaryPublic ? ref.beneficiary : void 0,
    documents: (ref.documents || []).filter(isPublishableDocument)
  };
}
function sortExperienceReferences(list) {
  return [...list].sort((a, b) => {
    const d = EXPERIENCE_DOMAIN_ORDER.indexOf(a.domain) - EXPERIENCE_DOMAIN_ORDER.indexOf(b.domain);
    if (d !== 0) return d;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}
function getPublicExperienceReferences(list) {
  return sortExperienceReferences(list.filter((r) => r.status === "publie")).map(toPublicExperienceReference);
}
var SEEDED_AT = 17917632e5;
function seed(id, domain, order, data) {
  return {
    id,
    domain,
    order,
    title: data.title,
    description: data.description,
    services: data.services,
    beneficiary: data.beneficiary,
    beneficiaryPublic: true,
    procurement: data.procurement,
    executionConfirmed: false,
    photos: [],
    documents: [],
    status: "publie",
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT
  };
}
var INITIAL_EXPERIENCE_REFERENCES = [
  // --- Domaine 1 : BTP ---
  seed("exp-btp-maison-arret-agadez", "btp", 1, {
    title: "Construction du mur de cl\xF4ture et r\xE9habilitation de la maison d\u2019arr\xEAt d\u2019Agadez",
    description: "Construction d\u2019un mur de cl\xF4ture et r\xE9habilitation de la maison d\u2019arr\xEAt d\u2019Agadez.",
    services: ["Construction d\u2019un mur de cl\xF4ture.", "R\xE9habilitation de la maison d\u2019arr\xEAt."],
    beneficiary: "Maison d\u2019arr\xEAt d\u2019Agadez",
    procurement: "Appel d\u2019offres"
  }),
  seed("exp-btp-tribunal-tchirozerine", "btp", 2, {
    title: "Construction du mur de cl\xF4ture et r\xE9habilitation du Tribunal d\u2019instance de Tchiroz\xE9rine",
    description: "Travaux de cl\xF4ture et r\xE9habilitation du Tribunal d\u2019instance de Tchiroz\xE9rine.",
    services: ["Travaux de cl\xF4ture.", "R\xE9habilitation de l\u2019\xE9tablissement."],
    beneficiary: "Tribunal d\u2019instance de Tchiroz\xE9rine",
    procurement: "DC"
  }),
  seed("exp-btp-maison-arret-madarounfa", "btp", 3, {
    title: "Construction du mur de cl\xF4ture et r\xE9habilitation de la maison d\u2019arr\xEAt de Madarounfa",
    description: "Travaux de cl\xF4ture et r\xE9habilitation de la maison d\u2019arr\xEAt de Madarounfa.",
    services: ["Travaux de cl\xF4ture.", "R\xE9habilitation de la maison d\u2019arr\xEAt."],
    beneficiary: "Maison d\u2019arr\xEAt de Madarounfa",
    procurement: "DC"
  }),
  seed("exp-btp-maison-arret-aguie", "btp", 4, {
    title: "R\xE9habilitation de la maison d\u2019arr\xEAt d\u2019Agui\xE9",
    description: "R\xE9habilitation de la maison d\u2019arr\xEAt d\u2019Agui\xE9.",
    services: ["R\xE9habilitation de l\u2019\xE9tablissement."],
    beneficiary: "Maison d\u2019arr\xEAt d\u2019Agui\xE9"
  }),
  seed("exp-btp-tgi-zinder", "btp", 5, {
    title: "Construction d\u2019un bloc d\u2019audience et r\xE9habilitation de l\u2019ensemble du Tribunal de grande instance de Zinder",
    description: "Construction d\u2019un bloc d\u2019audience et r\xE9habilitation de l\u2019ensemble du Tribunal de grande instance de Zinder.",
    services: ["Construction d\u2019un bloc d\u2019audience.", "R\xE9habilitation de l\u2019ensemble du TGI."],
    beneficiary: "Tribunal de grande instance de Zinder",
    procurement: "Appel d\u2019offres et DRP"
  }),
  seed("exp-btp-direction-faj", "btp", 6, {
    title: "Construction de gu\xE9rites et r\xE9habilitation des installations de la Faj",
    description: "Construction de gu\xE9rites et r\xE9habilitation de l\u2019ensemble de la direction de la Faj.",
    services: ["Construction de gu\xE9rites.", "R\xE9habilitation de l\u2019ensemble de la direction."],
    beneficiary: "Direction de la Faj"
  }),
  // --- Domaine 2 : Matériel informatique et fournitures ---
  seed("exp-info-giz", "informatique", 1, {
    title: "Livraisons de mat\xE9riel informatique \xE0 la GIZ",
    description: "Livraisons de mat\xE9riel informatique \xE0 la GIZ.",
    services: ["Plusieurs livraisons."],
    beneficiary: "GIZ",
    procurement: "Appels d\u2019offres"
  }),
  seed("exp-info-fao", "informatique", 2, {
    title: "Livraisons de mat\xE9riel informatique \xE0 la FAO",
    description: "Livraisons de mat\xE9riel informatique \xE0 la FAO.",
    services: ["Plusieurs livraisons."],
    beneficiary: "FAO",
    procurement: "Appels d\u2019offres"
  }),
  seed("exp-info-croix-rouge-niger", "informatique", 3, {
    title: "Livraisons de mat\xE9riel informatique \xE0 la Croix-Rouge Niger",
    description: "Livraisons de mat\xE9riel informatique \xE0 la Croix-Rouge Niger.",
    services: ["Plusieurs livraisons."],
    beneficiary: "Croix-Rouge Niger"
  }),
  seed("exp-info-mca", "informatique", 4, {
    title: "Fourniture et livraison de mat\xE9riel informatique au MCA",
    description: "Fourniture et livraison de mat\xE9riel informatique au MCA.",
    services: ["Livraison de mat\xE9riel informatique."],
    beneficiary: "MCA",
    procurement: "Appel d\u2019offres"
  }),
  seed("exp-info-ministere-justice", "informatique", 5, {
    title: "Livraisons de mat\xE9riel informatique au minist\xE8re de la Justice du Niger",
    description: "Livraisons de mat\xE9riel informatique au minist\xE8re de la Justice du Niger.",
    services: ["Plusieurs livraisons."],
    beneficiary: "Minist\xE8re de la Justice du Niger",
    procurement: "Appels d\u2019offres ouverts"
  }),
  seed("exp-info-faj", "informatique", 6, {
    title: "Livraison de mat\xE9riel informatique \xE0 la Faj",
    description: "Livraison de mat\xE9riel informatique \xE0 la Faj.",
    services: ["Livraison de mat\xE9riel informatique."],
    beneficiary: "Faj",
    procurement: "Appels d\u2019offres"
  }),
  seed("exp-info-ministere-jeunesse-sports", "informatique", 7, {
    title: "Fourniture de mat\xE9riel et de fournitures destin\xE9s aux examens",
    description: "Livraison de fournitures pour les examens au b\xE9n\xE9fice du minist\xE8re de la Jeunesse et des Sports du Niger.",
    services: ["Livraison de fournitures pour les examens."],
    beneficiary: "Minist\xE8re de la Jeunesse et des Sports du Niger"
  }),
  // --- Domaine 3 : Fournitures vivrières ---
  seed("exp-viv-ieps-tchirozerine", "vivrier", 1, {
    title: "Livraisons de fournitures vivri\xE8res \xE0 l\u2019Inspection de l\u2019enseignement primaire et pr\xE9scolaire de Tchiroz\xE9rine",
    description: "Livraisons de fournitures vivri\xE8res \xE0 l\u2019Inspection de l\u2019enseignement primaire et pr\xE9scolaire de Tchiroz\xE9rine.",
    services: ["Plusieurs livraisons."],
    beneficiary: "Inspection de l\u2019enseignement primaire et pr\xE9scolaire de Tchiroz\xE9rine",
    procurement: "Appel d\u2019offres ouvert"
  })
];

// server.ts
dotenv.config();
var PORT = Number(process.env.PORT) || 3e3;
var DATA_DIR = path.resolve("data");
var DB_FILE = path.join(DATA_DIR, "database.json");
var UPLOADS_DIR = path.resolve("public/images/uploads");
var EXPERIENCE_PHOTOS_DIR = path.join(UPLOADS_DIR, "experience");
var EXPERIENCE_DOCS_DIR = path.join(DATA_DIR, "experience-documents");
for (const dir of [DATA_DIR, UPLOADS_DIR, EXPERIENCE_PHOTOS_DIR, EXPERIENCE_DOCS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
function initialExperienceReferences() {
  return INITIAL_EXPERIENCE_REFERENCES.map((r) => ({ ...r }));
}
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    saveDatabase(INITIAL_DATABASE);
    return { ...INITIAL_DATABASE, experienceReferences: initialExperienceReferences() };
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DATABASE,
      ...parsed,
      settings: { ...INITIAL_DATABASE.settings, ...parsed.settings || {} },
      products: parsed.products || INITIAL_DATABASE.products,
      featured: parsed.featured || INITIAL_DATABASE.featured,
      brands: parsed.brands || INITIAL_DATABASE.brands,
      btpProjects: parsed.btpProjects || INITIAL_DATABASE.btpProjects || [],
      experienceReferences: Array.isArray(parsed.experienceReferences) ? parsed.experienceReferences : initialExperienceReferences()
    };
  } catch (err) {
    console.error("Failed to read database file, restoring defaults:", err);
    saveDatabase(INITIAL_DATABASE);
    return { ...INITIAL_DATABASE, experienceReferences: initialExperienceReferences() };
  }
}
var EXPERIENCE_STATUSES = ["brouillon", "en_attente", "valide", "publie"];
var EXPERIENCE_DOC_KINDS = [
  "bon_commande",
  "justificatif",
  "photo_travaux",
  "photo_materiel",
  "autre"
];
var EXP_PHOTO_URL_RE = /^\/images\/uploads\/experience\/([a-z0-9_-]+\.(?:jpg|png|webp))$/;
var EXP_DOC_FILE_RE = /^[a-z0-9_-]+\.(?:pdf|jpg|png|webp)$/;
var MIME_BY_EXT = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp"
};
function cleanStr(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function newExperienceId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
}
function sanitizeExperienceReference(body, existing, all) {
  const title = cleanStr(body?.title, 300);
  const description = cleanStr(body?.description, 3e3);
  const domain = body?.domain;
  if (!title) return { error: "L\u2019intitul\xE9 de la r\xE9f\xE9rence est obligatoire." };
  if (!description) return { error: "La description est obligatoire." };
  if (!EXPERIENCE_DOMAIN_ORDER.includes(domain)) return { error: "Domaine d\u2019activit\xE9 invalide." };
  const status = EXPERIENCE_STATUSES.includes(body?.status) ? body.status : "brouillon";
  if (status === "publie" && !(existing && (existing.status === "valide" || existing.status === "publie"))) {
    return { error: "Une r\xE9f\xE9rence doit d\u2019abord \xEAtre \xAB Valid\xE9e pour publication \xBB avant d\u2019\xEAtre publi\xE9e." };
  }
  const services = (Array.isArray(body?.services) ? body.services : []).map((s) => cleanStr(s, 300)).filter(Boolean).slice(0, 30);
  const photos = [];
  for (const p of Array.isArray(body?.photos) ? body.photos.slice(0, 30) : []) {
    const url = cleanStr(p?.url, 300);
    if (!EXP_PHOTO_URL_RE.test(url)) return { error: "Photographie invalide." };
    photos.push({
      id: cleanStr(p?.id, 80) || newExperienceId("photo"),
      url,
      alt: cleanStr(p?.alt, 300),
      caption: cleanStr(p?.caption, 300) || void 0
    });
  }
  if (status === "publie" && photos.some((p) => !p.alt)) {
    return { error: "Chaque photographie doit avoir un texte alternatif avant publication." };
  }
  const documents = [];
  for (const d of Array.isArray(body?.documents) ? body.documents.slice(0, 30) : []) {
    const file = cleanStr(d?.file, 120);
    if (!EXP_DOC_FILE_RE.test(file) || !fs.existsSync(path.join(EXPERIENCE_DOCS_DIR, file))) {
      return { error: "Document justificatif invalide ou introuvable." };
    }
    const isPublic = d?.isPublic === true;
    const redacted = d?.redacted === true;
    if (isPublic && !redacted) {
      return {
        error: "Un document ne peut \xEAtre rendu public que si les prix, signatures, coordonn\xE9es priv\xE9es et informations internes ont \xE9t\xE9 masqu\xE9s."
      };
    }
    documents.push({
      id: cleanStr(d?.id, 80) || newExperienceId("doc"),
      name: cleanStr(d?.name, 200) || file,
      kind: EXPERIENCE_DOC_KINDS.includes(d?.kind) ? d.kind : "autre",
      file,
      mimeType: MIME_BY_EXT[file.split(".").pop()],
      isPublic,
      redacted,
      description: cleanStr(d?.description, 500) || void 0
    });
  }
  let order = Number.isFinite(body?.order) ? Number(body.order) : existing?.order;
  if (order === void 0) {
    order = all.filter((r) => r.domain === domain).reduce((max, r) => Math.max(max, r.order || 0), 0) + 1;
  }
  const now = Date.now();
  return {
    ref: {
      id: existing?.id || newExperienceId("exp"),
      title,
      domain,
      description,
      services,
      beneficiary: cleanStr(body?.beneficiary, 200) || void 0,
      beneficiaryPublic: body?.beneficiaryPublic === true,
      procurement: cleanStr(body?.procurement, 120) || void 0,
      executionConfirmed: body?.executionConfirmed === true,
      photos,
      documents,
      status,
      order,
      createdAt: existing?.createdAt || now,
      updatedAt: now
    }
  };
}
function removeOrphanExperienceFiles(previous, all) {
  const usedPhotos = new Set(all.flatMap((r) => (r.photos || []).map((p) => p.url)));
  const usedDocs = new Set(all.flatMap((r) => (r.documents || []).map((d) => d.file)));
  for (const p of previous.photos || []) {
    const match = p.url.match(EXP_PHOTO_URL_RE);
    if (match && !usedPhotos.has(p.url)) {
      fs.rm(path.join(EXPERIENCE_PHOTOS_DIR, match[1]), { force: true }, () => {
      });
    }
  }
  for (const d of previous.documents || []) {
    if (EXP_DOC_FILE_RE.test(d.file) && !usedDocs.has(d.file)) {
      fs.rm(path.join(EXPERIENCE_DOCS_DIR, d.file), { force: true }, () => {
      });
    }
  }
}
function detectFileType(buffer) {
  if (buffer.subarray(0, 4).toString("latin1") === "%PDF") return "pdf";
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "jpg";
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (buffer.subarray(0, 4).toString("latin1") === "RIFF" && buffer.subarray(8, 12).toString("latin1") === "WEBP") {
    return "webp";
  }
  return null;
}
var SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://dhpeptfgmwvptqilfpho.supabase.co";
var SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_oHZOMRJJbjn4YmaC8hUzWQ_F2GmumCh";
var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
function saveDatabase(db) {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
  syncDbToSupabase(db).catch(() => {
  });
}
async function syncDbToSupabase(db) {
  try {
    const { error: pErr } = await supabase.from("products").upsert(
      db.products.map((p) => ({
        id: p.id,
        shop: p.shop,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        availability: p.availability,
        capacity: p.capacity || null,
        colors: p.colors || null,
        condition: p.condition || null,
        reference: p.reference || null,
        description: p.description || null,
        specs: p.specs || null,
        model: p.model || null,
        image: p.image || null,
        source_image: p.sourceImage || null,
        is_new: p.isNew || false,
        hidden: p.hidden || false,
        created_at: p.createdAt
      }))
    );
    if (!pErr) {
      await supabase.from("brands").upsert(
        db.brands.map((b) => ({
          id: b.id,
          name: b.name,
          logo: b.logo || "",
          source_logo: b.sourceLogo || "",
          display_order: b.order
        }))
      );
      await supabase.from("site_settings").upsert({
        id: 1,
        name: db.settings.name,
        slogan: db.settings.slogan,
        whatsapp_electronique: db.settings.whatsappElectronique,
        whatsapp_textile: db.settings.whatsappTextile,
        phone: db.settings.phone,
        address: db.settings.address,
        email: db.settings.email,
        hours: db.settings.hours,
        facebook: db.settings.facebook,
        instagram: db.settings.instagram,
        tiktok: db.settings.tiktok,
        maps_electronique: db.settings.mapsElectronique,
        maps_textile: db.settings.mapsTextile,
        site_url: db.settings.siteUrl,
        legal_name: db.settings.legalName,
        legal_info: db.settings.legalInfo,
        privacy_text: db.settings.privacyText,
        hero_title: db.settings.heroTitle,
        hero_subtitle: db.settings.heroSubtitle,
        elec_intro: db.settings.elecIntro,
        textile_intro: db.settings.textileIntro
      });
    }
  } catch {
  }
}
var activeSessions = /* @__PURE__ */ new Set();
var DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "alffa2025";
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acc\xE8s non autoris\xE9. Authentification requise." });
  }
  const token = authHeader.slice(7).trim();
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: "Session expir\xE9e ou invalide. Veuillez vous reconnecter." });
  }
  next();
}
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));
  app.use("/images/uploads", express.static(UPLOADS_DIR));
  app.get("/api/data", (_req, res) => {
    try {
      const db = loadDatabase();
      res.json({
        settings: db.settings,
        products: db.products,
        featured: db.featured,
        brands: db.brands,
        btpProjects: (db.btpProjects || []).filter((p) => p.publicationStatus === "publie").map((p) => ({
          ...p,
          documents: (p.documents || []).filter((d) => d.isPublic)
        })),
        experienceReferences: getPublicExperienceReferences(db.experienceReferences || []),
        version: db.version
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const db = loadDatabase();
    const expectedPassword = db.adminPasswordHash ? void 0 : DEFAULT_ADMIN_PASSWORD;
    let valid = false;
    if (db.adminPasswordHash) {
      const hash = crypto.createHash("sha256").update(String(password)).digest("hex");
      valid = hash === db.adminPasswordHash;
    } else {
      valid = password === expectedPassword;
    }
    if (valid) {
      const token = crypto.randomBytes(32).toString("hex");
      activeSessions.add(token);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Mot de passe incorrect." });
    }
  });
  app.get("/api/admin/check", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      if (activeSessions.has(token)) {
        return res.json({ authenticated: true });
      }
    }
    res.json({ authenticated: false });
  });
  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });
  app.post("/api/admin/change-password", verifyAdmin, (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit comporter au moins 6 caract\xE8res." });
    }
    const db = loadDatabase();
    db.adminPasswordHash = crypto.createHash("sha256").update(newPassword).digest("hex");
    saveDatabase(db);
    res.json({ success: true, message: "Mot de passe administrateur mis \xE0 jour avec succ\xE8s." });
  });
  app.put("/api/settings", verifyAdmin, (req, res) => {
    const newSettings = req.body;
    const db = loadDatabase();
    db.settings = {
      ...db.settings,
      ...newSettings
    };
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });
  app.post("/api/products", verifyAdmin, (req, res) => {
    const product = req.body;
    if (!product.id || !product.name || !product.shop) {
      return res.status(400).json({ error: "ID, nom et boutique sont obligatoires." });
    }
    const db = loadDatabase();
    const existingIndex = db.products.findIndex(
      (p) => p.id === product.id && p.shop === product.shop
    );
    if (existingIndex >= 0) {
      return res.status(409).json({ error: "Un produit avec cet identifiant existe d\xE9j\xE0 dans cette boutique." });
    }
    db.products.push({
      ...product,
      createdAt: product.createdAt || Date.now()
    });
    saveDatabase(db);
    res.status(201).json({ success: true, product });
  });
  app.put("/api/products/:shop/:id", verifyAdmin, (req, res) => {
    const { shop, id } = req.params;
    const updated = req.body;
    const db = loadDatabase();
    const index = db.products.findIndex((p) => p.id === id && p.shop === shop);
    if (index === -1) {
      return res.status(404).json({ error: "Produit introuvable." });
    }
    db.products[index] = {
      ...db.products[index],
      ...updated,
      id,
      shop
    };
    saveDatabase(db);
    res.json({ success: true, product: db.products[index] });
  });
  app.delete("/api/products/:shop/:id", verifyAdmin, (req, res) => {
    const { shop, id } = req.params;
    const db = loadDatabase();
    db.products = db.products.filter((p) => !(p.id === id && p.shop === shop));
    if (shop === "electronique" || shop === "textile") {
      db.featured[shop] = db.featured[shop].filter((fId) => fId !== id);
    }
    saveDatabase(db);
    res.json({ success: true, deletedId: id });
  });
  app.post("/api/products/reorder", verifyAdmin, (req, res) => {
    const { shop, orderedIds } = req.body;
    if (!shop || !Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "Boutique et liste ordonn\xE9e requises." });
    }
    const db = loadDatabase();
    const shopProducts = db.products.filter((p) => p.shop === shop);
    const otherProducts = db.products.filter((p) => p.shop !== shop);
    const reordered = [];
    for (const id of orderedIds) {
      const item = shopProducts.find((p) => p.id === id);
      if (item) reordered.push(item);
    }
    for (const item of shopProducts) {
      if (!reordered.some((p) => p.id === item.id)) {
        reordered.push(item);
      }
    }
    db.products = [...otherProducts, ...reordered];
    saveDatabase(db);
    res.json({ success: true, products: db.products });
  });
  app.post("/api/featured/toggle", verifyAdmin, (req, res) => {
    const { shop, id } = req.body;
    if (!shop || !id) {
      return res.status(400).json({ error: "Boutique et identifiant requis." });
    }
    const db = loadDatabase();
    const list = db.featured[shop] || [];
    const exists = list.includes(id);
    if (exists) {
      db.featured[shop] = list.filter((item) => item !== id);
    } else {
      db.featured[shop] = [...list, id];
    }
    saveDatabase(db);
    res.json({ success: true, featured: db.featured[shop] });
  });
  app.post("/api/featured/reorder", verifyAdmin, (req, res) => {
    const { shop, orderedIds } = req.body;
    if (!shop || !Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "Param\xE8tres invalides." });
    }
    const db = loadDatabase();
    db.featured[shop] = orderedIds;
    saveDatabase(db);
    res.json({ success: true, featured: db.featured[shop] });
  });
  app.put("/api/brands/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const updated = req.body;
    const db = loadDatabase();
    const index = db.brands.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Marque introuvable." });
    }
    db.brands[index] = {
      ...db.brands[index],
      ...updated,
      id
    };
    saveDatabase(db);
    res.json({ success: true, brand: db.brands[index] });
  });
  app.post("/api/brands", verifyAdmin, (req, res) => {
    const brand = req.body;
    if (!brand.id || !brand.name) {
      return res.status(400).json({ error: "ID et nom requis." });
    }
    const db = loadDatabase();
    if (db.brands.some((b) => b.id === brand.id)) {
      return res.status(409).json({ error: "Cette marque existe d\xE9j\xE0." });
    }
    db.brands.push({
      ...brand,
      order: brand.order || db.brands.length + 1
    });
    saveDatabase(db);
    res.status(201).json({ success: true, brand });
  });
  app.delete("/api/brands/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const db = loadDatabase();
    db.brands = db.brands.filter((b) => b.id !== id);
    saveDatabase(db);
    res.json({ success: true, deletedId: id });
  });
  app.get("/api/btp", (_req, res) => {
    try {
      const db = loadDatabase();
      const list = (db.btpProjects || []).filter((p) => p.publicationStatus === "publie").map((p) => ({
        ...p,
        documents: (p.documents || []).filter((d) => d.isPublic)
      }));
      res.json({ success: true, projects: list });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/admin/btp", verifyAdmin, (_req, res) => {
    try {
      const db = loadDatabase();
      res.json({ success: true, projects: db.btpProjects || [] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/btp", verifyAdmin, (req, res) => {
    try {
      const incoming = req.body;
      if (!incoming.title || !incoming.description) {
        return res.status(400).json({ error: "L\u2019intitul\xE9 et la description de la r\xE9alisation sont obligatoires." });
      }
      const db = loadDatabase();
      if (!db.btpProjects) db.btpProjects = [];
      const id = incoming.id || `btp-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
      const project = {
        ...incoming,
        id,
        createdAt: incoming.createdAt || Date.now(),
        updatedAt: Date.now(),
        photos: Array.isArray(incoming.photos) ? incoming.photos : [],
        documents: Array.isArray(incoming.documents) ? incoming.documents : [],
        stage: incoming.stage || "commande_documentee",
        publicationStatus: incoming.publicationStatus || "brouillon"
      };
      db.btpProjects.unshift(project);
      saveDatabase(db);
      res.status(201).json({ success: true, project });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/btp/:id", verifyAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = loadDatabase();
      if (!db.btpProjects) db.btpProjects = [];
      const index = db.btpProjects.findIndex((p) => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "R\xE9alisation BTP introuvable." });
      }
      db.btpProjects[index] = {
        ...db.btpProjects[index],
        ...updates,
        id,
        // Empêcher l'altération de l'identifiant
        updatedAt: Date.now()
      };
      saveDatabase(db);
      res.json({ success: true, project: db.btpProjects[index] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/btp/:id", verifyAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const db = loadDatabase();
      if (!db.btpProjects) db.btpProjects = [];
      db.btpProjects = db.btpProjects.filter((p) => p.id !== id);
      saveDatabase(db);
      res.json({ success: true, deletedId: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/experience", (_req, res) => {
    try {
      const db = loadDatabase();
      res.json({ success: true, references: getPublicExperienceReferences(db.experienceReferences || []) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/experience/documents/:file", (req, res) => {
    const { file } = req.params;
    if (!EXP_DOC_FILE_RE.test(file)) return res.status(404).json({ error: "Document introuvable." });
    const db = loadDatabase();
    const allowed = (db.experienceReferences || []).some(
      (r) => r.status === "publie" && (r.documents || []).some((d) => d.file === file && isPublishableDocument(d))
    );
    if (!allowed) return res.status(404).json({ error: "Document introuvable." });
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.sendFile(path.join(EXPERIENCE_DOCS_DIR, file));
  });
  app.get("/api/admin/experience", verifyAdmin, (_req, res) => {
    const db = loadDatabase();
    res.json({ success: true, references: db.experienceReferences || [] });
  });
  app.get("/api/admin/experience/documents/:file", verifyAdmin, (req, res) => {
    const { file } = req.params;
    const target = path.join(EXPERIENCE_DOCS_DIR, file);
    if (!EXP_DOC_FILE_RE.test(file) || !fs.existsSync(target)) {
      return res.status(404).json({ error: "Document introuvable." });
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    res.sendFile(target);
  });
  app.post("/api/admin/experience", verifyAdmin, (req, res) => {
    const db = loadDatabase();
    const list = db.experienceReferences || [];
    const { ref, error } = sanitizeExperienceReference(req.body, void 0, list);
    if (!ref) return res.status(400).json({ error });
    db.experienceReferences = [...list, ref];
    saveDatabase(db);
    res.status(201).json({ success: true, reference: ref });
  });
  app.put("/api/admin/experience/:id", verifyAdmin, (req, res) => {
    const db = loadDatabase();
    const list = db.experienceReferences || [];
    const index = list.findIndex((r) => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "R\xE9f\xE9rence introuvable." });
    const previous = list[index];
    const { ref, error } = sanitizeExperienceReference(req.body, previous, list);
    if (!ref) return res.status(400).json({ error });
    const next = [...list];
    next[index] = ref;
    db.experienceReferences = next;
    saveDatabase(db);
    removeOrphanExperienceFiles(previous, next);
    res.json({ success: true, reference: ref });
  });
  app.delete("/api/admin/experience/:id", verifyAdmin, (req, res) => {
    const db = loadDatabase();
    const list = db.experienceReferences || [];
    const previous = list.find((r) => r.id === req.params.id);
    if (!previous) return res.status(404).json({ error: "R\xE9f\xE9rence introuvable." });
    db.experienceReferences = list.filter((r) => r.id !== previous.id);
    saveDatabase(db);
    removeOrphanExperienceFiles(previous, db.experienceReferences);
    res.json({ success: true, deletedId: previous.id });
  });
  app.post("/api/admin/experience/upload", verifyAdmin, (req, res) => {
    const { data, filename, target } = req.body || {};
    if (target !== "photo" && target !== "document") {
      return res.status(400).json({ error: "Type de t\xE9l\xE9versement invalide." });
    }
    if (!data || typeof data !== "string") {
      return res.status(400).json({ error: "Fichier manquant." });
    }
    const base64 = data.includes(",") ? data.slice(data.indexOf(",") + 1) : data;
    const buffer = Buffer.from(base64, "base64");
    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: "Fichier trop volumineux (maximum 8 Mo)." });
    }
    const ext = detectFileType(buffer);
    if (!ext || target === "photo" && ext === "pdf") {
      return res.status(400).json({
        error: target === "photo" ? "Format accept\xE9 : JPG, PNG ou WebP." : "Format accept\xE9 : PDF, JPG, PNG ou WebP."
      });
    }
    const safeBase = (typeof filename === "string" ? path.basename(filename, path.extname(filename)) : "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9_-]/gi, "_").toLowerCase().slice(0, 40) || target;
    const uniqueName = `${safeBase}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
    if (target === "photo") {
      fs.writeFileSync(path.join(EXPERIENCE_PHOTOS_DIR, uniqueName), buffer);
      return res.json({ success: true, url: `/images/uploads/experience/${uniqueName}` });
    }
    fs.writeFileSync(path.join(EXPERIENCE_DOCS_DIR, uniqueName), buffer);
    res.json({ success: true, file: uniqueName, mimeType: MIME_BY_EXT[ext] });
  });
  app.post("/api/upload", verifyAdmin, (req, res) => {
    const { data, filename } = req.body;
    if (!data || typeof data !== "string") {
      return res.status(400).json({ error: "Donn\xE9es d\u2019image manquantes." });
    }
    const matches = data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
    let buffer;
    let ext = "webp";
    if (matches) {
      ext = matches[1].toLowerCase() === "jpeg" ? "jpg" : matches[1].toLowerCase();
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(data, "base64");
    }
    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: "Image trop volumineuse (maximum 8 Mo)." });
    }
    const safeBase = filename ? path.basename(filename, path.extname(filename)).replace(/[^a-z0-9_-]/gi, "_").toLowerCase() : "upload";
    const uniqueName = `${safeBase}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
    const targetFile = path.join(UPLOADS_DIR, uniqueName);
    fs.writeFileSync(targetFile, buffer);
    const fileUrl = `/images/uploads/${uniqueName}`;
    res.json({ success: true, url: fileUrl });
  });
  app.get("/api/backup", verifyAdmin, (_req, res) => {
    const db = loadDatabase();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=alffa-niger-backup-${Date.now()}.json`);
    res.send(JSON.stringify(db, null, 2));
  });
  app.post("/api/restore", verifyAdmin, (req, res) => {
    const incoming = req.body;
    if (!incoming || !Array.isArray(incoming.products) || !incoming.settings) {
      return res.status(400).json({ error: "Structure de sauvegarde invalide." });
    }
    saveDatabase(incoming);
    res.json({ success: true, message: "Donn\xE9es restaur\xE9es avec succ\xE8s." });
  });
  app.post("/api/admin/reset", verifyAdmin, (_req, res) => {
    saveDatabase(INITIAL_DATABASE);
    res.json({ success: true, message: "Base r\xE9initialis\xE9e aux donn\xE9es de d\xE9part." });
  });
  app.get("/api/supabase/status", async (_req, res) => {
    try {
      const { data, error } = await supabase.from("products").select("id").limit(1);
      const isConnected = !error || error.code === "PGRST205";
      const hasTables = !error;
      res.json({
        url: SUPABASE_URL,
        connected: isConnected,
        hasTables,
        error: error ? error.message : null
      });
    } catch (err) {
      res.json({
        url: SUPABASE_URL,
        connected: false,
        hasTables: false,
        error: err.message
      });
    }
  });
  app.post("/api/supabase/sync", verifyAdmin, async (_req, res) => {
    try {
      const db = loadDatabase();
      await syncDbToSupabase(db);
      res.json({ success: true, message: "Synchronisation vers Supabase lanc\xE9e avec succ\xE8s." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get(["/api/download/lws-zip", "/alffa-niger-lws.zip"], (_req, res) => {
    const zipPath = path.resolve("public/alffa-niger-lws.zip");
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, "alffa-niger-lws.zip");
    } else {
      res.status(404).json({ error: "Fichier zip introuvable." });
    }
  });
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        port: PORT
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ALFFA NIGER] Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("[ALFFA NIGER] Fatal server error:", err);
  process.exit(1);
});
