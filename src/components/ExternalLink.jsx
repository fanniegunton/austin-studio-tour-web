import React from "react"
import PropTypes from "prop-types"

const ExternalLink = props => (
  <a target="_blank" rel="noopener noreferrer" {...props} />
)

export default ExternalLink

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
