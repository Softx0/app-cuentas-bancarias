import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center"
  },
  labelText: {
    fontSize: 14
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  }
});

// #region Hierarchy Styles
export const primaryHierarchyStyle = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 158, 212, 1)"
  },
  labelText: {
    color: "rgba(255, 255, 255, 1)"
  }
});

export const bewareHierarchyStyle = StyleSheet.create({
  container: {
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2"
  },
  labelText: {
    color: "#DE3024"
  }
});

export const secondaryHierarchyStyle = StyleSheet.create({
  container: {
    backgroundColor: "rgba(222, 245, 255, 1)",
    borderWidth: 1,
    borderColor: "rgba(182, 239, 255, 1)"
  },
  labelText: {
    color: "rgba(0, 126, 171, 1)"
  }
});

export const secondaryGrayHierarchyStyle = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D7DAE0"
  },
  labelText: {
    color: "#6B758C",
    fontWeight: "600"
  }
});

export const ghostHierarchyStyle = StyleSheet.create({
  container: {
    backgroundColor: "transparent"
  },
  labelText: {
    color: "rgba(0, 158, 212, 1)"
  }
});
// #endregion

// #region Size Styles
export const smallSizeStyle = StyleSheet.create({
  container: {
    padding: 8
  },
  labelText: {
    fontSize: 14
  }
});

export const mediumSizeStyle = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  labelText: {
    fontSize: 14
  }
});

export const largeSizeStyle = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 24
  },
  labelText: {
    fontSize: 18
  }
});
// #endregion

// #region Style Styles
export const fullRadiusStyle = StyleSheet.create({
  container: {
    borderRadius: 100
  }
});

export const roundedStyle = StyleSheet.create({
  container: {
    borderRadius: 8
  }
});
// #endregion
