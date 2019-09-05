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

- [Settings](#settings): An unique entry to define common settings for the whole site
- [Page](#page)
- [Collection Item](#collection-item): create collections for blog posts, portfolio projets, testimonials, recipes, ... toile will create a page for each item and you can reference items inside pages in `Block - Reference`s
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

See [Colors and Styles](#colors-and-styles) for more details about how color palettes are handled in toile.

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

See [Colors and Styles](#colors-and-styles) for more details about how color palettes are handled in toile.

#### Style

Customize the page CSS (see [Colors and Styles](#colors-and-styles)).

#### Scripts

Dynamicaly embed external scripts in the `<head>` of this page only.

### Collection Item

Collection Items have similar fields as Pages. However, at the moment, they can't be composed of Sections and Blocks. The main content is a Free Text field. They have a title and a featured image before the main content and a gallery after.

#### Name

It will be the title of the page and (canonized to use as) the last part of the URL.

#### Type

The name of the collection this item belongs to. It will be used to construct the URL before the Name.

> Note:
>
> There is a better way to handle collections than using the Type field. See [Creating and managing multiple Collections](#creating-and-managing-multiple-collections)

#### Featured Image

Used on top of the page and when referencing the item from a Block - Reference.

#### Publication Date

Sometimes used when referencing the item from a Block - Reference

#### Last Edition Date

Not in use at the moment

#### Author

Sometimes used when referencing the item from a Block - Reference

#### Categories

Use it to create groups of items of the same Type. A visitor can then filter items when referenced from a Block - Reference.

#### Content

The main content of the page.

#### Gallery

Shown at the bottom of the page.

#### Options

This field can receive [layout options](#layout-options), for the gallery.

```js
{
  "linkTo": "https://www.toile.io/",
  // When referenced from a Block - Reference, clicking
  // the item will open a new window/tab to that URL
  "gallery": {
    "popup": true,
    "shape": "square",
    "columns": ["1/5"]
  }
}
```

#### Style

Customize the page CSS (see [Colors and Styles](#colors-and-styles)).

#### Scripts

Dynamicaly embed external scripts in the `<head>` of this page only.

### All Blocks (and Section)

#### Name

Only for internal organization purposes.

Suggestion: Name it something like "Page Name - Section Name - Memorable hint to know what this block does". E.g. "index - Intro - Title"

#### Options

Mainly used to change colors of the whole page.

```json
{
  "colorCombo": "classic",
  "colorPalettes": [1]
}
```

See [Colors and Styles](#colors-and-styles) for more details about how color palettes are handled in toile.

#### Style

Customize the page CSS (see [Colors and Styles](#colors-and-styles)).

### Block - Free Text

> See [All blocks](#all-blocks-and-section) for common fields.

#### Main

Some HTML from a Markdown field. You can also write HTML directly in there.

### Block - Form

It will create a form using [Netlify Forms](https://www.netlify.com/docs/form-handling/). It should be spam proof but highly dependant on Netlify (Nowadays I barely get one every 3 months or something like that). Be aware that if you receive a lot of submissions you will need to pay for a [form add-on](https://www.netlify.com/pricing/#forms) on Netlify.

> See [All blocks](#all-blocks-and-section) for common fields.

#### Form

A JSON field to describe the form.

```json
{
  "fields": [
    {
      "name": "name",
      "type": "text",
      "label": "Your Name",
      "value": "",
      "required": "required",
      "placeholder": "David Hasselhoff"
    },
    {
      "name": "message",
      "rows": "5",
      "type": "textarea",
      "label": "Your message",
      "value": "",
      "required": "required",
      "placeholder": "Your message"
    },
    {
      "name": "gender",
      "type": "radio",
      "options": [
        {
          "label": "Female",
          "value": "female",
          "checked": "checked"
        },
        {
          "label": "Male",
          "value": "male"
        }
      ]
    },
    {
      "type": "comment",
      "text": "Your gender... choose both if you are not sure"
    },
    {
      "name": "genderCheckbox",
      "type": "checkbox",
      "options": [
        {
          "label": "Female",
          "value": "female",
          "checked": "checked"
        },
        {
          "label": "Male",
          "value": "male"
        }
      ]
    },
    {
      "name": "email",
      "type": "email",
      "label": "Your Email",
      "required": "required",
      "placeholder": "david@hasselhoff.us"
    },
    {
      "name": "submit",
      "type": "submit",
      "value": "submit text in button"
    }
  ]
}
```

#### Success Message

Shown to user when everything goes according to plan

#### Error Message

Shown to user when the submition fails

### Block - Gallery

> See [All blocks](#all-blocks-and-section) for common fields.

#### Gallery

One or more images.

#### Options

This field can receive [layout options](#layout-options)

### Block - References

> See [All blocks](#all-blocks-and-section) for common fields.

#### References

A list of Pages and/or Collection Items

#### Options

This field can receive [layout options](#layout-options), a layout name and sometimes layout options for the elements composing the item.

```js
{
  "layout": {
    "name": "classicRow",
    // displays the featured image on the left and title, date, excerpt on the right
    // available: default, classicRow, testimonial, event
    "shape": "landscape",
    // the shape of the image
    "children": {
      "columns": ["1/3", "2/3"]
      // the image will be 1/3rd wide and the infos 2/3rd
    },
    "hideCategories": true,
    // hide the categories filtering buttons from the UI
    "linkTo": "external"
    // should collection items have a link internaly, externaly or none
    // when external, you need to set a key named "linkTo" in the Collection Item with the URL you want to reference from each item.
  }
}
```

### Section

These are responsible for the layout of the site. Wrap Blocks inside sections to control the number of columns and rows or to group related Blocks and apply styles.

> See [All blocks](#all-blocks-and-section) for common fields.

#### Blocks

A list of Blocks

## Layout Options

- [ ] TODO

```js
{
  "popup": true,
  // for galleries. clicking images will open a modal
  "shape": "square",
  // for galleries. Aspect ratio and shape of each image.
  // available: square, circle, landscape
  "align": "center",
  // vertical flex alignment
  "columns": ["1/3", "2/3"]
  // how wide should each column be.
  // if you provide more elements in the list than in this array, it will "loop" from the beginning. For example if this option is provided and 6 items are in the list, items 1, 3 and 5 will be 1/3rd wide and 2,4,6 will be 2/3rd.
  "rows": 2
  // stack items two by two in a single column
}
```

## Colors and Styles

All Styles fields are meant to receive CSS rules writen in object notation. Styles are handled by the [Glamor library](https://github.com/threepointone/glamor) and always applied to the root element you are writing your rules in. If you want to target children, either write your CSS rules in the children (when possible) or use CSS selectors.

- [ ] TODO: Explain rhythm and scale for styles BUT warning for deprecation

### Palettes

To control colors more easily and encourage homogenous branding, color palettes can be defined in the Options. Each color palette must have 3 colors: neutral, primary and secondary. 3 colors are enough to define all the colors needed by any Block, Section or Page.

See [combos](#combos) to know how it is applied.

The palette selected for the site, a Page or a Section will automatically be passed to nested content so you don't have to specify it if you don't want to change it. Moreover, creating contrasting sections can be done with [combos](#combos).

### Combos

Color combos can change the way the palette is applied to an item (and its children). By default, a "classic" combo is applied.

With a classic combo, the "neutral" color is used for the background, "primary" for text and borders and "secondary" for link hover effects and highlighting.

Changing the combo provides an easy way of changing how the same colors are applied without having to define too many palettes.

2 keywords are in use to invert colors and usage. The "contrast" keyword inverts the neutral and primary colors. The "funky" keyword inverts the primary and secundary colors. It means you have 4 combos at your disposal: "classic" (the default), "contrast", "funky" and "funkyContrast".

> Tip
>
> Define your palettes with a light "neutral", dark "primary" and colorful but contrasted "secundary". Then play with the combos if you want a dark or colorful background. It will make thinking about your colors easier.

#### A word of warning

Nested children are aware of their parent's combo. Whatever that combo is, it becomes the "classic" combo of the child...

Let's say for example that we want a section to stand out and apply a "contrast" combo for it to have a dark blue background and white text. Every Block inside that Section has then a "classic" combo of dark blue for the background and white for text. This "classic" combo is applied by default. If you want to invert colors again for a specific Block, you will have set its color combo to "contrast" (and not "classic").

You may need a bit of time to get used to that but what it allows you to do is change a parent's combo without (too much) worrying about its children. Since all color palettes and combos are relative to the parent, you can be sure that if you decide you want contrast for an element, you will always get contrast, no matter what you do with the parent (except customizing Styles directly of course).

## Creating and managing multiple Collections

- [ ] TODO

## Special Sections

- Footer
- Sidebar

## Multiple locales

## Publishing

## Quirks and caveats

- [ ] TODO: Explain IGNORE entries
