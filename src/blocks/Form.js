import React, { useMemo, useState } from 'react'
import { graphql } from 'gatsby'
import slugify from 'slugify'
import axios from 'axios'
// import qs from 'qs'
import _ from 'lodash'

import { mapStyle } from '../utils/processCss'
// import { metadata as siteMetadata } from '../utils/siteSettings.json'
// import { rhythm } from '../utils/typography'
// import colors from "../utils/colors"
import { internalJson, useColors } from '../utils'

import Html from '../atoms/Html'

import { LBlockForm } from '../t-layouts'

import View from '../../libs/nuds-view-component'

const ERROR = 'error'
const SUCCESS = 'success'
const PENDING = 'pending'

const makeStateFieldName = ({ fieldName, option }) => ({
  [`${fieldName}${option ? `_${option.value}` : ''}`]:
    !!option?.checked || false,
  [`validate_${fieldName}${option ? `_${option.value}` : ''}`]: true,
})

const makeFields = form => {
  // Form Fields
  const fields = form?.formFields || []
  let defaultFieldsState = {}

  fields.forEach(field => {
    // for checkboxes, create an entry for each
    if (field.type === `checkbox`) {
      field.options.forEach(option => {
        // // special validation fields
        // defaultFieldsState['validate' + field.name + '_' + option.value] = true
        // // normal fields
        // defaultFieldsState[field.name + '_' + option.value] =
        //   !!option.checked || false
        defaultFieldsState = {
          ...defaultFieldsState,
          ...makeStateFieldName({ fieldName: field.name, option }),
        }
      })
      return
    }
    // Create validate state for each field
    // defaultFieldsState['validate' + field.name] = true
    defaultFieldsState = {
      ...defaultFieldsState,
      ...makeStateFieldName({ fieldName: field.name }),
    }
    if (field.type === `comment`) {
      return
    }
    // for radio button, only one state entry and take the (last) one that is checked
    if (field.type === `radio`) {
      defaultFieldsState[field.name] = ''
      field.options.forEach(option => {
        if (option.checked === `checked`)
          defaultFieldsState[field.name] = option.value
      })
      return
    }
    defaultFieldsState[field.name] = field.value || ''
  })

  if (!_.find(fields, [`type`, `submit`])) {
    // fields.push({ type: "submit", value: "submit", name: "submit" })
    fields.push({ type: 'submit', value: '', name: 'submit' })
  }

  return { fields, defaultFieldsState }
}

// const Form = ({
//   block,
//   colors: colorsLib,
//   // location,
//   className = '',
//   passCSS,
// }) => {
//   if (!block.form) return null
//   if (Object.keys(block).length < 1) return null

//   const { options: optionsData, style: styleData, form: formData } = block
//   const form = internalJson(formData)
//   const options = internalJson(optionsData)
//   const style = mapStyle(internalJson(styleData))

//   const colors = useColors({ options, colorsLib })
//   const { isColored, classicCombo } = colors
//   const { id, name } = options

//   const formName = slugify(block.name.toLowerCase())

//   const { fields, defaultFieldsState } = useMemo(() => makeFields(form), [])
//   const defaultFormState = {
//     // NOTE: this was used because a lot of spams were passing through with Netlify forms
//     // [`bot-field`]: typeof window === 'undefined' ? 'server-side' : '',
//     [`bot-field`]: '',
//     ...defaultFieldsState,
//   }

//   // successState can be pending, success or error
//   const [successState, setSuccessState] = useState(PENDING)
//   const [formState, setFormState] = useState(defaultFormState)

//   const fieldChange = e => {
//     if (e.target.type === `checkbox`) {
//       setFormState(prev => ({
//         ...prev,
//         [e.target.name]: !prev[e.target.name],
//       }))
//       return
//     }
//     setFormState(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   const handleSubmit = e => {
//     // TODO:
//     e.preventDefault()

//     const { submit, ...fieldsState } = formState
//     const url = window && window.location.href

//     const fieldsToSend = {}
//     Object.keys(fieldsState).forEach(fieldName => {
//       if (fieldName.substring(0, 8) !== 'validate') {
//         fieldsToSend[fieldName] = fieldsState[fieldName]
//       }
//     })

