# About

<img src="https://uptime.ninder.marcel-lambacher.de/api/badge/4/status" /> <img src="https://uptime.ninder.marcel-lambacher.de/api/badge/4/uptime/24" />

Ninder is a mobile web app best described as "Tinder for baby names."
Connect with your partner, swipe through names, and discover new baby name ideas together. When you both swipe right on the same name,
the endless struggle to find the perfect baby name finally comes to an end!

<p align="center">
  <img src="./Animation.gif">
</p>

# Try it out!
For the best experience, use this web app on mobile devices.
Open https://ninder.marcel-lambacher.de and ask your partner to scan the QR code. Once your partner is joined, you can start to swipe.
Have fun!

# Disclaimer

This is a learning project to get started with Svelte.

# Techstack

- Frontend: Svelte (kit), Shadcn, Bits UI, Tailwind
- Backend: Sveltekit, Prisma
- Database: PostgreSQL
- Other: Scrapy, Docker Compose

# Operations

Unlike many others these days, I've chosen not to use a PaaS solution.
Ninder is hosted on a V-Server from Hetzner using Docker Compose.

The main reason for this decision is cost efficiency, as I run several other useful services in the background, such as **Uptime Karma** for monitoring and **Umami** for user tracking and site analytics.

Once changes are committed to the master branch, a Docker image is automatically built and deployed to my server.

# Authentication

Authentication is implemented using a lightweight username-only system.
Users simply choose a username to identify themselves across devices.
No passwords or email addresses are required, making it easy to get started while still maintaining progress across sessions.

# Swiping

The swipe UI control is custom-built using HammerJS, which provides events for detecting pan gestures on specific elements.
Using these pan events, I applied simple CSS transitions to create the illusion of swiping cards smoothly.

# Scraping

Of course, I didn’t collect 30,000 names manually!

This project is all about learning new skills, and one of those is data scraping with Scrapy.
I wrote a simple spider that crawls popular German baby name websites. Using item loaders and pipelines, I transformed and enriched the scraped data to suit my needs.

The output consists of two JSON files:

hit_list.json: Contains the most loved baby names.
names_by_origin.json: Contains names categorized by country or language.
These files are then post-processed and converted into an SQL import script, which I use to seed my database.
