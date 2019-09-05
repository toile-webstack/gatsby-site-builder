# Gatsby Site Builder

_Warning_: This is a prototype. There will be a lot of breaking changes when V1 comes out. We probably won't be able to create a migration tool for your content so you will have to copy/paste manually your content to the next content model. However, be assured that everything that is possible in the prototype (and a lot more) will be ported to version 1.

## Intro

This repo holds the code for a free and open source JAMstack website builder. It creates blazing fast experiences with zero coding skills required (but you can edit and customize CSS extensively if you enjoy that).

It was built primarily as a proof of concept because we wanted a way of quickly bootstrapping small to medium websites for clients. We wanted the websites to be fast, lightweight and extremely cheap (who said free?) for us to operate.

The system is currently working with GatsbyJS (V1 for now), Contentful CMS and Netlify. After the initial setup, everything is handled from Contentful. It is a bit hacky here and there but hey... it is a prototype!

If you like the idea, please show us any mark of interest. That will certainly boost our productivity to work towards V1!

> Note:
>
> We built this prototype in 2017 and barely updated it since. We worked on other versions of this idea but kept coming back to this one so we decided to go all in with it, open source it and make it evolve on the long run.

## Setup

You will need to setup 3 different services for this to work. Unfortunately, some terminal magic will be needed to setup Contentful but follow along and you will be fine.

### Easy first step

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/toile-webstack/gatsby-site-builder)

This will handle the Github fork and Netlify deploy for you. You still need to configure Contentful and the webhooks and environment variables in Netlify.

### Github

- Create a Github account
- Fork this repo (if you did not use the Easy first step)

### Contentful

- Create a Contentful account
- Create a new empty space (you will need its ID on the next step)
- Setup the space using the Contentful CLI

```shell
yarn global add contentful-cli
contentful login
contentful space import --content-file setup/contentful/contentful-export.json --space-id <your-new-space-id>
```

