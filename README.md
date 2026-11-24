# ForgePoint Engineering

Portfolio demonstration website for **ForgePoint Engineering**, a fictional UK industrial engineering consultancy.

> ForgePoint Engineering is not a real company. All case studies are fictional concepts, all contact details are illustrative, and the enquiry form does not send or store any information.

## Tech

Plain HTML, CSS and vanilla JavaScript. No frameworks, no build step — open `index.html` in a browser.

## Features

- Six responsive pages (Home, About, Services, Industries, Projects, Contact), tested at 360px, 768px and 1280px
- Fixed header that is transparent over the hero and turns solid on scroll, with a mobile menu
- Services sub-navigation that tracks the section in view; filterable case studies
- Four-stage methodology section (Assess, Develop, Implement, Optimise)
- Accessible enquiry form: inline errors, linked error summary, demonstration-only confirmation (no field names or action URL, so nothing can be submitted)
- Scroll-reveal animations, image hover effects and cross-page transitions, all disabled for reduced motion
- Responsive, lazy-loaded images with fixed dimensions to prevent layout shift
- Unique titles and descriptions, canonical URLs, Open Graph / Twitter metadata and a favicon set

## Structure

```
index.html  about.html  services.html  industries.html  projects.html  contact.html
css/styles.css      Shared stylesheet (design tokens, layout, components, pages)
js/main.js          Shared script (navigation, filters, form validation, animations)
assets/             Favicons, social sharing image
assets/images/      Web-optimised photos (800px and 1600px)
```

## Photography

Photos are from [Pexels](https://www.pexels.com/license/) and used under the Pexels licence. Photo pages: `https://www.pexels.com/photo/<id>/`

| File | Pexels ID |
|---|---|
| rotating-machinery | 2569842 |
| maintenance-technician | 35072831 |
| production-control | 31352672 |
| industrial-installation | 33488902 |
| power-station | 35792100 |
| pump-room | 357440 |
| production-line | 18631424 |
| hero, molten-metal, mine-headframe, pipe-tunnel, aggregate-conveyor | 29411310, 6804254, 6077034, 3421636, 40537864 |
