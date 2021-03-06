import React, { useCallback, useRef } from "react"
import PropTypes from "prop-types"
import { RiHeartFill } from "@coreyward/react-icons/ri"
import { debounce } from "lodash-es"
import hexToRgb from "lib/hexToRgb"
import Checkbox from "components/Checkbox"
import theme from "styles/theme"

const FilterBar = ({
  listTitle,
  defaultSearchQuery,
  state,
  dispatch,
  className,
}) => {
  const searchRef = useRef()

  const updateSearchQuery = useCallback(
    debounce(
      value =>
        dispatch({
          action: "setSearchQuery",
          value: searchRef.current.value,
        }),
      500
    ),
    []
  )

  const toggleFilter = value =>
    dispatch({
      action: "toggleFilter",
      value,
    })

  return (
    <div
      css={{
        padding: "16px var(--pagePadding)",
        display: "flex",
        justifyContent: "space-between",
        background: theme.n10,
        zIndex: 5,
        boxShadow: `0 1px 10px ${hexToRgb(theme.n10, 0.5)}`,
        "@supports (backdrop-filter: blur(6px))": {
          background: hexToRgb(theme.n10, 0.75),
          backdropFilter: "blur(6px)",
        },
        [theme.mobile]: {
          padding: "8px var(--pagePadding)",
        },
      }}
      className={className}
    >
      <div css={{ flex: "1 1 auto", marginRight: 24 }}>
        <div
          css={{
            ...theme.smallcaps,
            color: theme.n40,
            fontSize: 10,
            marginBottom: 8,
          }}
        >
          Filters
        </div>

        <div
          css={{
            display: "flex",
            [theme.mobile]: { display: "block" },
          }}
        >
          <input
            ref={searchRef}
            type="search"
            placeholder={`Search ${listTitle}`}
            defaultValue={defaultSearchQuery}
            onChange={updateSearchQuery}
            css={{
              flex: "1 1 300px",
              maxWidth: 400,
              marginRight: 16,
              fontSize: 12,
              fontFamily: "inherit",
              borderRadius: 10,
              color: theme.n40,
              padding: "0.5em 0.8em",
              outline: 0,
              border: `1px solid ${theme.n20}`,
              lineHeight: 1,
              ":focus": {
                border: `1px solid ${theme.n40}`,
              },
              "::placeholder": {
                color: theme.n40,
              },
              [theme.mobile]: { minWidth: "50vw" },
              [theme.smallMobile]: { minWidth: 160 },
            }}
          />

          <Checkbox
            onChange={() => toggleFilter("showEast")}
            checked={state.filters.has("showEast")}
            css={{
              flex: "0 0 auto",
              [theme.mobile]: {
                marginTop: 16,
              },
            }}
          >
            East Stops Only
          </Checkbox>
          <Checkbox
            onChange={() => toggleFilter("bookmarkedOnly")}
            checked={state.filters.has("bookmarkedOnly")}
            css={{
              flex: "0 0 auto",
              marginLeft: 8,
              [theme.mobile]: { margin: "8px 0 0 0" },
            }}
          >
            <RiHeartFill
              css={{ position: "relative", top: 2, marginRight: "0.5em" }}
            />
            Favorites ({state.bookmarkedStops.size || 0})
          </Checkbox>
        </div>
      </div>
    </div>
  )
}

export default FilterBar

FilterBar.propTypes = {
  listTitle: PropTypes.string.isRequired,
  defaultSearchQuery: PropTypes.string,
  state: PropTypes.shape({
    filters: PropTypes.instanceOf(Set),
    bookmarkedStops: PropTypes.instanceOf(Set),
  }).isRequired,
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
}
