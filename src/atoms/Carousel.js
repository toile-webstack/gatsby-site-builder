import React from 'react'
// import {MdClose} from "react-icons/md/"

import { rhythm, scale } from '../utils/typography'

class Carousel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      i: 0,
    }
    this.length = props.children.length
    // console.log(this.props.children)
  }

  next() {
    if (this.state.i < this.length - 1) {
      this.setState({ i: this.state.i + 1 })
    } else {
      this.setState({ i: 0 })
    }
  }

  render() {
    // TODO: const previous and next and current computed on every render then translate each with something like CSS -> transform: translate(1000px, 0);
    // TODO: need to find biggest height to set the same height for all

    setTimeout(() => {
      this.next()
    }, 3000)
    return (
      <div
        css={{
          // posiiton: `relative`,
          // display: `flex`,
          minHeight: 250,

          // "> div": {
          //   position: `absolute`,
          //   left: 0,
          //   right: 0,
          //   margin: `auto`,
          // },
        }}
      >
        {this.props.children[this.state.i]}
      </div>
    )
  }
}

export default Carousel
