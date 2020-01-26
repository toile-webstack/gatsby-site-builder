import React from 'react'

const Image = () => {
  const simple = (
    <picture>
      <source type="image/svg" src="logo.svg" />
      <source type="image/png" src="logo.png" />
      <img src="logo.gif" alt="RadWolf, Inc." />
    </picture>
  )
  return (
    <div
      className="gatsby-image-wrapper"
      htmlStyle="position:fixed;overflow:hidden"
    >
      <div htmlStyle="width:100%;padding-bottom:152.45833333333334%" />
      <div
        title="“Black and silver vintage camera” by Alexander Andrews (via unsplash.com)"
        htmlStyle="background-color: rgb(251, 250, 252); position: absolute; top: 0px; bottom: 0px; opacity: 0; right: 0px; left: 0px; transition-delay: 500ms;"
      />
      <img
        src="data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAeABQDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/9oADAMBAAIQAxAAAAH3UcdbkUcy2NW1SP/EABsQAAICAwEAAAAAAAAAAAAAAAACAxEBEBIx/9oACAEBAAEFAt58jlbLaWLliyyz/8QAFBEBAAAAAAAAAAAAAAAAAAAAIP/aAAgBAwEBPwEf/8QAFREBAQAAAAAAAAAAAAAAAAAAESD/2gAIAQIBAT8BI//EABcQAAMBAAAAAAAAAAAAAAAAAAIRIBD/2gAIAQEABj8ChFrc/wD/xAAbEAACAwADAAAAAAAAAAAAAAABEQAQISAxUf/aAAgBAQABPyGyRHyZM0PqjoUFsGPhP//aAAwDAQACAAMAAAAQ7P6M/8QAFREBAQAAAAAAAAAAAAAAAAAAESD/2gAIAQMBAT8QI//EABcRAQEBAQAAAAAAAAAAAAAAAAERABD/2gAIAQIBAT8QEl4U03//xAAbEAADAAIDAAAAAAAAAAAAAAAAAREQITFBUf/aAAgBAQABPxClKPUKw2cfsUiFHTG7UJLqRJ4tiy/D/9k="
        title="“Black and silver vintage camera” by Alexander Andrews (via unsplash.com)"
        alt=""
        htmlStyle="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; object-fit: cover; object-position: center center; opacity: 0; transition-delay: 500ms;"
      />
      <picture>
        <source
          srcSet="/6d653/edited.jpg 200w,
              /ea045/edited.jpg 400w,
              /a1aeb/edited.jpg 800w,
              /8d976/edited.jpg 1200w,
              /29a98/edited.jpg 1600w,
              /8fd7c/edited.jpg 2400w"
          sizes="(max-width: 800px) 100vw, 800px"
        />
        <img
          sizes="(max-width: 800px) 100vw, 800px"
          srcSet="/6d653/edited.jpg 200w,
                /ea045/edited.jpg 400w,
                /a1aeb/edited.jpg 800w,
                /8d976/edited.jpg 1200w,
                /29a98/edited.jpg 1600w,
                /8fd7c/edited.jpg 2400w"
          src="/a1aeb/edited.jpg"
          alt=""
          title="“Black and silver vintage camera” by Alexander Andrews (via unsplash.com)"
          loading="lazy"
          htmlStyle="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; object-fit: cover; object-position: center center; opacity: 1; transition: opacity 500ms ease 0s;"
        />
      </picture>
      <noscript>
        <picture>
          <source
            srcSet="/6d653/edited.jpg 200w,
                /ea045/edited.jpg 400w,
                /a1aeb/edited.jpg 800w,
                /8d976/edited.jpg 1200w,
                /29a98/edited.jpg 1600w,
                /8fd7c/edited.jpg 2400w"
            sizes="(max-width: 800px) 100vw, 800px"
          />
          <img
            loading="lazy"
            sizes="(max-width: 800px) 100vw, 800px"
            srcSet="/6d653/edited.jpg 200w,
                /ea045/edited.jpg 400w,
                /a1aeb/edited.jpg 800w,
                /8d976/edited.jpg 1200w,
                /29a98/edited.jpg 1600w,
                /8fd7c/edited.jpg 2400w"
            src="/a1aeb/edited.jpg"
            alt=""
            title="“Black and silver vintage camera” by Alexander Andrews (via unsplash.com)"
            htmlStyle="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"
          />
        </picture>
      </noscript>
    </div>
  )
}

export default Image
