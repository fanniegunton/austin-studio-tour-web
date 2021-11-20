import { uniqueId } from "lodash-es"
import { MODES } from "components/ModeSelector"

export const initialState = {
  filters: new Set(["hideClosed"]),
  filterBarKey: uniqueId(),
  mode: MODES.CARD,
  searchQuery: "",
  page: 1,
  activeListing: null,
  mapBounds: null,
  // Coordinates of the Texas State Capitol, just north of downtown Austin
  mapCenter: { lat: 30.274711897776527, lng: -97.74023069179279 },
}

export const reducer = (state, { action, value, ...props }) => {
  switch (action) {
    case "setViewMode":
      return {
        ...state,
        page: 1,
        mode: value,
        mapBounds: value === MODES.MAP ? state.mapBounds : null,
      }

    case "toggleFilter": {
      const filters = new Set(state.filters)

      if (filters.has(value)) {
        filters.delete(value)
      } else {
        filters.add(value)
      }

      return {
        ...state,
        page: 1,
        filters,
      }
    }

    case "setSearchQuery":
      return {
        ...state,
        page: 1,
        searchQuery: value,
      }

    case "clearSearchQuery":
      return {
        ...state,
        page: 1,
        searchQuery: "",
        filterBarKey: uniqueId(),
      }

    case "setPage":
      return {
        ...state,
        page: value,
      }

    case "setMapGeometry":
      return {
        ...state,
        mapBounds: value.bounds,
        mapCenter: value.center,
        mapZoom: value.zoom,
        page: 1,
      }

    case "activateListing":
      window.scrollTo({ top: document.body.offsetHeight, behavior: "smooth" })
      return {
        ...state,
        activeListing: value,
      }

    case "clearActiveListing":
      return {
        ...state,
        activeListing: null,
      }

    default:
      return state
  }
}
