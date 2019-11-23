import React, { useMemo, useState } from 'react'
import { graphql } from 'gatsby'
import slugify from 'slugify'
import axios from 'axios'
// import qs from 'qs'
import _ from 'lodash'

import { mapStyle } from '../utils/processCss'
// import { metadata as siteMetadata } from '../utils/siteSettings.json'
import { rhythm } from '../utils/typography'
// import colors from "../utils/colors"
import { internalJson, useColors } from '../utils'

import Html from '../atoms/Html'

import { LBlockForm } from '../t-layouts'

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

const Form = ({
  block,
  colors: colorsLib,
  // location,
  className = '',
  passCSS,
}) => {
  console.log(block)
  if (!block.form) return null
  if (Object.keys(block).length < 1) return null

  const { options: optionsData, style: styleData, form: formData } = block
  const form = internalJson(formData)
  const options = internalJson(optionsData)
  const dataOptions = options
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
        'form-name': this.formName,
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

  const reactFields = fields.map(
    (
      {
        type = `text`,
        name,
        value = null,
        label = null,
        options = null,
        ...attributes
      },
      key
    ) => {
      attributes.css = {
        backgroundColor:
          formState['validate_' + name] === false
            ? `rgba(255, 0, 0, 0.15)!important`
            : `initial`,
      }
      if (type === 'comment') {
        return attributes.text ? (
          <Html key={key} html={attributes.text} />
        ) : null
      }
      if (type === 'textarea') {
        return (
          <div key={key}>
            <label htmlFor={type + name}>
              <Html html={label} />
            </label>
            <textarea
              name={name}
              id={type + name}
              {...attributes}
              value={formState[name]}
              onChange={fieldChange}
            />
          </div>
        )
      }
      if (type.match(/text|tel|email|date/)) {
        return (
          <div key={key}>
            <label htmlFor={type + name}>
              <Html html={label} />
            </label>
            <input
              type={type}
              name={name}
              id={type + name}
              {...attributes}
              value={formState[name]}
              onChange={fieldChange}
            />
          </div>
        )
      }
      if (type.match(/submit/)) {
        return (
          <input
            type={type}
            name={name}
            id={type + name}
            key={key}
            {...attributes}
            value={value || label}
            onClick={() => {
              validate()
            }}
          />
        )
      }
      if (type.match(/radio/)) {
        return (
          <div key={key} css={attributes.css}>
            {options &&
              options.map(({ value, label }, key) => {
                return (
                  <div key={key}>
                    <input
                      type={type}
                      name={name}
                      id={type + name + value}
                      {...attributes}
                      value={value}
                      checked={formState[name] === value}
                      onChange={fieldChange}
                    />
                    <label htmlFor={type + name + value}>
                      <span />
                      <Html
                        html={label}
                        passCSS={{
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
      if (type.match(/checkbox/)) {
        return (
          <div key={key}>
            {options &&
              options.map(({ value, label, required }, key) => {
                attributes.css = {
                  backgroundColor:
                    formState['validate' + name + '_' + value] === false
                      ? `rgba(255, 0, 0, 0.15)!important`
                      : `initial`,
                }
                return (
                  <div key={key} css={attributes.css}>
                    <input
                      type={type}
                      name={`${name}_${value}`}
                      id={type + name + value}
                      {...attributes}
                      required={required}
                      value={value}
                      checked={formState[name + value]}
                      onChange={fieldChange}
                    />
                    <label htmlFor={type + name + value}>
                      <span />
                      <Html
                        html={label}
                        passCSS={{
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
    }
  )

  const reactForm = (
    <div>
      <form
        className={slugify(block.name.toLowerCase())}
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
      <Html html={block.successMessage.childMarkdownRemark.html} />
    </div>
  )
  const error = (
    <div className="formMessage error">
      <Html html={block.errorMessage.childMarkdownRemark.html} />
    </div>
  )

  return form ? (
    <LBlockForm
      id={id}
      name={name}
      className={`block blockForm ${className || ''}`}
      css={{
        ...colors[classicCombo].style,
        " input[type='radio'] + label > span, input[type='checkbox'] + label > span": {
          background:
            colors[classicCombo].background === colors.palettes[0].neutral
              ? colors[classicCombo].background
              : colors[classicCombo].border,
        },
        " input[type='radio']:checked + label > span, input[type='checkbox']:checked + label > span": {
          background:
            colors[classicCombo].background === colors.palettes[0].neutral
              ? colors[classicCombo].border
              : colors[classicCombo].background,
        },
        ...passCSS,
        ...style,
      }}
    >
      {successState === ERROR && error}
      {successState === SUCCESS && success}
      {successState === PENDING && reactForm}
    </LBlockForm>
  ) : null
}

// class BlockForm extends React.Component {
//   constructor(props) {
//     super(props)
//     // _json_ fields
//     const { options, style, form } = props.block
//     this.formData = internalJson(form)
//     this.optionsData = internalJson(options)
//     this.styleData = mapStyle(internalJson(style))

//     // Colors
//     let { colorPalettes, colorCombo } = this.optionsData
//     colorCombo = colorCombo
//       ? props.colors[`${colorCombo}Combo`]
//       : props.colors.classicCombo
//     colorPalettes = colorPalettes || props.colors.colorPalettes
//     const newColors = props.colors.computeColors(colorPalettes, colorCombo)
//     this.colors = { ...props.colors, ...newColors }
//     // Form name
//     this.formName = slugify(props.block.name.toLowerCase())
//     // Form Fields
//     this.fields = this.formData ? this.formData.formFields : []
//     this.defaultFieldsState = {}
//     this.fields.forEach(field => {
//       // for checkboxes, create an entry for each
//       if (field.type === `checkbox`) {
//         field.options.forEach(option => {
//           // special validation fields
//           this.defaultFieldsState[
//             'validate' + field.name + '_' + option.value
//           ] = true
//           // normal fields
//           this.defaultFieldsState[field.name + '_' + option.value] =
//             !!option.checked || false
//         })
//         return
//       }
//       // Create validate state for each field
//       this.defaultFieldsState['validate' + field.name] = true
//       if (field.type === `comment`) {
//         return
//       }
//       // for radio button, only one state entry and take the (last) one that is checked
//       if (field.type === `radio`) {
//         this.defaultFieldsState[field.name] = ''
//         field.options.forEach(option => {
//           if (option.checked === `checked`)
//             this.defaultFieldsState[field.name] = option.value
//         })
//         return
//       }
//       this.defaultFieldsState[field.name] = field.value || ''
//     })
//     this.state = {
//       success: false,
//       error: false,
//       [`bot-field`]: typeof window === 'undefined' ? 'server-side' : '',
//       ...this.defaultFieldsState,
//     }
//     if (!_.find(this.fields, [`type`, `submit`])) {
//       // this.fields.push({ type: "submit", value: "submit", name: "submit" })
//       this.fields.push({ type: 'submit', value: '', name: 'submit' })
//     }
//     this.fieldChange = this.fieldChange.bind(this)
//     this.handleSubmit = this.handleSubmit.bind(this)
//   }

//   fieldChange(e) {
//     if (e.target.type === `checkbox`) {
//       this.setState({
//         [e.target.name]: !this.state[e.target.name],
//       })
//       return
//     }
//     this.setState({
//       [e.target.name]: e.target.value,
//     })
//   }

//   handleSubmit(e) {
//     // TODO:
//     e.preventDefault()

//     const { success, error, submit, ...fields } = this.state

//     // let myHeaders = new Headers();
//     // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     // const url = this.props.location.pathname.substring(
//     //   0,
//     //   this.props.location.pathname.length - 1
//     // )
//     const url = window && window.location.href
//     // const url = siteMetadata.url;

//     let fieldsToSend = {}
//     Object.keys(fields).forEach(fieldName => {
//       if (fieldName.substring(0, 8) !== 'validate') {
//         fieldsToSend[fieldName] = fields[fieldName]
//       }
//     })

//     // console.log(fieldsToSend);
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
//         'form-name': this.formName,
//         ...fieldsToSend,
//       },
//     })
//       .then(res => {
//         console.log('OK', res)
//         if (res.status >= 400) {
//           // alert("Ooops :(\nThere was a problem with the form.")
//           this.setState({ success: false, error: true })
//           throw new Error('Bad response from server')
//         } else if (res.status === 200) {
//           console.log('request successful')
//           // this.props.openDialog('Bien reçu !', 'Merci pour votre message. Je vous recontacte au plus vite.\n\nFlorence')

//           this.setState({
//             success: true,
//             error: false,
//             ...this.defaultFieldsState,
//             // name: "",
//             // phone: "",
//             // email: "",
//             // message: ""
//           })
//         } else {
//           console.log(`Response: `, res)
//         }
//       })
//       .catch(error => {
//         console.error('ERR', error)
//         // alert("Ooops :(", "There was a problem with the form.")
//         this.setState({ success: false, error: true })
//       })
//   }

//   validate() {
//     this.fields.forEach(field => {
//       // Early return if field is not required
//       if (!field.required && field.type !== `checkbox`) {
//         return
//       }
//       // if field has a value it is ok EXCEPT for checkboxes
//       if (field.type !== `checkbox` && !!this.state[field.name]) {
//         if (
//           field.type === `email` &&
//           !this.state[field.name].match(
//             /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//           )
//         ) {
//           this.setState({
//             ['validate' + field.name]: false,
//           })
//           return
//         }
//         this.setState({
//           ['validate' + field.name]: true,
//         })
//         return
//       }

//       if (field.type === `checkbox`) {
//         field.options.forEach(option => {
//           if (!option.required) return
//           if (this.state[field.name + '_' + option.value]) {
//             this.setState({
//               ['validate' + field.name + '_' + option.value]: true,
//             })
//           } else {
//             this.setState({
//               ['validate' + field.name + '_' + option.value]: false,
//             })
//           }
//         })
//         return
//       }

//       this.setState({
//         ['validate' + field.name]: false,
//       })
//     })
//   }

//   render() {
//     const block = this.props.block
//     if (Object.keys(block).length < 1) {
//       return null
//     }
//     // const dataOptions = JSON.parse(block.options.internal.content)
//     const dataOptions = block.options
//     // console.log(block.options)

//     const {
//       classicCombo,
//       contrastCombo,
//       funkyCombo,
//       funkyContrastCombo,
//     } = this.colors

//     let fields = this.fields.map(
//       (
//         {
//           type = `text`,
//           name,
//           value = null,
//           label = null,
//           options = null,
//           ...attributes
//         },
//         key
//       ) => {
//         attributes.css = {
//           backgroundColor:
//             this.state['validate' + name] === false
//               ? `rgba(255, 0, 0, 0.15)!important`
//               : `initial`,
//         }
//         if (type === 'comment') {
//           return attributes.text ? (
//             <Html key={key} html={attributes.text} />
//           ) : null
//         }
//         if (type === 'textarea') {
//           return (
//             <div key={key}>
//               <label htmlFor={type + name}>
//                 <Html html={label} />
//               </label>
//               <textarea
//                 name={name}
//                 id={type + name}
//                 {...attributes}
//                 value={this.state[name]}
//                 onChange={this.fieldChange}
//               />
//             </div>
//           )
//         } else if (type.match(/text|tel|email|date/)) {
//           return (
//             <div key={key}>
//               <label htmlFor={type + name}>
//                 <Html html={label} />
//               </label>
//               <input
//                 type={type}
//                 name={name}
//                 id={type + name}
//                 {...attributes}
//                 value={this.state[name]}
//                 onChange={this.fieldChange}
//               />
//             </div>
//           )
//         } else if (type.match(/submit/)) {
//           return (
//             <input
//               type={type}
//               name={name}
//               id={type + name}
//               key={key}
//               {...attributes}
//               value={value || label}
//               onClick={() => {
//                 this.validate()
//               }}
//             />
//           )
//         } else if (type.match(/radio/)) {
//           return (
//             <div key={key} css={attributes.css}>
//               {options &&
//                 options.map(({ value, label }, key) => {
//                   return (
//                     <div key={key}>
//                       <input
//                         type={type}
//                         name={name}
//                         id={type + name + value}
//                         {...attributes}
//                         value={value}
//                         checked={this.state[name] === value}
//                         onChange={this.fieldChange}
//                       />
//                       <label htmlFor={type + name + value}>
//                         <span />
//                         <Html
//                           html={label}
//                           passCSS={{
//                             display: `inline`,
//                           }}
//                         />
//                       </label>
//                     </div>
//                   )
//                 })}
//             </div>
//           )
//         } else if (type.match(/checkbox/)) {
//           return (
//             <div key={key}>
//               {options &&
//                 options.map(({ value, label, required }, key) => {
//                   attributes.css = {
//                     backgroundColor:
//                       this.state['validate' + name + '_' + value] === false
//                         ? `rgba(255, 0, 0, 0.15)!important`
//                         : `initial`,
//                   }
//                   return (
//                     <div key={key} css={attributes.css}>
//                       <input
//                         type={type}
//                         name={`${name}_${value}`}
//                         id={type + name + value}
//                         {...attributes}
//                         required={required}
//                         value={value}
//                         checked={this.state[name + value]}
//                         onChange={this.fieldChange}
//                       />
//                       <label htmlFor={type + name + value}>
//                         <span />
//                         <Html
//                           html={label}
//                           passCSS={{
//                             display: `inline`,
//                           }}
//                         />
//                       </label>
//                     </div>
//                   )
//                 })}
//             </div>
//           )
//         }
//       }
//     )

//     const form = (
//       <div>
//         {/* {this.props.block.form.before} */}
//         <form
//           className={slugify(block.name.toLowerCase())}
//           onSubmit={this.handleSubmit}
//           name={this.formName}
//           data-netlify="true"
//           data-netlify-honeypot="bot-field"
//         >
//           <input
//             css={{
//               // visibility: `hidden`,
//               position: `fixed`,
//               top: -9999,
//               left: -9999,
//               width: 1,
//               height: 1,
//             }}
//             type="text"
//             name="bot-field"
//             placeholder="Leave empty!"
//             key="bot-field"
//             value={this.state[`bot-field`]}
//             onChange={this.fieldChange}
//           />
//           {fields}
//         </form>
//         {/* {this.props.block.form.after} */}
//       </div>
//     )
//     const success = (
//       <div className="formMessage success">
//         <Html html={block.successMessage.childMarkdownRemark.html} />
//       </div>
//     )
//     const error = (
//       <div className="formMessage error">
//         <Html html={block.errorMessage.childMarkdownRemark.html} />
//       </div>
//     )

//     const { id: htmlId, name: htmlName } = this.optionsData

//     return block.form ? (
//       <div
//         id={htmlId}
//         name={htmlName}
//         className="block blockForm"
//         css={{
//           ...this.colors[classicCombo].style,
//           padding: rhythm(1),
//           display: `flex`,
//           justifyContent: `center`,
//           alignItems: `center`,
//           width: `100%`,
//           maxWidth: `1000px`,
//           margin: `0 auto`,
//           '> div': {
//             width: `100%`,
//             maxWidth: `1000px`,
//             margin: `auto`,
//           },
//           " input[type='radio'] + label > span, input[type='checkbox'] + label > span": {
//             background:
//               this.colors[classicCombo].background ===
//               this.colors.palettes[0].neutral
//                 ? this.colors[classicCombo].background
//                 : this.colors[classicCombo].border,
//           },
//           " input[type='radio']:checked + label > span, input[type='checkbox']:checked + label > span": {
//             background:
//               this.colors[classicCombo].background ===
//               this.colors.palettes[0].neutral
//                 ? this.colors[classicCombo].border
//                 : this.colors[classicCombo].background,
//           },
//           ...this.props.passCSS,
//           ...this.styleData,
//         }}
//       >
//         {//
//         this.state.error ? error : this.state.success ? success : form
//         // success
//         }
//       </div>
//     ) : null
//   }
// }

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
