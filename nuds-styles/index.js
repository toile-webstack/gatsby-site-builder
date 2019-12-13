export const lateralShadowStyles = {
  // Styles for lateral shadow scroll
  overflow: 'auto',
  backgroundImage: `
/* Shadows */
linear-gradient(to right, white, white),
linear-gradient(to right, white, white),
/* Shadow covers */ 
linear-gradient(to right, rgba(0,0,0,.25), rgba(255,255,255,0)),
linear-gradient(to left, rgba(0,0,0,.25), rgba(255,255,255,0));   
            `,
  backgroundPosition: 'left center, right center, left center, right center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'white',
  backgroundSize: '20px 100%, 20px 100%, 10px 100%, 10px 100%',
  /* Opera doesn't support this in the shorthand */
  backgroundAttachment: 'local, local, scroll, scroll',
}

export const dumb = ''
