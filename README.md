![Screenshot](/.github/banner.png)

# Stellar Portfolio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/IndieCoderMM/stellar-portfolio)

A modern developer portfolio website built with [Next.js](https://nextjs.org), packed with smooth animations and customizable content.

Perfect for developers who want a fast, unique, and fully customizable site to showcase their work.

## Features

- Sleek, modern layout – Clean design focused on clarity and structure.
- Subtle motion effects – Thoughtful animations add life without getting in the way.
- Optimized for SEO – Static pages, auto-generated sitemap and built-in Open Graph support via `next/og`.
- Easy content management – Update content through simple data files.
- Easy customization – Personalize site content and structure easily.
- Built-in contact form – Emails are delivered instantly with EmailJS integration.
- Responsive by default – Designed to look great on all screen sizes out of the box.

## Tech Stack

- Next.js – React framework for SSR and performance
- Static data files – Simple content management without external dependencies
- Motion.dev – Animation library for React
- Tailwind CSS – Utility-first CSS framework
- EmailJS – Email service for handling contact form messages

## Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/indiecodermm/stellar-portfolio.git
cd stellar-portfolio
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the example env file and add your own config:

```bash
cp .env.example .env.local
```

4. **Run the dev server**

```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000)

5. **Customize Your Content**

Update the data files in the `/data` directory to customize your portfolio content:

- `profile.ts` - Your personal information and bio
- `projects.ts` - Your project portfolio
- `services.ts` - Services you offer
- `technologies.ts` - Technologies you work with

## Customization

All page content can be modified in the `/config/` folder.

_No need to dig into components unless you want to._

## Content Management

This template uses simple TypeScript data files for content management, making it easy to customize without external dependencies.

- Update `/data/profile.ts` for personal information
- Modify `/data/projects.ts` to showcase your projects
- Edit `/data/services.ts` to list your services
- Customize `/data/technologies.ts` for your tech stack

All content is statically generated at build time for optimal performance.

## Contact Form

The contact form uses **EmailJS** for sending messages.

- Sign up at [emailjs.com](https://www.emailjs.com/)
- Create a service and connect it to an email account
- Create an email template for the contact form.

<details>

<summary>Sample Email Template</summary>

```
Hello,

You’ve received a new message from your website. Here’s what they had to say:

Name: {{name}}
Email: {{email}}

Message:
{{message}}
```

</details>

- Get your EmailJS service ID, template ID, and user ID (public key)
- Add those to your `.env.local` file

## Deploy

Deploy anywhere Next.js is supported:

- **Vercel** (Recommended)

Make sure to set environment variables in your deployment settings.

## Contributing

Feel free to fork, customize, or contribute. Open an issue or PR if you have suggestions or improvements.

## License

This project is released under [The Unlicense](https://unlicense.org/), which means you can use, modify, and distribute it however you want.

Do whatever you like. No credit required (but appreciated).

## Credits

Thanks to all the amazing developers and designers whose work have inspired me to create this project.

Animattions and UI elements are from these awesome resources:

- Acternity UI – for the elegant components and design inspiration.
- Uiverse.io – for the open-source UI interactions and effects.

---

_I hope this template helps you build your own stunning portfolio site!_

_Happy building 🚀_
