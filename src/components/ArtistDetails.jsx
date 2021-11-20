import React from "react"
import PropTypes from "prop-types"
import Icons from "lib/icons"
import IconButton from "components/IconButton"

const ArtistDetails = ({
  name,
  stopType,
  stopNumber,
  category,
  address,
  astUrl,
  website,
  artistStatement,
  bio,
  className,
}) => {
  return (
    <div className={className}>
      <h3>
        {stopNumber} • {name}
      </h3>
      <h4>{stopType}</h4>
      {category && <h4>{category}</h4>}
      {address && <h4>{address}</h4>}
      {website && (
        <IconButton icon={Icons.Website} href={website}>
          Website
        </IconButton>
      )}
      {astUrl && (
        <IconButton icon={Icons.Website} href={astUrl}>
          Austin Studio Tour page
        </IconButton>
      )}
      {artistStatement && <p>{artistStatement}</p>}
      {bio && <p>{bio}</p>}
    </div>
  )
}

export default ArtistDetails

ArtistDetails.propTypes = {
  artistStatement: PropTypes.string,
  bio: PropTypes.string,
  className: PropTypes.string,
  astUrl: PropTypes.string,
  address: PropTypes.string,
  openForBusiness: PropTypes.bool.isRequired,
  category: PropTypes.string,
  name: PropTypes.string.isRequired,
  stopType: PropTypes.string,
  stopNumber: PropTypes.string,
  website: PropTypes.string,
}
