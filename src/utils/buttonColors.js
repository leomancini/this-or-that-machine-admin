export const getButtonColors = (variant, state = "default") => {
  const colorMap = {
    default: {
      default: "#007bff",
      hover: "#0056b3",
      active: "#004085"
    },
    secondary: {
      default: "#6c757d",
      hover: "#5a6268",
      active: "#40464c"
    },
    danger: {
      default: "#dc3545",
      hover: "#c82333",
      active: "#b82532"
    },
    primary: {
      default: "#000000",
      hover: "#333333",
      active: "#212529"
    }
  };

  const variantKey = variant?.includes("secondary")
    ? "secondary"
    : variant?.includes("danger")
    ? "danger"
    : variant?.includes("primary")
    ? "primary"
    : "default";

  return colorMap[variantKey][state];
};
