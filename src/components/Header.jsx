import React from "react"
import { Link } from "gatsby"
import theme from "styles/theme"

const Header = () => (
  <header
    css={{
      background: theme.n10,
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div
      css={{
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        css={{
          display: "inline-flex",
          fontWeight: 500,
          fontSize: 28,
          lineHeight: 1.2,
          color: theme.n80,
          textDecoration: "none",
        }}
      >
        Austin Studio Tour
      </Link>

      <div
        css={{
          ...theme.t3,
          color: theme.n40,
          fontSize: 18,
          marginTop: 4,
          marginLeft: 8,
          lineHeight: 1,
          [theme.mobile]: {
            display: "none",
          },
        }}
      >
        An unofficial roundup of studio tour stops, both E.A.S.T. and W.E.S.T.
      </div>
    </div>
  </header>
)

export default Header
