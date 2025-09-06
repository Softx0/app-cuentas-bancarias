import React from "react";

import PropTypes from "prop-types";
import { Text, TouchableOpacity, View } from "react-native";

export default function Controls(props) {
  const { styles, textStyles, label, component, onPressControl, disabled } = props;

  return (
    <TouchableOpacity onPress={() => onPressControl()} style={styles} disabled={disabled} hitSlop={{ top: 20, bottom: 20, left: 40, right: 40 }}>
      <View style={{ opacity: disabled ? 0 : 1 }}>{component || <Text style={[textStyles]}>{label}</Text>}</View>
    </TouchableOpacity>
  );
}

Controls.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  label: PropTypes.string,
  onPressControl: PropTypes.func.isRequired
};