//     // NOTE: DO NOT USE € sign in value fields!!!!!!!!!!!!!!!!!!!!
//     axios({
//       method: 'POST',
//       // baseURL: siteMetadata.url,
//       url,
//       headers: { 'content-type': 'application/x-www-form-urlencoded' },
//       // headers: myHeaders,
//       // data: qs.stringify({
//       //   "form-name": this.formName,
//       //   ...fieldsToSend
//       // })
//       params: {
//         'form-name': formName,
//         ...fieldsToSend,
//       },
//     })
//       .then(res => {
//         // console.log('OK: ', res)
//         if (res.status >= 400) {
//           // alert("Ooops :(\nThere was a problem with the form.")
//           setSuccessState(ERROR)
//           throw new Error('Bad response from server')
//         } else if (res.status === 200) {
//           // console.log('request successful')
//           // this.props.openDialog('Bien reçu !', 'Merci pour votre message. Je vous recontacte au plus vite.\n\nFlorence')

//           setSuccessState(SUCCESS)
//           setFormState(defaultFormState)
//         } else {
//           console.log(`Response: `, res)
//         }
//       })
//       .catch(error => {
//         console.error('ERR', error)
//         // alert("Ooops :(", "There was a problem with the form.")
//         setSuccessState(ERROR)
//       })
//   }

//   const validate = () => {
//     fields.forEach(field => {
//       // Early return if field is not required
//       if (!field.required && field.type !== `checkbox`) {
//         return
//       }
//       // if field has a value it is ok EXCEPT for checkboxes
//       if (field.type !== `checkbox` && !!formState[field.name]) {
//         if (
//           field.type === `email` &&
//           !formState[field.name].match(
//             /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//           )
//         ) {
//           setFormState(prev => ({ ...prev, [`validate_${field.name}`]: false }))
//           return
//         }
//         setFormState(prev => ({ ...prev, [`validate_${field.name}`]: true }))
//         return
//       }

//       if (field.type === `checkbox`) {
//         field.options.forEach(option => {
//           if (!option.required) return
//           const stateName = `${field.name}_${option.value}`
//           const stateValidateName = `validate_${stateName}`
//           if (formState[stateName]) {
//             setFormState(prev => ({ ...prev, [stateValidateName]: true }))
//           } else {
//             setFormState(prev => ({ ...prev, [stateValidateName]: false }))
//           }
//         })
//         return
//       }

//       setFormState(prev => ({ ...prev, [`validate_${field.name}`]: false }))
//     })
//   }

//   const RadioField = ({ css, options: ops, inputProps }) => {
//     return (
//       <div {...{ css }}>
//         {ops &&
//           ops.map(({ value, label }) => {
//             const htmlFor = inputProps.id + value
//             return (
//               <div key={value + label}>
//                 <input
//                   {...{
//                     ...inputProps,
//                     id: htmlFor,
//                     value,
//                     checked: formState[name] === value,
//                   }}
//                 />
//                 <label {...{ htmlFor }}>
//                   <span />
//                   <Html
//                     html={label}
//                     style={{
//                       display: `inline`,
//                     }}
//                   />
//                 </label>
//               </div>
//             )
//           })}
//       </div>
//     )
//   }

//   const CheckboxField = ({ css, options: ops, inputProps }) => {
//     return (
//       <div>
//         {ops &&
//           ops.map(({ value, label, required }) => {
//             const htmlFor = inputProps.id + value
//             return (
//               <div
//                 {...{
//                   key: value + label,
//                   css: {
//                     ...css,
//                     backgroundColor:
//                       formState[`validate${name}_${value}`] === false
//                         ? `rgba(255, 0, 0, 0.15)!important`
//                         : `initial`,
//                   },
//                 }}
//               >
//                 <input
//                   {...{
//                     ...inputProps,
//                     name: `${name}_${value}`,
//                     id: htmlFor,
//                     value,
//                     required,
//                     checked: formState[name + value],
//                   }}
//                 />
//                 <label {...{ htmlFor }}>
//                   <span />
//                   <Html
//                     html={label}
//                     style={{
//                       display: `inline`,
//                     }}
//                   />
//                 </label>
//               </div>
//             )
//           })}
//       </div>
//     )
//   }

//   const reactFields = fields.map(
//     ({
//       type = `text`,
//       name,
//       value = null,
//       label = null,
//       options = null,
//       text,
//       ...attrs
//     }) => {
//       const css = {
//         backgroundColor:
//           formState['validate_' + name] === false
//             ? `rgba(255, 0, 0, 0.15)!important`
//             : `initial`,
//       }
//       const attributes = {
//         ...attrs,
//         text,
//         css,
//       }

