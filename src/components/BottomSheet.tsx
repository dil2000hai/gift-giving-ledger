import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SHEET_SPRING } from '../constants/config';
import { theme } from '../constants/theme';

type Props = {
  visible: boolean;
  height: number;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Native <Modal> + an Animated translateY. No gesture-handler anywhere; the
 * sheet rises with a 300ms spring and the backdrop fades to 0.35.
 */
export function BottomSheet({ visible, height, title, onClose, children }: Props) {
  const [mounted, setMounted] = React.useState(visible);
  const slide = useRef(new Animated.Value(height)).current;
  const fade = useRef(new Animated.Value(0)).current;
  // `mounted` must not retrigger the effect, or the rise animation restarts.
  const wasMounted = useRef(visible);
  wasMounted.current = mounted;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      slide.setValue(height);
      fade.setValue(0);
      Animated.parallel([
        Animated.spring(slide, {
          toValue: 0,
          tension: SHEET_SPRING.tension,
          friction: SHEET_SPRING.friction,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!wasMounted.current) {
      return;
    }
    Animated.parallel([
      Animated.timing(slide, {
        toValue: height,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [fade, height, slide, visible]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View pointerEvents="box-none" style={[styles.backdropLayer, { opacity: fade }]}>
          <Pressable
            style={styles.backdropPress}
            accessibilityRole="button"
            accessibilityLabel="Close sheet"
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheetWrap, { transform: [{ translateY: slide }] }]}>
          {/* Captures taps on empty sheet space so they do not reach the backdrop. */}
          <View
            style={[styles.sheet, { height }]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>
            <View style={styles.body}>{children}</View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.scrim,
  },
  backdropPress: {
    flex: 1,
  },
  sheetWrap: {
    width: '100%',
  },
  sheet: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F0CEDB',
  },
  title: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  body: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 18,
  },
});

export default BottomSheet;
