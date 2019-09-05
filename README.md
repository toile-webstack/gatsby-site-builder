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

Next you will want to fill it with your content, change colors and build your pages as you see fit.

## The content model