//       const key = `${type}${name}`
//       const textAreaProps = {
//         key,
//         name,
//         id: key,
//         ...attributes,
//         value: formState[name] || value || label,
//         onChange: fieldChange,
//       }
//       const inputProps = {
//         ...textAreaProps,
//         type,
//       }
//       const submitProps = {
//         ...inputProps,
//         onClick: () => {
//           validate()
//         },
//       }

//       switch (type) {
//         case 'comment':
//           return attributes.text ? <Html {...{ key, html: text }} /> : null

//         case 'textarea':
//           return (
//             <div {...{ key }}>
//               <label htmlFor={key}>
//                 <Html html={label} />
//               </label>
//               <textarea {...textAreaProps} />
//             </div>
//           )

//         case 'text':
//         case 'tel':
//         case 'email':
//         case 'date':
//           return (
//             <div {...{ key }}>
//               <label htmlFor={key}>
//                 <Html html={label} />
//               </label>
//               <input {...inputProps} />
//             </div>
//           )
//         case 'submit':
//           return <input {...{ ...submitProps }} />
//         case 'radio':
//           return (
//             <RadioField
//               {...{
//                 key,
//                 css,
//                 options,
//                 inputProps,
//               }}
//             />
//           )
//         case 'checkbox':
//           return (
//             <CheckboxField
//               {...{
//                 key,
//                 css,
//                 options,
//                 inputProps,
//                 formSateField: formState[name],
//               }}
//             />
//           )
//         default:
//           return null
//       }
//     }
//   )

//   const reactForm = (
//     <div>
//       <form
//         className={slugify(block.name.toLowerCase())}
//         onSubmit={handleSubmit}
//         name={formName}
//         data-netlify="true"
//         data-netlify-honeypot="bot-field"
//       >
//         <input
//           css={{
//             // visibility: `hidden`,
//             position: `fixed`,
//             top: -9999,
//             left: -9999,
//             width: 1,
//             height: 1,
//           }}
//           type="text"
//           name="bot-field"
//           placeholder="Leave empty!"
//           key="bot-field"
//           value={formState[`bot-field`]}
//           onChange={fieldChange}
//         />
//         {reactFields}
//       </form>
//       {/* {this.props.block.form.after} */}
//     </div>
//   )
//   const success = (
//     <div className="formMessage success">
//       <Html html={block.successMessage.childMarkdownRemark.html} />
//     </div>
//   )
//   const error = (
//     <div className="formMessage error">
//       <Html html={block.errorMessage.childMarkdownRemark.html} />
//     </div>
//   )

//   return form ? (
//     <LBlockForm
//       id={id}
//       name={name}
//       className={`block blockForm ${className || ''}`}
//       css={{
//         ...(isColored ? colors[classicCombo].style : {}),
//         " input[type='radio'] + label > span, input[type='checkbox'] + label > span": {
//           background:
//             colors[classicCombo].background === colors.palettes[0].neutral
//               ? colors[classicCombo].background
//               : colors[classicCombo].border,
//         },
//         " input[type='radio']:checked + label > span, input[type='checkbox']:checked + label > span": {
//           background:
//             colors[classicCombo].background === colors.palettes[0].neutral
//               ? colors[classicCombo].border
//               : colors[classicCombo].background,
//         },
//         ...passCSS,
//         ...style,
//       }}
//     >
//       {successState === ERROR && error}
//       {successState === SUCCESS && success}
//       {successState === PENDING && reactForm}
//     </LBlockForm>
//   ) : null
// }

// ---------------------NEW IMPLEMENTATION -------------------

