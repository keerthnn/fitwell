export const cardPrimary = {
  flex: "1 1 280px",
  p: 3,
  minHeight: 160,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  borderRadius: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const cardSecondary = {
  ...cardPrimary,
  bgcolor: "secondary.main",
};

export const cardDefault = {
  flex: "1 1 280px",
  p: 3,
  minHeight: 160,
  borderRadius: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const dashboardStyles = { cardDefault, cardPrimary, cardSecondary };

export default dashboardStyles;
