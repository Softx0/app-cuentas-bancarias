import React from "react";

import { Text, View } from "react-native";

import Colors from "../../themes/Colors";
import CheckRender from "../security/CheckRender";
import { styles } from "./styles/StepInfoStyles";

/**
 * StepInfo component displays step information.
 * @param {Object} props - The component props.
 * @param {number} props.currentStep - The current step number.
 * @param {number} props.totalSteps - The total number of steps.
 * @param {string} props.title - The title of the step.
 * @param {string} props.circleColor - The color of the circle step.
 * @param {string} props.bodyTextColor - The color of the body text.
 * @param {string} props.subtitleColor - The color of the subtitle text.
 * @param {boolean} props.showProgressBar - Flag to show the progress bar.
 * @param {Object} props.contentStyle - The style of the content.
 * @param {progressBarBackground} props.progressBarBackground - The background color of the progress bar.
 * @returns {JSX.Element} - The rendered component.
 */
export default function StepInfo(props) {
  const { currentStep, totalSteps, title, circleColor, bodyTextColor, subtitleColor, showProgressBar, contentStyle, progressBarBackground } = props;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View>
      <View style={[styles.content, contentStyle]}>
        <View style={[styles.circleStep, { backgroundColor: circleColor }]}>
          <Text style={styles.circleText}>{currentStep}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: bodyTextColor }]}>{title}</Text>
          <Text style={[styles.subTitle, { color: subtitleColor }]}>
            Paso {currentStep} de {totalSteps}
          </Text>
        </View>
      </View>
      <CheckRender allowed={showProgressBar}>
        <View style={[styles.progressBar, { backgroundColor: progressBarBackground }]}>
          <View style={[styles.progress, { width: `${progress}%`, backgroundColor: circleColor }]} />
        </View>
      </CheckRender>
    </View>
  );
}

StepInfo.defaultProps = {
  currentStep: 1,
  totalSteps: 1,
  title: "Formulario",
  circleColor: Colors.primary[300],
  bodyTextColor: Colors.textPrimary,
  subtitleColor: Colors.textSecondary,
  showProgressBar: false,
  contentStyle: {},
  progressBarBackground: Colors.neutral[400]
};