const useForm = ({
  block,
  colors: colorsLib,
  // location,
  ...rest
}) => {
  const { options: optionsData, style: styleData, form: formData } = block
  const form = internalJson(formData)
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { isColored, classicCombo } = colors
  const { id, name } = options

  const formName = slugify(block.name.toLowerCase())

  const { fields, defaultFieldsState } = useMemo(() => makeFields(form), [])
  const defaultFormState = {
    // NOTE: this was used because a lot of spams were passing through with Netlify forms
    // [`bot-field`]: typeof window === 'undefined' ? 'server-side' : '',
    [`bot-field`]: '',
    ...defaultFieldsState,
  }

  // successState can be pending, success or error
  const [successState, setSuccessState] = useState(PENDING)
  const [formState, setFormState] = useState(defaultFormState)

  const fieldChange = e => {
    if (e.target.type === `checkbox`) {
      setFormState(prev => ({
        ...prev,
        [e.target.name]: !prev[e.target.name],
      }))
      return
    }
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = e => {
    // TODO:
    e.preventDefault()

    const { submit, ...fieldsState } = formState
    const url = window && window.location.href

    const fieldsToSend = {}
    Object.keys(fieldsState).forEach(fieldName => {
      if (fieldName.substring(0, 8) !== 'validate') {
        fieldsToSend[fieldName] = fieldsState[fieldName]
      }
    })

    // NOTE: DO NOT USE € sign in value fields!!!!!!!!!!!!!!!!!!!!
    axios({
      method: 'POST',
      // baseURL: siteMetadata.url,
      url,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      // headers: myHeaders,
      // data: qs.stringify({
      //   "form-name": this.formName,
      //   ...fieldsToSend
      // })
      params: {
        'form-name': formName,
        ...fieldsToSend,
      },
    })
      .then(res => {
        // console.log('OK: ', res)
        if (res.status >= 400) {
          // alert("Ooops :(\nThere was a problem with the form.")
          setSuccessState(ERROR)
          throw new Error('Bad response from server')
        } else if (res.status === 200) {
          // console.log('request successful')
          // this.props.openDialog('Bien reçu !', 'Merci pour votre message. Je vous recontacte au plus vite.\n\nFlorence')

          setSuccessState(SUCCESS)
          setFormState(defaultFormState)
        } else {
          console.log(`Response: `, res)
        }
      })
      .catch(error => {
        console.error('ERR', error)
        // alert("Ooops :(", "There was a problem with the form.")
        setSuccessState(ERROR)
      })
  }

  const validate = () => {
    fields.forEach(field => {
      // Early return if field is not required
      if (!field.required && field.type !== `checkbox`) {
        return
      }
      // if field has a value it is ok EXCEPT for checkboxes
      if (field.type !== `checkbox` && !!formState[field.name]) {
        if (
          field.type === `email` &&
          !formState[field.name].match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ) {
          setFormState(prev => ({ ...prev, [`validate_${field.name}`]: false }))
          return
        }
        setFormState(prev => ({ ...prev, [`validate_${field.name}`]: true }))
        return
      }

      if (field.type === `checkbox`) {
        field.options.forEach(option => {
          if (!option.required) return
          const stateName = `${field.name}_${option.value}`
          const stateValidateName = `validate_${stateName}`
          if (formState[stateName]) {
            setFormState(prev => ({ ...prev, [stateValidateName]: true }))
          } else {
            setFormState(prev => ({ ...prev, [stateValidateName]: false }))
          }
        })
        return
      }

      setFormState(prev => ({ ...prev, [`validate_${field.name}`]: false }))
    })
  }

  return {
    ...rest,
    ...block,
    form,
    options,
    style,
    id,
    // name,
    colors,
    isColored,
    classicCombo,
    formName,
    fields,
    successState,
    formState,

    fieldChange,
    handleSubmit,
    validate,
  }
}

const Markup = ({
  form,
  // options: optionsBlock,
  // style,
  className,
  id: idBlock,
  // name: nameBlock,
  successMessage,
  errorMessage,
  // colors,
  // isColored,
  // classicCombo,
  formName,
  fields,
  successState,
  formState,

  fieldChange,
  handleSubmit,
  validate,
}) => {
  const RadioField = ({ css, options: ops, inputProps }) => {
    return (
      <div {...{ css }}>
        {ops &&
          ops.map(({ value, label }) => {
            const htmlFor = inputProps.id + value
            return (
              <div key={value + label}>
                <input
                  {...{
                    ...inputProps,
                    id: htmlFor,
                    value,
                    checked: formState[inputProps.name] === value,
                  }}
                />
                <label {...{ htmlFor }}>
                  <span />
                  <Html
                    html={label}
                    style={{
                      display: `inline`,
                    }}
                  />
                </label>
              </div>
            )
          })}
      </div>
    )
  }

  const CheckboxField = ({ css, options: ops, inputProps }) => {
    return (
      <div>
        {ops &&
          ops.map(({ value, label, required }) => {
            const htmlFor = inputProps.id + value
            return (
              <div
                {...{
                  key: value + label,
                  css: {
                    ...css,
                    backgroundColor:
                      formState[`validate${inputProps.name}_${value}`] === false
                        ? `rgba(255, 0, 0, 0.15)!important`
                        : `initial`,
                  },
                }}
              >
                <input
                  {...{
                    ...inputProps,
                    name: `${inputProps.name}_${value}`,
                    id: htmlFor,
                    value,
                    required,
                    checked: formState[inputProps.name + value],
                  }}
                />
                <label {...{ htmlFor }}>
                  <span />
                  <Html
                    html={label}
                    style={{
                      display: `inline`,
                    }}
                  />
                </label>
              </div>
            )
          })}
      </div>
    )
  }

  const reactFields = fields.map(
    ({
      type = `text`,
      name,
      value = null,
      label = null,
      options = null,
      text,
      ...attrs
    }) => {
      const css = {
        backgroundColor:
          formState[`validate_${name}`] === false
            ? `rgba(255, 0, 0, 0.15)!important`
            : `initial`,
      }
      const attributes = {
        ...attrs,
        text,
        css,
      }

      const key = `${type}${name}`
      const textAreaProps = {
        key,
        name,
        id: key,
        ...attributes,
        value: formState[name] || value || label,
        onChange: fieldChange,
      }
      const inputProps = {
        ...textAreaProps,
        type,
      }
      const submitProps = {
        ...inputProps,
        onClick: () => {
          validate()
        },
      }

      switch (type) {
        case 'comment':
          return attributes.text ? <Html {...{ key, html: text }} /> : null

        case 'textarea':
          return (
            <div {...{ key }}>
              <label htmlFor={key}>
                <Html html={label} />
              </label>
              <textarea {...textAreaProps} />
            </div>
          )

        case 'text':
        case 'tel':
        case 'email':
        case 'date':
          return (
            <div {...{ key }}>
              <label htmlFor={key}>
                <Html html={label} />
              </label>
              <input {...inputProps} />
            </div>
          )
        case 'submit':
          return <input {...{ ...submitProps }} />
        case 'radio':
          return (
            <RadioField
              {...{
                key,
                css,
                options,
                inputProps,
              }}
            />
          )
        case 'checkbox':
          return (
            <CheckboxField
              {...{
                key,
                css,
                options,
                inputProps,
              }}
            />
          )
        default:
          return null
      }
    }
  )

  const reactForm = (
    <div>
      <form
        className={formName}
        onSubmit={handleSubmit}
        name={formName}
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input
          css={{
            // visibility: `hidden`,
            position: `fixed`,
            top: -9999,
            left: -9999,
            width: 1,
            height: 1,
          }}
          type="text"
          name="bot-field"
          placeholder="Leave empty!"
          key="bot-field"
          value={formState[`bot-field`]}
          onChange={fieldChange}
        />
        {reactFields}
      </form>
      {/* {this.props.block.form.after} */}
    </div>
  )
  const success = (
    <div className="formMessage success">
      <Html html={successMessage.childMarkdownRemark.html} />
    </div>
  )
  const error = (
    <div className="formMessage error">
      <Html html={errorMessage.childMarkdownRemark.html} />
    </div>
  )

  return form ? (
    <div
      {...{
        id: idBlock,
        name: formName,
        className: `block blockForm ${className || ''}`,
      }}
      // css={{
      //   ...(isColored ? colors[classicCombo].style : {}),
      //   " input[type='radio'] + label > span, input[type='checkbox'] + label > span": {
      //     background:
      //       colors[classicCombo].background === colors.palettes[0].neutral
      //         ? colors[classicCombo].background
      //         : colors[classicCombo].border,
      //   },
      //   " input[type='radio']:checked + label > span, input[type='checkbox']:checked + label > span": {
      //     background:
      //       colors[classicCombo].background === colors.palettes[0].neutral
      //         ? colors[classicCombo].border
      //         : colors[classicCombo].background,
      //   },
      //   ...passCSS,
      //   ...style,
      // }}
    >
      {successState === ERROR && error}
      {successState === SUCCESS && success}
      {successState === PENDING && reactForm}
    </div>
  ) : null
}

const Form = ({ ...data }) => (
  <View
    {...{
      data,
      useData: useForm,
      Markup,
    }}
  />
)

export default Form

export const blockFormFragment = graphql`
  fragment BlockForm on ContentfulBlockForm {
    id
    name
    __typename
    form {
      internal {
        content
      }
    }
    successMessage {
      id
      childMarkdownRemark {
        id
        html
      }
    }
    errorMessage {
      id
      childMarkdownRemark {
        id
        html
      }
    }
    options {
      internal {
        content
      }
    }
    style {
      internal {
        content
      }
    }
  }
`