> Refer to the contentful-cli [documentation](https://github.com/contentful/contentful-cli) for more info.

- Create an API key. In the Contentful interface, go to 'Space settings' > 'API keys' then click the button on the right 'Add API key'. Give it a name (for example 'Netlify build') and save.
- ... (stay on this page because we will need this info in Netlify. We will come back to Contentful later)

### Netlify

- Create a Netlify account
- Create a new project from Git and select your fork of this repo

  - Branch to deploy: `master`
  - Build command: `yarn develop`
  - Publish directory: `public`
  - Click 'Show advanced' and create 2 environment variables

    - `contentfulAccessToken` is the 'Content Delivery API - access token' that you created on the last step in Contentful
    - `contentfulSpaceID` is your space ID (also visible in the new API key info)

  - Click 'Deploy site'

- In 'Site settings' > 'Build & deploy' > 'Buil hooks', create 2 build hooks, one for your production environment and one for your staging environment:
  - Production: select the `master` branch
  - Stage: select the `stage` branch
- Optional: Configure other options in Netlify as you please, for example:

  - Rename your site
  - Configure your domain
  - Setup notifications to know when your build has finished or when there is an error
  - ...

> Refer to the [Netlify documentation](https://www.netlify.com/docs/) for more info.

### Back to Contentful

> If you know what you are doing, you can implement any method for triggering your builds on Netlify. This is just an example allowing the user to only use Contentful to manage her site.

In 'Space settings' > 'Webhooks', add 2 webhooks:

- For the 'production trigger', paste the url of the 'Production' build hook you created in Netlify. Then in the 'triggers' above, 'Select specific triggering events' and check only the box crossing 'Archive' with 'Asset'.
- For the 'stage trigger', paste the url of the 'Stage' build hook you created in Netlify. Then in the 'triggers' above, 'Select specific triggering events' and check only the box crossing 'Archive' with 'Entry'.

### Conclusion

A couple of minutes after you triggered the build on Netlify, your site should be ready. You can visit it on your Netlify url.

Next you will want to fill it with your content, change colors and build your pages.

## The content model

It is composed of the following content Types:

- [Settings](#Settings): An unique entry to define common settings for the whole site
- [Page](#Page)
- [Collection Item](#Collection Item): create collections for blog posts, portfolio projets, testimonials, recipes, ... toile will create a page for each item and you can reference items inside pages in `Block - Reference`s
- Section: To arrange blocks in columns and rows
- Blocks: There are multiple types of blocks
  - Free Text: The most common type of block. Use it to create blocks of text written in Markdown. You can also write HTML in there.
  - Form: Create Netlify forms with a JSON configuration object
  - Gallery: Display one or more images
  - References: display one or more internal links to `Page`s or `Collection Item`s
- Script: if you want to dynamicaly embed external scripts in the `<head>`

- [ ] TODO: Explain Each field of each content type
- [ ] TODO: don't forget to explain how free text is processed. emails, links, ...

### Settings

#### Website Name

The website name will be used in meta titles and is showed on the left of the menu

#### Menu

Link pages in the order you want them to appear in the menu

#### Favicon

Will be resized

#### Default Facebook Image

Social media image

#### Metadata

A JSON object.

Example:

```json
{
  "url": "https://www.toile.io/",
  "name": "toile.io",
  "title": "Affordable Professional Website for Entrepreneurs and Artists",
  "description": "toile.io makes designer websites accessible and affordable"
}
```

For now, these are the only keys that will be taken into consideration by toile.

#### Colors

A JSON object.

See [Colors and Styles](#Colors and Styles) for more details about how color palettes are handled in toile.

```json
{
  "palettes": [
    {
      "name": "blue",
      "neutral": "#FFF",
      "primary": "rgb(0, 38, 100)",
      "secondary": "rgb(255, 121, 0)"
    },
    {
      "name": "grey",
      "neutral": "rgb(255, 255, 255)",
      "primary": "rgb(92, 106, 113)",
      "secondary": "rgb(255, 121, 0)"
    }
  ],
  "mainCombo": "classic",
  "menuCombo": "classic",
  "footerCombo": "contrast"
}
```

#### Fonts

A JSON object

```json
{
  "body": ["Cuprum"],
  "header": ["Lekton"]
}
```

You can provide a list of fonts to be used for each key.

Don't forget to specify the google fonts you want to import in the options below

#### Contact

A JSON object.

Will be used in the footer as icons, texts or links. Blank or undefined values are not displayed.

```json
{
  "name": "",
  "email": "info@toile.io",
  "phone": "+32987654321",
  "facebook": "toile.io",
  "linkedin": "",
  "instagram": ""
}
```

Attention: `facebook` has to be the id of the page, not the full url

#### Google Analytics Teacking ID

Not in use at the moment!!!

Instead, define an environment variable in Netlify named `analyticsTrackingId`

#### Options

A JSON object

The only key used at the moment is for [typographyJS](https://kyleamathews.github.io/typography.js/) options

```json
{
  "typography": {
    "scaleRatio": 3,
    "googleFonts": [
      {
        "name": "Lekton",
        "styles": ["400", "700"]
      },
      {
        "name": "Cuprum",
        "styles": ["400", "400i", "700", "700i"]
      }
    ],
    "baseFontSize": "20px"
  }
}
```

#### Style

A JSON object

Global styles to be applied to the whole site

```json
{
  "ul": {
    "listStyleType": "square"
  },
  "@media only screen and (max-width:768px)": {
    "html": {
      "fontSize": "calc(16 / 16 * 100%)"
    }
  }
}
```

#### scripts

Dynamicaly embed external scripts in the `<head>` of every page

### Page

#### Path

A string to be canonized as the URL path (the part of the URL after https://www.your-domain.com/) of the page. 'Slash' ('/') characters can be used to create 'sub-pages'.

If no `name` key is defined in the `Metadata`, this will be used as the name of the page in the menu.

#### Metadata

Use this field to overwrite the necessary values defined in the Settings. The value for `name` defined here will be used in the menu.

#### Blocks

A list of Blocks and Sections that will form the content of the page

#### Options

Mainly used to change colors of the whole page.

```json
{
  "colorCombo": "classic",
  "colorPalettes": [1]
}
```

See [Colors and Styles](#Colors and Styles) for more details about how color palettes are handled in toile.

#### Style

Customize the page CSS (see [Colors and Styles](#Colors and Styles)).

#### Scripts

Dynamicaly embed external scripts in the `<head>` of this page only.

### Collection Item

Collection Items have similar fields as Pages. However, at the moment, they can't be composed of Sections and Blocks. The main content is a Free Text field.

They also get a few more fields:

## Colors and Styles

- [ ] TODO: Explain how color palettes and combos work + nesting
- [ ] TODO: Explain styles in doc Glamor
- [ ] TODO: Explain rhythm and scale for styles BUT warning for deprecation

## Creating and managing multiple Collections

## Special Sections

- Footer
- Sidebar

## Multiple locales

## Quirks and caveats

- [ ] TODO: Explain IGNORE contents
