# BMW Pulse E-Commerce Platform

A premium, interactive multi-page web application simulating a high-end BMW vehicle purchasing experience. The project is built completely from scratch using Vanilla HTML, CSS, and JavaScript.

## Features
- **Dynamic Showroom:** Browse a curated selection of BMW vehicles (M4, X5, i4, M8, Z4).
- **Interactive Configurator:** Customize your BMW's exterior paint, wheel styles, and interior upholstery with real-time price updates in INR (₹).
- **Persistent Virtual Garage:** Purchase vehicles and view them in your personal garage. Ownership data, Vehicle Identification Numbers (VINs), and chosen configurations are stored locally and instantly persist across sessions.
- **Premium Design System:** Dark-mode driven UI incorporating glassmorphism, fluid micro-animations, elegant typography, and fully responsive layouts optimized for all devices.
- **Multi-Page Architecture:** Features seamless hash-based routing alongside dedicated HTML pages for Brand Heritage (About) and Customer Support (Contact).

## Technologies Used
- **HTML5**: Semantic web structure
- **CSS3**: Vanilla CSS, robust CSS Variables for branding, Flexbox/Grid architectures, and native Keyframe animations.
- **JavaScript**: ES6+ modules, dynamic DOM Manipulation, LocalStorage state management.

## Getting Started
To view the site locally, you can serve the directory using any local web server. For example, using Python 3:

```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

## Project Structure
- `index.html`: Main Showroom, Configurator Modal, and Virtual Garage.
- `about.html`: BMW Brand Heritage and Electric Future.
- `contact.html`: interactive support and contact forms.
- `style.css`: Global styling and design system tokens.
- `main.js`: Core logic for state management, configurator math, and dynamic UI rendering.
- `assets/`: Generated high-quality BMW imagery.

## Author
[Das Ram Pranay](https://github.com/dasrampranay)
