# Wonderlust

A **Full-Stack Web Application** for travel listings built with **Node.js, Express, MongoDB, and EJS**.

## Features
- Add, edit, and delete listings (with images)
- User reviews for each listing
- Search and filter listings by location or country
- Responsive UI with EJS templates
- Secure session management

## Project Structure
majorproject/
├── app.js
├── models/
│   ├── listing.js
│   └── review.js
├── views/
│   ├── error.ejs
│   ├── includes/
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── layouts/
│   │   └── boilerplat.ejs
│   └── listing/
│       ├── edit.ejs
│       ├── index.ejs
│       ├── new.ejs
│       └── show.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── init/
│   ├── data.js
│   └── index.js
├── utlity/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── package.json
├── package-lock.json
├── config.env        (ignored, contains secrets)
├── .env.example      (template for environment variables)
└── .gitignore        (ignores node_modules, config.env, etc.)
