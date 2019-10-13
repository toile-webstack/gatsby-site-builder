import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import _ from 'underscore'

import Html from '../atoms/Html'

const useForm = ({
  formName,
  formFields = [],
  successMessage,
  errorMessage,
}) => {
  // const formName = slugify(props.block.name.toLowerCase())
  const defaultFieldsState = useRef({})
  const fields = useRef(formFields)

  useEffect(() => {
    fields.current.forEach(field => {
      // for checkboxes, create an entry for each
      if (field.type === `checkbox`) {
        field.options.forEach(option => {
          // special validation fields
          defaultFieldsState.current[
            `validate${field.name}` + '_' + option.value
          ] = true
          // normal fields
          defaultFieldsState.current[field.name + '_' + option.value] =
            !!option.checked || false
        })
        return
      }
      // Create validate state for each field
      defaultFieldsState.current[`validate${field.name}`] = true
      if (field.type === `comment`) {
        return
      }
      // for radio button, only one state entry and take the (last) one that is checked
      if (field.type === `radio`) {
        defaultFieldsState.current[field.name] = ''
        field.options.forEach(option => {
          if (option.checked === `checked`)
            defaultFieldsState.current[field.name] = option.value
        })
        return
      }
      defaultFieldsState.current[field.name] = field.value || ''
    })

    if (!_.find(fields.current, [`type`, `submit`])) {
      // fields.current.push({ type: "submit", value: "submit", name: "submit" })
      fields.current.push({ type: 'submit', value: '', name: 'submit' })
    }
  }, [])

  const [state, setState] = useState({
    success: false,
    error: false,
    [`bot-field`]: typeof window === 'undefined' ? 'server-side' : '',
    ...defaultFieldsState.current,
  })

  const fieldChange = e => {
    if (e.target.type === `checkbox`) {
      setState({
        [e.target.name]: !state[e.target.name],
      })
    } else {
      setState({
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    const { success, error, submit, ...fields } = state

    const url = window && window.location.href

    let fieldsToSend = {}
    Object.keys(fields).forEach(fieldName => {
      if (fieldName.substring(0, 8) !== 'validate') {
        fieldsToSend[fieldName] = fields[fieldName]
      }
    })

    // NOTE: DO NOT USE € sign in value fields!!!!!!!!!!!!!!!!!!!!
    axios({
      method: 'POST',
      url,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: {
        'form-name': formName,
        ...fieldsToSend,
      },
    })
      .then(res => {
        console.log('OK', res)
        if (res.status >= 400) {
          // alert("Ooops :(\nThere was a problem with the form.")
          setState({ success: false, error: true })
          throw new Error('Bad response from server')
        } else if (res.status === 200) {
          console.log('request successful')

          setState({
            success: true,
            error: false,
            ...defaultFieldsState.current,
          })
        } else {
          console.log(`Response: `, res)
        }
      })
      .catch(error => {
        console.error('ERROR: ', error)
        // alert("Ooops :(", "There was a problem with the form.")
        setState({ success: false, error: true })
      })
  }

  const validate = () => {
    fields.current.forEach(field => {
      // Early return if field is not required
      if (!field.required && field.type !== `checkbox`) {
        return
      }
      // if field has a value it is ok EXCEPT for checkboxes
      if (field.type !== `checkbox` && !!state[field.name]) {
        if (
          field.type === `email` &&
          !state[field.name].match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          )
        ) {
          setState({
            [`validate${field.name}`]: false,
          })
          return
        }
        setState({
          [`validate${field.name}`]: true,
        })
        return
      }

      if (field.type === `checkbox`) {
        field.options.forEach(option => {
          if (!option.required) return
          if (state[`${field.name} ${option.value}`]) {
            setState({
              [`validate${field.name} ${option.value}`]: true,
            })
          } else {
            setState({
              [`validate${field.name} ${option.value}`]: false,
            })
          }
        })
        return
      }

      setState({
        [`validate${field.name}`]: false,
      })
    })
  }

  const fieldsElements = fields.current.map(
    (
      {
        type = `text`,
        name,
        value = null,
        label = null,
        options = null,
        ...attr
      },
      key,
    ) => {
      const attributes = {
        ...attr,
        css: {
          backgroundColor:
            state['validate' + name] === false
              ? `rgba(255, 0, 0, 0.15)!important`
              : `initial`,
        },
      }

      if (type === 'comment') {
        return attributes.text ? (
          <Html key={name} html={attributes.text} />
        ) : null
      }
      if (type === 'textarea') {
        return (
          <div key={name}>
            <label htmlFor={type + name}>
              <Html html={label} />
            </label>
            <textarea
              name={name}
              id={type + name}
              {...attributes}
              value={state[name]}
              onChange={fieldChange}
            />
          </div>
        )
      }
      if (type.match(/text|tel|email|date/)) {
        return (
          <div key={name}>
            <label htmlFor={type + name}>
              <Html html={label} />
            </label>
            <input
              type={type}
              name={name}
              id={type + name}
              {...attributes}
              value={state[name]}
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
            key={name}
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
          <div key={name} css={attributes.css}>
            {options &&
              options.map(({ value, label }, key) => {
                return (
                  <div key={name}>
                    <input
                      type={type}
                      name={name}
                      id={type + name + value}
                      {...attributes}
                      value={value}
                      checked={state[name] === value}
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
          <div key={name}>
            {options &&
              options.map(({ value, label, required }, key) => {
                attributes.css = {
                  backgroundColor:
                    state['validate' + name + '_' + value] === false
                      ? `rgba(255, 0, 0, 0.15)!important`
                      : `initial`,
                }
                return (
                  <div key={name} css={attributes.css}>
                    <input
                      type={type}
                      name={`${name}_${value}`}
                      id={type + name + value}
                      {...attributes}
                      required={required}
                      value={value}
                      checked={state[name + value]}
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
    },
  )

  const form = (
    <div>
      {/* {props.block.form.before} */}
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
          value={state[`bot-field`]}
          onChange={fieldChange}
        />
        {fieldsElements}
      </form>
      {/* {props.block.form.after} */}
    </div>
  )

  const success = (
    <div className="formMessage success">
      <Html html={successMessage} />
    </div>
  )

  const error = (
    <div className="formMessage error">
      <Html html={errorMessage} />
    </div>
  )

  return {
    children: (state.error && error) || (state.success && success) || form,
  }
}

export default useForm
