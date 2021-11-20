import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import theme from "styles/theme"
import { keyframes } from "@emotion/core"
import { useMediaQuery } from "@material-ui/core"
import ScrollLock from "react-scrolllock"
import ArtistDetails from "components/ArtistDetails"
import hexToRgb from "lib/hexToRgb"
import Icons from "lib/icons"

const ActiveListingPanel = ({ listing: currentListing, dispatch, state }) => {
  const mobile = useMediaQuery(theme.mobile)
  const prevListingRef = useRef(currentListing)

  useEffect(() => {
    setTimeout(() => {
      prevListingRef.current = currentListing
    }, 500)
  }, [currentListing])

  const animation = !currentListing && prevListingRef.current ? "out" : "in"
  const listing = currentListing || prevListingRef.current

  if (!listing) return null

  return (
    <ScrollLock isActive={mobile && currentListing}>
      <div
        css={{
          position: "absolute",
          top: 79,
          left: "calc(0.5 * var(--pagePadding))",
          padding: "var(--pagePadding)",
          paddingTop: 0,
          width: "var(--listWidth)",
          bottom: 0,
          background: theme.n10,
          zIndex: 3,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          transform: `translateX(${animation === "out" ? "-100%" : 0})`,
          opacity: animation === "out" ? 0 : 1,
          animation: `${slideAnimation[animation]} 250ms ease-out`,
          [theme.mobile]: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "100%",
          },
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px calc(0.5 * var(--pagePadding))",
            margin: "0 calc(-0.5 * var(--pagePadding)) var(--pagePadding)",
            position: "sticky",
            top: 0,
            borderRadius: 3,
            boxShadow: `0 2px 4px ${hexToRgb(theme.n10, 0.5)}`,
            background: hexToRgb("#17273A", 0.9),
            backdropFilter: "blur(3px)",
            zIndex: 4,
            [theme.mobile]: {
              padding: 12,
              margin: "0 calc(-1 * var(--pagePadding)) var(--pagePadding)",
              borderRadius: 0,
            },
          }}
        >
          <button
            css={{
              background: theme.n30,
              padding: 8,
              border: 0,
              borderRadius: 3,
              cursor: "pointer",
              transition: "background 250ms",
              ":hover": {
                background: theme.n20,
              },
              marginRight: 16,
              outline: 0,
            }}
            onClick={() => {
              dispatch({ action: "clearActiveListing" })
            }}
          >
            <Icons.LeftChevron css={{ display: "block", color: theme.n80 }} />
          </button>

          <h3
            css={{
              color: theme.n80,
              fontSize: 24,
              fontWeight: 500,
              [theme.mobile]: {
                fontSize: 18,
              },
            }}
          >
            {listing.name}
          </h3>

          <div css={{ fontFamily: "monospace", whiteSpace: "nowrap" }}>
            <span css={{ fontSize: "smaller" }}>#</span>
            {listing.stopNumber}
          </div>
        </div>

        <ArtistDetails
          css={{ marginBottom: 16 }}
          dispatch={dispatch}
          bookmarked={state.bookmarkedStops.has(listing.stopNumber)}
          {...listing}
        />
      </div>
    </ScrollLock>
  )
}

export default ActiveListingPanel

ActiveListingPanel.propTypes = {
  listing: PropTypes.shape({
    ...ArtistDetails.propTypes,
    dispatch: undefined,
  }),
  state: PropTypes.shape({
    bookmarkedStops: PropTypes.instanceOf(Set).isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
}

const slideAnimation = {
  hidden: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
  visible: {
    transform: "translateX(0)",
    opacity: 1,
  },
}

slideAnimation.in = keyframes({
  from: slideAnimation.hidden,
  to: slideAnimation.visible,
})
slideAnimation.out = keyframes({
  from: slideAnimation.visible,
  to: slideAnimation.hidden,
})
